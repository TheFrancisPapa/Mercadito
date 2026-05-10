import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, MapPin, Filter, SlidersHorizontal } from 'lucide-react'
import { useBusqueda, useUbicacion } from '../../hooks/useMercado'
import { CATEGORIAS_PRODUCTO, PROVINCIAS_AR, CIUDADES_POR_PROVINCIA, fmtPrecio, TIPOS_COMERCIO } from '../../data/constants'
import { MapaLocales } from '../../components/map/MapaLocales'

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { ubicacion, cambiarUbicacion } = useUbicacion()
  const { query, resultados, cargando, error, buscarConDebounce, buscar } = useBusqueda()
  const [localQuery, setLocalQuery] = useState(searchParams.get('q') || '')
  const [categoriaFiltro, setCategoriaFiltro] = useState(searchParams.get('cat') || null)
  const [showMap, setShowMap] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  // Initial search from URL
  useEffect(() => {
    const q = searchParams.get('q')
    const cat = searchParams.get('cat')
    if (q) {
      setLocalQuery(q)
      buscar(q, ubicacion.ciudad, ubicacion.provincia)
    }
    if (cat) setCategoriaFiltro(cat)
  }, []) // eslint-disable-line

  const handleSearch = useCallback((texto) => {
    setLocalQuery(texto)
    setSearchParams(prev => { prev.set('q', texto); return prev })
    buscarConDebounce(texto, ubicacion.ciudad, ubicacion.provincia)
  }, [buscarConDebounce, ubicacion, setSearchParams])

  const resultadosFiltrados = categoriaFiltro
    ? resultados.filter(r => r.categoria === categoriaFiltro)
    : resultados

  const ciudades = CIUDADES_POR_PROVINCIA[ubicacion.provincia] || []

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={20} style={{ color: 'var(--text-muted)' }} />
        <input
          type="text"
          value={localQuery}
          onChange={e => handleSearch(e.target.value)}
          placeholder="Buscar producto... ej: Nesquik, Coca Cola, arroz"
          className="input py-3.5 pl-12 pr-4 text-base rounded-2xl"
          autoFocus
          style={{ boxShadow: '0 4px 20px rgba(16,185,129,0.08)' }}
        />
        {cargando && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Location + Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex gap-2 flex-1 min-w-0">
          <select
            value={ubicacion.provincia}
            onChange={e => {
              const p = e.target.value
              cambiarUbicacion(p, CIUDADES_POR_PROVINCIA[p]?.[0] || '')
              if (localQuery) buscar(localQuery, CIUDADES_POR_PROVINCIA[p]?.[0] || '', p)
            }}
            className="input select text-sm py-2 flex-1"
          >
            {PROVINCIAS_AR.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select
            value={ubicacion.ciudad}
            onChange={e => {
              cambiarUbicacion(ubicacion.provincia, e.target.value)
              if (localQuery) buscar(localQuery, e.target.value, ubicacion.provincia)
            }}
            className="input select text-sm py-2 flex-1"
          >
            {ciudades.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button onClick={() => setShowMap(!showMap)} className={`btn btn-sm ${showMap ? 'btn-primary' : 'btn-secondary'}`}>
          <MapPin size={14} /> Mapa
        </button>
        <button onClick={() => setShowFilters(!showFilters)} className="btn btn-secondary btn-sm">
          <SlidersHorizontal size={14} /> Filtros
        </button>
      </div>

      {/* Category Chips */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-4 -mx-1 px-1">
        <button
          onClick={() => setCategoriaFiltro(null)}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
            !categoriaFiltro
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'border-gray-200 text-gray-500 hover:border-gray-300'
          }`}
          style={!categoriaFiltro ? {} : { borderColor: 'var(--border)' }}
        >
          Todos
        </button>
        {CATEGORIAS_PRODUCTO.slice(0, 12).map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategoriaFiltro(categoriaFiltro === cat.id ? null : cat.id)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-all whitespace-nowrap ${
              categoriaFiltro === cat.id
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'text-gray-500 hover:border-gray-300'
            }`}
            style={categoriaFiltro === cat.id ? {} : { borderColor: 'var(--border)' }}
          >
            {cat.emoji} {cat.nombre}
          </button>
        ))}
      </div>

      {/* Map View */}
      {showMap && resultadosFiltrados.length > 0 && (
        <div className="mb-6 animate-fade-in">
          <MapaLocales resultados={resultadosFiltrados} ciudad={ubicacion.ciudad} />
        </div>
      )}

      {/* Results */}
      {error && (
        <div className="mb-4 px-4 py-3 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-600">
          {error}
        </div>
      )}

      {!localQuery || localQuery.length < 2 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-bold font-display mb-2">Buscá un producto</h3>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Escribí al menos 2 caracteres para empezar a buscar
          </p>
        </div>
      ) : resultadosFiltrados.length === 0 && !cargando ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">😔</div>
          <h3 className="text-lg font-bold font-display mb-2">No encontramos "{localQuery}"</h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            Probá con otro nombre o revisá la ortografía
          </p>
          <button onClick={() => navigate('/cargar-precio')} className="btn btn-primary">
            Cargar este producto
          </button>
        </div>
      ) : (
        <div>
          {!cargando && (
            <p className="text-xs px-1 mb-3" style={{ color: 'var(--text-muted)' }}>
              {resultadosFiltrados.length} resultado{resultadosFiltrados.length !== 1 ? 's' : ''} en {ubicacion.ciudad}
            </p>
          )}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {resultadosFiltrados.map((prod, i) => {
              const catInfo = CATEGORIAS_PRODUCTO.find(c => c.id === prod.categoria)
              const tipoInfo = TIPOS_COMERCIO.find(t => t.id === prod.comercio_mejor_tipo)
              return (
                <motion.button
                  key={prod.producto_id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => navigate(`/producto/${prod.producto_id}`)}
                  className="card card-interactive p-4 text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background: 'var(--brand-glow)' }}>
                      {prod.imagen_url
                        ? <img src={prod.imagen_url} alt="" className="w-full h-full object-cover rounded-xl" />
                        : catInfo?.emoji || '📦'
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{prod.nombre}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {prod.marca} {prod.presentacion && `· ${prod.presentacion}`}
                      </p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {prod.precio_min ? (
                          <>
                            <span className="text-lg font-black text-emerald-600">{fmtPrecio(prod.precio_min)}</span>
                            {prod.precio_max > prod.precio_min && (
                              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>— {fmtPrecio(prod.precio_max)}</span>
                            )}
                            {prod.precio_mejor_retornable && (
                              <span className="badge badge-sky">♻️ Ret.</span>
                            )}
                          </>
                        ) : (
                          <span className="text-xs italic" style={{ color: 'var(--text-muted)' }}>Sin precios aún</span>
                        )}
                      </div>
                      {prod.comercio_mejor && (
                        <div className="flex items-center gap-1.5 mt-2 pt-1.5 border-t" style={{ borderColor: 'var(--border)' }}>
                          <span className="text-[11px]">{tipoInfo?.emoji || '🏪'}</span>
                          <p className="text-[11px] truncate" style={{ color: 'var(--text-secondary)' }}>
                            <span className="font-semibold">{prod.comercio_mejor}</span>
                            {prod.comercio_mejor_dir && <span style={{ color: 'var(--text-muted)' }}> · 📍 {prod.comercio_mejor_dir}</span>}
                          </p>
                        </div>
                      )}
                      <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                        {prod.cant_comercios} comercio{prod.cant_comercios !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
