import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { Mail, Lock, Eye, EyeOff, TrendingDown, Users, Shield } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      navigate('/')
    } catch (err) {
      setError(err.message === 'Invalid login credentials' ? 'Email o contraseña incorrectos' : err.message)
    } finally { setCargando(false) }
  }

  return (
    <div className="auth-layout">
      {/* Brand Panel (Desktop only) */}
      <div className="auth-brand hero-pattern">
        <div className="relative z-10 text-center max-w-md">
          <div className="w-24 h-24 flex items-center justify-center mx-auto mb-6 animate-float relative z-10">
            <img src="/logo-v2.png" alt="Ahorrito Logo" className="w-full h-full object-contain drop-shadow-[0_8px_16px_rgba(16,185,129,0.4)]" />
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-3">Bienvenido a Ahorrito</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(167,243,208,0.7)' }}>
            La comunidad que te ayuda a encontrar los mejores precios en tu ciudad
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
        {/* Decorative orbs */}
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full" style={{ background: 'radial-gradient(circle, rgba(45,212,191,0.15), transparent 70%)' }} />
        <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.08), transparent 70%)' }} />
      </div>

      {/* Form Panel */}
      <div className="auth-form">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="lg:hidden w-14 h-14 flex items-center justify-center mx-auto mb-4 relative z-10">
              <img src="/logo-v2.png" alt="Ahorrito Logo" className="w-full h-full object-contain drop-shadow-[0_4px_8px_rgba(16,185,129,0.3)]" />
            </div>
            <h1 className="font-display text-2xl font-bold">Iniciá sesión</h1>
            <p className="text-sm mt-1.5" style={{ color: 'var(--text-muted)' }}>Accedé a tu cuenta de Ahorrito</p>
          </div>

          <form onSubmit={handleLogin} className="card p-6 md:p-7" style={{ boxShadow: 'var(--shadow-lg)' }}>
            {error && <div className="mb-4 px-3 py-2.5 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', color: '#dc2626' }}>{error}</div>}

            <div className="mb-4">
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" className="input pl-10" required />
              </div>
            </div>

            <div className="mb-6">
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Contraseña</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="input pl-10 pr-10" required />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors" style={{ color: 'var(--text-muted)' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={cargando} className="btn btn-primary w-full btn-lg">
              {cargando ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Iniciar Sesión'}
            </button>

            <p className="text-sm text-center mt-5" style={{ color: 'var(--text-muted)' }}>
              ¿No tenés cuenta?{' '}
              <Link to="/registro" className="font-semibold hover:underline" style={{ color: 'var(--brand)' }}>Registrate</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
