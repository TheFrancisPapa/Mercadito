import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, Search, Plus, Store, Tag, MapPin } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useUbicacion, useComercios, crearProducto, crearComercio, reportarPrecio, buscarProductoExistente } from '../../hooks/useMercado'
import { CATEGORIAS_PRODUCTO, TIPOS_COMERCIO, CANALES_COMPRA, PROVINCIAS_AR, CIUDADES_POR_PROVINCIA, fmtPrecio } from '../../data/constants'

const STEPS = ['producto', 'comercio', 'precio']

export default function AddPrice() {
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const { ubicacion } = useUbicacion()

  const [step, setStep] = useState(0)
  const [guardando, setGuardando] = useState(false)
  const [exito, setExito] = useState(false)
  const [error, setError] = useState('')

  // Step 1: Producto
  const [productoBusqueda, setProductoBusqueda] = useState('')
  const [productosSugeridos, setProductosSugeridos] = useState([])
  const [productoSeleccionado, setProductoSeleccionado] = useState(null)
  const [esNuevoProducto, setEsNuevoProducto] = useState(false)
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', marca: '', categoria: 'otro', presentacion: '' })

  // Step 2: Comercio
  const { comercios } = useComercios(ubicacion.ciudad, ubicacion.provincia)
  const [comercioBusqueda, setComercioBusqueda] = useState('')
  const [comercioSeleccionado, setComercioSeleccionado] = useState(null)
  const [esNuevoComercio, setEsNuevoComercio] = useState(false)
  const [nuevoComercio, setNuevoComercio] = useState({ nombre: '', tipo: 'otro', direccion: '', ciudad: ubicacion.ciudad, provincia: ubicacion.provincia })

  // Step 3: Precio
  const [precioInput, setPrecioInput] = useState('')
  const [enOferta, setEnOferta] = useState(false)
  const [precioOferta, setPrecioOferta] = useState('')
  const [esRetornable, setEsRetornable] = useState(false)
  const [canal, setCanal] = useState('local')

  // Auth guard
  useEffect(() => {
    if (!usuario) navigate('/login')
  }, [usuario, navigate])

  // Search products as you type
  useEffect(() => {
    const t = setTimeout(async () => {
      if (productoBusqueda.trim().length >= 2) {
        const resultados = await buscarProductoExistente(productoBusqueda)
        setProductosSugeridos(resultados)
      } else {
        setProductosSugeridos([])
      }
    }, 300)
    return () => clearTimeout(t)
  }, [productoBusqueda])

  const comerciosFiltrados = comercioBusqueda
    ? comercios.filter(c => c.nombre.toLowerCase().includes(comercioBusqueda.toLowerCase()))
    : comercios

  const handleSubmit = async () => {
    setError('')
    setGuardando(true)
    try {
      // Step 1: Get or create product
      let productoId = productoSeleccionado?.id
      if (esNuevoProducto) {
        const nuevo = await crearProducto(nuevoProducto)
        productoId = nuevo.id
      }
      if (!productoId) throw new Error('Seleccioná un producto')

      // Step 2: Get or create store
      let comercioId = comercioSeleccionado?.id
      if (esNuevoComercio) {
        const nuevo = await crearComercio(nuevoComercio)
        comercioId = nuevo.id
      }
      if (!comercioId) throw new Error('Seleccioná un comercio')

      // Step 3: Submit price
      if (!precioInput || isNaN(precioInput) || Number(precioInput) <= 0) throw new Error('Ingresá un precio válido')

      await reportarPrecio({
        productoId,
        comercioId,
        precio: precioInput,
        enOferta,
        precioOferta: enOferta ? precioOferta : null,
        esRetornable,
        canal,
      })

      setExito(true)
    } catch (e) {
      setError(e.message || 'Error al guardar')
    } finally { setGuardando(false) }
  }

  if (!usuario) return null

  if (exito) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-sm">
          <div className="text-5xl mb-4 animate-float">🎉</div>
          <h2 className="font-display text-xl font-bold mb-2 gradient-text">¡Precio cargado!</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            Gracias por contribuir a la comunidad. Tu aporte ayuda a todos a comprar mejor.
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { setExito(false); setStep(0); setProductoSeleccionado(null); setComercioSeleccionado(null); setPrecioInput('') }} className="btn btn-secondary">
              Cargar otro
            </button>
            <button onClick={() => navigate('/')} className="btn btn-primary">
              Ir al inicio
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <button onClick={() => step > 0 ? setStep(step - 1) : navigate(-1)} className="flex items-center gap-1.5 text-sm text-emerald-600 font-semibold mb-4 hover:text-emerald-700 transition-colors active:scale-95">
        <ArrowLeft size={16} /> {step > 0 ? 'Paso anterior' : 'Volver'}
      </button>

      {/* Steps Indicator */}
      <div className="flex items-center gap-2 mb-6">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1 flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              i < step ? 'bg-emerald-500 text-white' :
              i === step ? 'bg-emerald-100 text-emerald-700 animate-pulse-glow' :
              'text-gray-400'
            }`} style={i > step ? { background: 'var(--bg-secondary)' } : {}}>
              {i < step ? <Check size={14} /> : i + 1}
            </div>
            {i < 2 && <div className="flex-1 h-0.5 rounded" style={{ background: i < step ? 'var(--brand)' : 'var(--border)' }} />}
          </div>
        ))}
      </div>

      <h2 className="font-display text-lg font-bold mb-1">
        {step === 0 && '📦 Seleccioná el producto'}
        {step === 1 && '🏪 ¿Dónde lo encontraste?'}
        {step === 2 && '💰 ¿A cuánto está?'}
      </h2>
      <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
        {step === 0 && 'Buscá entre los existentes o creá uno nuevo'}
        {step === 1 && 'Elegí el comercio o agregá uno nuevo'}
        {step === 2 && 'Indicá el precio, canal y detalles'}
      </p>

      {error && <div className="mb-4 px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>}

      {/* Step 1: Producto */}
      {step === 0 && (
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
          {!esNuevoProducto ? (
            <>
              <div className="relative mb-3">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  value={productoBusqueda}
                  onChange={e => { setProductoBusqueda(e.target.value); setProductoSeleccionado(null) }}
                  placeholder="Buscar producto... ej: Coca Cola, Yerba, Arroz"
                  className="input pl-10"
                  autoFocus
                />
              </div>

              {productosSugeridos.length > 0 && (
                <div className="flex flex-col gap-1 mb-4 max-h-60 overflow-y-auto">
                  {productosSugeridos.map(p => {
                    const catInfo = CATEGORIAS_PRODUCTO.find(c => c.id === p.categoria)
                    return (
                      <button
                        key={p.id}
                        onClick={() => { setProductoSeleccionado(p); setProductoBusqueda(p.nombre) }}
                        className={`p-3 rounded-xl text-left flex items-center gap-3 transition-all ${
                          productoSeleccionado?.id === p.id ? 'border-2 border-emerald-400 bg-emerald-50' : 'hover:bg-gray-50'
                        }`}
                        style={productoSeleccionado?.id !== p.id ? { background: 'var(--bg-secondary)' } : {}}
                      >
                        <span className="text-lg">{catInfo?.emoji || '📦'}</span>
                        <div>
                          <p className="text-sm font-bold">{p.nombre}</p>
                          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{p.marca} {p.presentacion && `· ${p.presentacion}`}</p>
                        </div>
                        {productoSeleccionado?.id === p.id && <Check size={16} className="ml-auto text-emerald-600" />}
                      </button>
                    )
                  })}
                </div>
              )}

              {productoBusqueda.length >= 2 && (
                <button onClick={() => { setEsNuevoProducto(true); setNuevoProducto(p => ({ ...p, nombre: productoBusqueda })) }} className="btn btn-secondary w-full">
                  <Plus size={16} /> Crear producto nuevo: "{productoBusqueda}"
                </button>
              )}

              {productoSeleccionado && (
                <button onClick={() => setStep(1)} className="btn btn-primary w-full mt-3 btn-lg">
                  Siguiente →
                </button>
              )}
            </>
          ) : (
            <>
              <div className="card p-4 flex flex-col gap-3">
                <div>
                  <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--text-secondary)' }}>Nombre del producto *</label>
                  <input type="text" value={nuevoProducto.nombre} onChange={e => setNuevoProducto(p => ({ ...p, nombre: e.target.value }))} className="input" placeholder="ej: Coca-Cola" required />
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--text-secondary)' }}>Marca *</label>
                  <input type="text" value={nuevoProducto.marca} onChange={e => setNuevoProducto(p => ({ ...p, marca: e.target.value }))} className="input" placeholder="ej: Coca-Cola" />
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--text-secondary)' }}>Categoría *</label>
                  <select value={nuevoProducto.categoria} onChange={e => setNuevoProducto(p => ({ ...p, categoria: e.target.value }))} className="input select">
                    {CATEGORIAS_PRODUCTO.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.nombre}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--text-secondary)' }}>Presentación</label>
                  <input type="text" value={nuevoProducto.presentacion} onChange={e => setNuevoProducto(p => ({ ...p, presentacion: e.target.value }))} className="input" placeholder="ej: 2.25L, 500g, Pack x6" />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => setEsNuevoProducto(false)} className="btn btn-secondary flex-1">Cancelar</button>
                <button onClick={() => { if (nuevoProducto.nombre.trim()) setStep(1) }} className="btn btn-primary flex-1" disabled={!nuevoProducto.nombre.trim()}>Siguiente →</button>
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* Step 2: Comercio */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
          {!esNuevoComercio ? (
            <>
              <div className="relative mb-3">
                <Store size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input type="text" value={comercioBusqueda} onChange={e => { setComercioBusqueda(e.target.value); setComercioSeleccionado(null) }} placeholder="Buscar comercio..." className="input pl-10" autoFocus />
              </div>

              <div className="flex flex-col gap-1 mb-4 max-h-52 overflow-y-auto">
                {comerciosFiltrados.map(c => {
                  const tipoInfo = TIPOS_COMERCIO.find(t => t.id === c.tipo)
                  return (
                    <button
                      key={c.id}
                      onClick={() => setComercioSeleccionado(c)}
                      className={`p-3 rounded-xl text-left flex items-center gap-3 transition-all ${
                        comercioSeleccionado?.id === c.id ? 'border-2 border-emerald-400 bg-emerald-50' : ''
                      }`}
                      style={comercioSeleccionado?.id !== c.id ? { background: 'var(--bg-secondary)' } : {}}
                    >
                      <span className="text-lg">{tipoInfo?.emoji || '🏪'}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold flex items-center gap-1">
                          {c.nombre}
                          {c.verificado && <span className="badge badge-brand text-[8px] ml-1">✓</span>}
                        </p>
                        <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{c.direccion}</p>
                      </div>
                      {comercioSeleccionado?.id === c.id && <Check size={16} className="text-emerald-600 flex-shrink-0" />}
                    </button>
                  )
                })}
                {comerciosFiltrados.length === 0 && comercioBusqueda && (
                  <p className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>No se encontraron comercios</p>
                )}
              </div>

              <button onClick={() => { setEsNuevoComercio(true); setNuevoComercio(c => ({ ...c, nombre: comercioBusqueda })) }} className="btn btn-secondary w-full">
                <Plus size={16} /> Agregar comercio nuevo
              </button>

              {comercioSeleccionado && (
                <button onClick={() => setStep(2)} className="btn btn-primary w-full mt-3 btn-lg">
                  Siguiente →
                </button>
              )}
            </>
          ) : (
            <>
              <div className="card p-4 flex flex-col gap-3">
                <div>
                  <label className="text-xs font-semibold mb-1 block">Nombre del comercio *</label>
                  <input type="text" value={nuevoComercio.nombre} onChange={e => setNuevoComercio(c => ({ ...c, nombre: e.target.value }))} className="input" placeholder="ej: Supermercado Norte" />
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1 block">Tipo de comercio *</label>
                  <select value={nuevoComercio.tipo} onChange={e => setNuevoComercio(c => ({ ...c, tipo: e.target.value }))} className="input select">
                    {TIPOS_COMERCIO.map(t => <option key={t.id} value={t.id}>{t.emoji} {t.nombre}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1 block">Dirección</label>
                  <input type="text" value={nuevoComercio.direccion} onChange={e => setNuevoComercio(c => ({ ...c, direccion: e.target.value }))} className="input" placeholder="ej: Av. San Martín 1234" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold mb-1 block">Provincia *</label>
                    <select value={nuevoComercio.provincia} onChange={e => setNuevoComercio(c => ({ ...c, provincia: e.target.value, ciudad: CIUDADES_POR_PROVINCIA[e.target.value]?.[0] || '' }))} className="input select text-xs">
                      {PROVINCIAS_AR.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold mb-1 block">Ciudad *</label>
                    <select value={nuevoComercio.ciudad} onChange={e => setNuevoComercio(c => ({ ...c, ciudad: e.target.value }))} className="input select text-xs">
                      {(CIUDADES_POR_PROVINCIA[nuevoComercio.provincia] || []).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => setEsNuevoComercio(false)} className="btn btn-secondary flex-1">Cancelar</button>
                <button onClick={() => { if (nuevoComercio.nombre.trim()) setStep(2) }} className="btn btn-primary flex-1" disabled={!nuevoComercio.nombre.trim()}>Siguiente →</button>
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* Step 3: Precio */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
          {/* Summary */}
          <div className="card p-3 mb-4" style={{ background: 'var(--bg-secondary)' }}>
            <p className="text-xs font-bold">📦 {productoSeleccionado?.nombre || nuevoProducto.nombre}</p>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              🏪 {comercioSeleccionado?.nombre || nuevoComercio.nombre}
              {(comercioSeleccionado?.direccion || nuevoComercio.direccion) && ` · 📍 ${comercioSeleccionado?.direccion || nuevoComercio.direccion}`}
            </p>
          </div>

          <div className="card p-4 flex flex-col gap-4">
            {/* Canal */}
            <div>
              <label className="text-xs font-semibold mb-2 block">📡 Canal de compra</label>
              <div className="grid grid-cols-2 gap-2">
                {CANALES_COMPRA.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setCanal(c.id)}
                    className={`p-2.5 rounded-xl text-xs font-bold text-center transition-all ${canal === c.id ? 'border-2 border-emerald-400 bg-emerald-50 text-emerald-700' : 'border'}`}
                    style={canal !== c.id ? { borderColor: 'var(--border)' } : {}}
                  >
                    {c.emoji} {c.nombre}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="text-xs font-semibold mb-1.5 block">💰 Precio *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-bold" style={{ color: 'var(--text-muted)' }}>$</span>
                <input type="number" value={precioInput} onChange={e => setPrecioInput(e.target.value)} className="input pl-9 text-xl font-black py-3" placeholder="0.00" inputMode="decimal" step="0.01" min="0" autoFocus />
              </div>
            </div>

            {/* Toggle options */}
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className={`w-11 h-6 rounded-full relative transition-colors ${enOferta ? 'bg-emerald-500' : ''}`} style={!enOferta ? { background: 'var(--border)' } : {}} onClick={() => setEnOferta(!enOferta)}>
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${enOferta ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
                </div>
                <div>
                  <span className="text-sm font-bold">🔥 En oferta</span>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Tiene un precio promocional</p>
                </div>
              </label>
              {enOferta && (
                <div className="animate-fade-in">
                  <label className="text-xs font-semibold mb-1 block">Precio de oferta</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold" style={{ color: 'var(--text-muted)' }}>$</span>
                    <input type="number" value={precioOferta} onChange={e => setPrecioOferta(e.target.value)} className="input pl-8 text-base font-bold py-2" placeholder="0.00" inputMode="decimal" step="0.01" min="0" />
                  </div>
                </div>
              )}

              <label className="flex items-center gap-3 cursor-pointer">
                <div className={`w-11 h-6 rounded-full relative transition-colors ${esRetornable ? 'bg-emerald-500' : ''}`} style={!esRetornable ? { background: 'var(--border)' } : {}} onClick={() => setEsRetornable(!esRetornable)}>
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${esRetornable ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
                </div>
                <div>
                  <span className="text-sm font-bold">♻️ Envase retornable</span>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>El precio es con envase retornable</p>
                </div>
              </label>
            </div>
          </div>

          <button onClick={handleSubmit} disabled={guardando || !precioInput} className="btn btn-primary w-full mt-4 btn-lg">
            {guardando ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '✓ Cargar precio'}
          </button>
        </motion.div>
      )}
    </div>
  )
}
