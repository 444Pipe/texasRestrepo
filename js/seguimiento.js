/* ==========================================================================
   TEXAS · Parrilla Bar — Seguimiento del pedido (simulación)
   El estado se calcula con el tiempo transcurrido desde que se creó el pedido,
   así que sobrevive a recargas de la página.
   Depende de: js/datos.js, js/iconos.js, js/carrito.js, js/app.js
   ========================================================================== */

/* Segundos desde la creación en los que entra cada estado.
   Están comprimidos a propósito para que la demo se vea completa en ~1 minuto. */
const ETAPAS = [
  { clave: 'recibido',   titulo: 'Pedido recibido', icono: 'check',     nota: 'Confirmamos tu pedido y ya está en la cocina.',   segundos: 0 },
  { clave: 'preparando', titulo: 'En la parrilla',  icono: 'brasa',     nota: 'Estamos asando tu pedido al carbón, en su punto.', segundos: 15 },
  { clave: 'camino',     titulo: 'En camino',       icono: 'moto',      nota: 'El domiciliario ya salió con tu pedido.',          segundos: 35 },
  { clave: 'entregado',  titulo: 'Entregado',       icono: 'sombrero',  nota: '¡Buen provecho! Gracias por preferir Texas.',      segundos: 60 },
];

const DURACION_DEMO = ETAPAS[ETAPAS.length - 1].segundos;

/* -------------------- Recuperar el pedido guardado ---------------------- */
function cargarPedido() {
  const codigo = new URLSearchParams(location.search).get('p');

  try {
    const actual = JSON.parse(localStorage.getItem('texas_pedido_actual') || 'null');
    if (actual && (!codigo || actual.codigo === codigo)) return actual;

    const historial = JSON.parse(localStorage.getItem('texas_historial_v1') || '[]');
    return historial.find((p) => p.codigo === codigo) || null;
  } catch (e) {
    return null;
  }
}

/* ------------------- Mensaje de WhatsApp con el pedido ------------------ */
function mensajeWhatsApp(p) {
  return [
    `🤠 *PEDIDO ${p.codigo}* — TEXAS Parrilla Bar`,
    '',
    `*Cliente:* ${p.cliente.nombre}`,
    `*Celular:* ${p.cliente.celular}`,
    `*Sede:* ${p.sede.nombre}`,
    p.esRecoger ? '*Entrega:* Recoge en el punto' : `*Dirección:* ${p.direccion}`,
    p.referencia ? `*Referencia:* ${p.referencia}` : '',
    `*Zona:* ${p.zona.nombre}`,
    '',
    '*PEDIDO:*',
    ...p.items.map((i) => `• ${i.cantidad}× ${i.nombre} — ${precioCOP(i.total)}`),
    '',
    `Subtotal: ${precioCOP(p.subtotal)}`,
    `Domicilio: ${p.domicilio === 0 ? 'Gratis' : precioCOP(p.domicilio)}`,
    `*TOTAL: ${precioCOP(p.total)}*`,
    '',
    `*Pago:* ${p.pago.nombre}${p.vuelto ? ` (paga con ${precioCOP(p.vuelto)})` : ''}`,
    p.notas ? `*Notas:* ${p.notas}` : '',
  ].filter(Boolean).join('\n');
}

