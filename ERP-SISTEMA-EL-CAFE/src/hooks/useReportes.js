import { useState, useEffect } from 'react';
import reportesService from '../services/reportesService';

export const useReportesVentas = (fechaInicio, fechaFin) => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReportes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportesService.getReporteVentas(fechaInicio, fechaFin);
      setReportes(data);
    } catch (err) {
      setError('Error al cargar los reportes de ventas');
      console.error('Error fetching reportes ventas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fechaInicio && fechaFin) {
      fetchReportes();
    }
  }, [fechaInicio, fechaFin]);

  return {
    reportes,
    loading,
    error,
    refetch: fetchReportes
  };
};

export const useReportesInventario = () => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReportes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportesService.getReporteInventario();
      setReportes(data);
    } catch (err) {
      setError('Error al cargar los reportes de inventario');
      console.error('Error fetching reportes inventario:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportes();
  }, []);

  return {
    reportes,
    loading,
    error,
    refetch: fetchReportes
  };
};

export const useReportesProduccion = (fechaInicio, fechaFin) => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReportes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportesService.getReporteProduccion(fechaInicio, fechaFin);
      setReportes(data);
    } catch (err) {
      setError('Error al cargar los reportes de producción');
      console.error('Error fetching reportes produccion:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fechaInicio && fechaFin) {
      fetchReportes();
    }
  }, [fechaInicio, fechaFin]);

  return {
    reportes,
    loading,
    error,
    refetch: fetchReportes
  };
};

export const useProductosMasVendidos = (fechaInicio, fechaFin) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportesService.getProductosMasVendidos(fechaInicio, fechaFin);
      setProductos(data);
    } catch (err) {
      setError('Error al cargar los productos más vendidos');
      console.error('Error fetching productos mas vendidos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fechaInicio && fechaFin) {
      fetchProductos();
    }
  }, [fechaInicio, fechaFin]);

  return {
    productos,
    loading,
    error,
    refetch: fetchProductos
  };
};

export const useUtilidadPorProducto = () => {
  const [utilidad, setUtilidad] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUtilidad = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportesService.getUtilidadPorProducto();
      setUtilidad(data);
    } catch (err) {
      setError('Error al cargar la utilidad por producto');
      console.error('Error fetching utilidad por producto:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUtilidad();
  }, []);

  return {
    utilidad,
    loading,
    error,
    refetch: fetchUtilidad
  };
};

export const useGenerarReporte = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generarReportePDF = async (tipo, fechaInicio, fechaFin) => {
    try {
      setLoading(true);
      setError(null);
      const reporte = await reportesService.generarReportePDF(tipo, fechaInicio, fechaFin);
      return reporte;
    } catch (err) {
      setError('Error al generar el reporte PDF');
      console.error('Error generating PDF report:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generarReporteExcel = async (tipo, fechaInicio, fechaFin) => {
    try {
      setLoading(true);
      setError(null);
      const reporte = await reportesService.generarReporteExcel(tipo, fechaInicio, fechaFin);
      return reporte;
    } catch (err) {
      setError('Error al generar el reporte Excel');
      console.error('Error generating Excel report:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    generarReportePDF,
    generarReporteExcel
  };
};