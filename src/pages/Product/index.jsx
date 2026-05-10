import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Bell, BellOff, TrendingUp, TrendingDown, Minus, Star, MapPin, Clock, ThumbsUp, Edit3, ExternalLink } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { usePreciosProducto, useUbicacion, useHistorialPrecio, useSeguimiento, votarPrecio, crearSolicitudPrecio } from '../../hooks/useMercado'
import { CATEGORIAS_PRODUCTO, TIPOS_COMERCIO, CANALES_COMPRA, fmtPrecio, tiempoDesde } from '../../data/constants'
import { MapaLocales } from '../../components/map/MapaLocales'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const { ubicacion } = useUbicacion()
  const [producto, setProducto] = useState(null)
  const [cargandoProducto, setCargandoProducto] = useState(true)
  const { precios, cargando: cargandoPrecios, recargar } = usePreciosProducto(id, ubicacion.ciudad, ubicacion.provincia)
  const { seguidos, seguir, dejarDeSeguir } = useSeguimiento()
  const [canalFiltro, setCanalFiltro] = useState(null)
  const [editandoPrecioId, setEditandoPrecioId] = useState(null)
  const [nuevoPrecioInput, setNuevoPrecioInput] = useState('')
  const [motivoInput, setMotivoInput] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [votando, setVotando] = useState(null)
  const [showMap, setShowMap] = useState(false)

  const estaSiguiendo = seguidos.some(s => s.producto_id === id)

  // Load product info
  useEffect(() => {
    async function cargar() {
      const { data } = await supabase.from('productos').select('*').eq('id', id).single()
      setProducto(data)
      setCargandoProducto(false)
    }
    cargar()
  }, [id])

  if (cargandoProducto) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="skeleton h-8 w-48 mb-4" />
        <div className="skeleton h-32 mb-4" />
        <div className="skeleton h-24 mb-2" />
        <div className="skeleton h-24 mb-2" />
      </div>
    )
  }

  if (!producto) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="font-display text-xl font-bold mb-2">Producto no encontrado</h2>
        <button onClick={() => navigate(-1)} className="btn btn-primary mt-4">
          <ArrowLeft size={16} /> Volver
        </button>
      </div>
    )
  }

  const catInfo = CATEGORIAS_PRODUCTO.find(c => c.id === producto.categoria)
  const preciosFiltrados = canalFiltro ? precios.filter(p => p.canal === canalFiltro) : precios
  const precioMin = preciosFiltrados.length ? Math.min(...preciosFiltrados.map(p => p.en_oferta && p.precio_oferta ? p.precio_oferta : p.precio)) : 0
  const precioMax = preciosFiltrados.length ? Math.max(...preciosFiltrados.map(p => p.precio)) : 0
  const ahorro = precioMax > 0 ? precioMax - precioMin : 0
  const ahorroPct = precioMax > 0 ? Math.round((ahorro / precioMax) * 100) : 0

  // Top 3 cheapest
  const top3 = [...preciosFiltrados]
    .sort((a, b) => {
      const pa = a.en_oferta && a.precio_oferta ? a.precio_oferta : a.precio
      const pb = b.en_oferta && b.precio_oferta ? b.precio_oferta : b.precio
      return pa - pb
    })
    .slice(0, 3)

  const handleVoto = async (precioId, tipo) => {
    setVotando(precioId)
    try { await votarPrecio(precioId, tipo); await recargar() } catch (e) { console.error(e) }
    finally { setVotando(null) }
  }

  const handleSolicitud = async (precioId) => {
    if (!nuevoPrecioInput || isNaN(nuevoPrecioInput)) return
    setGuardando(true)
    try {
      await crearSolicitudPrecio(precioId, nuevoPrecioInput, motivoInput)
      setEditandoPrecioId(null)
      setNuevoPrecioInput('')
      setMotivoInput('')
    } catch (e) { console.error(e) }
    finally { setGuardando(false) }
  }

  const handleSeguir = async () => {
    if (estaSiguiendo) {
      await dejarDeSeguir(id)
    } else {
      await seguir(id, ubicacion.ciudad, ubicacion.provincia, precioMin || null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-emerald-600 font-semibold mb-4 hover:text-emerald-700 transition-colors active:scale-95">
        <ArrowLeft size={16} /> Volver
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Product Header */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-5 mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" style={{ background: 'var(--brand-glow)' }}>
                {producto.imagen_url
                  ? <img src={producto.imagen_url} alt="" className="w-full h-full object-cover rounded-2xl" />
                  : catInfo?.emoji || '📦'
                }
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold font-display">{producto.nombre}</h1>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {producto.marca} {producto.presentacion && `· ${producto.presentacion}`}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="badge badge-brand">{catInfo?.emoji} {catInfo?.nombre}</span>
                  {producto.nombre_estandarizado && producto.nombre_estandarizado !== producto.nombre && (
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      (también: {producto.nombre_estandarizado})
                    </span>
                  )}
                </div>
              </div>
              {usuario && (
                <button
                  onClick={handleSeguir}
                  className={`btn btn-sm ${estaSiguiendo ? 'btn-primary' : 'btn-secondary'}`}
                  title={estaSiguiendo ? 'Dejar de seguir' : 'Seguir producto'}
                >
                  {estaSiguiendo ? <BellOff size={14} /> : <Bell size={14} />}
                </button>
              )}
            </div>
          </motion.div>

          {/* Savings Card */}
          {precios.length > 1 && ahorro > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="card p-4 mb-4 price-best">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">💡 Ahorro potencial</p>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Comprando en el más barato vs el más caro</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-emerald-600">{fmtPrecio(ahorro)}</p>
                  <p className="text-[10px] font-bold text-emerald-500/70">−{ahorroPct}% menos</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Channel Filter */}
          {precios.length > 0 && (
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-2 mb-3">
              <button onClick={() => setCanalFiltro(null)} className={`flex-shrink-0 px-2.5 py-1.5 rounded-full text-[10px] font-bold border transition-all ${!canalFiltro ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'text-gray-500'}`} style={canalFiltro ? { borderColor: 'var(--border)' } : {}}>Todos</button>
              {CANALES_COMPRA.map(canal => {
                const count = precios.filter(p => p.canal === canal.id).length
                if (count === 0) return null
                return (
                  <button key={canal.id} onClick={() => setCanalFiltro(canalFiltro === canal.id ? null : canal.id)} className={`flex-shrink-0 px-2.5 py-1.5 rounded-full text-[10px] font-bold border transition-all whitespace-nowrap ${canalFiltro === canal.id ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'text-gray-500'}`} style={canalFiltro === canal.id ? {} : { borderColor: 'var(--border)' }}>
                    {canal.emoji} {canal.nombre} ({count})
                  </button>
                )
              })}
              <button onClick={() => setShowMap(!showMap)} className={`flex-shrink-0 px-2.5 py-1.5 rounded-full text-[10px] font-bold border transition-all ${showMap ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'text-gray-500'}`} style={showMap ? {} : { borderColor: 'var(--border)' }}>
                📍 Ver mapa
              </button>
            </div>
          )}

          {/* Map */}
          {showMap && <div className="mb-4 animate-fade-in"><MapaLocales resultados={[]} ciudad={ubicacion.ciudad} /></div>}

          {/* Prices List */}
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
            💰 Precios en {ubicacion.ciudad || 'tu zona'}
            <span className="text-[10px] font-normal ml-auto" style={{ color: 'var(--text-muted)' }}>
              {preciosFiltrados.length} comercio{preciosFiltrados.length !== 1 ? 's' : ''}
            </span>
            {cargandoPrecios && <div className="w-4 h-4 border-2 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />}
          </h3>

          {preciosFiltrados.length === 0 && !cargandoPrecios ? (
            <div className="card p-8 text-center">
              <p className="text-3xl mb-2">🏷️</p>
              <p className="text-sm font-bold">Aún no hay precios para este producto en {ubicacion.ciudad}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>¡Sé el primero en cargar un precio!</p>
              <button onClick={() => navigate('/cargar-precio')} className="btn btn-primary mt-4">Cargar Precio</button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {preciosFiltrados.map((p, i) => {
                const tipoInfo = TIPOS_COMERCIO.find(t => t.id === p.comercio_tipo)
                const canalInfo = CANALES_COMPRA.find(c => c.id === p.canal)
                const precioEfectivo = p.en_oferta && p.precio_oferta ? p.precio_oferta : p.precio
                const isEditing = editandoPrecioId === p.precio_id

                return (
                  <motion.div
                    key={p.precio_id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={`card p-4 ${i === 0 ? 'price-best' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${i === 0 ? 'bg-emerald-100' : ''}`} style={i !== 0 ? { background: 'var(--bg-secondary)' } : {}}>
                          {tipoInfo?.emoji || '🏪'}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Link to={`/comercio/${p.comercio_id}`} className="text-sm font-bold hover:text-emerald-600 transition-colors truncate">{p.comercio_nombre}</Link>
                            {p.en_oferta && <span className="badge badge-red">🔥 Oferta</span>}
                            {p.es_retornable && <span className="badge badge-sky">♻️ Ret.</span>}
                            {p.comercio_verificado && <span className="badge badge-brand">✓ Verificado</span>}
                          </div>
                          <p className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>{p.comercio_dir || tipoInfo?.nombre}</p>
                          {p.canal !== 'local' && (
                            <span className={`badge mt-0.5 ${p.canal === 'pedidos_ya' ? 'badge-violet' : p.canal === 'rappi' ? 'badge-amber' : 'badge-sky'}`}>
                              {canalInfo?.emoji} {canalInfo?.nombre}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-3">
                        <p className={`text-lg font-black ${i === 0 ? 'text-emerald-600' : ''}`}>{fmtPrecio(precioEfectivo)}</p>
                        {p.en_oferta && p.precio_oferta && <p className="text-[10px] line-through" style={{ color: 'var(--text-muted)' }}>{fmtPrecio(p.precio)}</p>}
                        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{tiempoDesde(p.updated_at)}</p>
                        {p.comercio_rating > 0 && (
                          <div className="flex items-center gap-0.5 justify-end mt-0.5">
                            <Star size={10} className="text-amber-400 fill-amber-400" />
                            <span className="text-[10px] font-bold" style={{ color: 'var(--text-secondary)' }}>{Number(p.comercio_rating).toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Edit inline */}
                    {isEditing && (
                      <div className="mt-3 pt-3 border-t animate-fade-in" style={{ borderColor: 'var(--border)' }}>
                        <p className="text-[11px] font-bold text-amber-600 mb-2">📢 Solicitar actualización de precio</p>
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold" style={{ color: 'var(--text-muted)' }}>$</span>
                            <input type="number" value={nuevoPrecioInput} onChange={e => setNuevoPrecioInput(e.target.value)} placeholder={String(p.precio)} className="input py-2 pl-8 text-sm font-bold" inputMode="decimal" autoFocus />
                          </div>
                          <button onClick={() => handleSolicitud(p.precio_id)} disabled={guardando || !nuevoPrecioInput} className="btn btn-primary btn-sm">
                            {guardando ? '...' : '✓ Enviar'}
                          </button>
                          <button onClick={() => { setEditandoPrecioId(null); setNuevoPrecioInput('') }} className="btn btn-ghost btn-sm">✕</button>
                        </div>
                        <input type="text" value={motivoInput} onChange={e => setMotivoInput(e.target.value)} placeholder="Motivo (opcional)" className="input text-xs mt-2 py-1.5" />
                      </div>
                    )}

                    {/* Vote buttons */}
                    {!isEditing && (
                      <div className="mt-2 pt-2 border-t flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                        {i === 0 && preciosFiltrados.length > 1 ? (
                          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">🏆 Mejor precio</span>
                        ) : (
                          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                            {p.votos_ok > 0 && `✓ ${p.votos_ok} confirmaron`}
                            {p.votos_desactual > 0 && ` · ⚠ ${p.votos_desactual} reportaron`}
                          </span>
                        )}
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleVoto(p.precio_id, 'ok')} disabled={votando === p.precio_id || !usuario} className="px-2 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 active:scale-95 transition-all disabled:opacity-50" title={!usuario ? 'Iniciá sesión para votar' : ''}>
                            👍 Confirmo
                          </button>
                          <button onClick={() => { setEditandoPrecioId(p.precio_id); setNuevoPrecioInput('') }} disabled={!usuario} className="px-2 py-1 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-600 hover:bg-amber-100 active:scale-95 transition-all disabled:opacity-50" title={!usuario ? 'Iniciá sesión' : ''}>
                            📢 Actualizar
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          )}

          {/* CTA */}
          {usuario && (
            <button onClick={() => navigate('/cargar-precio')} className="w-full mt-5 btn btn-primary btn-lg">
              🏷️ Cargar precio en otro comercio
            </button>
          )}
        </div>

        {/* Sidebar — Top 3 Cheapest */}
        <div className="lg:col-span-1">
          {top3.length > 0 && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="card p-4 mb-4 sticky top-20">
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                🏆 Top 3 más baratos
              </h3>
              <div className="flex flex-col gap-2">
                {top3.map((p, i) => {
                  const precioEfectivo = p.en_oferta && p.precio_oferta ? p.precio_oferta : p.precio
                  return (
                    <div key={p.precio_id} className={`p-3 rounded-xl ${i === 0 ? 'price-best' : ''}`} style={i !== 0 ? { background: 'var(--bg-secondary)' } : {}}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-lg font-bold" style={{ color: i === 0 ? 'var(--brand)' : 'var(--text-muted)' }}>#{i + 1}</span>
                          <div className="min-w-0">
                            <Link to={`/comercio/${p.comercio_id}`} className="text-xs font-bold hover:text-emerald-600 transition-colors truncate block">{p.comercio_nombre}</Link>
                            <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{p.comercio_dir}</p>
                          </div>
                        </div>
                        <span className={`text-base font-black flex-shrink-0 ${i === 0 ? 'text-emerald-600' : ''}`}>{fmtPrecio(precioEfectivo)}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Price History Preview */}
          {precios.length > 0 && (
            <div className="card p-4">
              <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
                📊 Tendencia de precio
              </h3>
              <div className="text-center py-4">
                <div className="flex items-center justify-center gap-2 mb-1">
                  {precioMin < precioMax ? (
                    <TrendingDown size={20} className="text-emerald-500" />
                  ) : (
                    <Minus size={20} style={{ color: 'var(--text-muted)' }} />
                  )}
                  <span className="text-2xl font-black text-emerald-600">{fmtPrecio(precioMin)}</span>
                </div>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  Precio más bajo actual en {ubicacion.ciudad}
                </p>
                <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                  <div>
                    <p className="text-xs font-bold">{fmtPrecio(precioMin)}</p>
                    <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>Mínimo</p>
                  </div>
                  <div className="w-px h-6" style={{ background: 'var(--border)' }} />
                  <div>
                    <p className="text-xs font-bold">{fmtPrecio(precioMax)}</p>
                    <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>Máximo</p>
                  </div>
                  <div className="w-px h-6" style={{ background: 'var(--border)' }} />
                  <div>
                    <p className="text-xs font-bold">{preciosFiltrados.length}</p>
                    <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>Comercios</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
