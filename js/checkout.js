/* ==========================================================================
   TEXAS · Parrilla Bar — Checkout del domicilio
   Valida los datos, calcula el domicilio según la zona, genera el código
   del pedido y lo deja guardado para la página de seguimiento.
   Depende de: js/datos.js, js/carrito.js, js/app.js
   ========================================================================== */

const CLAVE_ACTUAL = 'texas_pedido_actual';
const CLAVE_HISTORIAL = 'texas_historial_v1';

/** Genera un código legible tipo TX-4821 */
function generarCodigo() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return 'TX-' + n;
}

/** Guarda el pedido y devuelve el objeto guardado */
function guardarPedido(pedido) {
  try {
    localStorage.setItem(CLAVE_ACTUAL, JSON.stringify(pedido));
    const previos = JSON.parse(localStorage.getItem(CLAVE_HISTORIAL) || '[]');
    previos.unshift(pedido);
    localStorage.setItem(CLAVE_HISTORIAL, JSON.stringify(previos.slice(0, 20)));
  } catch (e) {
    /* si el navegador bloquea el almacenamiento seguimos con el flujo */
  }
  return pedido;
}

document.addEventListener('DOMContentLoaded', () => {
  const bloqueVacio = document.getElementById('vacio');
  const bloqueCheckout = document.getElementById('checkout');
  const form = document.getElementById('formPedido');
  if (!form) return;

  /* ------------------ ¿Hay algo en el pedido? -------------------------- */
  if (!Carrito.detalle().length) {
    bloqueVacio.hidden = false;
    return;
  }
  bloqueCheckout.hidden = false;

  /* --------------------------- Referencias ------------------------------ */
  const selSede = document.getElementById('sede');
  const contZonas = document.getElementById('zonas');
  const contPagos = document.getElementById('pagos');
  const campoDireccion = document.getElementById('direccion').closest('.campo');
  const camposDireccion = document.getElementById('camposDireccion');
  const campoVuelto = document.getElementById('campoVuelto');
  const errorZona = document.getElementById('errorZona');
  const errorPago = document.getElementById('errorPago');
  const btnConfirmar = document.getElementById('btnConfirmar');

  /* ---------------------------- Sedes ----------------------------------- */
  selSede.innerHTML = SEDES.map(
    (s) => `<option value="${s.id}">${s.nombre} — ${s.direccion}</option>`
  ).join('');

  /* --------------------------- Formas de pago --------------------------- */
  contPagos.innerHTML = METODOS_PAGO.map((m) => `
    <label class="opcion">
      <input type="radio" name="pago" value="${m.id}">
      <span class="opcion__texto">
        <span class="opcion__nombre">${m.nombre}</span>
        <span class="opcion__nota">${m.nota}</span>
      </span>
    </label>`).join('');

  contPagos.addEventListener('change', () => {
    const elegido = form.querySelector('input[name="pago"]:checked')?.value;
    campoVuelto.hidden = elegido !== 'efectivo';
    errorPago.style.display = 'none';
  });

  /* ---------------------- Zonas (dependen de la sede) ------------------- */
  function pintarZonas() {
    const sede = selSede.value;
    const disponibles = ZONAS_DOMICILIO.filter((z) => z.sede === sede || z.sede === 'ambas');

    contZonas.innerHTML = disponibles.map((z) => `
      <label class="opcion">
        <input type="radio" name="zona" value="${z.id}">
        <span class="opcion__texto">
          <span class="opcion__nombre">${z.nombre}</span>
          <span class="opcion__nota">Entrega estimada ${z.tiempo}</span>
        </span>
        <span class="opcion__valor">${z.valor === 0 ? 'Gratis' : precioCOP(z.valor)}</span>
      </label>`).join('');

    actualizarResumen();
  }

  selSede.addEventListener('change', pintarZonas);

  contZonas.addEventListener('change', () => {
    errorZona.style.display = 'none';
    const zona = zonaElegida();
    // "Recoger en el punto" no necesita dirección
    const recoge = zona?.id === 'recoger';
    camposDireccion.hidden = recoge;
    if (recoge) campoDireccion.classList.remove('es-invalido');
    actualizarResumen();
  });

  function zonaElegida() {
    const v = form.querySelector('input[name="zona"]:checked')?.value;
    return v ? buscarZona(v) : null;
  }

  /* ----------------------------- Resumen -------------------------------- */
  const resumenItems = document.getElementById('resumenItems');
  const lineaSubtotal = document.getElementById('lineaSubtotal');
  const lineaDomicilio = document.getElementById('lineaDomicilio');
  const lineaTiempo = document.getElementById('lineaTiempo');
  const lineaTotal = document.getElementById('lineaTotal');

  // Mientras se confirma el pedido se vacía el carrito a propósito:
  // esta bandera evita que la vista salte al estado "pedido vacío".
  let enviando = false;

  function actualizarResumen() {
    const items = Carrito.detalle();

    // Si el usuario vació el pedido desde el cajón, vuelve al estado vacío
    if (!items.length && !enviando) {
      bloqueCheckout.hidden = true;
      bloqueVacio.hidden = false;
      return;
    }
    if (!items.length) return;

    resumenItems.innerHTML = items.map((d) => `
      <div class="resumen__item">
        <span><b>${d.cantidad}×</b> ${d.plato.nombre}</span>
        <i>${precioCOP(d.total)}</i>
      </div>`).join('');

    const zona = zonaElegida();
    const sub = Carrito.subtotal();
    const envio = zona ? zona.valor : 0;

    lineaSubtotal.textContent = precioCOP(sub);
    lineaDomicilio.textContent = zona ? (envio === 0 ? 'Gratis' : precioCOP(envio)) : 'Elige tu zona';
    lineaTiempo.textContent = zona ? zona.tiempo : '—';
    lineaTotal.textContent = precioCOP(sub + envio);
  }

  Carrito.suscribir(actualizarResumen);
  pintarZonas();

  /* ---------------------------- Validación ------------------------------ */
  function marcar(campoEl, valido) {
    campoEl.classList.toggle('es-invalido', !valido);
    return valido;
  }

  function validar() {
    let ok = true;
    let primerFallo = null;

    const nombre = document.getElementById('nombre');
    const celular = document.getElementById('celular');
    const direccion = document.getElementById('direccion');

    // Nombre: al menos 3 caracteres y que tenga letras
    const nombreOk = nombre.value.trim().length >= 3 && /[a-záéíóúñ]/i.test(nombre.value);
    if (!marcar(nombre.closest('.campo'), nombreOk)) { ok = false; primerFallo ||= nombre; }

    // Celular colombiano: 10 dígitos empezando por 3
    const celOk = /^3\d{9}$/.test(celular.value.replace(/\D/g, ''));
    if (!marcar(celular.closest('.campo'), celOk)) { ok = false; primerFallo ||= celular; }

    // Zona
    const zona = zonaElegida();
    errorZona.style.display = zona ? 'none' : 'block';
    if (!zona) { ok = false; primerFallo ||= contZonas; }

    // Dirección (solo si hay entrega a domicilio)
    if (zona && zona.id !== 'recoger') {
      const dirOk = direccion.value.trim().length >= 6;
      if (!marcar(campoDireccion, dirOk)) { ok = false; primerFallo ||= direccion; }
    } else {
      campoDireccion.classList.remove('es-invalido');
    }

    // Pago
    const pago = form.querySelector('input[name="pago"]:checked');
    errorPago.style.display = pago ? 'none' : 'block';
    if (!pago) { ok = false; primerFallo ||= contPagos; }

    if (!ok && primerFallo) {
      primerFallo.scrollIntoView({ behavior: 'smooth', block: 'center' });
      primerFallo.focus?.({ preventScroll: true });
      avisar('Revisa los campos marcados en rojo', 'error');
    }

    return ok;
  }

  // Limpia el error de un campo apenas el usuario lo corrige
  form.querySelectorAll('input, textarea').forEach((el) => {
    el.addEventListener('input', () => el.closest('.campo')?.classList.remove('es-invalido'));
  });

  // El celular solo acepta dígitos
  document.getElementById('celular').addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
  });

  document.getElementById('vuelto').addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 8);
  });

  /* ----------------------------- Envío ---------------------------------- */
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const items = Carrito.detalle();
    if (!items.length) { location.reload(); return; }

    const sub = Carrito.subtotal();
    if (sub < NEGOCIO.pedidoMinimo) {
      avisar(`El pedido mínimo para domicilio es ${precioCOP(NEGOCIO.pedidoMinimo)}`, 'error');
      return;
    }

    if (!validar()) return;

    enviando = true;
    btnConfirmar.disabled = true;
    btnConfirmar.textContent = 'Enviando a la parrilla…';

    const zona = zonaElegida();
    const sede = SEDES.find((s) => s.id === selSede.value);
    const pagoId = form.querySelector('input[name="pago"]:checked').value;
    const pago = METODOS_PAGO.find((m) => m.id === pagoId);

    const pedido = {
      codigo: generarCodigo(),
      creado: Date.now(),
      cliente: {
        nombre: document.getElementById('nombre').value.trim(),
        celular: document.getElementById('celular').value.trim(),
      },
      sede: { id: sede.id, nombre: sede.nombre, direccion: sede.direccion },
      zona: { id: zona.id, nombre: zona.nombre, valor: zona.valor, tiempo: zona.tiempo },
      esRecoger: zona.id === 'recoger',
      direccion: zona.id === 'recoger' ? 'Recoge en el punto' : document.getElementById('direccion').value.trim(),
      referencia: document.getElementById('referencia').value.trim(),
      pago: { id: pago.id, nombre: pago.nombre },
      vuelto: campoVuelto.hidden ? '' : document.getElementById('vuelto').value.trim(),
      notas: document.getElementById('notas').value.trim(),
      items: items.map((d) => ({
        id: d.plato.id,
        nombre: d.plato.nombre,
        precio: d.plato.precio,
        cantidad: d.cantidad,
        total: d.total,
      })),
      subtotal: sub,
      domicilio: zona.valor,
      total: sub + zona.valor,
    };

    guardarPedido(pedido);
    Carrito.vaciar();

    // Pequeña pausa para que se vea el estado del botón
    setTimeout(() => {
      location.href = 'seguimiento.html?p=' + encodeURIComponent(pedido.codigo);
    }, 700);
  });
});
