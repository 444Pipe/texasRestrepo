# TEXAS · Parrilla Bar — Sitio web + sistema de domicilios

Sitio estático (HTML + CSS + JavaScript, sin build ni dependencias) para
**TEXAS Parrilla Bar** — Restrepo y Cumaral, Meta.

## Cómo verlo en local

```bash
npm start
# http://localhost:3000
```

No hay que instalar nada: el proyecto no tiene dependencias. `npm start` levanta
`server.js`, que es el mismo servidor que corre en producción.

También puedes abrir `index.html` directo en el navegador, pero con servidor el
video carga mejor (soporta peticiones Range).

## Desplegar en Railway

El proyecto ya trae todo lo que Railway necesita: `package.json` con el script
`start`, `server.js` escuchando en `$PORT` y `railway.json` con la configuración
del despliegue.

**Desde GitHub** (lo más cómodo):

1. Sube el proyecto a un repositorio.
2. En Railway: **New Project → Deploy from GitHub repo** y elige el repo.
3. Railway detecta `package.json`, construye con Nixpacks y arranca con
   `npm start`. Como no hay dependencias, el build tarda segundos.
4. **Settings → Networking → Generate Domain** para obtener la URL pública.

**Desde la terminal**, si prefieres el CLI:

```bash
npm i -g @railway/cli
railway login
railway init
railway up
railway domain
```

Cosas que conviene saber:

- **No configures `PORT`.** Railway la inyecta y `server.js` la lee sola.
- **No hay variables de entorno obligatorias.** El sitio es estático.
- El healthcheck apunta a `/`; si responde 200, el despliegue queda activo.
- Para dominio propio: **Settings → Networking → Custom Domain** y apunta el
  CNAME que te dé Railway.
- Cada `git push` a la rama conectada redespliega. `server.js` cierra limpio al
  recibir `SIGTERM`, así que no se cortan descargas a medias.

### Qué hace `server.js`

Es un servidor estático sin dependencias (solo el runtime de Node). Se encarga de:

- Tipos MIME correctos, incluido el `.mp4` del video
- **Peticiones Range**, para que el video se pueda adelantar
- **ETag + 304**, para no reenviar lo que el navegador ya tiene en caché
- **gzip** en HTML, CSS y JS (la hoja de estilos pasa de 65 KB a 15 KB)
- Rutas sin extensión: `/carta` sirve `carta.html`
- Página `404.html` propia para rutas que no existen
- Bloqueo de todo lo que no es público: `server.js`, `package.json`,
  `railway.json`, `README.md`, archivos ocultos y `node_modules` responden 404

## Páginas

| Archivo | Qué hace |
|---|---|
| `index.html` | Hero, la historia con el video del negocio, el código de la casa, la tabla del día, el cartel del Burger Fest, las sedes y cómo pedir |
| `carta.html` | Carta completa en tablas de madera, con filtros por categoría y buscador |
| `checkout.html` | Formulario del domicilio: datos, zona de entrega y forma de pago |
| `seguimiento.html` | Estado del pedido en vivo (simulado) + envío por WhatsApp |

## Sistema de domicilios

El botón flotante naranja **“Pedir domicilio”** está fijo abajo a la derecha en
`index.html` y `carta.html`. Abre el cajón lateral con el pedido y muestra un
contador con los ítems agregados.

Flujo completo:

1. **Carta** → botón “+ Agregar” en cada plato.
2. **La comanda** (el cajón lateral) → cambiar cantidades, quitar ítems, vaciar.
   Bloquea el paso si no se llega al pedido mínimo.
3. **Checkout** → nombre, celular, sede, zona (el costo del domicilio se calcula
   solo), dirección, forma de pago y notas. Con validación campo por campo.
4. **Seguimiento** → código de pedido (`TX-####`) y estado que avanza:
   recibido → en la parrilla → en camino → entregado. Botón para enviar el
   pedido completo por WhatsApp.

El pedido se guarda en `localStorage`, así que sobrevive recargas y cambios de
página. **Es un sistema de prueba**: no hay backend ni pasarela de pago; el
cierre real del pedido se hace por WhatsApp.

## Dónde se edita cada cosa

