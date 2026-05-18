import { motion } from 'framer-motion'
import { ArrowLeft, Heart, Coffee, Server, MapPin, Users, ExternalLink, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const CAFECITO_URL = 'https://cafecito.app/manguitox'

const DESTINO_DONACIONES = [
  { emoji: '🗄️', icon: Server, titulo: 'Más espacio en servidores', desc: 'Más productos, más precios, más ciudades. Todo eso necesita más almacenamiento.' },
  { emoji: '🗺️', icon: MapPin, titulo: 'Llegar a más lugares', desc: 'Queremos que Ahorrito esté disponible en todas las ciudades de Argentina.' },
  { emoji: '⚡', icon: Sparkles, titulo: 'Nuevas funcionalidades', desc: 'Servicios, notificaciones push, comparaciones inteligentes y mucho más.' },
  { emoji: '👥', icon: Users, titulo: 'Más comunidad', desc: 'Difusión, redes sociales y acciones para que más gente pueda ahorrar cada día.' },
]

export default function Donar() {
  const navigate = useNavigate()

  return (
    <div className="container-app max-w-3xl py-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm font-semibold mb-5 active:scale-95" style={{ color: 'var(--brand)' }}>
        <ArrowLeft size={16} /> Volver
      </button>

      {/* Header con gradiente */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card overflow-hidden mb-8"
        style={{ boxShadow: 'var(--shadow-lg)' }}
      >
        <div className="relative p-8 md:p-12 text-center" style={{ background: 'var(--gradient-hero-mesh)' }}>
          {/* Orbes decorativos */}
          <div className="absolute top-5 right-[15%] w-48 h-48 rounded-full animate-float" style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 left-[10%] w-64 h-64 rounded-full animate-float" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)', animationDelay: '1s' }} />

          <div className="relative z-10">
            <div className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-5 animate-bounce-in"
              style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.3), rgba(245,158,11,0.4))', backdropFilter: 'blur(10px)' }}>
              <span className="text-4xl">☕</span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white mb-3">
              Apoyá a <span style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ahorrito</span>
            </h1>
            <p className="text-base md:text-lg max-w-lg mx-auto leading-relaxed" style={{ color: 'rgba(167,243,208,0.8)' }}>
              Ahorrito es un proyecto 100% gratuito hecho con amor para la comunidad.
              Tu apoyo nos ayuda a seguir creciendo y que más personas puedan ahorrar.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Botón principal Cafecito */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-10"
      >
        <a
          href={CAFECITO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-lg font-bold text-white transition-all hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            boxShadow: '0 8px 32px rgba(245,158,11,0.35), 0 0 0 1px rgba(245,158,11,0.2)',
          }}
        >
          <Coffee size={22} />
          Invitame un cafecito
          <ExternalLink size={16} />
        </a>
        <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
          Donación única · Sin suscripción · El monto lo elegís vos 💛
        </p>
      </motion.div>

      {/* ¿A dónde van las donaciones? */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="font-display text-xl font-bold mb-2 text-center">¿A dónde van las donaciones?</h2>
        <p className="text-sm text-center mb-7" style={{ color: 'var(--text-muted)' }}>
          Cada aporte se usa para mantener y mejorar la plataforma
        </p>

        <div className="grid sm:grid-cols-2 gap-3 mb-10">
          {DESTINO_DONACIONES.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="card p-5 transition-all hover:scale-[1.01]"
              style={{ boxShadow: 'var(--shadow-sm)' }}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: 'var(--accent-glow)' }}>
                  {item.emoji}
                </div>
                <div>
                  <p className="text-sm font-bold mb-1">{item.titulo}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Gracias */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="card p-8 text-center"
        style={{ background: 'var(--bg-secondary)', boxShadow: 'var(--shadow-sm)' }}
      >
        <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4"
          style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
          <Heart size={28} className="text-red-500" />
        </div>
        <h3 className="font-display text-lg font-bold mb-2">¡Gracias por ser parte!</h3>
        <p className="text-sm max-w-md mx-auto leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          Incluso si no podés donar, ayudás un montón cargando precios, compartiendo Ahorrito con tus amigos
          y dejando tu opinión en los comercios. ¡Cada acción cuenta! 🙌
        </p>
      </motion.div>
    </div>
  )
}
