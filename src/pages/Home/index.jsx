import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, TrendingDown, Store, Users, ArrowRight, Sparkles } from 'lucide-react'
import { CATEGORIAS_PRODUCTO } from '../../data/constants'
import { useUbicacion, usePopulares } from '../../hooks/useMercado'
import { fmtPrecio } from '../../data/constants'

const HERO_EXAMPLES = ['Coca-Cola', 'Yerba Mate', 'Arroz', 'Zapatillas', 'Perfume', 'Leche']

export default function Home() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [placeholderIdx, setPlaceholderIdx] = useState(0)
  const { ubicacion } = useUbicacion()
  const { populares } = usePopulares(ubicacion.ciudad, ubicacion.provincia)

  // Animated placeholder
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx(i => (i + 1) % HERO_EXAMPLES.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  const handleSearch = (e) => {
    e?.preventDefault()
    if (searchQuery.trim().length >= 2) {
      navigate(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div>
      {/* ═══ Hero Section ═══ */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'var(--gradient-hero)' }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #34d399 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-20%] left-[-10%] w-80 h-80 rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)' }} />

        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-sm text-emerald-200 mb-6">
              <Sparkles size={14} />
              Precios verificados por la comunidad
            </div>

            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Compará precios<br />
              <span className="text-emerald-300">en tu ciudad</span>
            </h1>

            <p className="text-emerald-100/80 text-lg max-w-lg mx-auto mb-8">
              Encontrá dónde comprar más barato. Buscá cualquier producto y
              compará precios en todos los comercios cerca tuyo.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-xl mx-auto">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                <div className="relative flex items-center bg-white rounded-2xl shadow-2xl overflow-hidden">
                  <Search className="ml-5 text-gray-400 flex-shrink-0" size={22} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={`Buscar ${HERO_EXAMPLES[placeholderIdx]}...`}
                    className="flex-1 py-4 px-4 text-base text-gray-900 placeholder-gray-400 outline-none bg-transparent"
                  />
                  <button
                    type="submit"
                    className="mr-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:scale-105 active:scale-95"
                    style={{ background: 'var(--gradient-brand)' }}
                  >
                    Buscar
                  </button>
                </div>
              </div>
            </form>

            {/* Quick search chips */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {HERO_EXAMPLES.map(term => (
                <button
                  key={term}
                  onClick={() => navigate(`/buscar?q=${encodeURIComponent(term)}`)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-white/80 border border-white/10 hover:bg-white/20 hover:text-white transition-all active:scale-95"
                >
                  🔍 {term}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ Stats Banner ═══ */}
      <section className="border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { icon: <TrendingDown size={20} className="text-emerald-500" />, label: 'Ahorrá hasta', value: '40%' },
              { icon: <Store size={20} className="text-emerald-500" />, label: 'Comercios', value: '100+' },
              { icon: <Users size={20} className="text-emerald-500" />, label: 'Comunidad', value: 'Activa' },
            ].map(stat => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col items-center gap-1"
              >
                {stat.icon}
                <span className="text-xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>{stat.value}</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Categories ═══ */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-display text-2xl font-bold mb-6 text-center"
          >
            Explorá por categoría
          </motion.h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {CATEGORIAS_PRODUCTO.slice(0, 16).map((cat, i) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                onClick={() => navigate(`/buscar?cat=${cat.id}`)}
                className="card card-interactive p-4 flex flex-col items-center gap-2 group"
              >
                <span className="text-2xl transition-transform group-hover:scale-125">{cat.emoji}</span>
                <span className="text-xs font-semibold text-center" style={{ color: 'var(--text-secondary)' }}>{cat.nombre}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Popular Products ═══ */}
      {populares.length > 0 && (
        <section className="py-12 px-4" style={{ background: 'var(--bg-secondary)' }}>
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-2xl font-bold mb-6">
              🔥 Populares en {ubicacion.ciudad}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {populares.slice(0, 8).map((prod, i) => {
                const catInfo = CATEGORIAS_PRODUCTO.find(c => c.id === prod.categoria)
                return (
                  <motion.button
                    key={prod.producto_id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => navigate(`/producto/${prod.producto_id}`)}
                    className="card card-interactive p-4 text-left"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                        style={{ background: 'var(--brand-glow)' }}>
                        {catInfo?.emoji || '📦'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold truncate">{prod.nombre}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                          {prod.marca} {prod.presentacion && `· ${prod.presentacion}`}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-lg font-black text-emerald-600">{fmtPrecio(prod.precio_min)}</span>
                          {prod.precio_max > prod.precio_min && (
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>— {fmtPrecio(prod.precio_max)}</span>
                          )}
                        </div>
                        <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                          {prod.cant_comercios} comercio{prod.cant_comercios !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══ CTA Section ═══ */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl font-bold mb-4">
              ¿Viste un precio? <span className="gradient-text">Compartilo</span>
            </h2>
            <p className="text-base mb-8" style={{ color: 'var(--text-secondary)' }}>
              Ayudá a tu comunidad cargando precios. Cada aporte hace la diferencia
              para que todos podamos comprar mejor.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => navigate('/cargar-precio')} className="btn btn-primary btn-lg">
                <Plus size={18} /> Cargar un precio
              </button>
              <button onClick={() => navigate('/registro')} className="btn btn-secondary btn-lg">
                Crear cuenta gratis <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

function Plus(props) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
}
