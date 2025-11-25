import { useState } from 'react';
import cajaService from '../services/cajaService';

export const useCierresCaja = () => {
  const [cierres, setCierres] = useState(cajaService.getCierres());

  const cerrarHoy = () => {
    const hoy = new Date().toISOString().split('T')[0];
    const resumen = cajaService.cierreDiario(hoy);
    setCierres([...cajaService.getCierres()]);
    return resumen;
  };

  return { cierres, cerrarHoy };
};

