import { useState, useEffect } from 'react';
import produccionService from '../services/produccionService';

export const useProduccion = () => {
  const [produccion, setProduccion] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProduccion = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await produccionService.getProduccion();
      setProduccion(data);
    } catch (err) {
      setError('Error al cargar la producción');
      console.error('Error fetching produccion:', err);
    } finally {
      setLoading(false);
    }
  };

  const registrarProduccion = async (nuevaProduccion) => {
    try {
      setLoading(true);
      const produccionRegistrada = await produccionService.registrarProduccion(nuevaProduccion);
      setProduccion(prev => [...prev, produccionRegistrada]);
      return produccionRegistrada;
    } catch (err) {
      setError('Error al registrar la producción');
      console.error('Error registering produccion:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduccion();
  }, []);

  return {
    produccion,
    loading,
    error,
    registrarProduccion,
    refetch: fetchProduccion
  };
};

export const useRecetas = () => {
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecetas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await produccionService.getRecetas();
      setRecetas(data);
    } catch (err) {
      setError('Error al cargar las recetas');
      console.error('Error fetching recetas:', err);
    } finally {
      setLoading(false);
    }
  };

  const crearReceta = async (receta) => {
    try {
      setLoading(true);
      const nuevaReceta = await produccionService.crearReceta(receta);
      setRecetas(prev => [...prev, nuevaReceta]);
      return nuevaReceta;
    } catch (err) {
      setError('Error al crear la receta');
      console.error('Error creating receta:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editarReceta = async (id, patch) => {
    try {
      setLoading(true);
      const rec = await produccionService.editarReceta(id, patch);
      setRecetas(prev => prev.map(r => r.id === id ? rec : r));
      return rec;
    } catch (err) {
      setError('Error al editar la receta');
      console.error('Error editing receta:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const eliminarReceta = async (id) => {
    try {
      setLoading(true);
      await produccionService.eliminarReceta(id);
      setRecetas(prev => prev.filter(r => r.id !== id));
      return true;
    } catch (err) {
      setError('Error al eliminar la receta');
      console.error('Error deleting receta:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecetas();
  }, []);

  return {
    recetas,
    loading,
    error,
    crearReceta,
    editarReceta,
    eliminarReceta,
    refetch: fetchRecetas
  };
};

export const useConsumoInsumos = () => {
  const [consumoInsumos, setConsumoInsumos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchConsumoInsumos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await produccionService.getConsumoInsumos();
      setConsumoInsumos(data);
    } catch (err) {
      setError('Error al cargar el consumo de insumos');
      console.error('Error fetching consumoInsumos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsumoInsumos();
  }, []);

  return {
    consumoInsumos,
    loading,
    error,
    refetch: fetchConsumoInsumos
  };
};

export const useCostoProduccion = () => {
  const [costo, setCosto] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calcularCosto = async (recetaId, cantidad) => {
    try {
      setLoading(true);
      setError(null);
      const costoCalculado = await produccionService.calcularCostoProduccion(recetaId, cantidad);
      setCosto(costoCalculado);
      return costoCalculado;
    } catch (err) {
      setError('Error al calcular el costo de producción');
      console.error('Error calculating costo produccion:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const calcularCostoUnidad = async (recetaId) => {
    try {
      setLoading(true);
      const unit = await produccionService.calcularCostoUnidad(recetaId);
      return unit;
    } catch (err) {
      setError('Error al calcular costo por unidad');
      console.error('Error calculating costo unidad:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    costo,
    loading,
    error,
    calcularCosto,
    calcularCostoUnidad
  };
};

export const useRendimientoProduccion = () => {
  const [rendimiento, setRendimiento] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calcularRendimiento = async (fechaInicio, fechaFin) => {
    try {
      setLoading(true);
      setError(null);
      const rendimientoCalculado = await produccionService.getRendimientoProduccion(fechaInicio, fechaFin);
      setRendimiento(rendimientoCalculado);
      return rendimientoCalculado;
    } catch (err) {
      setError('Error al calcular el rendimiento');
      console.error('Error calculating rendimiento:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    rendimiento,
    loading,
    error,
    calcularRendimiento
  };
};