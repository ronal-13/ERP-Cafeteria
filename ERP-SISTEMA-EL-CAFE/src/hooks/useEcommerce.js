import { useCallback, useEffect, useMemo, useState } from 'react';
import ecommerceService from '../services/ecommerceService';

// Catálogo web con polling de stock
export const useWebCatalog = ({ pollingMs = 15000 } = {}) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({ q: '', categoria: '', disponibles: true });

  const fetchProductos = useCallback(async (f = undefined) => {
    try {
      setLoading(true);
      setError(null);
      await ecommerceService.sincronizarStockDesdeInventario();
      const filtrosToUse = f !== undefined ? f : filtros;
      const data = await ecommerceService.getProductos(filtrosToUse);
      setProductos(data);
    } catch (err) {
      setError('Error al cargar productos web');
      console.error('getProductos web:', err);
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  useEffect(() => { fetchProductos(); }, [fetchProductos]);

  useEffect(() => {
    const t = setInterval(() => fetchProductos(), pollingMs);
    return () => clearInterval(t);
  }, [pollingMs, fetchProductos]);

  return { productos, loading, error, filtros, setFiltros, refetch: () => fetchProductos(filtros) };
};

// Carrito
export const useCart = () => {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('web_cart_items');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch (e) {
      console.error('cart hydrate error:', e);
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem('web_cart_items', JSON.stringify(items));
      const count = items.reduce((acc, i) => acc + Number(i.cantidad || 0), 0);
      window.dispatchEvent(new CustomEvent('web_cart_updated', { detail: { count } }));
    } catch (e) {
      console.error('cart persist error:', e);
    }
  }, [items, hydrated]);

  const addItem = (p, qty = 1) => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.id === p.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], cantidad: copy[idx].cantidad + qty };
        return copy;
      }
      return [...prev, { id: p.id, sku: p.sku, nombre: p.nombre, precio: p.precio, cantidad: qty }];
    });
  };

  const updateQty = (id, cantidad) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, cantidad: Number(cantidad) } : i));
  };

  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id));
  const clear = () => setItems([]);

  const subtotal = useMemo(() => items.reduce((acc, i) => acc + i.precio * i.cantidad, 0), [items]);
  const IGV = 0.18;
  const igv = useMemo(() => Math.round(subtotal * IGV * 100) / 100, [subtotal]);
  const total = useMemo(() => Math.round((subtotal + igv) * 100) / 100, [subtotal, igv]);

  return { items, addItem, updateQty, removeItem, clear, subtotal, igv, total };
};

// Checkout
export const useCheckout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const pagarCulqi = async ({ monto, token }) => ecommerceService.pagarCulqi({ monto, token });
  const pagarNiubiz = async ({ monto, tarjeta }) => ecommerceService.pagarNiubiz({ monto, tarjeta });
  const generarYapeQR = async ({ monto }) => ecommerceService.generarYapeQR({ monto });
  const verificarYapePago = async ({ sessionId }) => ecommerceService.verificarYapePago({ sessionId });

  const registrarPedido = async ({ cliente, items, metodoPago, transaccionId }) => {
    try {
      setLoading(true);
      setError(null);
      const pedido = await ecommerceService.registrarPedidoWeb({ cliente, items, metodoPago, transaccionId });
      return pedido;
    } catch (err) {
      setError(err?.message || 'Error al registrar pedido web');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, pagarCulqi, pagarNiubiz, generarYapeQR, verificarYapePago, registrarPedido };
};

// Admin Web
export const useWebAdmin = () => {
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refetchProductos = async () => {
    try {
      setLoading(true);
      await ecommerceService.sincronizarStockDesdeInventario();
      const data = await ecommerceService.getProductos({ disponibles: false });
      setProductos(data);
    } catch (err) {
      setError('Error al cargar productos web');
      console.error('refetchProductos:', err);
    } finally { setLoading(false); }
  };

  const refetchPedidos = async (f = {}) => {
    try {
      setLoading(true);
      const data = await ecommerceService.getPedidosWeb(f);
      setPedidos(data);
    } catch (err) {
      setError('Error al cargar pedidos web');
      console.error('refetchPedidos:', err);
    } finally { setLoading(false); }
  };

  const crearProductoWeb = async (data) => { const p = await ecommerceService.crearProductoWeb(data); setProductos(prev => [...prev, p]); return p; };
  const editarProductoWeb = async (id, patch) => { const p = await ecommerceService.editarProductoWeb(id, patch); setProductos(prev => prev.map(x => x.id === id ? p : x)); return p; };
  const eliminarProductoWeb = async (id) => { await ecommerceService.eliminarProductoWeb(id); setProductos(prev => prev.filter(x => x.id !== id)); return true; };

  useEffect(() => { refetchProductos(); refetchPedidos(); }, []);

  return { productos, pedidos, loading, error, refetchProductos, refetchPedidos, crearProductoWeb, editarProductoWeb, eliminarProductoWeb };
};
