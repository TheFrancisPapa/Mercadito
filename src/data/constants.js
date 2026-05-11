// ═══════════════════════════════════════════════════════════════
// AHORRITO — Constants & Data
// ═══════════════════════════════════════════════════════════════

export const PROVINCIAS_AR = [
  'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba',
  'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja',
  'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan',
  'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago del Estero',
  'Tierra del Fuego', 'Tucumán',
]

export const CIUDADES_POR_PROVINCIA = {
  'Corrientes': ['Capital', 'Goya', 'Paso de los Libres', 'Curuzú Cuatiá', 'Mercedes', 'Monte Caseros', 'Esquina', 'Bella Vista', 'Santo Tomé', 'Ituzaingó', 'Gobernador Virasoro', 'Saladas', 'Santa Lucia', 'San Luis del Palmar', 'Itatí', 'Empedrado'],
  'Buenos Aires': ['La Plata', 'Mar del Plata', 'Bahía Blanca', 'Tandil', 'Quilmes', 'Lanús', 'Avellaneda', 'Morón', 'San Isidro', 'Tigre'],
  'CABA': ['CABA'],
  'Córdoba': ['Córdoba', 'Villa Carlos Paz', 'Río Cuarto', 'Villa María'],
  'Santa Fe': ['Rosario', 'Santa Fe', 'Rafaela', 'Venado Tuerto'],
  'Mendoza': ['Mendoza', 'San Rafael', 'Godoy Cruz'],
  'Tucumán': ['San Miguel de Tucumán', 'Yerba Buena', 'Banda del Río Salí'],
  'Chaco': ['Resistencia', 'Presidencia Roque Sáenz Peña', 'Villa Ángela'],
  'Misiones': ['Posadas', 'Oberá', 'Eldorado', 'Puerto Iguazú'],
  'Entre Ríos': ['Paraná', 'Concordia', 'Gualeguaychú'],
  'Salta': ['Salta', 'San Ramón de la Nueva Orán', 'Tartagal'],
  'Jujuy': ['San Salvador de Jujuy', 'Palpalá', 'San Pedro'],
  'Formosa': ['Formosa', 'Clorinda'],
}

export const CATEGORIAS_PRODUCTO = [
  { id: 'bebidas', nombre: 'Bebidas', emoji: '🥤' },
  { id: 'comidas', nombre: 'Comidas', emoji: '🍔' },
  { id: 'almacen', nombre: 'Almacén', emoji: '🏪' },
  { id: 'lacteos', nombre: 'Lácteos', emoji: '🥛' },
  { id: 'carnes', nombre: 'Carnes', emoji: '🥩' },
  { id: 'verduras_frutas', nombre: 'Verduras y Frutas', emoji: '🥬' },
  { id: 'panaderia', nombre: 'Panadería', emoji: '🍞' },
  { id: 'congelados', nombre: 'Congelados', emoji: '🧊' },
  { id: 'ropa', nombre: 'Ropa', emoji: '👕' },
  { id: 'calzado', nombre: 'Calzado', emoji: '👟' },
  { id: 'limpieza', nombre: 'Limpieza', emoji: '🧹' },
  { id: 'higiene', nombre: 'Higiene', emoji: '🧴' },
  { id: 'electronica', nombre: 'Electrónica', emoji: '📱' },
  { id: 'hogar', nombre: 'Hogar', emoji: '🏠' },
  { id: 'farmacia', nombre: 'Farmacia', emoji: '💊' },
  { id: 'libreria', nombre: 'Librería', emoji: '📚' },
  { id: 'perfumeria', nombre: 'Perfumería', emoji: '🌸' },
  { id: 'relojeria', nombre: 'Relojería', emoji: '⌚' },
  { id: 'otro', nombre: 'Otro', emoji: '📦' },
]

