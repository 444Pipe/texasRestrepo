/* ==========================================================================
   TEXAS · Parrilla Bar — Iconografía western
   Todo dibujado a mano en SVG: nada de emojis, nada de librerías externas.
   Cada icono usa viewBox 0 0 24 24 y hereda currentColor.
   ========================================================================== */

const ICONOS = {

  /* ------------------------- Identidad vaquera ------------------------- */

  /* Estrella de sheriff de cinco puntas con bolitas en las puntas */
  estrella: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2 14.47 8.6 21.51 8.91 15.99 13.3 17.88 20.09 12 16.2 6.12 20.09 8.01 13.3 2.49 8.91 9.53 8.6Z"/>
    <circle cx="12" cy="2" r="1.35"/><circle cx="21.51" cy="8.91" r="1.35"/>
    <circle cx="17.88" cy="20.09" r="1.35"/><circle cx="6.12" cy="20.09" r="1.35"/>
    <circle cx="2.49" cy="8.91" r="1.35"/>
  </svg>`,

  /* Sombrero vaquero, el mismo gesto del logo */
  sombrero: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M7.4 13.2c.2-2.6.6-4.8 1-6.2.4-1.5 1.9-2.3 3.6-2.3s3.2.8 3.6 2.3c.4 1.4.8 3.6 1 6.2"/>
    <path d="M1.8 14.4c1.6-1.4 3.6-1.6 5.6-1.2 3 .6 6.2.6 9.2 0 2-.4 4-.2 5.6 1.2-1.2 2.9-5.2 4.6-10.2 4.6S3 17.3 1.8 14.4Z"/>
    <path d="M7.1 12.6c3.2 1.5 6.6 1.5 9.8 0"/>
  </svg>`,

  /* Herradura con los clavos */
  herradura: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true">
    <path d="M6.6 21.2V13a5.4 5.4 0 0 1 10.8 0v8.2"/>
    <path d="M6.6 21.2h2.6M14.8 21.2h2.6" stroke-width="2.8"/>
    <circle cx="7.6" cy="15.4" r=".85" fill="currentColor" stroke="none"/>
    <circle cx="16.4" cy="15.4" r=".85" fill="currentColor" stroke="none"/>
    <circle cx="8.2" cy="18.4" r=".85" fill="currentColor" stroke="none"/>
    <circle cx="15.8" cy="18.4" r=".85" fill="currentColor" stroke="none"/>
  </svg>`,

  /* Cabeza de longhorn — silueta maciza para que se lea también en 16 px */
  longhorn: `<svg viewBox="0 0 24 24" fill="currentColor" fill-rule="evenodd" aria-hidden="true">
    <path d="M2.4 6.5c-.7.2-.8 1.1 0 1.5 1.5.9 3.1.8 4.7 1.3-.2.7-.3 1.4-.3 2.1 0 2.2 1.2 4.1 3 5L12 20.9l2.2-4.5c1.8-.9 3-2.8 3-5 0-.7-.1-1.4-.3-2.1 1.6-.5 3.2-.4 4.7-1.3.8-.4.7-1.3 0-1.5-2.3-.7-4.2.3-6.1 1.3-.9-.6-2.1-1-3.5-1s-2.6.4-3.5 1c-1.9-1-3.8-2-6.1-1.3Z
             M9.3 12.4a1.1 1.1 0 1 1 2.2 0 1.1 1.1 0 0 1-2.2 0Z
             M12.5 12.4a1.1 1.1 0 1 1 2.2 0 1.1 1.1 0 0 1-2.2 0Z"/>
  </svg>`,

  /* Llama de la brasa */
  brasa: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true">
    <path d="M12 2.5c.6 3 3 4 4.6 6.4 1.2 1.8 1.6 3.5 1.6 5 0 3.6-2.8 6.6-6.2 6.6S5.8 17.5 5.8 13.9c0-2.4 1.2-4 2.4-5.2.3 1 .9 1.7 1.7 2 .1-3.3.6-6 2.1-8.2Z"/>
    <path d="M12 20.5c-1.8 0-3.2-1.5-3.2-3.3 0-1.9 1.5-2.6 2-4.2.9.8 2.3 1.9 2.9 3.1.3.6.5 1.1.5 1.7 0 1.5-1 2.7-2.2 2.7Z"/>
  </svg>`,

  /* Cactus del desierto */
  cactus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M12 21.5V6.2a2.4 2.4 0 0 1 4.8 0v.6"/>
    <path d="M12 13.4H8.9A2.4 2.4 0 0 1 6.5 11V8.6"/>
    <path d="M12 10.6h2.6A2.4 2.4 0 0 0 17 8.2V6.6"/>
    <path d="M8.6 21.5h6.8"/>
  </svg>`,

  /* Rueda de carreta */
  rueda: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
    <circle cx="12" cy="12" r="9.2"/><circle cx="12" cy="12" r="2.6"/>
    <path d="M12 2.8v6.6M12 14.6v6.6M2.8 12h6.6M14.6 12h6.6"/>
    <path d="m5.5 5.5 4.7 4.7M13.8 13.8l4.7 4.7M18.5 5.5l-4.7 4.7M10.2 13.8l-4.7 4.7" stroke-width="1.2"/>
  </svg>`,

  /* Bota con espuela */
  bota: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M8 2.8h4.6v8.4c0 1.5.7 2.4 2 3l3.3 1.5c1.2.6 1.9 1.5 1.9 2.8v1.7H8Z"/>
    <path d="M8 8.2h4.6"/>
    <circle cx="3.6" cy="18.4" r="2.2"/><path d="M5.8 18.4H8"/>
  </svg>`,

  /* Hamburguesa con ajonjolí */
  hamburguesa: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M3.4 10.4a8.6 5.8 0 0 1 17.2 0Z"/>
    <path d="M3.2 12.6h17.6"/>
    <path d="M3.6 15c1.4-1 2.6 1 4 0s2.6 1 4 0 2.6 1 4 0 2.3.8 3.4.2"/>
    <path d="M3.6 17.2a8.4 3.4 0 0 0 16.8 0Z"/>
    <circle cx="9" cy="7.6" r=".55" fill="currentColor" stroke="none"/>
    <circle cx="13.4" cy="6.9" r=".55" fill="currentColor" stroke="none"/>
    <circle cx="16.6" cy="8.4" r=".55" fill="currentColor" stroke="none"/>
  </svg>`,

  /* Jarra de cerveza */
  jarra: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M4.6 6.4h10.6v12.2a1.6 1.6 0 0 1-1.6 1.6H6.2a1.6 1.6 0 0 1-1.6-1.6Z"/>
    <path d="M15.2 9h2.4a2.7 2.7 0 0 1 0 5.4h-2.4"/>
    <path d="M4.6 10h10.6"/>
    <path d="M8 12.8v4.2M11.8 12.8v4.2"/>
    <path d="M5.4 6.4c-.4-1.6.7-2.8 2.2-2.6.5-1.3 2.4-1.5 3.2-.4 1.2-.7 2.8.1 2.9 1.6.9.2 1.4.8 1.5 1.4"/>
  </svg>`,

  /* Mazorca */
  mazorca: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M12 3c3 0 5.1 3.1 5.1 7.5S15 20.6 12 20.6 6.9 14.9 6.9 10.5 9 3 12 3Z"/>
    <path d="M12 4.6v14.6"/>
    <path d="M9.5 7.4c1 1.4 1 8.2 0 9.6M14.5 7.4c-1 1.4-1 8.2 0 9.6"/>
  </svg>`,

  /* --------------------------- Interfaz -------------------------------- */

  moto: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="5.5" cy="17.5" r="3.4"/><circle cx="18.5" cy="17.5" r="3.4"/><path d="M15 17.5H9m9.5-3.5-2-6H14m-8.5 9.5 3-6.5H14"/><path d="M12 5h3l1 3"/></svg>`,

  cerrar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>`,

  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m4 12.5 5.5 5.5L20 7"/></svg>`,

  mas: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>`,

  pin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,

  reloj: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>`,

  tel: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>`,

  flecha: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>`,

  buscar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`,

  wa: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-1.7-.9-2.9-1.6-4-3.6-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5s-.7-1.6-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5 1.9.8 2.6.9 3.5.7.6-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.2-.3-.3-.6-.4Z"/><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2Z"/></svg>`,

  ig: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.6" cy="6.4" r="1.3" fill="currentColor" stroke="none"/></svg>`,

  fb: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12Z"/></svg>`,

  play: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.2v13.6a1 1 0 0 0 1.5.87l11-6.8a1 1 0 0 0 0-1.74l-11-6.8A1 1 0 0 0 8 5.2Z"/></svg>`,

  pausa: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6.5" y="4.5" width="4" height="15" rx="1.3"/><rect x="13.5" y="4.5" width="4" height="15" rx="1.3"/></svg>`,

  mudo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4.8 6.6 8.6H3.2v6.8h3.4L11 19.2Z" fill="currentColor"/><path d="m16.5 9.5 5 5m0-5-5 5"/></svg>`,

  sonido: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4.8 6.6 8.6H3.2v6.8h3.4L11 19.2Z" fill="currentColor"/><path d="M15.3 9.2a4 4 0 0 1 0 5.6M18 6.5a7.8 7.8 0 0 1 0 11"/></svg>`,
};

