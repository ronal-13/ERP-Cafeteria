import { useEffect, useState } from 'react';
import promotionsService from '../services/promotionsService';

export const usePromotions = () => {
  const [promos, setPromos] = useState(promotionsService.getAll());

  useEffect(() => {
    setPromos(promotionsService.getAll());
    const unsub = promotionsService.subscribe(next => setPromos(next));
    return () => { if (typeof unsub === 'function') unsub(); };
  }, []);

  const crear = async (data) => promotionsService.create(data);
  const editar = async (id, patch) => promotionsService.edit(id, patch);
  const eliminar = async (id) => promotionsService.remove(id);

  return { promos, crear, editar, eliminar };
};
