/* ==========================================================================
   TEXAS · Parrilla Bar — Sistema de domicilios (carrito compartido)
   · Guarda el pedido en localStorage (sobrevive recargas y cambios de página)
   · Pinta el botón flotante "Pedir domicilio" abajo a la derecha
   · Pinta y maneja la comanda (el cajón lateral del pedido)
   · Avisos tipo toast
   Depende de: js/datos.js, js/iconos.js
   ========================================================================== */

const Carrito = (function () {
  const CLAVE = 'texas_pedido_v1';
  let lineas = []; // [{ id, cantidad }]
  const oyentes = [];

  function cargar() {
    try {
      const crudo = localStorage.getItem(CLAVE);
      const guardado = crudo ? JSON.parse(crudo) : [];
      // Descarta ítems que ya no existan en la carta (p. ej. tras actualizar el menú)
      lineas = Array.isArray(guardado)
        ? guardado
            .filter((l) => l && buscarPlato(l.id) && Number(l.cantidad) > 0)
            .map((l) => ({ id: l.id, cantidad: Math.min(99, Math.max(1, Math.floor(Number(l.cantidad)))) }))
        : [];
    } catch (e) {
      lineas = [];
    }
  }

  function guardar() {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(lineas));
    } catch (e) {
      /* almacenamiento lleno o bloqueado: el pedido sigue vivo en memoria */
    }
    notificar();
  }

  /** Devuelve [{ plato, cantidad, total }] */
  function detalle() {
    return lineas
      .map((l) => {
        const plato = buscarPlato(l.id);
        return plato ? { plato, cantidad: l.cantidad, total: plato.precio * l.cantidad } : null;
      })
      .filter(Boolean);
  }

  const subtotal = () => detalle().reduce((suma, d) => suma + d.total, 0);
  const unidades = () => lineas.reduce((suma, l) => suma + l.cantidad, 0);

  function agregar(id, cantidad = 1) {
    if (!buscarPlato(id)) return;
    const linea = lineas.find((l) => l.id === id);
    if (linea) linea.cantidad = Math.min(99, linea.cantidad + cantidad);
    else lineas.push({ id, cantidad: Math.min(99, cantidad) });
    guardar();
  }

  function fijar(id, cantidad) {
    const n = Math.floor(Number(cantidad));
    if (n <= 0) return quitar(id);
    const linea = lineas.find((l) => l.id === id);
    if (linea) { linea.cantidad = Math.min(99, n); guardar(); }
  }

  function quitar(id) {
    lineas = lineas.filter((l) => l.id !== id);
    guardar();
  }

  function vaciar() {
    lineas = [];
    guardar();
  }

  function suscribir(fn) {
    oyentes.push(fn);
    fn(detalle());
  }

  function notificar() {
    oyentes.forEach((fn) => fn(detalle()));
  }

  cargar();

  return { detalle, subtotal, unidades, agregar, fijar, quitar, vaciar, suscribir, notificar, recargar: cargar };
})();

/* ------------------------------- Avisos --------------------------------- */
function avisar(mensaje, tipo = '') {
  let cont = document.querySelector('.toasts');
  if (!cont) {
    cont = document.createElement('div');
    cont.className = 'toasts';
    cont.setAttribute('role', 'status');
    cont.setAttribute('aria-live', 'polite');
    document.body.appendChild(cont);
  }

  const t = document.createElement('div');
  t.className = 'toast pergamino' + (tipo ? ' toast--' + tipo : '');
  t.textContent = mensaje;
  cont.appendChild(t);

  setTimeout(() => {
    t.classList.add('es-saliendo');
    setTimeout(() => t.remove(), 260);
  }, 2400);
}

