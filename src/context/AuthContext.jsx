import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [usuario, setUsuario] = useState(null)
  const [rol, setRol] = useState('user')
  const [cargando, setCargando] = useState(true)

  const cargarRol = useCallback(async (userId) => {
    if (!userId) { setRol('user'); return }
    try {
      const { data } = await supabase
        .from('mercado_roles')
        .select('rol')
        .eq('user_id', userId)
        .maybeSingle()
      setRol(data?.rol || 'user')
    } catch { setRol('user') }
  }, [])

  useEffect(() => {
    let montado = true

    async function getInitialSession() {
      try {
        const { data: { session: s } } = await supabase.auth.getSession()
        if (montado && s) {
          setSession(s)
          setUsuario(s.user)
          await cargarRol(s.user.id)
        }
      } catch (err) {
        console.error('Error obteniendo sesión:', err)
      } finally {
        if (montado) setCargando(false)
      }
    }

    getInitialSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (montado) {
        setSession(newSession)
        setUsuario(newSession?.user || null)
        if (newSession?.user) {
          await cargarRol(newSession.user.id)
        } else {
          setRol('user')
        }
        setCargando(false)
      }
    })

    return () => { montado = false; subscription?.unsubscribe() }
  }, [cargarRol])

  const logout = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setUsuario(null)
    setRol('user')
  }

  const esMod = rol === 'moderador' || rol === 'admin'
  const esAdmin = rol === 'admin'

  return (
    <AuthContext.Provider value={{ session, usuario, rol, cargando, logout, esMod, esAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
