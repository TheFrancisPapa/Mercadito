import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Search, Plus, User, Shield, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function Navbar() {
  const { usuario, esMod, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-40 glass border-b" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl transition-transform group-hover:scale-110">🛒</span>
          <span className="font-display font-bold text-lg gradient-text">Ahorrito</span>
        </Link>

        {/* Desktop Search */}
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-8">
          <button
            onClick={() => navigate('/buscar')}
            className="input flex items-center gap-2 cursor-pointer hover:border-emerald-400 transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <Search size={16} />
            <span className="text-sm">Buscar productos...</span>
          </button>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          {usuario ? (
            <>
              <button onClick={() => navigate('/cargar-precio')} className="btn btn-primary btn-sm">
                <Plus size={16} /> Cargar Precio
              </button>
              {esMod && (
                <button onClick={() => navigate('/moderacion')} className="btn btn-ghost btn-sm" title="Moderación">
                  <Shield size={16} />
                </button>
              )}
              <button onClick={() => navigate('/perfil')} className="btn btn-ghost btn-sm">
                <User size={16} />
              </button>
              <button onClick={logout} className="btn btn-ghost btn-sm" title="Salir">
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="btn btn-ghost btn-sm">Iniciar Sesión</button>
              <button onClick={() => navigate('/registro')} className="btn btn-primary btn-sm">Registrarse</button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center gap-2">
          <button onClick={() => navigate('/buscar')} className="btn btn-ghost btn-sm p-2">
            <Search size={20} />
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} className="btn btn-ghost btn-sm p-2">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}
          >
            <div className="p-4 flex flex-col gap-2">
              {usuario ? (
                <>
                  <button onClick={() => { navigate('/cargar-precio'); setMenuOpen(false) }} className="btn btn-primary w-full">
                    <Plus size={16} /> Cargar Precio
                  </button>
                  <button onClick={() => { navigate('/perfil'); setMenuOpen(false) }} className="btn btn-secondary w-full">
                    <User size={16} /> Mi Perfil
                  </button>
                  {esMod && (
                    <button onClick={() => { navigate('/moderacion'); setMenuOpen(false) }} className="btn btn-secondary w-full">
                      <Shield size={16} /> Moderación
                    </button>
                  )}
                  <button onClick={() => { logout(); setMenuOpen(false) }} className="btn btn-ghost w-full">
                    <LogOut size={16} /> Salir
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => { navigate('/login'); setMenuOpen(false) }} className="btn btn-secondary w-full">Iniciar Sesión</button>
                  <button onClick={() => { navigate('/registro'); setMenuOpen(false) }} className="btn btn-primary w-full">Registrarse</button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
