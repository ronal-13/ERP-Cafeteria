import { useState, useEffect } from 'react';
import inventarioService from '../services/inventarioService';

export const useInventario = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await inventarioService.getProductos();
      setProductos(data);
    } catch (err) {
      setError('Error al cargar los productos');
      console.error('Error fetching productos:', err);
    } finally {
      setLoading(false);
    }
  };

  const editarProducto = async (id, patch) => {
    try {
      setLoading(true);
      const producto = await inventarioService.editarProducto(id, patch);
      setProductos(prev => prev.map(p => p.id === id ? producto : p));
      return producto;
    } catch (err) {
      setError('Error al editar el producto');
      console.error('Error editing producto:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const eliminarProducto = async (id) => {
    try {
      setLoading(true);
      await inventarioService.eliminarProducto(id);
      setProductos(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err) {
      setError('Error al eliminar el producto');
      console.error('Error deleting producto:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const ajustarInventarioSet = async (id, nuevoStock, responsable, motivo) => {
    try {
      setLoading(true);
      const prod = await inventarioService.ajustarInventarioSet(id, nuevoStock, responsable, motivo);
      setProductos(prev => prev.map(p => p.id === id ? prod : p));
      return prod;
    } catch (err) {
      setError('Error al ajustar inventario');
      console.error('Error adjust inventario:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const crearProducto = async (producto) => {
    try {
      setLoading(true);
      const nuevoProducto = await inventarioService.crearProducto(producto);
      setProductos(prev => [...prev, nuevoProducto]);
      return nuevoProducto;
    } catch (err) {
      setError('Error al crear el producto');
      console.error('Error creating producto:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const actualizarStock = async (id, cantidad, tipo) => {
    try {
      setLoading(true);
      const producto = await inventarioService.actualizarStock(id, cantidad, tipo);
      setProductos(prev => prev.map(p => p.id === id ? producto : p));
      return producto;
    } catch (err) {
      setError('Error al actualizar el stock');
      console.error('Error updating stock:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  return {
    productos,
    loading,
    error,
    crearProducto,
    editarProducto,
    eliminarProducto,
    actualizarStock,
    ajustarInventarioSet,
    refetch: fetchProductos
  };
};

export const useInsumos = () => {
  const [insumos, setInsumos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInsumos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await inventarioService.getInsumos();
      setInsumos(data);
    } catch (err) {
      setError('Error al cargar los insumos');
      console.error('Error fetching insumos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsumos();
  }, []);

  return {
    insumos,
    loading,
    error,
    refetch: fetchInsumos
  };
};

export const useProveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProveedores = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await inventarioService.getProveedores();
      setProveedores(data);
    } catch (err) {
      setError('Error al cargar los proveedores');
      console.error('Error fetching proveedores:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  return {
    proveedores,
    loading,
    error,
    refetch: fetchProveedores
  };
};

export const useMovimientos = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMovimientos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await inventarioService.getMovimientos();
      setMovimientos(data);
    } catch (err) {
      setError('Error al cargar los movimientos');
      console.error('Error fetching movimientos:', err);
    } finally {
      setLoading(false);
    }
  };

  const registrarMovimiento = async (movimiento) => {
    try {
      setLoading(true);
      const nuevoMovimiento = await inventarioService.registrarMovimiento(movimiento);
      setMovimientos(prev => [...prev, nuevoMovimiento]);
      return nuevoMovimiento;
    } catch (err) {
      setError('Error al registrar el movimiento');
      console.error('Error registering movimiento:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getMovimientosByProducto = async (nombre) => {
    try {
      setLoading(true);
      const data = await inventarioService.getMovimientosByProducto(nombre);
      return data;
    } catch (err) {
      setError('Error al obtener movimientos del producto');
      console.error('Error fetching movimientos by producto:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const calcularConsumo = async (periodo = 'dia') => {
    try {
      setLoading(true);
      const data = await inventarioService.calcularConsumo(periodo);
      return data;
    } catch (err) {
      setError('Error al calcular consumo');
      console.error('Error calcular consumo:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovimientos();
  }, []);

  return {
    movimientos,
    loading,
    error,
    registrarMovimiento,
    getMovimientosByProducto,
    calcularConsumo,
    refetch: fetchMovimientos
  };
};

export const useAlertasStock = () => {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAlertas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await inventarioService.getAlertasStock();
      setAlertas(data);
    } catch (err) {
      setError('Error al cargar las alertas');
      console.error('Error fetching alertas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertas();
  }, []);

  return {
    alertas,
    loading,
    error,
    refetch: fetchAlertas
  };
};