// ═══════════════════════════════════════════════════════════════
// AHORRITO — Core Hooks
// ═══════════════════════════════════════════════════════════════
import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { estandarizarNombre, normalizarPresentacion } from '../data/constants'

const STORAGE_KEY_UBICACION = 'ahorrito_ubicacion'

// ── Hook de ubicación ───────────────────────────────────────
export function useUbicacion() {
  const [ubicacion, setUbicacion] = useState(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY_UBICACION)
      if (guardado) return JSON.parse(guardado)
    } catch {}
    return { provincia: 'Corrientes', ciudad: 'Capital' }
  })

  const cambiarUbicacion = useCallback((provincia, ciudad) => {
    const nueva = { provincia, ciudad }
    setUbicacion(nueva)
    try { localStorage.setItem(STORAGE_KEY_UBICACION, JSON.stringify(nueva)) } catch {}
  }, [])

  return { ubicacion, cambiarUbicacion }
}

// ── Hook de búsqueda ────────────────────────────────────────
export function useBusqueda() {
  const [query, setQuery] = useState('')
  const [resultados, setResultados] = useState([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)
  const debounceRef = useRef(null)

  const buscar = useCallback(async (texto, ciudad = null, provincia = null) => {
    if (!texto || texto.trim().length < 2) { setResultados([]); return }
    setCargando(true)
    setError(null)
    try {
      const { data, error: err } = await supabase.rpc('buscar_productos', {
        p_query: texto.trim(),
        p_ciudad: ciudad,
        p_provincia: provincia,
        p_limite: 20,
      })
      if (err) throw err
      setResultados(data || [])
    } catch (e) {
      console.error('Error buscando:', e)
      setError('Error al buscar. Intentá de nuevo.')
      setResultados([])
    } finally {
      setCargando(false)
    }
  }, [])

  const buscarConDebounce = useCallback((texto, ciudad, provincia) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    setQuery(texto)
    if (!texto || texto.trim().length < 2) { setResultados([]); setCargando(false); return }
    setCargando(true)
    debounceRef.current = setTimeout(() => buscar(texto, ciudad, provincia), 350)
  }, [buscar])

  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current) }, [])

  return { query, setQuery, resultados, cargando, error, buscar, buscarConDebounce }
}

// ── Hook para precios de un producto ────────────────────────
export function usePreciosProducto(productoId, ciudad, provincia) {
  const [precios, setPrecios] = useState([])
  const [cargando, setCargando] = useState(false)

  const cargar = useCallback(async () => {
    if (!productoId) return
    setCargando(true)
    try {
      const { data, error } = await supabase.rpc('precios_producto_en_ciudad', {
        p_producto_id: productoId,
        p_ciudad: ciudad || null,
        p_provincia: provincia || null,
      })
      if (error) throw error
      setPrecios(data || [])
    } catch (e) { console.error(e) }
    finally { setCargando(false) }
  }, [productoId, ciudad, provincia])

  useEffect(() => { cargar() }, [cargar])
  return { precios, cargando, recargar: cargar }
}

// ── Hook para comercios ─────────────────────────────────────
export function useComercios(ciudad, provincia) {
  const [comercios, setComercios] = useState([])
  const [cargando, setCargando] = useState(false)

  const cargar = useCallback(async () => {
    setCargando(true)
    try {
      let q = supabase.from('comercios').select('*').order('nombre')
      if (ciudad) q = q.eq('ciudad', ciudad)
      if (provincia) q = q.eq('provincia', provincia)
      const { data, error } = await q
      if (error) throw error
      setComercios(data || [])
    } catch (e) { console.error(e) }
    finally { setCargando(false) }
  }, [ciudad, provincia])

  useEffect(() => { cargar() }, [cargar])
  return { comercios, cargando, recargar: cargar }
}

// ── Hook para populares ─────────────────────────────────────
export function usePopulares(ciudad, provincia) {
  const [populares, setPopulares] = useState([])
  const [cargando, setCargando] = useState(false)

  const cargar = useCallback(async () => {
    setCargando(true)
    try {
      const { data, error } = await supabase.rpc('productos_populares', {
        p_ciudad: ciudad || null,
        p_provincia: provincia || null,
        p_limite: 8,
      })
      if (error) throw error
      setPopulares(data || [])
    } catch (e) { console.error(e) }
    finally { setCargando(false) }
  }, [ciudad, provincia])

  useEffect(() => { cargar() }, [cargar])
  return { populares, cargando }
}

// ── Hook para historial de precios ──────────────────────────
export function useHistorialPrecio(precioProductoId) {
  const [historial, setHistorial] = useState([])
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    if (!precioProductoId) return
    setCargando(true)
    supabase.rpc('historial_precio_producto', { p_precio_producto_id: precioProductoId })
      .then(({ data }) => setHistorial(data || []))
      .catch(console.error)
      .finally(() => setCargando(false))
  }, [precioProductoId])

  return { historial, cargando }
}

// ── Hook para reviews ───────────────────────────────────────
export function useReviews(comercioId) {
  const [reviews, setReviews] = useState([])
  const [cargando, setCargando] = useState(false)

  const cargar = useCallback(async () => {
    if (!comercioId) return
    setCargando(true)
    try {
      const { data, error } = await supabase
        .from('reviews_comercios')
        .select('*')
        .eq('comercio_id', comercioId)
        .order('created_at', { ascending: false })
      if (error) throw error
      setReviews(data || [])
    } catch (e) { console.error(e) }
    finally { setCargando(false) }
  }, [comercioId])

  useEffect(() => { cargar() }, [cargar])
  return { reviews, cargando, recargar: cargar }
}

