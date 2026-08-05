/* ==========================================================================
   TEXAS · Parrilla Bar — Lógica común de las páginas
   Depende de: js/datos.js, js/iconos.js, js/carrito.js
   ========================================================================== */

/* ------------------------ Utilidades compartidas ------------------------ */

function linkWhatsApp(mensaje) {
  return `https://wa.me/${NEGOCIO.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

/** Renglón de carta: nombre … guía punteada … precio, con botón de agregar. */
function renglonPlato(plato) {
  return `
    <article class="renglon">
      <h3 class="renglon__nombre">
        ${plato.nombre}${plato.etiqueta ? `<span class="renglon__etq">${plato.etiqueta}</span>` : ''}
      </h3>
      <span class="renglon__guia" aria-hidden="true"></span>
      <span class="renglon__precio">${precioCOP(plato.precio)}</span>
      <p class="renglon__desc">${plato.descripcion}</p>
      <button class="renglon__add" type="button" data-agregar="${plato.id}"
              aria-label="Agregar ${plato.nombre} al pedido">${ICONOS.mas}</button>
    </article>`;
}

/** Estrella de sheriff con un icono montado encima */
function placaSheriff(nombreIcono) {
  return `<span class="regla__placa">${ICONOS.estrella}<span class="regla__icono">${ICONOS[nombreIcono] || ''}</span></span>`;
}

/* ---------------- Inyección automática de iconos en el HTML ------------- */
/* data-icono="x"     → el icono va delante del texto
   data-icono-fin="x" → el icono va detrás del texto
   data-orn="x"       → el icono va a lado y lado (adornos)                 */
function montarIconos(raiz = document) {
  raiz.querySelectorAll('[data-icono]:not([data-icono-listo])').forEach((el) => {
    const svg = ICONOS[el.dataset.icono];
    if (!svg) return;
    el.insertAdjacentHTML('afterbegin', svg);
    el.setAttribute('data-icono-listo', '');
  });

  raiz.querySelectorAll('[data-icono-fin]:not([data-icono-fin-listo])').forEach((el) => {
    const svg = ICONOS[el.dataset.iconoFin];
    if (!svg) return;
    el.insertAdjacentHTML('beforeend', svg);
    el.setAttribute('data-icono-fin-listo', '');
  });

  raiz.querySelectorAll('[data-orn]:not([data-orn-listo])').forEach((el) => {
    const svg = ICONOS[el.dataset.orn];
    if (!svg) return;
    el.insertAdjacentHTML('afterbegin', svg);
    el.insertAdjacentHTML('beforeend', svg);
    el.setAttribute('data-orn-listo', '');
  });
}

/* Revela elementos que se crearon después del observer inicial */
function revelarPronto(contenedor, retardo = 120) {
  contenedor.querySelectorAll('.revelar').forEach((el, i) =>
    setTimeout(() => el.classList.add('es-visible'), retardo + i * 110)
  );
}

/* ================================ INICIO ================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------- Header pegajoso ---------------------------- */
  const header = document.getElementById('header');
  if (header && !header.classList.contains('header--pegado')) {
    const alScroll = () => header.classList.toggle('header--pegado', window.scrollY > 40);
    alScroll();
    window.addEventListener('scroll', alScroll, { passive: true });
  }

  /* --------------------------- Menú móvil ------------------------------- */
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      const abierto = nav.classList.toggle('es-abierto');
      menuBtn.setAttribute('aria-expanded', String(abierto));
      menuBtn.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
    });

    nav.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        nav.classList.remove('es-abierto');
        menuBtn.setAttribute('aria-expanded', 'false');
      })
    );
  }

  /* ------------------- Ornamento bajo cada encabezado ------------------- */
  document.querySelectorAll('.enc').forEach((enc) => {
    enc.insertAdjacentHTML('beforeend', ORNAMENTOS.cuerdaEstrella);
  });

  /* -------------------- El código de la casa (index) -------------------- */
  const codigoGrid = document.getElementById('codigoGrid');
  if (codigoGrid) {
    codigoGrid.innerHTML = REGLAS.map((r) => `
      <article class="regla revelar">
        <span class="regla__num" aria-hidden="true">${r.num}</span>
        ${placaSheriff(r.icono)}
        <h3>${r.titulo}</h3>
        <p>${r.texto}</p>
      </article>`).join('');
    revelarPronto(codigoGrid);
  }

  /* --------------------- La tabla del día (index) ----------------------- */
  const tablaLista = document.getElementById('tablaLista');
  if (tablaLista) {
    tablaLista.innerHTML = CARTA.filter((p) => p.destacado).map(renglonPlato).join('');
  }

  /* --------------------------- Sedes (index) ---------------------------- */
  const sedesGrid = document.getElementById('sedesGrid');
  if (sedesGrid) {
    sedesGrid.innerHTML = SEDES.map((s) => `
      <div class="sede-colgante revelar">
        <article class="sede madera remaches">
          <span class="remache"></span><span class="remache"></span>
          <span class="remache"></span><span class="remache"></span>

          <h3 class="sede__ciudad">${s.nombre}</h3>
          <p class="sede__badge">${ICONOS.estrella} Meta · Colombia ${ICONOS.estrella}</p>

          <p class="sede__linea">${ICONOS.pin}<span><strong>${s.direccion}</strong><br>${s.detalle}</span></p>
          <p class="sede__linea">${ICONOS.reloj}<span>${s.horario}</span></p>
          <p class="sede__linea">${ICONOS.tel}<span>${NEGOCIO.telefonoBonito}</span></p>

          <div class="sede__acciones">
            <a class="btn btn--madera btn--sm" href="${s.mapa}" target="_blank" rel="noopener">Cómo llegar</a>
            <a class="btn btn--fantasma btn--sm" href="${linkWhatsApp(
              `¡Hola TEXAS! Quiero pedir a domicilio en la sede de ${s.nombre}.`
            )}" target="_blank" rel="noopener">Pedir aquí</a>
          </div>
        </article>
      </div>`).join('');
    revelarPronto(sedesGrid);
  }

  /* ------------------------------ Redes --------------------------------- */
  const redes = document.getElementById('redes');
  if (redes) {
    redes.innerHTML = `
      <a class="red" href="${NEGOCIO.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${ICONOS.ig}</a>
      <a class="red" href="${NEGOCIO.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${ICONOS.fb}</a>
      <a class="red" href="${linkWhatsApp('¡Hola TEXAS! Quiero hacer un pedido.')}" target="_blank" rel="noopener" aria-label="WhatsApp">${ICONOS.wa}</a>`;
  }

  /* ----------------------- Cinta de cuero (index) ----------------------- */
  const cinta = document.getElementById('cinta');
  if (cinta) {
    const frases = [
      'Picadas de la casa', 'Hamburguesas ahumadas', 'Churrasco al carbón',
      'Ternera a la llanera', 'Mazorcada Texas', 'Costillas BBQ',
      'Cerveza bien fría', '¡Texas nunca falla!',
    ];
    // la lista va duplicada para que el bucle de la animación no tenga costura
    cinta.innerHTML = [...frases, ...frases]
      .map((f) => `<span class="cinta__item">${f} ${ICONOS.estrella}</span>`)
      .join('');
  }

  /* ------------------ Video del negocio (montaje celular) --------------- */
  const video = document.getElementById('videoNegocio');
  if (video) {
    const btnPlay = document.getElementById('btnPlay');
    const btnSonido = document.getElementById('btnSonido');
    const pantalla = video.closest('.celular__pantalla');

    function pintarSonido() {
      btnSonido.innerHTML = video.muted ? ICONOS.mudo : ICONOS.sonido;
      btnSonido.setAttribute('aria-pressed', String(!video.muted));
      btnSonido.setAttribute('aria-label', video.muted ? 'Activar el sonido' : 'Silenciar el video');
    }

    function pintarPlay() {
      btnPlay.innerHTML = video.paused ? ICONOS.play : ICONOS.pausa;
      btnPlay.classList.toggle('es-oculto', !video.paused);
      btnPlay.setAttribute('aria-label', video.paused ? 'Reproducir el video' : 'Pausar el video');
    }

    video.addEventListener('play', pintarPlay);
    video.addEventListener('pause', pintarPlay);
    pintarPlay();
    pintarSonido();

    const alternar = () => {
      if (video.paused) video.play().catch(() => {});
      else video.pause();
    };

    btnPlay.addEventListener('click', (e) => { e.stopPropagation(); alternar(); });

    btnSonido.addEventListener('click', (e) => {
      e.stopPropagation();
      video.muted = !video.muted;
      if (!video.muted && video.paused) video.play().catch(() => {});
      pintarSonido();
    });

    // Un clic en la pantalla también reproduce o pausa, salvo sobre los enlaces
    pantalla.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      alternar();
    });

    /* Arranca en silencio al entrar en pantalla y se pausa al salir:
       así no gasta datos mientras nadie lo está viendo. */
    if ('IntersectionObserver' in window) {
      const obsVideo = new IntersectionObserver(
        (ents) => ents.forEach((en) => {
          if (en.isIntersecting) video.play().catch(() => {});
          else if (!video.paused) video.pause();
        }),
        { threshold: 0.4 }
      );
      obsVideo.observe(video);
    }
  }

  /* ------------------------- Enlaces de WhatsApp ------------------------ */
  const msgGeneral = '¡Hola TEXAS! 🤠 Quiero información sobre la carta y los domicilios.';
  document.querySelectorAll('#waContacto, #waFooter').forEach((a) => { a.href = linkWhatsApp(msgGeneral); });

  /* --------------------------------- Año -------------------------------- */
  const anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();

  /* ------------- Iconos del HTML (después de pintar todo) --------------- */
  montarIconos();

  /* -------------------- Aparecer al hacer scroll ------------------------ */
  const revelables = document.querySelectorAll('.revelar:not(.es-visible)');
  if (revelables.length && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e, i) => {
          if (!e.isIntersecting) return;
          setTimeout(() => e.target.classList.add('es-visible'), i * 90);
          obs.unobserve(e.target);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    revelables.forEach((el) => obs.observe(el));
  } else {
    revelables.forEach((el) => el.classList.add('es-visible'));
  }
});
