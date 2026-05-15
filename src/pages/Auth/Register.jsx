import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { Mail, Lock, User, Eye, EyeOff, TrendingDown, Users, Shield } from 'lucide-react'

export default function Register() {
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [exito, setExito] = useState(false)
  const [cargando, setCargando] = useState(false)

  const passStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3
  const strengthColors = ['', '#ef4444', '#f59e0b', '#10b981']
  const strengthLabels = ['', 'Débil', 'Media', 'Fuerte']

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Las contraseñas no coinciden'); return }
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return }
    setCargando(true)
    try {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { nombre } } })
      if (error) throw error
      if (data.user) { await supabase.from('mercado_roles').upsert({ user_id: data.user.id, rol: 'user' }) }
      setExito(true)
    } catch (err) { setError(err.message) }
    finally { setCargando(false) }
  }

  if (exito) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce-in"
               style={{ background: 'var(--brand-glow)' }}>✅</div>
          <h2 className="font-display text-xl font-bold mb-2 gradient-text">¡Cuenta creada!</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            Revisá tu email para confirmar tu cuenta. Después podés empezar a cargar precios.
          </p>
          <button onClick={() => navigate('/login')} className="btn btn-primary">Ir a Iniciar Sesión</button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="auth-layout">
      {/* Brand Panel (Desktop) */}
      <div className="auth-brand hero-pattern">
        <div className="relative z-10 text-center max-w-md">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 animate-float"
               style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}>🛒</div>
          <h2 className="font-display text-3xl font-bold text-white mb-3">Unite a Ahorrito</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(167,243,208,0.7)' }}>
            Ayudá a miles de personas a comprar mejor compartiendo precios
          </p>
          <div className="flex justify-center gap-6 mt-10">
            {[
              { icon: <TrendingDown size={18} />, text: 'Ahorrá' },
              { icon: <Users size={18} />, text: 'Comunidad' },
              { icon: <Shield size={18} />, text: 'Verificado' },
            ].map(f => (
              <div key={f.text} className="flex flex-col items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)' }}>{f.icon}</div>
                <span className="text-[10px] font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full" style={{ background: 'radial-gradient(circle, rgba(45,212,191,0.15), transparent 70%)' }} />
        <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.08), transparent 70%)' }} />
      </div>

      {/* Form */}
      <div className="auth-form">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="lg:hidden w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"
                 style={{ background: 'var(--brand-glow)' }}>🛒</div>
            <h1 className="font-display text-2xl font-bold">Creá tu cuenta</h1>
            <p className="text-sm mt-1.5" style={{ color: 'var(--text-muted)' }}>Unite a la comunidad de Ahorrito</p>
          </div>

          <form onSubmit={handleRegister} className="card p-6 md:p-7" style={{ boxShadow: 'var(--shadow-lg)' }}>
            {error && <div className="mb-4 px-3 py-2.5 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', color: '#dc2626' }}>{error}</div>}

            <div className="mb-4">
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Nombre</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Tu nombre" className="input pl-10" required />
              </div>
            </div>

            <div className="mb-4">
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" className="input pl-10" required />
              </div>
            </div>

            <div className="mb-3">
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Contraseña</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" className="input pl-10 pr-10" required />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1" style={{ color: 'var(--text-muted)' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Password Strength */}
              {password.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 flex gap-1">
                    {[1, 2, 3].map(level => (
                      <div key={level} className="h-1 flex-1 rounded-full transition-colors"
                        style={{ background: passStrength >= level ? strengthColors[passStrength] : 'var(--border)' }} />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold" style={{ color: strengthColors[passStrength] }}>{strengthLabels[passStrength]}</span>
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Confirmar contraseña</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repetí tu contraseña" className="input pl-10" required />
              </div>
            </div>

            <button type="submit" disabled={cargando} className="btn btn-primary w-full btn-lg">
              {cargando ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Crear Cuenta'}
            </button>

            <p className="text-sm text-center mt-5" style={{ color: 'var(--text-muted)' }}>
              ¿Ya tenés cuenta?{' '}
              <Link to="/login" className="font-semibold hover:underline" style={{ color: 'var(--brand)' }}>Iniciá sesión</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