// ── Hook para seguimiento de productos ──────────────────────
export function useSeguimiento() {
  const [seguidos, setSeguidos] = useState([])
  const [cargando, setCargando] = useState(false)

  const cargar = useCallback(async () => {
    setCargando(true)
    try {
      const { data, error } = await supabase
        .from('seguimiento_productos')
        .select('*, productos(nombre, marca, categoria, presentacion, imagen_url)')
        .order('created_at', { ascending: false })
      if (error) throw error
      setSeguidos(data || [])
    } catch (e) { console.error(e) }
    finally { setCargando(false) }
  }, [])

  useEffect(() => { cargar() }, [cargar])

  const seguir = async (productoId, ciudad, provincia, precioRef) => {
    const { error } = await supabase.from('seguimiento_productos').upsert({
      user_id: (await supabase.auth.getUser()).data.user.id,
      producto_id: productoId,
      ciudad, provincia,
      precio_referencia: precioRef,
    }, { onConflict: 'user_id,producto_id' })
    if (error) throw error
    await cargar()
  }

  const dejarDeSeguir = async (productoId) => {
    const userId = (await supabase.auth.getUser()).data.user.id
    const { error } = await supabase
      .from('seguimiento_productos')
      .delete()
      .eq('user_id', userId)
      .eq('producto_id', productoId)
    if (error) throw error
    await cargar()
  }

  return { seguidos, cargando, seguir, dejarDeSeguir, recargar: cargar }
}

// ── Funciones de escritura ──────────────────────────────────
export async function crearProducto({ nombre, marca, categoria, subcategoria, presentacion }) {
  const { data, error } = await supabase
    .from('productos')
    .insert({
      nombre: nombre.trim(),
      marca: marca.trim(),
      categoria,
      subcategoria: subcategoria?.trim() || null,
      presentacion: normalizarPresentacion(presentacion),
      nombre_estandarizado: estandarizarNombre(`${nombre} ${marca} ${presentacion || ''}`),
    })
    .select().single()
  if (error) throw error
  return data
}

export async function crearComercio({ nombre, tipo, direccion, ciudad, provincia, lat, lng }) {
  const { data, error } = await supabase
    .from('comercios')
    .insert({
      nombre: nombre.trim(),
      tipo, direccion: direccion?.trim() || null,
      ciudad: ciudad.trim(), provincia: provincia.trim(),
      lat, lng,
    })
    .select().single()
  if (error) throw error
  return data
}

export async function reportarPrecio({ productoId, comercioId, precio, enOferta, precioOferta, esRetornable, canal = 'local' }) {
  const { data, error } = await supabase
    .from('precios_productos')
    .upsert({
      producto_id: productoId,
      comercio_id: comercioId,
      precio: Number(precio),
      en_oferta: enOferta || false,
      precio_oferta: precioOferta ? Number(precioOferta) : null,
      es_retornable: esRetornable || false,
      canal,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'producto_id,comercio_id,canal' })
    .select().single()
  if (error) throw error
  return data
}

export async function votarPrecio(precioId, tipoVoto) {
  const campo = tipoVoto === 'ok' ? 'votos_ok' : 'votos_desactual'
  const { data: actual } = await supabase.from('precios_productos').select(campo).eq('id', precioId).single()
  if (!actual) return
  const { error } = await supabase.from('precios_productos').update({ [campo]: (actual[campo] || 0) + 1 }).eq('id', precioId)
  if (error) throw error
}

export async function crearReview(comercioId, estrellas, comentario) {
  const userId = (await supabase.auth.getUser()).data.user.id
  const { error } = await supabase.from('reviews_comercios').upsert({
    comercio_id: comercioId,
    user_id: userId,
    estrellas,
    comentario: comentario?.trim() || null,
  }, { onConflict: 'comercio_id,user_id' })
  if (error) throw error
}

export async function crearSolicitudPrecio(precioProductoId, precioSugerido, motivo) {
  const userId = (await supabase.auth.getUser()).data.user.id
  const { error } = await supabase.from('solicitudes_precio').insert({
    precio_producto_id: precioProductoId,
    precio_sugerido: Number(precioSugerido),
    motivo: motivo?.trim() || null,
    solicitado_por: userId,
  })
  if (error) throw error
}

export async function buscarProductoExistente(nombre) {
  if (!nombre || nombre.trim().length < 2) return []
  const { data } = await supabase
    .from('productos')
    .select('id, nombre, marca, categoria, presentacion, imagen_url')
    .or(`nombre.ilike.%${nombre.trim()}%,marca.ilike.%${nombre.trim()}%,nombre_estandarizado.ilike.%${nombre.trim()}%`)
    .limit(8)
  return data || []
}

// Verificar si ya existe un precio para producto + comercio + canal
export async function buscarPrecioDuplicado(productoId, comercioId, canal = 'local') {
  if (!productoId || !comercioId) return null
  const { data, error } = await supabase
    .from('precios_productos')
    .select('*, productos(nombre, marca, presentacion), comercios(nombre, direccion)')
    .eq('producto_id', productoId)
    .eq('comercio_id', comercioId)
    .eq('canal', canal)
    .maybeSingle()
  if (error) { console.error('Error buscando duplicado:', error); return null }
  return data
}

// Obtener todos los precios de un producto en un comercio (todos los canales)
export async function preciosProductoEnComercio(productoId, comercioId) {
  if (!productoId || !comercioId) return []
  const { data, error } = await supabase
    .from('precios_productos')
    .select('*, productos(nombre, marca, presentacion)')
    .eq('producto_id', productoId)
    .eq('comercio_id', comercioId)
    .order('canal')
  if (error) { console.error(error); return [] }
  return data || []
}
