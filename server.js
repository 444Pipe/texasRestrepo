/* ==========================================================================
   TEXAS · Parrilla Bar — Servidor de archivos estáticos
   Sin dependencias: solo el runtime de Node. Railway lo arranca con
   `npm start` y escucha en el puerto que le pase la plataforma.

   Qué resuelve:
     · Tipos MIME correctos (incluido el .mp4 del video)
     · Peticiones Range, para que el video se pueda adelantar
     · ETag + 304, para no reenviar lo que el navegador ya tiene
     · gzip en HTML, CSS y JS
     · Protección contra path traversal
   ========================================================================== */

const http = require('http');
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const zlib = require('zlib');

const RAIZ = __dirname;
const PUERTO = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';

/* ----------------------------- Tipos MIME ------------------------------- */
const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml; charset=utf-8',
};

/* Lo que vale la pena comprimir: texto. Las imágenes y el video ya vienen
   comprimidos y volver a pasarles gzip solo gasta CPU. */
const COMPRIMIBLES = new Set(['.html', '.css', '.js', '.json', '.svg', '.txt', '.xml', '.webmanifest']);

/* Los assets pesados no cambian de nombre, pero sí de contenido si se
   reemplazan: caché corta con revalidación para el código, más larga para
   imágenes y video. */
function cacheDe(ext) {
  if (['.html'].includes(ext)) return 'no-cache';
  if (['.css', '.js'].includes(ext)) return 'no-cache';
  if (['.mp4', '.webm', '.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.ico', '.woff2', '.woff'].includes(ext)) {
    return 'public, max-age=604800';
  }
  return 'public, max-age=3600';
}

const CABECERAS_BASE = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

/* ------------------------- Lo que NO es público -------------------------
   El sitio vive en index/carta/checkout/seguimiento + css, js y statics.
   Todo lo demás (código del servidor, configuración, dependencias, archivos
   ocultos) no se sirve: responde 404 como si no existiera. */
const ARCHIVOS_PRIVADOS = new Set([
  'server.js',
  'package.json',
  'package-lock.json',
  'railway.json',
  'railway.toml',
  'nixpacks.toml',
  'Dockerfile',
  'Procfile',
  'node_modules',
]);

const EXT_PRIVADAS = new Set(['.md', '.toml', '.lock', '.log', '.env']);

function esPrivado(rutaAbsoluta) {
  const relativa = path.relative(RAIZ, rutaAbsoluta);
  if (!relativa) return false; // la raíz misma

  return relativa.split(/[\\/]+/).filter(Boolean).some((parte) =>
    parte.startsWith('.') ||
    ARCHIVOS_PRIVADOS.has(parte) ||
    EXT_PRIVADAS.has(path.extname(parte).toLowerCase())
  );
}

/* ------------------------- Resolución de rutas -------------------------- */
/** Convierte la URL en una ruta real dentro de RAIZ, o null si se sale. */
function resolverRuta(urlPath) {
  let limpio;
  try {
    limpio = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  } catch (e) {
    return null; // porcentaje mal codificado
  }

  if (limpio.includes('\0')) return null;

  // path.normalize + comprobación de prefijo: bloquea ../../etc
  const destino = path.resolve(RAIZ, '.' + path.posix.normalize(limpio));
  const raizConBarra = RAIZ.endsWith(path.sep) ? RAIZ : RAIZ + path.sep;

  if (destino !== RAIZ && !destino.startsWith(raizConBarra)) return null;
  return destino;
}

/** Devuelve { ruta, stat } del archivo a servir, o null si no existe. */
async function buscarArchivo(destino, urlPath) {
  const candidatos = [];

  if (urlPath.endsWith('/')) {
    candidatos.push(path.join(destino, 'index.html'));
  } else {
    candidatos.push(destino);
    // /carta → /carta.html
    if (!path.extname(destino)) {
      candidatos.push(destino + '.html');
      candidatos.push(path.join(destino, 'index.html'));
    }
  }

  for (const ruta of candidatos) {
    if (esPrivado(ruta)) continue;
    try {
      const stat = await fsp.stat(ruta);
      if (stat.isFile()) return { ruta, stat };
    } catch (e) {
      /* sigue con el siguiente candidato */
    }
  }
  return null;
}

/* ------------------------------ Utilidades ------------------------------ */
const etagDe = (stat) => `W/"${stat.size.toString(16)}-${stat.mtimeMs.toString(16)}"`;

/** Interpreta "bytes=0-1023". Devuelve null si no aplica o es inválido. */
function leerRango(cabecera, tamano) {
  if (!cabecera) return null;

  const m = /^bytes=(\d*)-(\d*)$/.exec(cabecera.trim());
  if (!m) return null;

  const [, desdeStr, hastaStr] = m;
  let desde, hasta;

  if (desdeStr === '' && hastaStr === '') return null;

  if (desdeStr === '') {
    // sufijo: los últimos N bytes
    const n = Number(hastaStr);
    if (!Number.isFinite(n) || n <= 0) return null;
    desde = Math.max(0, tamano - n);
    hasta = tamano - 1;
  } else {
    desde = Number(desdeStr);
    hasta = hastaStr === '' ? tamano - 1 : Number(hastaStr);
  }

  if (!Number.isFinite(desde) || !Number.isFinite(hasta)) return null;
  if (desde > hasta || desde >= tamano) return 'invalido';

  return { desde, hasta: Math.min(hasta, tamano - 1) };
}

