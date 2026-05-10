import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Bell, LogOut, ChevronRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useSeguimiento } from '../../hooks/useMercado'
import { fmtPrecio, CATEGORIAS_PRODUCTO } from '../../data/constants'

export default function Profile() {
  const navigate = useNavigate()
  const { usuario, rol, logout, esMod, esAdmin } = useAuth()
  const { seguidos, dejarDeSeguir } = useSeguimiento()

  useEffect(() => {
    if (!usuario) navigate('/login')
  }, [usuario, navigate])

  if (!usuario) return null

  const nombre = usuario.user_metadata?.nombre || usuario.email?.split('@')[0] || 'Usuario'

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      {/* Profile Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-5 text-center mb-6">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-3" style={{ background: 'var(--brand-glow)' }}>
          {nombre[0].toUpperCase()}
        </div>
        <h1 className="font-display text-xl font-bold">{nombre}</h1>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{usuario.email}</p>
        <span className={`badge mt-2 inline-flex ${esAdmin ? 'badge-red' : esMod ? 'badge-violet' : 'badge-brand'}`}>
          {esAdmin ? '👑 Admin' : esMod ? '🛡️ Moderador' : '👤 Usuario'}
        </span>
      </motion.div>

      {/* Quick Links */}
      <div className="card mb-6 overflow-hidden divide-y" style={{ borderColor: 'var(--border)' }}>
        <button onClick={() => navigate('/cargar-precio')} className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
          <span className="text-sm font-semibold">🏷️ Cargar un precio</span>
          <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
        </button>
        {esMod && (
          <button onClick={() => navigate('/moderacion')} className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <span className="text-sm font-semibold">🛡️ Panel de moderación</span>
            <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
          </button>
        )}
      </div>

      {/* Followed Products */}
      <h2 className="text-sm font-bold mb-3 flex items-center gap-2">
        <Bell size={14} /> Productos seguidos ({seguidos.length})
      </h2>

      {seguidos.length === 0 ? (
        <div className="card p-6 text-center">
          <p className="text-3xl mb-2">🔔</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No estás siguiendo ningún producto</p>
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
              <motion.div key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="card p-3 flex items-center gap-3">
                <Link to={`/producto/${s.producto_id}`} className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-xl">{catInfo?.emoji || '📦'}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{prod?.nombre}</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      {prod?.marca} {prod?.presentacion && `· ${prod?.presentacion}`}
                    </p>
                    {s.precio_referencia && (
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        Ref: {fmtPrecio(s.precio_referencia)}
                      </p>
                    )}
                  </div>
                </Link>
                <button onClick={() => dejarDeSeguir(s.producto_id)} className="btn btn-ghost btn-sm text-red-400 hover:text-red-600" title="Dejar de seguir">
                  ✕
                </button>
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
