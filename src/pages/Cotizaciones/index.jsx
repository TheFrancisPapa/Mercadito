import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, RefreshCw, ArrowRightLeft, TrendingUp, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCotizaciones, NOMBRES_DOLAR, MONEDAS_CONVERTIR } from '../../hooks/useCotizaciones'
import { fmtPrecio } from '../../data/constants'

export default function Cotizaciones() {
  const navigate = useNavigate()
  const { cotizaciones, cargando, error, ultimaActualizacion, convertir, recargar } = useCotizaciones()
  const [montoInput, setMontoInput] = useState('')
  const [monedaOrigen, setMonedaOrigen] = useState('USD')
  const [tipoDolar, setTipoDolar] = useState('blue')

  const resultado = montoInput ? convertir(montoInput, monedaOrigen, tipoDolar) : null
  const monedaInfo = MONEDAS_CONVERTIR.find(m => m.id === monedaOrigen)

  return (
    <div className="container-app max-w-4xl py-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm font-semibold mb-5 active:scale-95" style={{ color: 'var(--brand)' }}>
        <ArrowLeft size={16} /> Volver
      </button>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold flex items-center gap-3">
              💵 Cotizaciones
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Consultá el valor del dólar y convertí precios al instante
            </p>
          </div>
          <button onClick={recargar} disabled={cargando}
            className="btn btn-secondary btn-sm" style={{ borderRadius: 'var(--radius-full)' }}>
            <RefreshCw size={14} className={cargando ? 'animate-spin' : ''} />
            {cargando ? '' : 'Actualizar'}
          </button>
        </div>

        {ultimaActualizacion && (
          <p className="text-[10px] flex items-center gap-1 mb-4" style={{ color: 'var(--text-muted)' }}>
            <Clock size={10} /> Última actualización: {ultimaActualizacion.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </motion.div>

      {error && (
        <div className="mb-4 px-3 py-2.5 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', color: '#dc2626' }}>{error}</div>
      )}

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Main: Cotizaciones */}
        <div className="lg:col-span-2">
          {/* Dólares */}
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
            🇺🇸 Dólar Estadounidense
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-6">
            {cotizaciones.dolares.map((d, i) => {
              const casa = d.casa?.toLowerCase() || d.nombre?.toLowerCase() || ''
              const info = Object.entries(NOMBRES_DOLAR).find(([key]) => casa.includes(key))?.[1]
              if (!info) return null

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="card p-4 transition-all hover:scale-[1.02]"
                  style={{ boxShadow: 'var(--shadow-sm)' }}
                >
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="text-lg">{info.emoji}</span>
                    <div>
                      <p className="text-xs font-bold">{info.nombre}</p>
                      <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{info.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <p className="text-[9px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>Compra</p>
                      <p className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>{fmtPrecio(d.compra)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>Venta</p>
                      <p className="text-base font-extrabold" style={{ color: info.color }}>{fmtPrecio(d.venta)}</p>
                    </div>
                  </div>
                  {d.fechaActualizacion && (
                    <p className="text-[8px] mt-2 text-right" style={{ color: 'var(--text-muted)' }}>
                      {new Date(d.fechaActualizacion).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Real Brasileño */}
          {cotizaciones.brl && (
            <>
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                🇧🇷 Real Brasileño
              </h3>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-4 mb-6 max-w-xs"
                style={{ boxShadow: 'var(--shadow-sm)' }}
              >
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="text-lg">🇧🇷</span>
                  <div>
                    <p className="text-xs font-bold">Real</p>
                    <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>Cotización oficial</p>
                  </div>
                </div>
                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-[9px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>Compra</p>
                    <p className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>{fmtPrecio(cotizaciones.brl.compra)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>Venta</p>
                    <p className="text-base font-extrabold" style={{ color: '#16a34a' }}>{fmtPrecio(cotizaciones.brl.venta)}</p>
                  </div>
                </div>
              </motion.div>
            </>
          )}

          {/* Euro */}
          {cotizaciones.eur && (
            <>
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                🇪🇺 Euro
              </h3>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-4 mb-6 max-w-xs"
                style={{ boxShadow: 'var(--shadow-sm)' }}
              >
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="text-lg">🇪🇺</span>
                  <div>
                    <p className="text-xs font-bold">Euro</p>
                    <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>Cotización oficial</p>
                  </div>
                </div>
                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-[9px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>Compra</p>
                    <p className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>{fmtPrecio(cotizaciones.eur.compra)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>Venta</p>
                    <p className="text-base font-extrabold" style={{ color: '#3b82f6' }}>{fmtPrecio(cotizaciones.eur.venta)}</p>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>

        {/* Sidebar: Conversor */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-5 sticky top-20"
            style={{ boxShadow: 'var(--shadow-lg)' }}
          >
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
              <ArrowRightLeft size={16} style={{ color: 'var(--brand)' }} />
              Conversor rápido
            </h3>

            {/* Moneda origen */}
            <div className="mb-3">
              <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Moneda</label>
              <div className="flex gap-1.5">
                {MONEDAS_CONVERTIR.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setMonedaOrigen(m.id)}
                    className="flex-1 px-2 py-2 rounded-xl text-[11px] font-bold text-center transition-all"
                    style={monedaOrigen === m.id
                      ? { border: '2px solid var(--brand)', background: 'var(--brand-glow)', color: 'var(--brand-dark)' }
                      : { border: '1.5px solid var(--border)', color: 'var(--text-secondary)' }
                    }
                  >
                    {m.emoji} {m.id}
                  </button>
                ))}
              </div>
            </div>

            {/* Tipo de dólar (solo si es USD) */}
            {monedaOrigen === 'USD' && (
              <div className="mb-3">
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Tipo de dólar</label>
                <select
                  value={tipoDolar}
                  onChange={e => setTipoDolar(e.target.value)}
                  className="input select text-xs"
                >
                  {Object.entries(NOMBRES_DOLAR).map(([key, info]) => (
                    <option key={key} value={key}>{info.emoji} {info.nombre}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Monto */}
            <div className="mb-4">
              <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Monto en {monedaInfo?.nombre || monedaOrigen}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold" style={{ color: 'var(--text-muted)' }}>
                  {monedaInfo?.simbolo || '$'}
                </span>
                <input
                  type="number"
                  value={montoInput}
                  onChange={e => setMontoInput(e.target.value)}
                  className="input pl-12 text-lg font-extrabold py-3"
                  placeholder="0.00"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            {/* Resultado */}
            <div className="rounded-xl p-4 text-center" style={{ background: 'var(--brand-glow)' }}>
              <p className="text-[10px] uppercase font-bold tracking-wider mb-1" style={{ color: 'var(--brand-dark)' }}>
                Equivale a
              </p>
              <p className="text-2xl font-extrabold font-display" style={{ color: 'var(--brand-dark)' }}>
                {resultado !== null ? fmtPrecio(resultado) : '—'}
              </p>
              <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                Pesos Argentinos 🇦🇷
              </p>
            </div>

            {montoInput && resultado !== null && (
              <div className="mt-3 p-3 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  {monedaInfo?.simbolo}{montoInput} {monedaOrigen} = {fmtPrecio(resultado)} ARS
                </p>
              </div>
            )}

            <p className="text-[9px] text-center mt-3" style={{ color: 'var(--text-muted)' }}>
              Datos de <a href="https://dolarapi.com" target="_blank" rel="noopener noreferrer" className="underline">DolarAPI.com</a> · Se actualizan cada 5 min
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
