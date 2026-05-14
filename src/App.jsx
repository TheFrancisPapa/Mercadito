import { Routes, Route } from 'react-router-dom'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import Home from './pages/Home'
import SearchResults from './pages/Search'
import ProductDetail from './pages/Product'
import StoreProfile from './pages/Store'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import AddPrice from './pages/AddPrice'
import Profile from './pages/Profile'
import Moderation from './pages/Moderation'
import { useAuth } from './context/AuthContext'

export default function App() {
  const { cargando } = useAuth()

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--gradient-hero-mesh)' }}>
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5 animate-float"
               style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}>
            🛒
          </div>
          <p className="font-display font-bold text-xl text-white/90 mb-4">Ahorrito</p>
          <div className="w-8 h-8 border-3 border-white/20 border-t-teal-300 rounded-full animate-spin mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col has-bottom-nav" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buscar" element={<SearchResults />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/comercio/:id" element={<StoreProfile />} />
          <Route path="/cargar-precio" element={<AddPrice />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/moderacion" element={<Moderation />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