/* ------------------ Botón flotante + comanda del pedido ----------------- */
const PanelPedido = (function () {
  let velo, cajon, cuerpo, pie, contador, flotante;
  let ultimoFoco = null;

  function construir() {
    /* --- Botón flotante, abajo a la derecha --- */
    if (document.body.dataset.flotante !== 'no') {
      flotante = document.createElement('button');
      flotante.className = 'flotante';
      flotante.type = 'button';
      flotante.setAttribute('aria-label', 'Pedir domicilio — abrir mi pedido');
      flotante.innerHTML = `
        ${ICONOS.moto}
        <span class="flotante__texto">Pedir domicilio</span>
        <span class="flotante__contador" aria-hidden="true">0</span>`;
      flotante.addEventListener('click', abrir);
      document.body.appendChild(flotante);
      contador = flotante.querySelector('.flotante__contador');
    }

    /* --- Velo + comanda --- */
    velo = document.createElement('div');
    velo.className = 'velo';
    velo.addEventListener('click', cerrar);

    cajon = document.createElement('aside');
    cajon.className = 'cajon pergamino';
    cajon.setAttribute('role', 'dialog');
    cajon.setAttribute('aria-modal', 'true');
    cajon.setAttribute('aria-label', 'Mi pedido');
    cajon.innerHTML = `
      <header class="cajon__cabecera">
        <h2 class="cajon__titulo">La comanda</h2>
        <p class="cajon__sub">Texas · Parrilla Bar</p>
        <button class="cajon__cerrar" type="button" aria-label="Cerrar">${ICONOS.cerrar}</button>
      </header>
      <div class="cajon__cuerpo"></div>
      <footer class="cajon__pie"></footer>`;

    document.body.append(velo, cajon);
    cuerpo = cajon.querySelector('.cajon__cuerpo');
    pie = cajon.querySelector('.cajon__pie');
    cajon.querySelector('.cajon__cerrar').addEventListener('click', cerrar);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && cajon.classList.contains('es-abierto')) cerrar();
    });

    Carrito.suscribir(pintar);
  }

  function pintar(items) {
    if (contador) {
      const n = Carrito.unidades();
      contador.textContent = n > 99 ? '99+' : n;
      contador.classList.toggle('es-visible', n > 0);
    }

    if (!cuerpo) return;

    if (!items.length) {
      cuerpo.innerHTML = `
        <div class="vacio">
          <span class="vacio__icono">${ICONOS.sombrero}</span>
          <h3>La comanda está en blanco</h3>
          <p>Arma tu pedido desde la carta y nosotros lo llevamos hasta tu puerta.</p>
          <a class="btn btn--brasa" href="carta.html">Ver la carta</a>
        </div>`;
      pie.innerHTML = '';
      return;
    }

    cuerpo.innerHTML = items.map((d) => `
      <article class="item" data-id="${d.plato.id}">
        <div>
          <h3 class="item__nombre">${d.plato.nombre}</h3>
          <p class="item__precio-u">${precioCOP(d.plato.precio)} c/u</p>
        </div>
        <p class="item__total">${precioCOP(d.total)}</p>
        <div class="item__controles">
          <button class="paso" type="button" data-accion="menos" aria-label="Quitar una unidad de ${d.plato.nombre}">−</button>
          <span class="item__cantidad" aria-label="Cantidad">${d.cantidad}</span>
          <button class="paso" type="button" data-accion="mas" aria-label="Agregar una unidad de ${d.plato.nombre}">+</button>
          <button class="item__quitar" type="button" data-accion="quitar">Quitar</button>
        </div>
      </article>`).join('');

    const sub = Carrito.subtotal();
    const falta = NEGOCIO.pedidoMinimo - sub;
    const n = Carrito.unidades();

    pie.innerHTML = `
      ${falta > 0 ? `<p class="aviso-minimo">Pedido mínimo ${precioCOP(NEGOCIO.pedidoMinimo)} · te faltan ${precioCOP(falta)}</p>` : ''}
      <div class="resumen-linea"><span>Subtotal (${n} ${n === 1 ? 'ítem' : 'ítems'})</span><span>${precioCOP(sub)}</span></div>
      <div class="resumen-linea"><span>Domicilio</span><span>Según tu zona</span></div>
      <div class="resumen-linea resumen-linea--total"><span>Total</span><strong>${precioCOP(sub)}</strong></div>
      <a class="btn btn--brasa btn--bloque" href="checkout.html" style="margin-top:1rem"
         ${falta > 0 ? 'aria-disabled="true" data-bloqueado="1"' : ''}>
        Continuar pedido ${ICONOS.flecha}
      </a>
      <button class="btn btn--fantasma btn--bloque btn--sm" type="button" data-accion="vaciar" style="margin-top:.6rem">
        Vaciar la comanda
      </button>`;
  }

  function abrir() {
    ultimoFoco = document.activeElement;
    velo.classList.add('es-abierto');
    cajon.classList.add('es-abierto');
    document.body.style.overflow = 'hidden';
    setTimeout(() => cajon.querySelector('.cajon__cerrar')?.focus(), 360);
  }

  function cerrar() {
    velo.classList.remove('es-abierto');
    cajon.classList.remove('es-abierto');
    document.body.style.overflow = '';
    ultimoFoco?.focus?.();
  }

  /* Delegación dentro de la comanda */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-accion]');
    if (!btn || !cajon?.contains(btn)) return;

    const accion = btn.dataset.accion;

    if (accion === 'vaciar') {
      if (confirm('¿Seguro que quieres vaciar tu pedido?')) {
        Carrito.vaciar();
        avisar('Comanda vaciada');
      }
      return;
    }

    const id = btn.closest('.item')?.dataset.id;
    if (!id) return;
    const actual = Carrito.detalle().find((d) => d.plato.id === id)?.cantidad || 0;

    if (accion === 'mas') Carrito.fijar(id, actual + 1);
    if (accion === 'menos') Carrito.fijar(id, actual - 1);
    if (accion === 'quitar') { Carrito.quitar(id); avisar('Ítem retirado del pedido'); }
  });

  /* Bloquea el paso al checkout si no se llega al mínimo */
  document.addEventListener('click', (e) => {
    const enlace = e.target.closest('a[data-bloqueado="1"]');
    if (!enlace) return;
    e.preventDefault();
    avisar(`El pedido mínimo para domicilio es ${precioCOP(NEGOCIO.pedidoMinimo)}`, 'error');
  });

  return { construir, abrir, cerrar };
})();

/* -------------- Botón "agregar" en cualquier parte del sitio ------------- */
/* Funciona por delegación: sirve cualquier elemento con data-agregar="<id>" */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-agregar]');
  if (!btn || btn.classList.contains('es-agregado')) return;

  const plato = buscarPlato(btn.dataset.agregar);
  if (!plato) return;

  Carrito.agregar(plato.id, 1);
  avisar(`${plato.nombre} va para la parrilla`, 'ok');

  const original = btn.innerHTML;
  btn.classList.add('es-agregado');
  btn.innerHTML = ICONOS.check;
  setTimeout(() => {
    btn.classList.remove('es-agregado');
    btn.innerHTML = original;
  }, 1100);
});

/* ------------------------------ Arranque -------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  PanelPedido.construir();

  document.querySelectorAll('[data-abrir-pedido]').forEach((b) =>
    b.addEventListener('click', (e) => { e.preventDefault(); PanelPedido.abrir(); })
  );

  /* Si el pedido cambia en otra pestaña, se refresca aquí */
  window.addEventListener('storage', (e) => {
    if (e.key === 'texas_pedido_v1') { Carrito.recargar(); Carrito.notificar(); }
  });
});
