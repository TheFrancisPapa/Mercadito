import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Clock, Shield, Star, ExternalLink } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { useReviews, crearReview } from '../../hooks/useMercado'
import { TIPOS_COMERCIO, fmtPrecio, tiempoDesde } from '../../data/constants'

export default function StoreProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const [comercio, setComercio] = useState(null)
  const [precios, setPrecios] = useState([])
  const [cargando, setCargando] = useState(true)
  const { reviews, recargar: recargarReviews } = useReviews(id)
  const [nuevaEstrellas, setNuevaEstrellas] = useState(0)
  const [nuevoComentario, setNuevoComentario] = useState('')
  const [guardandoReview, setGuardandoReview] = useState(false)

  useEffect(() => {
    async function cargar() {
      const { data: c } = await supabase.from('comercios').select('*').eq('id', id).single()
      setComercio(c)

      const { data: p } = await supabase
        .from('precios_productos')
        .select('*, productos(nombre, marca, presentacion, categoria)')
        .eq('comercio_id', id)
        .order('updated_at', { ascending: false })
        .limit(20)
      setPrecios(p || [])
      setCargando(false)
    }
    cargar()
  }, [id])

  const handleReview = async () => {
    if (!nuevaEstrellas) return
    setGuardandoReview(true)
    try {
      await crearReview(id, nuevaEstrellas, nuevoComentario)
      setNuevaEstrellas(0)
      setNuevoComentario('')
      await recargarReviews()
      // Reload store to get updated rating
      const { data: c } = await supabase.from('comercios').select('*').eq('id', id).single()
      setComercio(c)
    } catch (e) { console.error(e) }
    finally { setGuardandoReview(false) }
  }

  if (cargando) {
    return <div className="max-w-4xl mx-auto px-4 py-8"><div className="skeleton h-40" /><div className="skeleton h-24 mt-4" /></div>
  }

  if (!comercio) {
    return <div className="max-w-4xl mx-auto px-4 py-16 text-center"><div className="text-5xl mb-4">😕</div><h2 className="font-display text-xl font-bold">Comercio no encontrado</h2></div>
  }

  const tipoInfo = TIPOS_COMERCIO.find(t => t.id === comercio.tipo)

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-emerald-600 font-semibold mb-4 hover:text-emerald-700 active:scale-95">
        <ArrowLeft size={16} /> Volver
      </button>

      {/* Store Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" style={{ background: 'var(--brand-glow)' }}>
            {comercio.logo_url ? <img src={comercio.logo_url} alt="" className="w-full h-full object-cover rounded-2xl" /> : tipoInfo?.emoji || '🏪'}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold font-display">{comercio.nombre}</h1>
              {comercio.verificado && <span className="badge badge-brand">✓ Verificado</span>}
            </div>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {tipoInfo?.nombre || comercio.tipo} · {comercio.ciudad}, {comercio.provincia}
            </p>
            {comercio.direccion && <p className="text-xs flex items-center gap-1 mt-1" style={{ color: 'var(--text-secondary)' }}><MapPin size={12} /> {comercio.direccion}</p>}
            <div className="flex items-center gap-3 mt-2">
              {comercio.rating_promedio > 0 && (
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span className="text-sm font-bold">{Number(comercio.rating_promedio).toFixed(1)}</span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>({comercio.total_reviews})</span>
                </div>
              )}
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{precios.length} producto{precios.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Products list */}
        <div className="lg:col-span-2">
          <h3 className="text-sm font-bold mb-3">🏷️ Productos en este comercio</h3>
          {precios.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-3xl mb-2">📦</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Aún no hay precios cargados para este comercio</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {precios.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }} className="card p-3 card-hover">
                  <Link to={`/producto/${p.producto_id}`} className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold truncate">{p.productos?.nombre}</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        {p.productos?.marca} {p.productos?.presentacion && `· ${p.productos?.presentacion}`}
                        {p.en_oferta && <span className="ml-1 text-red-500 font-bold">🔥 Oferta</span>}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <p className="text-base font-black text-emerald-600">{fmtPrecio(p.en_oferta && p.precio_oferta ? p.precio_oferta : p.precio)}</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{tiempoDesde(p.updated_at)}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Reviews sidebar */}
        <div className="lg:col-span-1">
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2">⭐ Reseñas</h3>

          {/* New Review */}
          {usuario && (
            <div className="card p-4 mb-4">
              <p className="text-xs font-bold mb-2">Tu opinión</p>
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s} onClick={() => setNuevaEstrellas(s)} className="star" title={`${s} estrella${s > 1 ? 's' : ''}`}>
                    <Star size={24} className={s <= nuevaEstrellas ? 'star-filled fill-amber-400' : 'star-empty'} />
                  </button>
                ))}
              </div>
              <textarea value={nuevoComentario} onChange={e => setNuevoComentario(e.target.value)} placeholder="Comentario (opcional, max 500 char)" className="input text-xs py-2" rows={2} maxLength={500} />
              <button onClick={handleReview} disabled={!nuevaEstrellas || guardandoReview} className="btn btn-primary btn-sm w-full mt-2">
                {guardandoReview ? '...' : 'Enviar reseña'}
              </button>
            </div>
          )}

          {reviews.length === 0 ? (
            <div className="card p-4 text-center">
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Sin reseñas aún</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {reviews.map(r => (
                <div key={r.id} className="card p-3">
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={12} className={s <= r.estrellas ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                    ))}
                    <span className="text-[10px] ml-auto" style={{ color: 'var(--text-muted)' }}>{tiempoDesde(r.created_at)}</span>
                  </div>
                  {r.comentario && <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{r.comentario}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
