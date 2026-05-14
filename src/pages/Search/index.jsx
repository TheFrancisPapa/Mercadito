import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, MapPin, SlidersHorizontal, Trophy } from 'lucide-react'
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

  useEffect(() => {
    const q = searchParams.get('q')
    const cat = searchParams.get('cat')
    if (q) { setLocalQuery(q); buscar(q, ubicacion.ciudad, ubicacion.provincia) }
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
    <div className="container-app py-5 md:py-6">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={20} style={{ color: 'var(--brand)' }} />
        <input
          type="text"
          value={localQuery}
          onChange={e => handleSearch(e.target.value)}
          placeholder="Buscar producto... ej: Nesquik, Coca Cola, arroz"
          className="input py-3.5 pl-12 pr-4 text-base"
          autoFocus
          style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)', borderColor: 'var(--border)' }}
        />
        {cargando && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--brand)' }} />
          </div>
        )}
      </div>

      {/* Location + Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex gap-2 flex-1 min-w-0">
          <select value={ubicacion.provincia} onChange={e => { const p = e.target.value; cambiarUbicacion(p, CIUDADES_POR_PROVINCIA[p]?.[0] || ''); if (localQuery) buscar(localQuery, CIUDADES_POR_PROVINCIA[p]?.[0] || '', p) }} className="input select text-sm py-2 flex-1">
            {PROVINCIAS_AR.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={ubicacion.ciudad} onChange={e => { cambiarUbicacion(ubicacion.provincia, e.target.value); if (localQuery) buscar(localQuery, e.target.value, ubicacion.provincia) }} className="input select text-sm py-2 flex-1">
            {ciudades.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button onClick={() => setShowMap(!showMap)} className={`btn btn-sm ${showMap ? 'btn-primary' : 'btn-secondary'}`}>
          <MapPin size={14} /> Mapa
        </button>
      </div>

      {/* Category Chips */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-5 -mx-1 px-1">
        <button onClick={() => setCategoriaFiltro(null)}
          className="flex-shrink-0 px-3.5 py-2 rounded-full text-xs font-bold border transition-all"
          style={!categoriaFiltro ? { background: 'var(--brand-glow)', borderColor: 'var(--brand)', color: 'var(--brand-dark)' } : { borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
          Todos
        </button>
        {CATEGORIAS_PRODUCTO.slice(0, 12).map(cat => (
          <button key={cat.id} onClick={() => setCategoriaFiltro(categoriaFiltro === cat.id ? null : cat.id)}
            className="flex-shrink-0 px-3.5 py-2 rounded-full text-xs font-bold border transition-all whitespace-nowrap"
            style={categoriaFiltro === cat.id ? { background: 'var(--brand-glow)', borderColor: 'var(--brand)', color: 'var(--brand-dark)' } : { borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
            {cat.emoji} {cat.nombre}
          </button>
        ))}
      </div>

      {/* Map */}
      {showMap && resultadosFiltrados.length > 0 && (
        <div className="mb-6 animate-fade-in"><MapaLocales resultados={resultadosFiltrados} ciudad={ubicacion.ciudad} /></div>
      )}

      {/* Error */}
      {error && <div className="mb-4 px-4 py-3 rounded-2xl text-sm" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', color: '#dc2626' }}>{error}</div>}

      {/* Results */}
      {!localQuery || localQuery.length < 2 ? (
        <div className="text-center py-16 md:py-24">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-bold font-display mb-2">Buscá un producto</h3>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Escribí al menos 2 caracteres para empezar a buscar</p>
        </div>
      ) : resultadosFiltrados.length === 0 && !cargando ? (
        <div className="text-center py-16 md:py-24">
          <div className="text-5xl mb-4">😔</div>
          <h3 className="text-lg font-bold font-display mb-2">No encontramos "{localQuery}"</h3>
          <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>Probá con otro nombre o revisá la ortografía</p>
          <button onClick={() => navigate('/cargar-precio')} className="btn btn-primary">Cargar este producto</button>
        </div>
      ) : (
        <div>
          {!cargando && (
            <p className="text-xs px-1 mb-3 font-medium" style={{ color: 'var(--text-muted)' }}>
              {resultadosFiltrados.length} resultado{resultadosFiltrados.length !== 1 ? 's' : ''} en {ubicacion.ciudad}
            </p>
          )}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {resultadosFiltrados.map((prod, i) => {
              const catInfo = CATEGORIAS_PRODUCTO.find(c => c.id === prod.categoria)
              const tipoInfo = TIPOS_COMERCIO.find(t => t.id === prod.comercio_mejor_tipo)
              const isBest = i === 0 && prod.precio_min
              return (
                <motion.button
                  key={prod.producto_id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => navigate(`/producto/${prod.producto_id}`)}
                  className={`card card-interactive p-4 text-left ${isBest ? 'price-best' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background: 'var(--brand-glow)' }}>
                      {prod.imagen_url
                        ? <img src={prod.imagen_url} alt="" className="w-full h-full object-cover rounded-xl" />
                        : catInfo?.emoji || '📦'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-bold truncate">{prod.nombre}</p>
                        {isBest && <Trophy size={12} style={{ color: 'var(--accent)', flexShrink: 0 }} />}
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {prod.marca} {prod.presentacion && `· ${prod.presentacion}`}
                      </p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {prod.precio_min ? (
                          <>
                            <span className="text-lg font-extrabold" style={{ color: 'var(--brand)' }}>{fmtPrecio(prod.precio_min)}</span>
                            {prod.precio_max > prod.precio_min && (
                              <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>— {fmtPrecio(prod.precio_max)}</span>
                            )}
                            {prod.precio_mejor_retornable && <span className="badge badge-sky">♻️ Ret.</span>}
                          </>
                        ) : (
                          <span className="text-xs italic" style={{ color: 'var(--text-muted)' }}>Sin precios aún</span>
                        )}
                      </div>
                      {prod.comercio_mejor && (
                        <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                          <span className="text-[11px]">{tipoInfo?.emoji || '🏪'}</span>
                          <p className="text-[11px] truncate" style={{ color: 'var(--text-secondary)' }}>
                            <span className="font-semibold">{prod.comercio_mejor}</span>
                            {prod.comercio_mejor_dir && <span style={{ color: 'var(--text-muted)' }}> · 📍 {prod.comercio_mejor_dir}</span>}
                          </p>
                        </div>
                      )}
                      <p className="text-[10px] mt-1.5" style={{ color: 'var(--text-muted)' }}>
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
