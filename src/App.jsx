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
import SmartCart from './pages/SmartCart'
import Cotizaciones from './pages/Cotizaciones'
import Donar from './pages/Donar'
import { useAuth } from './context/AuthContext'

export default function App() {
  const { cargando } = useAuth()

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--gradient-hero-mesh)' }}>
        <div className="text-center animate-fade-in">
          <div className="w-24 h-24 flex items-center justify-center mx-auto mb-5 animate-float relative z-10">
            <img src="/logo-v2.png" alt="Cargando Ahorrito..." className="w-full h-full object-contain drop-shadow-[0_8px_16px_rgba(16,185,129,0.4)]" />
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
          <Route path="/lista-inteligente" element={<SmartCart />} />
          <Route path="/cotizaciones" element={<Cotizaciones />} />
          <Route path="/donar" element={<Donar />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
