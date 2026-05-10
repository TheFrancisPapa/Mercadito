import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t py-8 px-4" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛒</span>
            <span className="font-display font-bold gradient-text">Mercadito</span>
          </div>
          <div className="flex items-center gap-6 text-sm" style={{ color: 'var(--text-muted)' }}>
            <Link to="/" className="hover:text-emerald-500 transition-colors">Inicio</Link>
            <Link to="/buscar" className="hover:text-emerald-500 transition-colors">Buscar</Link>
            <Link to="/cargar-precio" className="hover:text-emerald-500 transition-colors">Cargar Precio</Link>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Precios cargados por la comunidad 💚
          </p>
        </div>
      </div>
    </footer>
  )
}
