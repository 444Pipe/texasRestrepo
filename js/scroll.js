/* ==========================================================================
   TEXAS · Parrilla Bar — Efectos de scroll

   Todo pasa por un solo bucle de requestAnimationFrame que arranca cuando
   hay scroll y se apaga solo cuando ya no queda nada moviéndose. Dentro del
   bucle primero se LEE todo el layout y después se ESCRIBE, para no forzar
   reflows en cada cuadro.

   Los valores se publican como variables CSS y el trabajo pesado lo hace el
   compositor; el JS no toca `style.transform` directamente.

   Depende de: js/datos.js (precioCOP no, pero sí el orden de carga)
   ========================================================================== */

(function () {
  const raiz = document.documentElement;
  const menosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ----------------------------- Elementos ------------------------------
     Se resuelven dentro de activar(), no al cargar el script: los letreros
     de las sedes los pinta app.js y todavía no existen en este punto. */
  let hero, wanted, montaje, letreros = [];

  /* ------------------------- Estado del bucle --------------------------- */
  let ultimoY = window.scrollY;
  let pedido = null;          // id del requestAnimationFrame en curso
  let altoTotal = 0;
  let altoHero = 0;

  /* Péndulo de los letreros colgantes: un solo resorte compartido, con un
     multiplicador distinto por letrero para que no se mezan como robots.

     Lo que empuja el letrero es la ACELERACIÓN del scroll, no su velocidad:
     un letrero colgado se mece cuando arrancas o frenas, no mientras bajas
     a ritmo constante. Con velocidad se saturaba contra el tope y quedaba
     inclinado en vez de volver al reposo. */
  let angulo = 0;
  let velAngular = 0;
  let deltaPrevio = 0;
  const RIGIDEZ = 0.05;       // qué tan fuerte tira hacia el reposo
  const ROCE = 0.07;          // cuánto se frena en cada cuadro
  const EMPUJE = 0.010;       // cuánto lo mueve el tirón del scroll
  const TOPE = 3;             // grados máximos, malla de seguridad
  const TOPE_VEL = 1.2;       // por si llega un salto de scroll enorme

  function medir() {
    altoTotal = Math.max(1, raiz.scrollHeight - window.innerHeight);
    altoHero = hero ? hero.offsetHeight : 0;
  }

  /* ------------------------------ El bucle ------------------------------ */
  function cuadro() {
    /* ---------- 1. LEER ---------- */
    const y = window.scrollY;
    const alto = window.innerHeight;
    const delta = y - ultimoY;
    ultimoY = y;

    const rectWanted = wanted ? wanted.getBoundingClientRect() : null;
    const rectMontaje = montaje ? montaje.getBoundingClientRect() : null;

    /* ---------- 2. CALCULAR ---------- */
    const avance = Math.min(1, Math.max(0, y / altoTotal));

    // El tirón es el cambio de velocidad del scroll, no la velocidad misma
    const d = Math.max(-60, Math.min(60, delta));
    const empujon = (d - deltaPrevio) * EMPUJE;
    deltaPrevio = d;

    velAngular += -angulo * RIGIDEZ - velAngular * ROCE + empujon;
    velAngular = Math.max(-TOPE_VEL, Math.min(TOPE_VEL, velAngular));
    angulo = Math.max(-TOPE, Math.min(TOPE, angulo + velAngular));

    const quieto = Math.abs(velAngular) < 0.002 && Math.abs(angulo) < 0.002 && d === 0;
    if (quieto) { angulo = 0; velAngular = 0; }

    /* ---------- 3. ESCRIBIR ---------- */
    raiz.style.setProperty('--avance', avance.toFixed(4));

    if (hero && y < altoHero) {
      const p = y / altoHero;
      // el fondo se queda atrás, el contenido se adelanta y se desvanece
      raiz.style.setProperty('--hero-fondo-y', (y * 0.30).toFixed(1));
      raiz.style.setProperty('--hero-y', (y * -0.14).toFixed(1));
      raiz.style.setProperty('--hero-op', Math.max(0, 1 - p * 1.45).toFixed(3));
    }

    if (rectWanted && rectWanted.bottom > 0 && rectWanted.top < alto) {
      const centro = (rectWanted.top + rectWanted.height / 2 - alto / 2) / alto;
      wanted.style.setProperty('--fondo-y', (centro * -70).toFixed(1));
      wanted.style.setProperty('--cartel-y', (centro * 26).toFixed(1));
    }

    if (rectMontaje && rectMontaje.bottom > 0 && rectMontaje.top < alto) {
      const centro = (rectMontaje.top + rectMontaje.height / 2 - alto / 2) / alto;
      montaje.style.setProperty('--montaje-y', (centro * -34).toFixed(1));
    }

    if (letreros.length) raiz.style.setProperty('--balanceo', angulo.toFixed(3));

    /* ---------- 4. ¿Seguimos? ---------- */
    pedido = quieto ? null : requestAnimationFrame(cuadro);
  }

  function pedirCuadro() {
    if (pedido === null) pedido = requestAnimationFrame(cuadro);
  }

  /* --------------------- Contador del cartel Se Busca -------------------- */
  function animarContador(el) {
    const destino = Number(el.dataset.contar);
    if (!Number.isFinite(destino)) return;

    const prefijo = el.dataset.prefijo || '';
    const duracion = 1400;
    const inicio = performance.now();

    function paso(ahora) {
      const t = Math.min(1, (ahora - inicio) / duracion);
      // easeOutExpo: arranca rápido y frena al final
      const suave = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      el.textContent = prefijo + Math.round(destino * suave).toLocaleString('es-CO');
      if (t < 1) requestAnimationFrame(paso);
    }

    requestAnimationFrame(paso);
  }

  /* ------------------------------ Arranque ------------------------------ */
  function activar() {
    /* Barra de avance de lectura */
    const barra = document.createElement('div');
    barra.className = 'progreso';
    barra.setAttribute('aria-hidden', 'true');
    document.body.appendChild(barra);

    hero = document.querySelector('.hero');
    wanted = document.querySelector('.wanted-zona');
    montaje = document.querySelector('.montaje');
    letreros = [...document.querySelectorAll('.sede')];

    // cada letrero pesa distinto, así no se mecen todos igual
    letreros.forEach((el, i) => el.style.setProperty('--peso', (1 - i * 0.16).toFixed(2)));

    if (menosMovimiento.matches) {
      // Sin efectos: solo la barra de avance, que no es movimiento decorativo
      medir();
      window.addEventListener('scroll', () => {
        raiz.style.setProperty('--avance', Math.min(1, window.scrollY / altoTotal).toFixed(4));
      }, { passive: true });
      document.querySelectorAll('[data-contar]').forEach((el) => {
        el.textContent = (el.dataset.prefijo || '') + Number(el.dataset.contar).toLocaleString('es-CO');
      });
      return;
    }

    medir();
    pedirCuadro();

    window.addEventListener('scroll', pedirCuadro, { passive: true });
    window.addEventListener('resize', () => { medir(); pedirCuadro(); }, { passive: true });

    // Las fuentes cambian la altura del documento al cargar
    if (document.fonts?.ready) document.fonts.ready.then(medir);

    /* El contador espera a estar en pantalla */
    const contadores = document.querySelectorAll('[data-contar]');
    if (contadores.length && 'IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entradas) => {
        entradas.forEach((e) => {
          if (!e.isIntersecting) return;
          animarContador(e.target);
          obs.unobserve(e.target);
        });
      }, { threshold: 0.6 });
      contadores.forEach((el) => obs.observe(el));
    } else {
      contadores.forEach(animarContador);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', activar);
  } else {
    activar();
  }
})();
