/* ==========================================================================
   TEXAS · Parrilla Bar — Página de la carta
   Filtros por categoría + buscador en vivo. Cada categoría se pinta como
   una tabla de madera con los renglones y sus guías punteadas.
   Depende de: js/datos.js, js/iconos.js, js/carrito.js, js/app.js
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const contenedor = document.getElementById('carta');
  const filtros = document.getElementById('filtros');
  const busqueda = document.getElementById('busqueda');
  const minimo = document.getElementById('minimo');

  if (!contenedor) return;

  if (minimo) minimo.textContent = precioCOP(NEGOCIO.pedidoMinimo);

  let categoriaActiva = 'todas';
  let termino = '';

  /* --------------------------- Filtros ---------------------------------- */
  filtros.innerHTML = [{ id: 'todas', nombre: 'Todo', icono: 'sombrero' }, ...CATEGORIAS]
    .map((c) => `
      <button class="filtro" type="button" data-cat="${c.id}" aria-pressed="${c.id === 'todas'}">
        ${ICONOS[c.icono] || ''} ${c.nombre}
      </button>`)
    .join('');

  filtros.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-cat]');
    if (!btn) return;
    categoriaActiva = btn.dataset.cat;
    filtros.querySelectorAll('[data-cat]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    pintar();
  });

  /* --------------------------- Buscador --------------------------------- */
  if (busqueda) {
    let temporizador;
    busqueda.addEventListener('input', () => {
      clearTimeout(temporizador);
      temporizador = setTimeout(() => {
        termino = busqueda.value.trim();
        pintar();
      }, 160);
    });
  }

  /* Quita tildes para que "jamon" encuentre "jamón" */
  function normalizar(texto) {
    return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  }

  /* ---------------------------- Pintar ---------------------------------- */
  function pintar() {
    const t = normalizar(termino);

    const visibles = CARTA.filter((p) => {
      const porCategoria = categoriaActiva === 'todas' || p.categoria === categoriaActiva;
      const porTexto = !t || normalizar(p.nombre + ' ' + p.descripcion).includes(t);
      return porCategoria && porTexto;
    });

    if (!visibles.length) {
      contenedor.innerHTML = `
        <div class="sin-resultados">
          ${ICONOS.cactus}
          <h2>Por aquí no hay nada</h2>
          <p>No encontramos platos con “${termino}”. Prueba con otra palabra o mira toda la carta.</p>
        </div>`;
      return;
    }

    contenedor.innerHTML = CATEGORIAS.map((cat) => {
      const platos = visibles.filter((p) => p.categoria === cat.id);
      if (!platos.length) return '';

      return `
        <section class="grupo" id="cat-${cat.id}">
          <div class="grupo__cabecera">
            <span class="grupo__icono">${ICONOS[cat.icono] || ''}</span>
            <h2>${cat.nombre}</h2>
            <span>${cat.bajada}</span>
          </div>

          <div class="tabla madera remaches">
            <span class="remache"></span><span class="remache"></span>
            <span class="remache"></span><span class="remache"></span>
            <div class="tabla__lista">${platos.map(renglonPlato).join('')}</div>
          </div>
        </section>`;
    }).join('');
  }

  pintar();
});
