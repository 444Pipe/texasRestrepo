/* ==========================================================================
   TEXAS · Parrilla Bar — Datos del negocio, carta y zonas de domicilio
   Este es el único archivo que hay que tocar para actualizar precios,
   platos, sedes o valores de domicilio.
   ========================================================================== */

const NEGOCIO = {
  nombre: 'TEXAS',
  nombreCompleto: 'TEXAS · Parrilla Bar',
  lema: '¡Texas nunca falla!',
  descripcionCorta: 'Con verdadero sabor a parrilla',
  telefono: '3202044872',
  telefonoBonito: '320 204 4872',
  whatsapp: '573202044872', // formato internacional para el link de WhatsApp
  instagram: 'https://www.instagram.com/texasparrillabar/',
  facebook: 'https://www.facebook.com/p/TEXAS-Parrilla-Bar-100087573162260/',
  horario: 'Martes a domingo y festivos · 4:00 p.m. – 11:00 p.m.',
  horarioCorto: '4:00 p.m. – 11:00 p.m.',
  pedidoMinimo: 25000,
};

const SEDES = [
  {
    id: 'restrepo',
    nombre: 'Restrepo',
    direccion: '50 m arriba del C.C. Sunrise',
    detalle: 'Calle 8 #1-20 · Restrepo, Meta',
    mapa: 'https://maps.google.com/?q=Texas+Parrilla+Bar+Restrepo+Meta',
    horario: 'Mar – Dom y festivos · 4:00 p.m. – 11:00 p.m.',
  },
  {
    id: 'cumaral',
    nombre: 'Cumaral',
    direccion: 'Zona centro de Cumaral',
    detalle: 'Cumaral, Meta',
    mapa: 'https://maps.google.com/?q=Texas+Parrilla+Bar+Cumaral+Meta',
    horario: 'Mar – Dom y festivos · 4:00 p.m. – 11:00 p.m.',
  },
];

/* Zonas de domicilio: el valor se suma al subtotal en el checkout. */
const ZONAS_DOMICILIO = [
  { id: 'restrepo-centro', sede: 'restrepo', nombre: 'Restrepo · Centro', valor: 4000, tiempo: '25–35 min' },
  { id: 'restrepo-afueras', sede: 'restrepo', nombre: 'Restrepo · Barrios periféricos', valor: 7000, tiempo: '35–50 min' },
  { id: 'cumaral-centro', sede: 'cumaral', nombre: 'Cumaral · Centro', valor: 4000, tiempo: '25–35 min' },
  { id: 'cumaral-afueras', sede: 'cumaral', nombre: 'Cumaral · Barrios periféricos', valor: 8000, tiempo: '35–50 min' },
  { id: 'recoger', sede: 'ambas', nombre: 'Recoger en el punto', valor: 0, tiempo: '20–30 min' },
];

const METODOS_PAGO = [
  { id: 'efectivo', nombre: 'Efectivo contra entrega', nota: 'Indícanos con cuánto pagas' },
  { id: 'nequi', nombre: 'Nequi', nota: 'Te enviamos el número por WhatsApp' },
  { id: 'daviplata', nombre: 'Daviplata', nota: 'Te enviamos el número por WhatsApp' },
  { id: 'datafono', nombre: 'Datáfono en la puerta', nota: 'Débito o crédito' },
];

/* El campo `icono` es el nombre de un icono de js/iconos.js */
const CATEGORIAS = [
  { id: 'picadas', nombre: 'Picadas', icono: 'brasa', bajada: 'La especialidad de la casa' },
  { id: 'hamburguesas', nombre: 'Hamburguesas', icono: 'hamburguesa', bajada: 'Carne ahumada en la parrilla' },
  { id: 'carnes', nombre: 'Carnes a la parrilla', icono: 'longhorn', bajada: 'Corte, brasa y punto exacto' },
  { id: 'compartir', nombre: 'Para compartir', icono: 'mazorca', bajada: 'Entradas y picoteo' },
  { id: 'bebidas', nombre: 'Bebidas & Bar', icono: 'jarra', bajada: 'Para acompañar la parrilla' },
  { id: 'adiciones', nombre: 'Adiciones', icono: 'mas', bajada: 'Complementa tu plato' },
];