Casi todo el contenido del negocio vive en **`js/datos.js`**:

- `NEGOCIO` — teléfono, WhatsApp, horario, redes, pedido mínimo
- `SEDES` — sedes, direcciones y enlaces a Google Maps
- `ZONAS_DOMICILIO` — zonas, costo del domicilio y tiempo estimado
- `METODOS_PAGO` — formas de pago
- `CATEGORIAS` y `CARTA` — platos, descripciones y precios
  (`destacado: true` hace que el plato salga en “La tabla del día” del index)
- `REGLAS` — las cuatro reglas de “El código de la casa”

Los colores de la marca están al inicio de `css/estilos.css`, en `:root`.

> **Precios y carta:** los platos y valores están cargados con precios de
> referencia según el tipo de comida que maneja Texas. Antes de publicar hay que
> confirmarlos con el restaurante y ajustarlos en `js/datos.js`.

## Archivos JavaScript

| Archivo | Responsabilidad |
|---|---|
| `datos.js` | Datos del negocio, carta, zonas, formas de pago y "el código de la casa" |
| `iconos.js` | Toda la iconografía western dibujada en SVG + ornamentos |
| `carrito.js` | Carrito en `localStorage`, botón flotante, la comanda y los avisos |
| `app.js` | Header, menú móvil, animaciones, video del negocio y secciones del index |
| `carta.js` | Filtros y buscador de la carta |
| `checkout.js` | Validación, cálculo del domicilio y creación del pedido |
| `seguimiento.js` | Simulación del estado y armado del mensaje de WhatsApp |

El orden de carga importa: `datos.js` → `iconos.js` → `carrito.js` → `app.js` → (`carta.js` / `checkout.js` / `seguimiento.js`).

## Sistema visual

Todo el ambiente western se construye con CSS puro, sin imágenes de apoyo ni
librerías. Las piezas están al inicio de `css/estilos.css`:

- **Texturas**: `--tex-grano`, `--tex-fibra`, `--tex-veta` y `--tex-cuero` son
  filtros SVG (`feTurbulence`) embebidos como `data:` URI. El grano de película
  va sobre toda la página mediante `body::after`.
- **Materiales**: las clases `.madera` (con variantes `--clara` y `--oscura`),
  `.cuero` y `.pergamino` se aplican a cualquier elemento para vestirlo.
  `.costura` agrega la línea punteada de talabartería y `.remaches` las cabezas
  de clavo en las esquinas.
- **Iconografía**: estrella de sheriff, sombrero, herradura, longhorn, brasa,
  cactus, mazorca, jarra y demás están en `js/iconos.js`. Se insertan en el HTML
  con `data-icono="nombre"` (antes del texto), `data-icono-fin` (después) o
  `data-orn` (a lado y lado).

Piezas con carácter propio: la **comanda** en pergamino con borde troquelado, la
**tabla de saloon** con guías punteadas entre plato y precio, los **letreros
colgantes** de las sedes, el cartel de **“Se Busca”** del Burger Fest y los
**hierros de marcar** numerados de la sección de domicilios.

## Recursos

- `statics/logo-transparente.png` — logo recortado con fondo transparente
  (generado a partir de `statics/logo.png`, que conserva el fondo gris original)
- `statics/hero_responsive.PNG` — imagen del hero
- `statics/video/texas-negocio.mp4` — video del negocio (formato vertical 9:16),
  se muestra dentro de un mockup de celular en la sección “Nuestra historia”
- `statics/video/poster.jpg` — primer fotograma que se ve antes de reproducir

El video arranca en silencio cuando entra en pantalla y se pausa al salir. El
botón 🔇 activa el sonido.

## Datos del negocio usados

Tomados del Instagram [@texasparrillabar](https://www.instagram.com/texasparrillabar/)
y de directorios locales:

- Lema: **“¡Texas nunca falla!”** · “Con verdadero sabor a parrilla”
- Sedes: Restrepo (50 m arriba del C.C. Sunrise) y Cumaral, Meta
- Horario: martes a domingo y festivos, 4:00 p.m. – 11:00 p.m.
- Teléfono / WhatsApp: 320 204 4872
