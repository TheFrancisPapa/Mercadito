import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { Search, Plus, User, Shield, LogOut, Menu, X, Home, Tag, Sparkles, Sun, Moon } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function Navbar() {
  const { usuario, esMod, logout } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* ═══ Top Navbar ═══ */}
      <nav className="sticky top-0 z-40 glass" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="container-app h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" 
                 style={{ background: 'var(--gradient-brand)', boxShadow: 'var(--shadow-brand)' }}>
              <span className="transition-transform group-hover:scale-110" style={{ filter: 'brightness(10)' }}>🛒</span>
            </div>
            <span className="font-display font-bold text-xl gradient-text tracking-tight">Ahorrito</span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-lg mx-8">
            <button
              onClick={() => navigate('/buscar')}
              className="input flex items-center gap-3 cursor-pointer transition-all"
              style={{ 
                color: 'var(--text-muted)',
                borderColor: 'var(--border)',
                borderRadius: 'var(--radius-xl)',
                padding: '0.6rem 1rem',
                background: 'var(--bg-secondary)',
              }}
            >
              <Search size={16} style={{ color: 'var(--brand)', opacity: 0.7 }} />
              <span className="text-sm">Buscar productos...</span>
              <span className="ml-auto text-[10px] px-2 py-0.5 rounded-md font-bold" 
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                ⌘K
              </span>
            </button>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-1.5">
            <button onClick={toggleTheme} className="btn btn-ghost btn-sm" title={isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
              style={{ borderRadius: 'var(--radius-full)' }}>
              {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            {usuario ? (
              <>
                <button onClick={() => navigate('/cargar-precio')} className="btn btn-primary btn-sm">
                  <Plus size={15} /> Cargar Precio
                </button>
                <button onClick={() => navigate('/lista-inteligente')} className="btn btn-ghost btn-sm" title="Carrito Inteligente"
                  style={{ borderRadius: 'var(--radius-full)', color: 'var(--brand)' }}>
                  <Sparkles size={17} />
                </button>
                {esMod && (
                  <button onClick={() => navigate('/moderacion')} className="btn btn-ghost btn-sm" title="Moderación"
                    style={{ borderRadius: 'var(--radius-full)' }}>
                    <Shield size={17} />
                  </button>
                )}
                <button onClick={() => navigate('/perfil')} className="btn btn-ghost btn-sm"
                  style={{ borderRadius: 'var(--radius-full)' }}>
                  <User size={17} />
                </button>
                <button onClick={logout} className="btn btn-ghost btn-sm" title="Salir"
                  style={{ borderRadius: 'var(--radius-full)' }}>
                  <LogOut size={17} />
                </button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="btn btn-ghost btn-sm">Iniciar Sesión</button>
                <button onClick={() => navigate('/registro')} className="btn btn-primary btn-sm">Registrarse</button>
              </>
            )}
          </div>

          {/* Mobile: Only hamburger for auth actions, main nav is bottom bar */}
          <div className="md:hidden flex items-center gap-1">
            <button onClick={toggleTheme} className="btn btn-ghost btn-sm p-2"
              style={{ borderRadius: 'var(--radius-full)' }}>
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {usuario ? (
              <button onClick={() => setMenuOpen(!menuOpen)} className="btn btn-ghost btn-sm p-2"
                style={{ borderRadius: 'var(--radius-full)' }}>
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            ) : (
              <button onClick={() => navigate('/login')} className="btn btn-primary btn-sm text-xs px-3">
                Entrar
              </button>
            )}
          </div>
        </div>

        {/* Mobile Dropdown (supplementary actions) */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
              style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-card)' }}
            >
              <div className="p-3 flex flex-col gap-1.5">
                {esMod && (
                  <button onClick={() => { navigate('/moderacion'); setMenuOpen(false) }} 
                    className="btn btn-secondary w-full justify-start text-sm">
                    <Shield size={16} /> Moderación
                  </button>
                )}
                <button onClick={() => { logout(); setMenuOpen(false) }} 
                  className="btn btn-ghost w-full justify-start text-sm text-red-500">
                  <LogOut size={16} /> Cerrar sesión
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ═══ Bottom Tab Bar (Mobile Only) ═══ */}
      <div className="md:hidden bottom-nav">
        <button className={`bottom-nav-item ${isActive('/') ? 'active' : ''}`}
          onClick={() => navigate('/')}>
          <Home size={22} strokeWidth={isActive('/') ? 2.5 : 1.8} />
          <span>Inicio</span>
        </button>

        <button className={`bottom-nav-item ${isActive('/buscar') ? 'active' : ''}`}
          onClick={() => navigate('/buscar')}>
          <Search size={22} strokeWidth={isActive('/buscar') ? 2.5 : 1.8} />
          <span>Buscar</span>
        </button>

        {usuario ? (
          <>
            <button className="bottom-nav-item" onClick={() => navigate('/cargar-precio')}>
              <div className="bottom-nav-item-cta">
                <Plus size={24} strokeWidth={2.5} />
              </div>
            </button>

            <button className={`bottom-nav-item ${isActive('/lista-inteligente') ? 'active' : ''}`}
              onClick={() => navigate('/lista-inteligente')}>
              <Sparkles size={22} strokeWidth={isActive('/lista-inteligente') ? 2.5 : 1.8} className="text-emerald-500" />
              <span>Ahorrito AI</span>
            </button>

            <button className={`bottom-nav-item ${isActive('/perfil') ? 'active' : ''}`}
              onClick={() => navigate('/perfil')}>
              <User size={22} strokeWidth={isActive('/perfil') ? 2.5 : 1.8} />
              <span>Perfil</span>
            </button>
          </>
        ) : (
          <button className={`bottom-nav-item ${isActive('/login') || isActive('/registro') ? 'active' : ''}`}
            onClick={() => navigate('/login')}>
            <User size={22} strokeWidth={isActive('/login') ? 2.5 : 1.8} />
            <span>Ingresar</span>
          </button>
        )}
      </div>
    </>
  )
}
