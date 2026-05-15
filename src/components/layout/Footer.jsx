import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
      <div className="container-app py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                   style={{ background: 'var(--gradient-brand)' }}>
                <span style={{ filter: 'brightness(10)' }}>🛒</span>
              </div>
              <span className="font-display font-bold text-lg gradient-text">Ahorrito</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)', maxWidth: '280px' }}>
              La comunidad que te ayuda a encontrar los mejores precios en tu ciudad. 
              Cada aporte cuenta 💚
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Navegación
            </h4>
            <div className="flex flex-col gap-2">
              {[
                { to: '/', label: 'Inicio' },
                { to: '/buscar', label: 'Buscar productos' },
                { to: '/cargar-precio', label: 'Cargar precio' },
              ].map(link => (
                <Link key={link.to} to={link.to} 
                  className="text-sm font-medium transition-colors hover:text-teal-500"
                  style={{ color: 'var(--text-secondary)' }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Comunidad
            </h4>
            <div className="flex flex-col gap-2">
              {[
                { to: '/registro', label: 'Crear cuenta gratis' },
                { to: '/login', label: 'Iniciar sesión' },
              ].map(link => (
                <Link key={link.to} to={link.to} 
                  className="text-sm font-medium transition-colors hover:text-teal-500"
                  style={{ color: 'var(--text-secondary)' }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
             style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
            Hecho con <Heart size={12} className="text-red-400 fill-red-400" /> en Argentina
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} Ahorrito. Precios cargados por la comunidad.
          </p>
        </div>
      </div>
    </footer>
  )
}