/* ==========================================================================
   Ornamentos: piezas decorativas más grandes, con su propio viewBox.
   ========================================================================== */

const ORNAMENTOS = {

  /* Separador: cuerda con estrella al centro */
  cuerdaEstrella: `<svg class="ornamento" viewBox="0 0 400 26" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <linearGradient id="ornG" x1="0" x2="1">
        <stop offset="0" stop-color="currentColor" stop-opacity="0"/>
        <stop offset=".3" stop-color="currentColor" stop-opacity=".9"/>
        <stop offset=".7" stop-color="currentColor" stop-opacity=".9"/>
        <stop offset="1" stop-color="currentColor" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <path d="M4 13h150" stroke="url(#ornG)" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M246 13h150" stroke="url(#ornG)" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M160 13h26M214 13h26" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity=".55"/>
    <path d="m200 3 2.9 6.4 7 .8-5.2 4.7 1.4 6.9-6.1-3.4-6.1 3.4 1.4-6.9-5.2-4.7 7-.8Z" fill="currentColor"/>
  </svg>`,

  /* Separador: cuernos de longhorn abriéndose */
  cuernos: `<svg class="ornamento" viewBox="0 0 400 40" aria-hidden="true">
    <path d="M200 30c-4.6 0-8 3-8 6.5h16c0-3.5-3.4-6.5-8-6.5Z" fill="currentColor" opacity=".8"/>
    <path d="M192 30c-14-4-24-2-38-10-16-9-30-8-44-14" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M208 30c14-4 24-2 38-10 16-9 30-8 44-14" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round"/>
    <circle cx="110" cy="6" r="3" fill="currentColor"/><circle cx="290" cy="6" r="3" fill="currentColor"/>
  </svg>`,
};

/* Cuerda decorativa (solo el trenzado, sin estrella) */
const CUERDA = `<span class="cuerda" aria-hidden="true"></span>`;
