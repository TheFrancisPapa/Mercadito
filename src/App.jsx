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
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="text-center animate-fade-in">
          <div className="text-5xl mb-4 animate-float">🛒</div>
          <div className="w-8 h-8 border-3 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
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