function responderError(res, codigo, metodo) {
  const cuerpo = codigo === 404
    ? '404 — Por aquí no hay nada.'
    : `${codigo} — Algo salió mal.`;

  res.writeHead(codigo, {
    ...CABECERAS_BASE,
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Length': Buffer.byteLength(cuerpo),
    'Cache-Control': 'no-store',
  });
  res.end(metodo === 'HEAD' ? undefined : cuerpo);
}

/* Página 404 con la identidad del sitio, si existe */
async function responder404(res, metodo) {
  const ruta = path.join(RAIZ, '404.html');
  try {
    const stat = await fsp.stat(ruta);
    res.writeHead(404, {
      ...CABECERAS_BASE,
      'Content-Type': TIPOS['.html'],
      'Content-Length': stat.size,
      'Cache-Control': 'no-cache',
    });
    if (metodo === 'HEAD') return res.end();
    return fs.createReadStream(ruta).pipe(res);
  } catch (e) {
    return responderError(res, 404, metodo);
  }
}

/* ------------------------------ Petición -------------------------------- */
async function atender(req, res) {
  const metodo = req.method || 'GET';

  if (metodo !== 'GET' && metodo !== 'HEAD') {
    res.writeHead(405, { ...CABECERAS_BASE, Allow: 'GET, HEAD', 'Content-Length': 0 });
    return res.end();
  }

  const urlPath = (req.url || '/').split('?')[0];
  const destino = resolverRuta(urlPath);
  if (!destino) return responderError(res, 400, metodo);

  const encontrado = await buscarArchivo(destino, urlPath);
  if (!encontrado) return responder404(res, metodo);

  const { ruta, stat } = encontrado;
  const ext = path.extname(ruta).toLowerCase();
  const tipo = TIPOS[ext] || 'application/octet-stream';
  const etag = etagDe(stat);

  const cabeceras = {
    ...CABECERAS_BASE,
    'Content-Type': tipo,
    'Cache-Control': cacheDe(ext),
    ETag: etag,
    'Last-Modified': stat.mtime.toUTCString(),
  };

  // ¿El navegador ya lo tiene?
  if (req.headers['if-none-match'] === etag) {
    res.writeHead(304, cabeceras);
    return res.end();
  }

  /* ---- Range: necesario para poder adelantar el video ---- */
  const rango = leerRango(req.headers.range, stat.size);

  if (rango === 'invalido') {
    res.writeHead(416, { ...cabeceras, 'Content-Range': `bytes */${stat.size}` });
    return res.end();
  }

  if (rango) {
    const largo = rango.hasta - rango.desde + 1;
    res.writeHead(206, {
      ...cabeceras,
      'Accept-Ranges': 'bytes',
      'Content-Range': `bytes ${rango.desde}-${rango.hasta}/${stat.size}`,
      'Content-Length': largo,
    });
    if (metodo === 'HEAD') return res.end();
    return fs.createReadStream(ruta, { start: rango.desde, end: rango.hasta }).pipe(res);
  }

  /* ---- gzip solo para texto ---- */
  const aceptaGzip = /\bgzip\b/.test(req.headers['accept-encoding'] || '');

  if (aceptaGzip && COMPRIMIBLES.has(ext)) {
    res.writeHead(200, { ...cabeceras, 'Content-Encoding': 'gzip', Vary: 'Accept-Encoding' });
    if (metodo === 'HEAD') return res.end();
    return fs.createReadStream(ruta).pipe(zlib.createGzip({ level: 6 })).pipe(res);
  }

  res.writeHead(200, { ...cabeceras, 'Accept-Ranges': 'bytes', 'Content-Length': stat.size });
  if (metodo === 'HEAD') return res.end();
  return fs.createReadStream(ruta).pipe(res);
}

/* ------------------------------ Arranque -------------------------------- */
const servidor = http.createServer((req, res) => {
  atender(req, res).catch((err) => {
    console.error('Error atendiendo', req.url, err);
    if (!res.headersSent) responderError(res, 500, req.method);
    else res.end();
  });
});

servidor.listen(PUERTO, HOST, () => {
  console.log(`TEXAS · Parrilla Bar sirviendo en http://${HOST}:${PUERTO}`);
});

/* Railway envía SIGTERM al redesplegar: cerramos limpio para no cortar
   descargas a medias. */
for (const senal of ['SIGTERM', 'SIGINT']) {
  process.on(senal, () => {
    console.log(`${senal} recibido, cerrando el servidor…`);
    servidor.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 10000).unref();
  });
}
