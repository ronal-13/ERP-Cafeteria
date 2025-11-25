import { useEffect, useState } from 'react';
import sunatService from '../services/sunatService';

export const useSunat = () => {
  const [comprobantes, setComprobantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchComprobantes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await sunatService.getElectronicos();
      setComprobantes(data);
    } catch (err) {
      setError('Error al cargar comprobantes');
      console.error('Error fetching comprobantes:', err);
    } finally {
      setLoading(false);
    }
  };

  const emitir = async (payload) => {
    try {
      setLoading(true);
      const reg = await sunatService.emitirComprobanteElectronico(payload);
      setComprobantes(prev => [...prev, reg]);
      return reg;
    } catch (err) {
      setError('Error al emitir comprobante');
      console.error('Error emitir:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const enviar = async (id, proveedor) => {
    try {
      setLoading(true);
      const reg = await sunatService.enviarAPSE(id, proveedor);
      setComprobantes(prev => prev.map(c => c.id === id ? reg : c));
      return reg;
    } catch (err) {
      setError('Error al enviar a PSE');
      console.error('Error enviar PSE:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reenviar = async (id) => {
    try {
      setLoading(true);
      const reg = await sunatService.reenviar(id);
      setComprobantes(prev => prev.map(c => c.id === id ? reg : c));
      return reg;
    } catch (err) {
      setError('Error al reenviar');
      console.error('Error reenviar:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getXML = (id) => sunatService.getXML(id);
  const getPDF = (id) => sunatService.getPDF(id);
  const validarRUC = (r) => sunatService.validarRUC(r);
  const validarDNI = (d) => sunatService.validarDNI(d);
  const consultarContribuyente = async (doc) => sunatService.consultarContribuyente(doc);

  useEffect(() => {
    fetchComprobantes();
  }, []);

  return {
    comprobantes,
    loading,
    error,
    emitir,
    enviar,
    reenviar,
    getXML,
    getPDF,
    validarRUC,
    validarDNI,
    consultarContribuyente,
    refetch: fetchComprobantes
  };
};
