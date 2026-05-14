import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Bell, LogOut, ChevronRight, Tag, Shield } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useSeguimiento } from '../../hooks/useMercado'
import { fmtPrecio, CATEGORIAS_PRODUCTO } from '../../data/constants'

export default function Profile() {
  const navigate = useNavigate()
  const { usuario, rol, logout, esMod, esAdmin } = useAuth()
  const { seguidos, dejarDeSeguir } = useSeguimiento()

  useEffect(() => { if (!usuario) navigate('/login') }, [usuario, navigate])
  if (!usuario) return null

  const nombre = usuario.user_metadata?.nombre || usuario.email?.split('@')[0] || 'Usuario'

  return (
    <div className="container-app max-w-xl py-6">
      {/* Profile Header with gradient */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl overflow-hidden mb-6" style={{ boxShadow: 'var(--shadow-lg)' }}>
        <div className="px-6 pt-8 pb-10 text-center relative" style={{ background: 'var(--gradient-hero-mesh)' }}>
          <div className="absolute inset-0 hero-pattern" />
          <div className="relative z-10">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-3"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '2px solid rgba(255,255,255,0.2)', color: 'white' }}>
              {nombre[0].toUpperCase()}
            </div>
            <h1 className="font-display text-xl font-bold text-white">{nombre}</h1>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(167,243,208,0.7)' }}>{usuario.email}</p>
          </div>
        </div>
        <div className="p-4 flex items-center justify-center gap-3" style={{ background: 'var(--bg-card)' }}>
          <span className={`badge ${esAdmin ? 'badge-red' : esMod ? 'badge-violet' : 'badge-brand'}`}>
            {esAdmin ? '👑 Admin' : esMod ? '🛡️ Moderador' : '👤 Usuario'}
          </span>
          <span className="badge badge-amber">
            🔔 {seguidos.length} seguidos
          </span>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="card mb-6 overflow-hidden" style={{ boxShadow: 'var(--shadow-sm)' }}>
        <button onClick={() => navigate('/cargar-precio')}
          className="w-full px-5 py-3.5 flex items-center justify-between transition-colors"
          style={{ borderBottom: '1px solid var(--border)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <span className="text-sm font-semibold flex items-center gap-2"><Tag size={15} style={{ color: 'var(--brand)' }} /> Cargar un precio</span>
          <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
        </button>
        {esMod && (
          <button onClick={() => navigate('/moderacion')}
            className="w-full px-5 py-3.5 flex items-center justify-between transition-colors"
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <span className="text-sm font-semibold flex items-center gap-2"><Shield size={15} className="text-violet-500" /> Panel de moderación</span>
            <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
          </button>
        )}
      </div>

      {/* Followed Products */}
      <h2 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
        <Bell size={14} style={{ color: 'var(--brand)' }} /> Productos seguidos ({seguidos.length})
      </h2>

      {seguidos.length === 0 ? (
        <div className="card p-8 text-center" style={{ background: 'var(--bg-secondary)' }}>
          <p className="text-3xl mb-3">🔔</p>
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>No estás siguiendo ningún producto</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            Seguí un producto para recibir alertas cuando cambie de precio
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {seguidos.map((s, i) => {
            const prod = s.productos
            const catInfo = CATEGORIAS_PRODUCTO.find(c => c.id === prod?.categoria)
            return (
              <motion.div key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="card card-hover p-3.5 flex items-center gap-3">
                <Link to={`/producto/${s.producto_id}`} className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: 'var(--brand-glow)' }}>
                    {catInfo?.emoji || '📦'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{prod?.nombre}</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      {prod?.marca} {prod?.presentacion && `· ${prod?.presentacion}`}
                    </p>
                    {s.precio_referencia && (
                      <p className="text-[10px] font-semibold" style={{ color: 'var(--brand)' }}>Ref: {fmtPrecio(s.precio_referencia)}</p>
                    )}
                  </div>
                </Link>
                <button onClick={() => dejarDeSeguir(s.producto_id)}
                  className="btn btn-ghost btn-sm text-red-400 hover:text-red-600 p-1.5" 
                  style={{ borderRadius: 'var(--radius-full)' }} title="Dejar de seguir">✕</button>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Logout */}
      <button onClick={logout} className="btn btn-ghost w-full mt-8 text-red-500 hover:text-red-600">
        <LogOut size={16} /> Cerrar sesión
      </button>
    </div>
  )
}
