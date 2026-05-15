import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUbicacion } from '../../hooks/useMercado';
import { useSmartCart } from '../../hooks/useSmartCart';
import { fmtPrecio } from '../../data/constants';

export default function SmartCart() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { ubicacion } = useUbicacion();
  const { 
    cartItems, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    optimizeCart, 
    optimizationResult, 
    isOptimizing, 
    error 
  } = useSmartCart();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl p-8 text-center shadow-xl border border-gray-100 dark:border-gray-700">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
            🔒
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ahorrito AI Optimizer</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Esta es una herramienta premium gratuita para usuarios registrados. Permite encontrar la combinación exacta de comercios para que gastes lo menos posible en toda tu lista.
          </p>
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/login')}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              Iniciar Sesión
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="w-full py-4 bg-white dark:bg-gray-800 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold rounded-2xl hover:bg-emerald-50 dark:hover:bg-gray-700 transition-colors active:scale-95"
            >
              Crear Cuenta Gratis
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 transition-colors">
      <div className="bg-gradient-to-br from-emerald-500 to-teal-700 pt-16 pb-12 px-4 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              ✨
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Ahorrito AI</h1>
          </div>
          <p className="text-emerald-50 text-lg max-w-xl font-medium">
            Armá tu lista y nuestro algoritmo encontrará en qué comercio (o combinación) te sale más barato comprar todo.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-6 relative z-20">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 md:p-8">
          
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-50">🛒</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Tu lista está vacía</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Buscá productos en el Inicio y tocala opción "Agregar a la lista".</p>
              <button 
                onClick={() => navigate('/')}
                className="px-8 py-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold rounded-xl hover:bg-emerald-200 dark:hover:bg-emerald-800/50 transition-colors"
              >
                Explorar Ofertas
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Mi Lista ({cartItems.length} items)
                </h3>
                <button 
                  onClick={clearCart}
                  className="text-sm text-red-500 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Vaciar
                </button>
              </div>

              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.producto_id} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600">
                    {item.imagen_url ? (
                      <img src={item.imagen_url} alt={item.nombre} className="w-16 h-16 object-contain bg-white rounded-xl p-1" />
                    ) : (
                      <div className="w-16 h-16 bg-white dark:bg-gray-600 rounded-xl flex items-center justify-center text-2xl shadow-sm">
                        📦
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 dark:text-white truncate">{item.nombre}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.marca} • {item.presentacion}</p>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-1 shadow-sm">
                      <button 
                        onClick={() => updateQuantity(item.producto_id, item.cantidad - 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        -
                      </button>
                      <span className="w-4 text-center font-bold text-gray-900 dark:text-white">{item.cantidad}</span>
                      <button 
                        onClick={() => updateQuantity(item.producto_id, item.cantidad + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        +
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item.producto_id)}
                      className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-6">
                <button
                  onClick={() => optimizeCart(ubicacion.ciudad, ubicacion.provincia)}
                  disabled={isOptimizing}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-3 text-lg transition-transform active:scale-95 disabled:opacity-70 disabled:active:scale-100"
                >
                  {isOptimizing ? (
                    <>
                      <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Optimizando compras...
                    </>
                  ) : (
                    <>
                      <span>✨</span>
                      Ahorrito AI: Optimizar Compra
                    </>
                  )}
                </button>
                {error && <p className="text-red-500 text-sm mt-3 text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">{error}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Resultados de la optimización */}
        {optimizationResult && (
          <div className="mt-8 space-y-8 animate-fade-in-up">
            
            {/* Mejor Combinación */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border-2 border-emerald-100 dark:border-emerald-900/50 p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-500 text-white px-4 py-1 rounded-bl-2xl font-bold text-sm">
                MAYOR AHORRO
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <span className="text-emerald-500">🏆</span> La Mejor Combinación
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Si estás dispuesto a visitar varios comercios, esta es la forma de gastar lo menos posible.</p>
              
              {optimizationResult.mejor_combinacion?.length > 0 ? (
                <>
                  <div className="space-y-3 mb-6">
                    {optimizationResult.mejor_combinacion.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white text-sm">
                            {item.cantidad}x producto ID {item.producto_id.substring(0,4)}...
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Comprar en: <span className="font-bold text-emerald-600 dark:text-emerald-400">{item.comercio_nombre}</span></p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-gray-900 dark:text-white">{fmtPrecio(item.subtotal)}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{fmtPrecio(item.precio_unitario)} c/u</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-lg font-bold text-gray-600 dark:text-gray-300">Total Combinado</span>
                    <span className="text-3xl font-black text-emerald-500">
                      {fmtPrecio(optimizationResult.mejor_combinacion.reduce((acc, curr) => acc + curr.subtotal, 0))}
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-gray-500">No encontramos precios para todos tus productos en esta ciudad.</p>
              )}
            </div>

            {/* Mejores Comercios Únicos */}
            {optimizationResult.mejores_comercios?.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 px-2">Mejores Opciones en 1 Solo Comercio</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  {optimizationResult.mejores_comercios.map((comercio, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white">{comercio.comercio_nombre}</h4>
                          <span className="text-xs font-medium px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-md">
                            Tienen {comercio.productos_encontrados} de {cartItems.length} items
                          </span>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total en este comercio</p>
                        <p className="text-2xl font-black text-gray-900 dark:text-white">{fmtPrecio(comercio.total_precio)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
