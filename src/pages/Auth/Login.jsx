import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🛒</div>
          <h1 className="font-display text-2xl font-bold">Iniciá sesión</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Accedé a tu cuenta de Ahorrito</p>
        </div>

        <form onSubmit={handleLogin} className="card p-6">
          {error && (
            <div className="mb-4 px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>
          )}

          <div className="mb-4">
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" className="input pl-10" required />
            </div>
          </div>

          <div className="mb-6">
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Contraseña</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="input pl-10 pr-10" required />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={cargando} className="btn btn-primary w-full btn-lg">
            {cargando ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Iniciar Sesión'}
          </button>

          <p className="text-sm text-center mt-4" style={{ color: 'var(--text-muted)' }}>
            ¿No tenés cuenta?{' '}
            <Link to="/registro" className="text-emerald-600 font-semibold hover:underline">Registrate</Link>
          </p>
        </form>
      </motion.div>
    </div>
  )
}
