import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Check, X, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { fmtPrecio, tiempoDesde } from '../../data/constants'

export default function Moderation() {
  const navigate = useNavigate()
  const { usuario, esMod } = useAuth()
  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(true)

  const recargar = useCallback(async () => {
    setCargando(true)
    try {
      const { data } = await supabase
        .from('solicitudes_precio')
        .select('*, precios_productos(precio, productos(nombre), comercios(nombre))')
        .order('created_at', { ascending: false })
        .limit(50)
      setSolicitudes((data || []).map(s => ({
        ...s,
        precio_anterior: s.precios_productos?.precio,
        precio_propuesto: s.precio_sugerido,
        producto_nombre: s.precios_productos?.productos?.nombre,
        comercio_nombre: s.precios_productos?.comercios?.nombre,
      })))
    } catch (e) { console.error(e) }
    finally { setCargando(false) }
  }, [])

  useEffect(() => { if (esMod) recargar() }, [esMod, recargar])

  const manejarSolicitud = async (id, estado) => {
    const { error } = await supabase.from('solicitudes_precio').update({ estado, revisado_por: usuario.id }).eq('id', id)
    if (error) throw error
    if (estado === 'aprobada') {
      const sol = solicitudes.find(s => s.id === id)
      if (sol) {
        await supabase.from('precios_productos').update({ precio: sol.precio_propuesto, updated_at: new Date().toISOString() }).eq('id', sol.precio_producto_id)
      }
    }
  }
  const [procesando, setProcesando] = useState(null)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => { if (!usuario || !esMod) navigate('/') }, [usuario, esMod, navigate])
  if (!usuario || !esMod) return null

  const handleAccion = async (id, accion) => {
    setProcesando(id)
    try { await manejarSolicitud(id, accion); await recargar() }
    catch (e) { console.error(e) }
    finally { setProcesando(null) }
  }

  const pendientes = solicitudes.filter(s => s.estado === 'pendiente')
  const resueltas = solicitudes.filter(s => s.estado !== 'pendiente')

  return (
    <div className="container-app max-w-3xl py-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="font-display text-2xl font-bold flex items-center gap-2">
          <Shield size={22} className="text-violet-500" /> Panel de Moderación
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Gestioná las solicitudes de la comunidad</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Pendientes', value: pendientes.length, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
          { label: 'Aprobadas', value: solicitudes.filter(s => s.estado === 'aprobada').length, color: 'var(--brand)', bg: 'var(--brand-glow)' },
          { label: 'Rechazadas', value: solicitudes.filter(s => s.estado === 'rechazada').length, color: '#ef4444', bg: 'rgba(239,68,68,0.06)' },
        ].map(s => (
          <div key={s.label} className="card p-3.5 text-center" style={{ boxShadow: 'var(--shadow-xs)' }}>
            <p className="text-2xl font-extrabold font-display" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Pending */}
      <h2 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
        <Clock size={14} className="text-amber-500" /> Pendientes ({pendientes.length})
      </h2>

      {cargando ? (
        <div className="flex flex-col gap-2">{[1, 2, 3].map(i => <div key={i} className="skeleton h-24" />)}</div>
      ) : pendientes.length === 0 ? (
        <div className="card p-8 text-center mb-8" style={{ background: 'var(--bg-secondary)' }}>
          <p className="text-3xl mb-2">✅</p>
          <p className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>No hay solicitudes pendientes</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>¡Todo al día!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 mb-8">
          {pendientes.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="card p-4" style={{ boxShadow: 'var(--shadow-sm)', borderLeft: '3px solid #f59e0b' }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{s.producto_nombre || 'Producto'}</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    🏪 {s.comercio_nombre || 'Comercio'} · {tiempoDesde(s.created_at)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm font-bold" style={{ color: 'var(--text-muted)', textDecoration: 'line-through' }}>{fmtPrecio(s.precio_anterior)}</span>
                    <span>→</span>
                    <span className="text-sm font-extrabold" style={{ color: 'var(--brand)' }}>{fmtPrecio(s.precio_propuesto)}</span>
                  </div>
                  {s.motivo && <p className="text-[11px] mt-1.5 px-2 py-1 rounded-lg" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>💬 {s.motivo}</p>}
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button onClick={() => handleAccion(s.id, 'aprobada')} disabled={procesando === s.id}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90"
                    style={{ background: 'var(--brand-glow)', color: 'var(--brand-dark)' }} title="Aprobar">
                    <Check size={18} />
                  </button>
                  <button onClick={() => handleAccion(s.id, 'rechazada')} disabled={procesando === s.id}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90"
                    style={{ background: 'rgba(239,68,68,0.06)', color: '#dc2626' }} title="Rechazar">
                    <X size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Resolved */}
      {resueltas.length > 0 && (
        <div>
          <button onClick={() => setExpanded(expanded === 'resolved' ? null : 'resolved')} className="text-sm font-bold flex items-center gap-2 w-full mb-3" style={{ color: 'var(--text-secondary)' }}>
            Historial ({resueltas.length})
            {expanded === 'resolved' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {expanded === 'resolved' && (
            <div className="flex flex-col gap-1.5 animate-fade-in">
              {resueltas.slice(0, 20).map(s => (
                <div key={s.id} className="card p-3 flex items-center gap-3" style={{ opacity: 0.7 }}>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs`}
                    style={{ background: s.estado === 'aprobada' ? 'var(--brand-glow)' : 'rgba(239,68,68,0.06)', color: s.estado === 'aprobada' ? 'var(--brand-dark)' : '#dc2626' }}>
                    {s.estado === 'aprobada' ? <Check size={14} /> : <X size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">{s.producto_nombre}</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{fmtPrecio(s.precio_anterior)} → {fmtPrecio(s.precio_propuesto)} · {tiempoDesde(s.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
