import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'

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

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Las contraseñas no coinciden'); return }
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return }
    
    setCargando(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { nombre } }
      })
      if (error) throw error

      // Create role entry
      if (data.user) {
        await supabase.from('mercado_roles').upsert({ user_id: data.user.id, rol: 'user' })
      }

      setExito(true)
    } catch (err) {
      setError(err.message)
    } finally { setCargando(false) }
  }

  if (exito) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-sm">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="font-display text-xl font-bold mb-2">¡Cuenta creada!</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            Revisá tu email para confirmar tu cuenta. Después podés empezar a cargar precios.
          </p>
          <button onClick={() => navigate('/login')} className="btn btn-primary">Ir a Iniciar Sesión</button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🛒</div>
          <h1 className="font-display text-2xl font-bold">Creá tu cuenta</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Unite a la comunidad de Ahorrito</p>
        </div>

        <form onSubmit={handleRegister} className="card p-6">
          {error && <div className="mb-4 px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>}

          <div className="mb-4">
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Nombre</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Tu nombre" className="input pl-10" required />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" className="input pl-10" required />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Contraseña</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" className="input pl-10 pr-10" required />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Confirmar contraseña</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repetí tu contraseña" className="input pl-10" required />
            </div>
          </div>

          <button type="submit" disabled={cargando} className="btn btn-primary w-full btn-lg">
            {cargando ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Crear Cuenta'}
          </button>

          <p className="text-sm text-center mt-4" style={{ color: 'var(--text-muted)' }}>
            ¿Ya tenés cuenta?{' '}
            <Link to="/login" className="text-emerald-600 font-semibold hover:underline">Iniciá sesión</Link>
          </p>
        </form>
      </motion.div>
    </div>
  )
}
