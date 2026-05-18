import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, TrendingDown, Store, Users, ArrowRight, Sparkles, ChevronRight, Zap, Heart, Shield, DollarSign, Coffee } from 'lucide-react'
import { CATEGORIAS_PRODUCTO } from '../../data/constants'
import { useUbicacion, usePopulares } from '../../hooks/useMercado'
import { fmtPrecio } from '../../data/constants'
import { useCotizaciones, NOMBRES_DOLAR } from '../../hooks/useCotizaciones'

const HERO_EXAMPLES = ['Coca-Cola', 'Yerba Mate', 'Arroz', 'Zapatillas', 'Perfume', 'Leche']

export default function Home() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [placeholderIdx, setPlaceholderIdx] = useState(0)
  const { ubicacion } = useUbicacion()
  const { populares } = usePopulares(ubicacion.ciudad, ubicacion.provincia)
  const { cotizaciones, dolarBlue, cargando: cargandoCotiz } = useCotizaciones()

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
      <section className="relative overflow-hidden hero-pattern"
        style={{ background: 'var(--gradient-hero-mesh)' }}>
        
        {/* Animated orbs */}
        <div className="absolute top-10 right-[10%] w-72 h-72 rounded-full animate-float"
          style={{ background: 'radial-gradient(circle, rgba(45,212,191,0.15) 0%, transparent 70%)', animationDelay: '0s' }} />
        <div className="absolute bottom-0 left-[5%] w-96 h-96 rounded-full animate-float"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)', animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 right-[30%] w-48 h-48 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)' }} />

        <div className="relative container-app py-16 md:py-24 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{ 
                background: 'rgba(255,255,255,0.08)', 
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(167,243,208,0.9)'
              }}>
              <Sparkles size={14} />
              Precios verificados por la comunidad
            </div>

            <h1 className="font-display font-extrabold text-white leading-[1.1] mb-5"
              style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)' }}>
              Compará precios{' '}
              <span style={{ 
                background: 'linear-gradient(135deg, #2dd4bf, #a7f3d0, #fbbf24)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent' 
              }}>en tu ciudad</span>
            </h1>

            <p className="text-base md:text-lg max-w-xl mx-auto mb-9 leading-relaxed"
              style={{ color: 'rgba(167,243,208,0.7)' }}>
              Encontrá dónde comprar más barato. Buscá cualquier producto y
              compará precios en todos los comercios cerca tuyo.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-xl mx-auto">
              <div className="relative group">
                <div className="absolute -inset-1.5 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"
                  style={{ background: 'linear-gradient(135deg, rgba(45,212,191,0.5), rgba(13,148,136,0.4), rgba(245,158,11,0.2))' }} />
                <div className="relative flex items-center rounded-2xl overflow-hidden"
                  style={{ background: 'white', boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 0 40px rgba(13,148,136,0.1)' }}>
                  <Search className="ml-5 flex-shrink-0" size={22} style={{ color: 'var(--brand)' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={`Buscar ${HERO_EXAMPLES[placeholderIdx]}...`}
                    className="flex-1 min-w-0 py-4 md:py-4.5 px-3 md:px-4 text-sm md:text-base text-gray-900 placeholder-gray-400 outline-none bg-transparent"
                  />
                  <button
                    type="submit"
                    className="mr-2 flex-shrink-0 px-4 md:px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:scale-105 active:scale-95"
                    style={{ background: 'var(--gradient-brand)', boxShadow: 'var(--shadow-brand)' }}
                  >
                    Buscar
                  </button>
                </div>
              </div>
            </form>

            {/* Quick chips */}
            <div className="flex flex-wrap justify-center gap-2 mt-7">
              {HERO_EXAMPLES.map(term => (
                <button
                  key={term}
                  onClick={() => navigate(`/buscar?q=${encodeURIComponent(term)}`)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95"
                  style={{ 
                    background: 'rgba(255,255,255,0.08)', 
                    color: 'rgba(255,255,255,0.75)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                  onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.15)'; e.target.style.color = 'white' }}
                  onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.08)'; e.target.style.color = 'rgba(255,255,255,0.75)' }}
                >
                  {term}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ Stats Banner ═══ */}
      <section style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
        <div className="container-app py-6 md:py-8">
          <div className="grid grid-cols-3 gap-3 md:gap-6">
            {[
              { icon: <TrendingDown size={22} />, label: 'Ahorrá hasta', value: '40%', color: 'var(--brand)' },
              { icon: <Store size={22} />, label: 'Comercios', value: '100+', color: 'var(--brand)' },
              { icon: <Users size={22} />, label: 'Comunidad', value: 'Activa', color: 'var(--accent)' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-elevated flex flex-col items-center gap-1.5 p-4 md:p-5 text-center"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" 
                     style={{ background: 'var(--brand-glow)', color: stat.color }}>
                  {stat.icon}
                </div>
                <span className="text-xl md:text-2xl font-extrabold font-display" style={{ color: 'var(--text-primary)' }}>{stat.value}</span>
                <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Categories ═══ */}
      <section className="py-10 md:py-14">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">Explorá por categoría</h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Encontrá lo que necesitás en segundos</p>
          </motion.div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {CATEGORIAS_PRODUCTO.slice(0, 16).map((cat, i) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                onClick={() => navigate(`/buscar?cat=${cat.id}`)}
                className="card card-interactive p-4 md:p-5 flex flex-col items-center gap-2.5 group"
              >
                <span className="text-2xl md:text-3xl transition-transform group-hover:scale-125 group-hover:-translate-y-1">{cat.emoji}</span>
                <span className="text-[11px] md:text-xs font-semibold text-center leading-tight" style={{ color: 'var(--text-secondary)' }}>{cat.nombre}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Cotizaciones Rápidas ═══ */}
      {cotizaciones.dolares.length > 0 && (
        <section style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
          <div className="container-app py-8 md:py-10">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-5"
            >
              <div>
                <h2 className="font-display text-xl md:text-2xl font-bold flex items-center gap-2">
                  💵 Cotizaciones del día
                </h2>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Para que conviertas precios al instante</p>
              </div>
              <button onClick={() => navigate('/cotizaciones')}
                className="btn btn-ghost btn-sm" style={{ color: 'var(--brand)' }}>
                Ver todas <ChevronRight size={14} />
              </button>
            </motion.div>
            <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1">
              {cotizaciones.dolares.slice(0, 5).map((d, i) => {
                const casa = d.casa?.toLowerCase() || d.nombre?.toLowerCase() || ''
                const info = Object.entries(NOMBRES_DOLAR).find(([key]) => casa.includes(key))?.[1]
                if (!info) return null
                return (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => navigate('/cotizaciones')}
                    className="card card-interactive flex-shrink-0 p-3.5 min-w-[140px]"
                  >
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-sm">{info.emoji}</span>
                      <span className="text-[11px] font-bold">{info.nombre}</span>
                    </div>
                    <p className="text-lg font-extrabold" style={{ color: info.color }}>{fmtPrecio(d.venta)}</p>
                    <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>Venta</p>
                  </motion.button>
                )
              })}
              {cotizaciones.brl && (
                <motion.button
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25 }}
                  onClick={() => navigate('/cotizaciones')}
                  className="card card-interactive flex-shrink-0 p-3.5 min-w-[140px]"
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-sm">🇧🇷</span>
                    <span className="text-[11px] font-bold">Real</span>
                  </div>
                  <p className="text-lg font-extrabold" style={{ color: '#16a34a' }}>{fmtPrecio(cotizaciones.brl.venta)}</p>
                  <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>Venta</p>
                </motion.button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ═══ Popular Products ═══ */}
      {populares.length > 0 && (
        <section className="py-10 md:py-14" style={{ background: 'var(--bg-secondary)' }}>
          <div className="container-app">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-xl md:text-2xl font-bold flex items-center gap-2">
                  <Zap size={20} className="text-amber-500" />
                  Populares en {ubicacion.ciudad}
                </h2>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Los más buscados por la comunidad</p>
              </div>
              <button onClick={() => navigate('/buscar')} 
                className="btn btn-ghost btn-sm hidden sm:inline-flex" 
                style={{ color: 'var(--brand)' }}>
                Ver todos <ChevronRight size={14} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {populares.slice(0, 8).map((prod, i) => {
                const catInfo = CATEGORIAS_PRODUCTO.find(c => c.id === prod.categoria)
                return (
                  <motion.button
                    key={prod.producto_id}
                    initial={{ opacity: 0, y: 12 }}
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
                        <div className="flex items-center gap-2 mt-2.5">
                          <span className="text-lg font-extrabold" style={{ color: 'var(--brand)' }}>{fmtPrecio(prod.precio_min)}</span>
                          {prod.precio_max > prod.precio_min && (
                            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>— {fmtPrecio(prod.precio_max)}</span>
                          )}
                        </div>
                        <p className="text-[10px] mt-1.5" style={{ color: 'var(--text-muted)' }}>
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

      {/* ═══ Apoyar Ahorrito ═══ */}
      <section className="py-10 md:py-14">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card overflow-hidden"
            style={{ boxShadow: 'var(--shadow-lg)' }}
          >
            <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center gap-6"
              style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(251,191,36,0.05))' }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(245,158,11,0.3))' }}>
                <span className="text-3xl">☕</span>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-display text-lg font-bold mb-1">¿Te gusta Ahorrito?</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Somos un proyecto gratuito hecho para la comunidad. Con tu apoyo podemos llegar a más ciudades y seguir ayudando a todos a ahorrar.
                </p>
              </div>
              <button
                onClick={() => navigate('/donar')}
                className="btn btn-lg font-bold flex-shrink-0 transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', boxShadow: '0 4px 16px rgba(245,158,11,0.3)' }}
              >
                <Coffee size={18} /> Invitame un cafecito
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ CTA & Benefits Section ═══ */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ background: 'radial-gradient(circle at top right, rgba(45,212,191,0.15), transparent 50%)' }} />
        <div className="container-app relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-5"
                style={{ background: 'var(--accent-glow)', color: '#d97706' }}>
                <Sparkles size={12} /> Beneficios exclusivos
              </div>
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-4 leading-tight">
                ¿Por qué unirte a <span className="gradient-text">Ahorrito</span>?
              </h2>
              <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Crear una cuenta es 100% gratis y te da acceso a herramientas diseñadas para maximizar tus ahorros todos los días.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-12">
              <div className="card card-premium p-6 md:p-8 text-center transition-transform hover:-translate-y-1">
                <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-5" style={{ background: 'var(--brand-glow)', color: 'var(--brand)' }}>
                  <Heart size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">Guarda Favoritos</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>Tené a mano los productos que comprás siempre y revisá sus precios al instante sin tener que buscarlos.</p>
              </div>

              <div className="card card-premium p-6 md:p-8 text-center relative overflow-hidden transition-transform hover:-translate-y-1" style={{ borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-5 relative z-10" style={{ background: 'var(--accent-glow)', color: '#d97706' }}>
                  <Plus size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 relative z-10">Aportá y Ayudá</h3>
                <p className="text-sm leading-relaxed relative z-10" style={{ color: 'var(--text-muted)' }}>Cargá precios que veas en la calle y ayudá a miles de vecinos a ahorrar en su compra del mes.</p>
              </div>

              <div className="card card-premium p-6 md:p-8 text-center transition-transform hover:-translate-y-1">
                <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-5" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#0284c7' }}>
                  <Shield size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">Ganá Reputación</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>Tus aportes te suman puntos. Convertite en un usuario verificado y confiable para toda la comunidad.</p>
              </div>

              <div className="card card-premium p-6 md:p-8 text-center transition-transform hover:-translate-y-1" style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-5 relative z-10" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                  <Sparkles size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 relative z-10">Ahorrito AI</h3>
                <p className="text-sm leading-relaxed relative z-10" style={{ color: 'var(--text-muted)' }}>Armá tu lista de compras y nuestro algoritmo te dirá en qué supermercado gastarás menos.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button onClick={() => navigate('/registro')} className="btn btn-primary btn-lg shadow-xl shadow-teal-500/20 px-8">
                Crear cuenta gratis <ArrowRight size={18} className="ml-1" />
              </button>
              <button onClick={() => navigate('/login')} className="btn btn-ghost btn-lg" style={{ color: 'var(--text-secondary)' }}>
                Ya tengo cuenta
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
