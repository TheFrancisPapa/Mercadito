// ═══════════════════════════════════════════════════════════════
// AHORRITO — Hook de Cotizaciones (DolarAPI.com)
// ═══════════════════════════════════════════════════════════════
import { useState, useEffect, useCallback } from 'react'

const CACHE_KEY = 'ahorrito_cotizaciones'
const CACHE_TTL = 5 * 60 * 1000 // 5 minutos

function getCached() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (Date.now() - parsed.timestamp < CACHE_TTL) return parsed.data
  } catch {}
  return null
}

function setCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }))
  } catch {}
}

export function useCotizaciones() {
  const [cotizaciones, setCotizaciones] = useState(() => getCached() || { dolares: [], brl: null, eur: null })
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null)

  const cargar = useCallback(async (force = false) => {
    if (!force) {
      const cached = getCached()
      if (cached) {
        setCotizaciones(cached)
        setUltimaActualizacion(new Date())
        return
      }
    }

    setCargando(true)
    setError(null)
    try {
      const [resDolares, resBrl, resEur] = await Promise.allSettled([
        fetch('https://dolarapi.com/v1/dolares').then(r => r.json()),
        fetch('https://dolarapi.com/v1/cotizaciones/brl').then(r => r.json()),
        fetch('https://dolarapi.com/v1/cotizaciones/eur').then(r => r.json()),
      ])

      const data = {
        dolares: resDolares.status === 'fulfilled' ? resDolares.value : [],
        brl: resBrl.status === 'fulfilled' ? resBrl.value : null,
        eur: resEur.status === 'fulfilled' ? resEur.value : null,
      }

      setCotizaciones(data)
      setCache(data)
      setUltimaActualizacion(new Date())
    } catch (e) {
      console.error('Error cargando cotizaciones:', e)
      setError('No se pudieron cargar las cotizaciones')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => { cargar() }, [cargar])

  // Auto-refresh cada 5 minutos
  useEffect(() => {
    const interval = setInterval(() => cargar(true), CACHE_TTL)
    return () => clearInterval(interval)
  }, [cargar])

  // Helper: convertir moneda extranjera a ARS
  const convertir = useCallback((monto, moneda = 'USD', tipoDolar = 'blue') => {
    if (!monto || isNaN(monto)) return null
    if (moneda === 'ARS') return Number(monto)

    if (moneda === 'BRL') {
      if (!cotizaciones.brl?.venta) return null
      return Number(monto) * cotizaciones.brl.venta
    }

    if (moneda === 'EUR') {
      if (!cotizaciones.eur?.venta) return null
      return Number(monto) * cotizaciones.eur.venta
    }

    // USD
    const dolar = cotizaciones.dolares.find(d => {
      const casa = d.casa?.toLowerCase() || d.nombre?.toLowerCase() || ''
      return casa.includes(tipoDolar.toLowerCase())
    })
    if (!dolar?.venta) return null
    return Number(monto) * dolar.venta
  }, [cotizaciones])

  // Obtener cotización específica del dólar blue
  const dolarBlue = cotizaciones.dolares.find(d => {
    const casa = d.casa?.toLowerCase() || d.nombre?.toLowerCase() || ''
    return casa.includes('blue')
  })

  return {
    cotizaciones,
    dolarBlue,
    cargando,
    error,
    ultimaActualizacion,
    convertir,
    recargar: () => cargar(true),
  }
}

// Nombres amigables para los tipos de dólar
export const NOMBRES_DOLAR = {
  blue: { nombre: 'Blue', emoji: '💵', color: '#3b82f6', desc: 'Mercado informal' },
  oficial: { nombre: 'Oficial', emoji: '🏛️', color: '#10b981', desc: 'Banco Nación' },
  bolsa: { nombre: 'MEP/Bolsa', emoji: '📈', color: '#8b5cf6', desc: 'Dólar Bolsa' },
  contadoconliqui: { nombre: 'CCL', emoji: '🌐', color: '#f59e0b', desc: 'Contado con Liquidación' },
  cripto: { nombre: 'Cripto', emoji: '₿', color: '#f97316', desc: 'Bitcoin / USDT' },
  tarjeta: { nombre: 'Tarjeta', emoji: '💳', color: '#ec4899', desc: 'Compras en el exterior' },
  mayorista: { nombre: 'Mayorista', emoji: '🏭', color: '#6b7280', desc: 'Comercio exterior' },
}

export const MONEDAS_CONVERTIR = [
  { id: 'USD', nombre: 'Dólar', emoji: '🇺🇸', simbolo: 'US$' },
  { id: 'BRL', nombre: 'Real Brasileño', emoji: '🇧🇷', simbolo: 'R$' },
  { id: 'EUR', nombre: 'Euro', emoji: '🇪🇺', simbolo: '€' },
]
