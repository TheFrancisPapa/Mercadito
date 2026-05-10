import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Check, X, Clock, AlertTriangle, DollarSign, Store, Eye } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { fmtPrecio, tiempoDesde } from '../../data/constants'

export default function Moderation() {
  const navigate = useNavigate()
  const { usuario, esMod } = useAuth()
  const [tab, setTab] = useState('precios')
  const [solicitudes, setSolicitudes] = useState([])
  const [verificaciones, setVerificaciones] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (!usuario || !esMod) { navigate('/'); return }
    cargarDatos()
  }, [usuario, esMod, navigate])

  async function cargarDatos() {
    setCargando(true)
    try {
      const [{ data: sol }, { data: ver }] = await Promise.all([
        supabase.from('solicitudes_precio').select('*, precios_productos(precio, productos(nombre, marca), comercios(nombre))').eq('estado', 'pendiente').order('created_at', { ascending: false }),
        supabase.from('verificacion_comercios').select('*, comercios(nombre, tipo, direccion, ciudad)').eq('estado', 'pendiente').order('created_at', { ascending: false }),
      ])
      setSolicitudes(sol || [])
      setVerificaciones(ver || [])
    } catch (e) { console.error(e) }
    finally { setCargando(false) }
  }

  const handleSolicitud = async (id, estado) => {
    await supabase.from('solicitudes_precio').update({
      estado,
      revisado_por: usuario.id,
      revisado_at: new Date().toISOString(),
    }).eq('id', id)

    if (estado === 'aprobada') {
      const sol = solicitudes.find(s => s.id === id)
      if (sol) {
        await supabase.from('precios_productos').update({
          precio: sol.precio_sugerido,
          updated_at: new Date().toISOString(),
        }).eq('id', sol.precio_producto_id)
      }
    }
    cargarDatos()
  }

  const handleVerificacion = async (id, estado, notas) => {
    await supabase.from('verificacion_comercios').update({
      estado,
      notas_moderador: notas || null,
      revisado_por: usuario.id,
      revisado_at: new Date().toISOString(),
    }).eq('id', id)

    if (estado === 'aprobado') {
      const ver = verificaciones.find(v => v.id === id)
      if (ver) {
        await supabase.from('comercios').update({ verificado: true }).eq('id', ver.comercio_id)
      }
    }
    cargarDatos()
  }

  if (!esMod) return null

  const tabs = [
    { id: 'precios', label: '💰 Solicitudes de precio', count: solicitudes.length },
    { id: 'comercios', label: '🏪 Verificaciones', count: verificaciones.length },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-violet-100">
            <Shield size={20} className="text-violet-600" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold">Panel de Moderación</h1>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Revisá las solicitudes pendientes</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${tab === t.id ? 'bg-emerald-50 text-emerald-700 border-emerald-200 border' : 'text-gray-500'}`} style={tab !== t.id ? { background: 'var(--bg-secondary)' } : {}}>
              {t.label}
              {t.count > 0 && <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] bg-red-100 text-red-600">{t.count}</span>}
            </button>
          ))}
        </div>

        {cargando && <div className="text-center py-8"><div className="w-8 h-8 border-3 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto" /></div>}

        {/* Price Requests */}
        {tab === 'precios' && !cargando && (
          <div>
            {solicitudes.length === 0 ? (
              <div className="card p-8 text-center"><p className="text-3xl mb-2">✅</p><p className="text-sm" style={{ color: 'var(--text-muted)' }}>No hay solicitudes pendientes</p></div>
            ) : (
              <div className="flex flex-col gap-3">
                {solicitudes.map((s, i) => (
                  <motion.div key={s.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="card p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold">{s.precios_productos?.productos?.nombre}</p>
                        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                          🏪 {s.precios_productos?.comercios?.nombre}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>
                            Actual: {fmtPrecio(s.precios_productos?.precio)}
                          </span>
                          <span className="text-xs">→</span>
                          <span className="text-sm font-black text-emerald-600">
                            {fmtPrecio(s.precio_sugerido)}
                          </span>
                        </div>
                        {s.motivo && <p className="text-xs mt-1 italic" style={{ color: 'var(--text-secondary)' }}>"{s.motivo}"</p>}
                        <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>{tiempoDesde(s.created_at)}</p>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button onClick={() => handleSolicitud(s.id, 'aprobada')} className="btn btn-sm px-3" style={{ background: 'var(--gradient-brand)', color: 'white' }}>
                          <Check size={14} />
                        </button>
                        <button onClick={() => handleSolicitud(s.id, 'rechazada')} className="btn btn-sm px-3 bg-red-50 text-red-600 hover:bg-red-100">
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Store Verification */}
        {tab === 'comercios' && !cargando && (
          <div>
            {verificaciones.length === 0 ? (
              <div className="card p-8 text-center"><p className="text-3xl mb-2">✅</p><p className="text-sm" style={{ color: 'var(--text-muted)' }}>No hay verificaciones pendientes</p></div>
            ) : (
              <div className="flex flex-col gap-3">
                {verificaciones.map((v, i) => (
                  <motion.div key={v.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="card p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-sm font-bold">{v.comercios?.nombre}</p>
                        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                          {v.comercios?.tipo} · {v.comercios?.direccion} · {v.comercios?.ciudad}
                        </p>
                        {v.fotos_local?.length > 0 && (
                          <div className="flex gap-2 mt-2 overflow-x-auto">
                            {v.fotos_local.map((url, j) => (
                              <a key={j} href={url} target="_blank" rel="noopener noreferrer" className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border" style={{ borderColor: 'var(--border)' }}>
                                <img src={url} alt={`Foto ${j + 1}`} className="w-full h-full object-cover" />
                              </a>
                            ))}
                          </div>
                        )}
                        {v.fotos_productos?.length > 0 && (
                          <div className="flex gap-2 mt-2 overflow-x-auto">
                            {v.fotos_productos.map((url, j) => (
                              <a key={j} href={url} target="_blank" rel="noopener noreferrer" className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border" style={{ borderColor: 'var(--border)' }}>
                                <img src={url} alt={`Producto ${j + 1}`} className="w-full h-full object-cover" />
                              </a>
                            ))}
                          </div>
                        )}
                        <p className="text-[10px] mt-2" style={{ color: 'var(--text-muted)' }}>{tiempoDesde(v.created_at)}</p>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button onClick={() => handleVerificacion(v.id, 'aprobado')} className="btn btn-sm px-3" style={{ background: 'var(--gradient-brand)', color: 'white' }}>
                          <Check size={14} /> Aprobar
                        </button>
                        <button onClick={() => handleVerificacion(v.id, 'rechazado', 'No cumple requisitos')} className="btn btn-sm px-3 bg-red-50 text-red-600 hover:bg-red-100">
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}