document.addEventListener('DOMContentLoaded', () => {
  const sinPedido = document.getElementById('sinPedido');
  const conPedido = document.getElementById('conPedido');
  if (!conPedido) return;

  const pedido = cargarPedido();

  if (!pedido) {
    sinPedido.hidden = false;
    return;
  }
  conPedido.hidden = false;

  /* --------------------------- Cabecera --------------------------------- */
  document.getElementById('selloExito').innerHTML =
    ICONOS.estrella + `<span class="exito__check">${ICONOS.check}</span>`;

  document.getElementById('nombreCliente').textContent = pedido.cliente.nombre.split(' ')[0];
  document.getElementById('codigoPedido').textContent = pedido.codigo;
  document.getElementById('resumenEntrega').textContent = pedido.esRecoger
    ? `Lo puedes recoger en nuestra sede de ${pedido.sede.nombre} · ${pedido.zona.tiempo}`
    : `Llega a ${pedido.direccion} · ${pedido.zona.tiempo}`;

  /* ------------------------ Detalle de entrega -------------------------- */
  const detalle = [
    ['Código del pedido', pedido.codigo],
    ['Sede', `${pedido.sede.nombre} — ${pedido.sede.direccion}`],
    ['Zona', pedido.zona.nombre],
    [pedido.esRecoger ? 'Modalidad' : 'Dirección', pedido.direccion],
    pedido.referencia ? ['Referencia', pedido.referencia] : null,
    ['Contacto', `${pedido.cliente.nombre} · ${pedido.cliente.celular}`],
    ['Forma de pago', pedido.pago.nombre + (pedido.vuelto ? ` (paga con ${precioCOP(pedido.vuelto)})` : '')],
    pedido.notas ? ['Notas', pedido.notas] : null,
    ['Hora del pedido', new Date(pedido.creado).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })],
  ].filter(Boolean);

  document.getElementById('detalleEntrega').innerHTML = detalle
    .map(([k, v]) => `<div class="detalle-linea"><span>${k}</span><b>${v}</b></div>`)
    .join('');

  /* ----------------------------- Ítems ---------------------------------- */
  document.getElementById('itemsPedido').innerHTML = pedido.items
    .map((i) => `
      <div class="resumen__item">
        <span><b>${i.cantidad}×</b> ${i.nombre}</span>
        <i>${precioCOP(i.total)}</i>
      </div>`)
    .join('');

  document.getElementById('subtotalPedido').textContent = precioCOP(pedido.subtotal);
  document.getElementById('domicilioPedido').textContent = pedido.domicilio === 0 ? 'Gratis' : precioCOP(pedido.domicilio);
  document.getElementById('totalPedido').textContent = precioCOP(pedido.total);

  /* ---------------------------- WhatsApp -------------------------------- */
  document.getElementById('btnWhatsApp').href =
    `https://wa.me/${NEGOCIO.whatsapp}?text=${encodeURIComponent(mensajeWhatsApp(pedido))}`;

  /* ------------------------- Pasos del estado --------------------------- */
  const contPasos = document.getElementById('pasos');
  contPasos.innerHTML = ETAPAS.map((et) => {
    const esRecogerCamino = et.clave === 'camino' && pedido.esRecoger;
    return `
      <div class="paso-estado" data-clave="${et.clave}">
        <div class="paso-estado__bolita">${ICONOS[et.icono] || ''}</div>
        <div>
          <h3 class="paso-estado__titulo">${esRecogerCamino ? 'Listo para recoger' : et.titulo}</h3>
          <p class="paso-estado__nota">${esRecogerCamino ? 'Tu pedido te espera en el punto.' : et.nota}</p>
        </div>
      </div>`;
  }).join('');

  const nodos = [...contPasos.querySelectorAll('.paso-estado')];
  const barra = document.getElementById('barra');
  const tiempoRestante = document.getElementById('tiempoRestante');
  const etiquetaTiempo = document.getElementById('etiquetaTiempo');

  let etapaAnterior = -1;
  let reloj = null;

  function refrescar() {
    const transcurrido = (Date.now() - pedido.creado) / 1000;

    let indice = 0;
    ETAPAS.forEach((et, i) => { if (transcurrido >= et.segundos) indice = i; });

    const esFinal = indice === ETAPAS.length - 1;

    nodos.forEach((n, i) => {
      n.classList.toggle('es-hecho', i < indice || esFinal);
      n.classList.toggle('es-activo', i === indice && !esFinal);
    });

    barra.style.width = Math.min(100, (transcurrido / DURACION_DEMO) * 100) + '%';

    if (esFinal) {
      etiquetaTiempo.textContent = 'Pedido finalizado';
      tiempoRestante.textContent = '¡Entregado!';
    } else {
      const faltan = Math.max(0, Math.ceil(DURACION_DEMO - transcurrido));
      etiquetaTiempo.textContent = pedido.esRecoger ? 'Listo para recoger en' : 'Tiempo estimado de entrega';
      tiempoRestante.textContent = `${faltan} s (demo · real: ${pedido.zona.tiempo})`;
    }

    // Aviso solo cuando el estado cambia de verdad
    if (indice !== etapaAnterior) {
      if (etapaAnterior !== -1) {
        const et = ETAPAS[indice];
        avisar(
          et.clave === 'camino' && pedido.esRecoger ? 'Tu pedido está listo para recoger' : et.titulo,
          esFinal ? 'ok' : ''
        );
      }
      etapaAnterior = indice;
    }

    if (esFinal && reloj) clearInterval(reloj);
  }

  refrescar();
  if (etapaAnterior !== ETAPAS.length - 1) reloj = setInterval(refrescar, 1000);

  /* -------------------- Reiniciar la simulación ------------------------- */
  document.getElementById('btnReiniciar').addEventListener('click', () => {
    pedido.creado = Date.now();
    try { localStorage.setItem('texas_pedido_actual', JSON.stringify(pedido)); } catch (e) {}
    location.reload();
  });
});
