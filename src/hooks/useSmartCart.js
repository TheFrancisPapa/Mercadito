import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const CART_STORAGE_KEY = 'ahorrito_smart_cart';

export function useSmartCart() {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error loading cart', e);
    }
    return [];
  });
  
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addItem = useCallback((producto) => {
    setCartItems(prev => {
      const exists = prev.find(item => item.producto_id === producto.id);
      if (exists) {
        return prev.map(item => 
          item.producto_id === producto.id 
            ? { ...item, cantidad: item.cantidad + 1 } 
            : item
        );
      }
      return [...prev, { 
        producto_id: producto.id, 
        cantidad: 1, 
        nombre: producto.nombre,
        marca: producto.marca,
        presentacion: producto.presentacion,
        imagen_url: producto.imagen_url
      }];
    });
  }, []);

  const removeItem = useCallback((producto_id) => {
    setCartItems(prev => prev.filter(item => item.producto_id !== producto_id));
  }, []);

  const updateQuantity = useCallback((producto_id, cantidad) => {
    if (cantidad < 1) return;
    setCartItems(prev => prev.map(item => 
      item.producto_id === producto_id 
        ? { ...item, cantidad } 
        : item
    ));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setOptimizationResult(null);
  }, []);

  const optimizeCart = useCallback(async (ciudad, provincia) => {
    if (cartItems.length === 0) return;
    setIsOptimizing(true);
    setError(null);
    
    try {
      // Formatear items para el RPC
      const payloadItems = cartItems.map(item => ({
        producto_id: item.producto_id,
        cantidad: item.cantidad
      }));

      const { data, error: rpcError } = await supabase.rpc('optimizar_carrito', {
        p_items: payloadItems,
        p_ciudad: ciudad,
        p_provincia: provincia
      });

      if (rpcError) throw rpcError;
      
      setOptimizationResult(data);
    } catch (e) {
      console.error('Error optimizando carrito:', e);
      setError('Hubo un error al optimizar tu carrito. Inténtalo de nuevo.');
    } finally {
      setIsOptimizing(false);
    }
  }, [cartItems]);

  return {
    cartItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    optimizeCart,
    optimizationResult,
    isOptimizing,
    error,
    totalItems: cartItems.reduce((acc, item) => acc + item.cantidad, 0)
  };
}