/* Las cuatro reglas que se muestran en "El código de la casa" del index */
const REGLAS = [
  {
    num: 'I', icono: 'brasa', titulo: 'Parrilla de verdad',
    texto: 'Carbón, no plancha. Cada corte pasa por el fuego hasta el punto que pediste.',
  },
  {
    num: 'II', icono: 'longhorn', titulo: 'Sabor llanero',
    texto: 'Ternera a la llanera, chorizo santarrosano y ají de la casa. Receta de la región.',
  },
  {
    num: 'III', icono: 'sombrero', titulo: 'Ambiente western',
    texto: 'Cielo abierto, madera y mesas bien separadas. Para venir con familia o con parche.',
  },
  {
    num: 'IV', icono: 'moto', titulo: 'Te lo llevamos',
    texto: 'Domicilios en Restrepo y Cumaral. Pides desde la web y sigues tu pedido en vivo.',
  },
];

/* destacado: true → aparece en la sección "Lo más pedido" del index */
const CARTA = [
  /* ---------- PICADAS ---------- */
  {
    id: 'pic-personal',
    categoria: 'picadas',
    nombre: 'Picada Personal',
    descripcion: 'Carne de res, cerdo, pollo, chorizo llanero, morcilla, papa criolla y maduro.',
    precio: 28000,
    destacado: true,
    etiqueta: 'La favorita',
  },
  {
    id: 'pic-casa',
    categoria: 'picadas',
    nombre: 'Picada de la Casa',
    descripcion: 'Para 2 personas. Mix de carnes a la parrilla, chorizo, chicharrón, papa criolla, yuca y maduro.',
    precio: 55000,
    destacado: true,
    etiqueta: 'Para 2',
  },
  {
    id: 'pic-texas',
    categoria: 'picadas',
    nombre: 'Picada Texas',
    descripcion: 'Para 4 personas. La tabla completa: res, cerdo, pollo, costilla BBQ, chorizo, morcilla y todos los acompañamientos.',
    precio: 95000,
    etiqueta: 'Para 4',
  },
  {
    id: 'pic-llanerita',
    categoria: 'picadas',
    nombre: 'Llanerita Doble',
    descripcion: 'Ternera a la llanera, chorizo, papa criolla, yuca y ají de la casa. Sabor llanero puro.',
    precio: 45000,
    destacado: true,
    etiqueta: 'Sabor llanero',
  },

  /* ---------- HAMBURGUESAS ---------- */
  {
    id: 'ham-clasica',
    categoria: 'hamburguesas',
    nombre: 'Texas Clásica',
    descripcion: 'Carne 150 g a la parrilla, queso, lechuga, tomate, cebolla y salsa de la casa.',
    precio: 22000,
  },
  {
    id: 'ham-bbq',
    categoria: 'hamburguesas',
    nombre: 'BBQ Bacon',
    descripcion: 'Carne ahumada, doble tocineta crocante, queso cheddar, cebolla caramelizada y salsa BBQ.',
    precio: 28000,
    destacado: true,
    etiqueta: 'Ahumada',
  },
  {
    id: 'ham-vaquera',
    categoria: 'hamburguesas',
    nombre: 'La Vaquera',
    descripcion: 'Doble carne 300 g, doble queso, tocineta, aros de cebolla y salsa Texas. Solo para valientes.',
    precio: 34000,
    destacado: true,
    etiqueta: 'Doble carne',
  },
  {
    id: 'ham-ranchera',
    categoria: 'hamburguesas',
    nombre: 'Ranchera',
    descripcion: 'Costilla desmechada al humo, queso fundido, pepinillos y salsa ahumada.',
    precio: 32000,
  },
  {
    id: 'ham-pollo',
    categoria: 'hamburguesas',
    nombre: 'Pollo Crispy',
    descripcion: 'Pechuga apanada crocante, queso, lechuga, tomate y salsa ranch.',
    precio: 26000,
  },

  /* ---------- CARNES A LA PARRILLA ---------- */
  {
    id: 'car-churrasco',
    categoria: 'carnes',
    nombre: 'Churrasco 300 g',
    descripcion: 'Lomo de res a la parrilla con papa a la francesa, ensalada y arepa.',
    precio: 42000,
    destacado: true,
  },
  {
    id: 'car-punta',
    categoria: 'carnes',
    nombre: 'Punta de Anca 350 g',
    descripcion: 'Corte jugoso al carbón con guarnición a elección y chimichurri de la casa.',
    precio: 46000,
  },
  {
    id: 'car-baby',
    categoria: 'carnes',
    nombre: 'Baby Beef 300 g',
    descripcion: 'Corte suave a la parrilla, papa criolla, ensalada fresca y arepa.',
    precio: 44000,
  },
  {
    id: 'car-costillas',
    categoria: 'carnes',
    nombre: 'Costillas BBQ',
    descripcion: 'Costilla de cerdo cocción lenta bañada en BBQ, con papa rústica y coleslaw.',
    precio: 40000,
    etiqueta: 'Cocción lenta',
  },
  {
    id: 'car-mamona',
    categoria: 'carnes',
    nombre: 'Ternera a la Llanera 400 g',
    descripcion: 'La mamona tradicional del Meta, asada a la vara con yuca, papa criolla y ají.',
    precio: 48000,
    destacado: true,
    etiqueta: 'Tradicional',
  },
  {
    id: 'car-pechuga',
    categoria: 'carnes',
    nombre: 'Pechuga a la Parrilla',
    descripcion: 'Pechuga marinada al carbón con ensalada, papa a la francesa y arepa.',
    precio: 30000,
  },

  /* ---------- PARA COMPARTIR ---------- */
  {
    id: 'com-mazorcada',
    categoria: 'compartir',
    nombre: 'Mazorcada Texas',
    descripcion: 'Mazorca desgranada con carnes mixtas, queso fundido, tocineta y salsas.',
    precio: 32000,
    destacado: true,
  },
  {
    id: 'com-alitas',
    categoria: 'compartir',
    nombre: 'Alitas BBQ x8',
    descripcion: 'Alitas al humo en salsa BBQ, búfalo o miel mostaza. Con papa a la francesa.',
    precio: 28000,
  },
  {
    id: 'com-papas',
    categoria: 'compartir',
    nombre: 'Papas Texas',
    descripcion: 'Papa a la francesa con queso fundido, tocineta crocante y salsa de la casa.',
    precio: 22000,
  },
  {
    id: 'com-chorizo',
    categoria: 'compartir',
    nombre: 'Chorizo Llanero con Arepa',
    descripcion: 'Chorizo santarrosano a la parrilla con arepa de maíz y ají casero.',
    precio: 18000,
  },

  /* ---------- BEBIDAS & BAR ---------- */
  { id: 'beb-limonada', categoria: 'bebidas', nombre: 'Limonada de Coco', descripcion: 'Jarra 1 L bien fría.', precio: 12000 },
  { id: 'beb-jugo', categoria: 'bebidas', nombre: 'Jugo Natural', descripcion: 'En agua o leche: mora, maracuyá, lulo o mango.', precio: 9000 },
  { id: 'beb-gaseosa', categoria: 'bebidas', nombre: 'Gaseosa / Agua', descripcion: 'Personal 400 ml.', precio: 5000 },
  { id: 'beb-cerveza', categoria: 'bebidas', nombre: 'Cerveza Nacional', descripcion: 'Bien helada, botella 330 ml.', precio: 7000 },
  { id: 'beb-michelada', categoria: 'bebidas', nombre: 'Michelada Texas', descripcion: 'Cerveza preparada con limón, sal y salsas de la casa.', precio: 14000 },
  { id: 'beb-coctel', categoria: 'bebidas', nombre: 'Cóctel de la Casa', descripcion: 'Pregunta por la carta de cócteles del bar.', precio: 22000 },

  /* ---------- ADICIONES ---------- */
  { id: 'adi-papa', categoria: 'adiciones', nombre: 'Porción de Papa Francesa', descripcion: 'Porción generosa.', precio: 9000 },
  { id: 'adi-arepa', categoria: 'adiciones', nombre: 'Arepa de Maíz', descripcion: 'Asada a la parrilla.', precio: 3000 },
  { id: 'adi-queso', categoria: 'adiciones', nombre: 'Porción de Queso', descripcion: 'Queso costeño asado.', precio: 6000 },
  { id: 'adi-criolla', categoria: 'adiciones', nombre: 'Papa Criolla', descripcion: 'Crocante, con sal y limón.', precio: 8000 },
  { id: 'adi-salsa', categoria: 'adiciones', nombre: 'Salsa Adicional', descripcion: 'BBQ, ají de la casa, ranch o piña.', precio: 2000 },
];

/* --------------------------- utilidades --------------------------- */

/** 28000 → "$ 28.000" */
function precioCOP(valor) {
  return '$ ' + Number(valor).toLocaleString('es-CO', { maximumFractionDigits: 0 });
}

/** Busca un plato por id en la carta */
function buscarPlato(id) {
  return CARTA.find((p) => p.id === id);
}

/** Busca una zona de domicilio por id */
function buscarZona(id) {
  return ZONAS_DOMICILIO.find((z) => z.id === id);
}
