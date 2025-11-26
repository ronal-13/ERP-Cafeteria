import { useState, useEffect } from 'react';
import ventasService from '../services/ventasService';

export const useVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVentas = async (filtros = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ventasService.getVentas(filtros);
      setVentas(data);
    } catch (err) {
      setError('Error al cargar las ventas');
      console.error('Error fetching ventas:', err);
    } finally {
      setLoading(false);
    }
  };

  const crearVenta = async (venta) => {
    try {
      setLoading(true);
      const nuevaVenta = await ventasService.crearVenta(venta);
      setVentas(prev => [...prev, nuevaVenta]);
      return nuevaVenta;
    } catch (err) {
      setError('Error al crear la venta');
      console.error('Error creating venta:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const actualizarVenta = async (id, ventaActualizada) => {
    try {
      setLoading(true);
      const venta = await ventasService.actualizarVenta(id, ventaActualizada);
      setVentas(prev => prev.map(v => v.id === id ? venta : v));
      return venta;
    } catch (err) {
      setError('Error al actualizar la venta');
      console.error('Error updating venta:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const eliminarVenta = async (id) => {
    try {
      setLoading(true);
      await ventasService.eliminarVenta(id);
      setVentas(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      setError('Error al eliminar la venta');
      console.error('Error deleting venta:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const anularVenta = async (id, motivo = '') => {
    try {
      setLoading(true);
      const venta = await ventasService.anularVenta(id, motivo);
      setVentas(prev => prev.map(v => v.id === id ? venta : v));
      return venta;
    } catch (err) {
      setError('Error al anular la venta');
      console.error('Error annulling venta:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generarPDF = async (id) => {
    try {
      setLoading(true);
      return await ventasService.generarPDF(id);
    } catch (err) {
      setError('Error al generar PDF');
      console.error('Error generating PDF:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const enviarComprobanteEmail = async (id, email) => {
    try {
      setLoading(true);
      return await ventasService.enviarComprobanteEmail(id, email);
    } catch (err) {
      setError('Error al enviar comprobante');
      console.error('Error sending email:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registrarImpresion = async (id, opciones = {}) => {
    try {
      setLoading(true);
      return await ventasService.registrarImpresion(id, opciones);
    } catch (err) {
      setError('Error al registrar impresión');
      console.error('Error registrar impresion:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVentas();
  }, []);

  return {
    ventas,
    loading,
    error,
    crearVenta,
    actualizarVenta,
    eliminarVenta,
    anularVenta,
    generarPDF,
    enviarComprobanteEmail,
    registrarImpresion,
    refetch: fetchVentas
  };
};

export const useClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ventasService.getClientes();
      setClientes(data);
    } catch (err) {
      setError('Error al cargar los clientes');
      console.error('Error fetching clientes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  return {
    clientes,
    loading,
    error,
    refetch: fetchClientes
  };
};

export const useComprobantes = () => {
  const [comprobantes, setComprobantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchComprobantes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ventasService.getComprobantes();
      setComprobantes(data);
    } catch (err) {
      setError('Error al cargar los comprobantes');
      console.error('Error fetching comprobantes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComprobantes();
  }, []);

  return {
    comprobantes,
    loading,
    error,
    refetch: fetchComprobantes
  };
};
