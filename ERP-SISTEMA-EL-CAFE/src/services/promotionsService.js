let promotions = [
  { id: 9001, titulo: '2x1 en Café Americano', descripcion: 'Solo hoy, en bebidas calientes.', categoria: 'Bebidas' },
  { id: 9002, titulo: 'Croissant + Café', descripcion: 'Combo desayuno a precio especial.', categoria: 'Panadería' }
];

const listeners = [];

const notify = () => {
  const snapshot = [...promotions];
  listeners.forEach(fn => {
    try { fn(snapshot); } catch {}
  });
};

const promotionsService = {
  getAll() {
    return [...promotions];
  },
  create(data) {
    const item = { id: Date.now(), titulo: '', descripcion: '', categoria: '', ...data };
    promotions.push(item);
    notify();
    return item;
  },
  edit(id, patch) {
    const idx = promotions.findIndex(p => p.id === id);
    if (idx >= 0) {
      promotions[idx] = { ...promotions[idx], ...patch };
      notify();
      return promotions[idx];
    }
    return null;
  },
  remove(id) {
    const idx = promotions.findIndex(p => p.id === id);
    if (idx >= 0) promotions.splice(idx, 1);
    notify();
    return true;
  },
  subscribe(fn) {
    listeners.push(fn);
    return () => {
      const i = listeners.indexOf(fn);
      if (i >= 0) listeners.splice(i, 1);
    };
  }
};

export default promotionsService;