export const TIPOS_COMERCIO = [
  { id: 'supermercado', nombre: 'Supermercado', emoji: '🛒' },
  { id: 'mayorista', nombre: 'Mayorista', emoji: '📦' },
  { id: 'kiosco', nombre: 'Kiosco', emoji: '🏪' },
  { id: 'almacen', nombre: 'Almacén', emoji: '🏬' },
  { id: 'verduleria', nombre: 'Verdulería', emoji: '🥬' },
  { id: 'farmacia', nombre: 'Farmacia', emoji: '💊' },
  { id: 'tienda_ropa', nombre: 'Tienda de Ropa', emoji: '👕' },
  { id: 'libreria', nombre: 'Librería', emoji: '📚' },
  { id: 'ferreteria', nombre: 'Ferretería', emoji: '🔧' },
  { id: 'electronica', nombre: 'Electrónica', emoji: '📱' },
  { id: 'perfumeria', nombre: 'Perfumería', emoji: '🌸' },
  { id: 'restaurant', nombre: 'Restaurant', emoji: '🍽️' },
  { id: 'otro', nombre: 'Otro', emoji: '🏷️' },
]

export const CANALES_COMPRA = [
  { id: 'local', nombre: 'En el local', emoji: '🏪', color: 'emerald' },
  { id: 'pedidos_ya', nombre: 'Pedidos Ya', emoji: '🛵', color: 'violet' },
  { id: 'rappi', nombre: 'Rappi', emoji: '🏍️', color: 'orange' },
  { id: 'online', nombre: 'Página online', emoji: '🌐', color: 'sky' },
]

// ── Helpers ──────────────────────────────────────────────────
export function fmtPrecio(n) {
  if (!n && n !== 0) return '—'
  return `$${Number(n).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}

export function tiempoDesde(isoStr) {
  if (!isoStr) return ''
  const diff = Date.now() - new Date(isoStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'ahora'
  if (mins < 60) return `hace ${mins} min`
  const horas = Math.floor(mins / 60)
  if (horas < 24) return `hace ${horas}h`
  const dias = Math.floor(horas / 24)
  if (dias < 7) return `hace ${dias}d`
  return new Date(isoStr).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
}

// ── Name Standardization ────────────────────────────────────
export function estandarizarNombre(raw) {
  if (!raw) return ''
  let s = raw.trim()
  
  // Normalize units
  const unitReplacements = [
    [/\b(\d+(?:[.,]\d+)?)\s*(litros?|lts?|ltrs?)\b/gi, '$1L'],
    [/\b(\d+(?:[.,]\d+)?)\s*(mililitros?|mls?)\b/gi, '$1ml'],
    [/\b(\d+(?:[.,]\d+)?)\s*(kilogramos?|kilos?|kgs?)\b/gi, '$1kg'],
    [/\b(\d+(?:[.,]\d+)?)\s*(gramos?|grs?)\b/gi, '$1g'],
    [/\b(\d+(?:[.,]\d+)?)\s*(unidades?|uds?|unis?)\b/gi, '$1u'],
  ]
  
  for (const [regex, replacement] of unitReplacements) {
    s = s.replace(regex, replacement)
  }
  
  // Format "x6", "x12"
  s = s.replace(/\bx\s*(\d+)/gi, 'x$1')
  
  // Capitalize each word
  s = s.replace(/\b\w/g, c => c.toUpperCase())
  
  // Normalize common brand names
  const brands = {
    'coca cola': 'Coca-Cola',
    'coca-cola': 'Coca-Cola',
    'pepsi cola': 'Pepsi',
    'fanta': 'Fanta',
  }
  const lower = s.toLowerCase()
  for (const [key, val] of Object.entries(brands)) {
    if (lower.includes(key)) {
      s = s.replace(new RegExp(key, 'gi'), val)
    }
  }
  
  return s.trim()
}

export function normalizarPresentacion(raw) {
  if (!raw) return ''
  let s = raw.trim().toLowerCase()
  const reemplazos = [
    [/\b(litros?|lts?|ltrs?)\b/gi, 'L'],
    [/\b(mililitros?|mls?)\b/gi, 'ml'],
    [/\b(kilogramos?|kilos?|kgs?)\b/gi, 'kg'],
    [/\b(gramos?|grs?)\b/gi, 'g'],
    [/\b(unidades?|uds?|unis?)\b/gi, 'u'],
  ]
  for (const [regex, unit] of reemplazos) {
    s = s.replace(regex, unit)
  }
  s = s.replace(/(\d+(?:[.,]\d+)?)\s*(L|ml|kg|g|u)\b/gi, (_, num, unit) =>
    num + unit.charAt(0).toUpperCase() + unit.slice(1).toLowerCase()
  )
  s = s.replace(/\bx\s*(\d+)/gi, 'x$1')
  return s.charAt(0).toUpperCase() + s.slice(1)
}
