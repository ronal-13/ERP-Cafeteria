// Datos simulados para el módulo de producción
export const recetasData = [
  {
    id: 1,
    nombre: 'Café Americano',
    descripcion: 'Café negro tradicional',
    tiempoPreparacion: 3,
    porciones: 1,
    costoProduccion: 5.00,
    manoObra: 0.50,
    insumos: [
      { insumo: 'Café Molido', cantidad: 0.015, unidad: 'kg', costo: 0.30 },
      { insumo: 'Agua', cantidad: 0.2, unidad: 'litro', costo: 0.20 }
    ]
  },
  {
    id: 2,
    nombre: 'Capuccino',
    descripcion: 'Café con leche espumosa',
    tiempoPreparacion: 5,
    porciones: 1,
    costoProduccion: 8.00,
    manoObra: 0.70,
    insumos: [
      { insumo: 'Café Molido', cantidad: 0.015, unidad: 'kg', costo: 0.30 },
      { insumo: 'Leche', cantidad: 0.15, unidad: 'litro', costo: 0.50 },
      { insumo: 'Azúcar', cantidad: 0.01, unidad: 'kg', costo: 0.02 }
    ]
  },
  {
    id: 3,
    nombre: 'Croissant',
    descripcion: 'Pan francés hojaldrado',
    tiempoPreparacion: 30,
    porciones: 12,
    costoProduccion: 72.00,
    manoObra: 10.00,
    insumos: [
      { insumo: 'Harina', cantidad: 0.5, unidad: 'kg', costo: 1.50 },
      { insumo: 'Mantequilla', cantidad: 0.25, unidad: 'kg', costo: 3.00 },
      { insumo: 'Huevos', cantidad: 6, unidad: 'unidad', costo: 3.00 },
      { insumo: 'Leche', cantidad: 0.2, unidad: 'litro', costo: 0.70 },
      { insumo: 'Azúcar', cantidad: 0.05, unidad: 'kg', costo: 0.12 },
      { insumo: 'Sal', cantidad: 0.01, unidad: 'kg', costo: 0.01 }
    ]
  }
];

export const produccionData = [
  {
    id: 1,
    fecha: '2024-01-15',
    producto: 'Café Americano',
    cantidadProducida: 20,
    cantidadPlaneada: 25,
    rendimiento: 80,
    costoTotal: 100.00,
    responsable: 'María García',
    estado: 'Completado',
    mermas: 0
  },
  {
    id: 2,
    fecha: '2024-01-15',
    producto: 'Capuccino',
    cantidadProducida: 15,
    cantidadPlaneada: 15,
    rendimiento: 100,
    costoTotal: 120.00,
    responsable: 'Carlos Rodríguez',
    estado: 'Completado',
    mermas: 0
  },
  {
    id: 3,
    fecha: '2024-01-16',
    producto: 'Croissant',
    cantidadProducida: 10,
    cantidadPlaneada: 12,
    rendimiento: 83,
    costoTotal: 60.00,
    responsable: 'Ana López',
    estado: 'Completado',
    mermas: 2
  }
];

export const consumoInsumosData = [
  {
    id: 1,
    fecha: '2024-01-15',
    insumo: 'Café Molido',
    cantidadConsumida: 0.3,
    unidad: 'kg',
    produccion: 'Café Americano',
    responsable: 'María García'
  },
  {
    id: 2,
    fecha: '2024-01-15',
    insumo: 'Leche',
    cantidadConsumida: 2.25,
    unidad: 'litros',
    produccion: 'Capuccino',
    responsable: 'Carlos Rodríguez'
  },
  {
    id: 3,
    fecha: '2024-01-16',
    insumo: 'Harina',
    cantidadConsumida: 0.42,
    unidad: 'kg',
    produccion: 'Croissant',
    responsable: 'Ana López'
  }
];

// Servicio de producción
class ProduccionService {
  async getRecetas() {
    return new Promise(resolve => {
      setTimeout(() => resolve(recetasData), 500);
    });
  }
  
  async getProduccion() {
    return new Promise(resolve => {
      setTimeout(() => resolve(produccionData), 500);
    });
  }
  
  async getConsumoInsumos() {
    return new Promise(resolve => {
      setTimeout(() => resolve(consumoInsumosData), 500);
    });
  }
  
  async crearReceta(receta) {
    return new Promise(resolve => {
      setTimeout(() => {
        const manoObra = Number(receta.manoObra || 0);
        const costoInsumos = (receta.insumos || []).reduce((acc, i) => acc + Number(i.costo || 0), 0);
        const costoProduccion = Math.round((costoInsumos + manoObra) * 100) / 100;
        const nuevaReceta = { ...receta, manoObra, costoProduccion, id: Date.now() };
        recetasData.push(nuevaReceta);
        resolve(nuevaReceta);
      }, 500);
    });
  }

  async editarReceta(id, patch) {
    return new Promise(resolve => {
      setTimeout(() => {
        const idx = recetasData.findIndex(r => r.id === id);
        if (idx !== -1) {
          const base = { ...recetasData[idx], ...patch };
          const manoObra = Number(base.manoObra || 0);
          const costoInsumos = (base.insumos || []).reduce((acc, i) => acc + Number(i.costo || 0), 0);
          base.costoProduccion = Math.round((costoInsumos + manoObra) * 100) / 100;
          recetasData[idx] = base;
          resolve(recetasData[idx]);
        }
      }, 400);
    });
  }

  async eliminarReceta(id) {
    return new Promise(resolve => {
      setTimeout(() => {
        const idx = recetasData.findIndex(r => r.id === id);
        if (idx !== -1) {
          recetasData.splice(idx, 1);
          resolve(true);
        }
      }, 300);
    });
  }
  
  async registrarProduccion(produccion) {
    return new Promise(resolve => {
      setTimeout(() => {
        const nuevaProduccion = { 
          ...produccion, 
          id: Date.now(),
          estado: 'Completado',
          rendimiento: Math.round((produccion.cantidadProducida / produccion.cantidadPlaneada) * 100)
        };
        produccionData.push(nuevaProduccion);
        // Ajuste de inventario simulado por producción
        const receta = recetasData.find(r => r.nombre === nuevaProduccion.producto);
        if (receta) {
          const consumos = receta.insumos.map(i => ({ insumo: i.insumo, cantidad: i.cantidad * nuevaProduccion.cantidadProducida / receta.porciones }));
          import('../services/inventarioService').then(mod => {
            mod.default.consumirInsumos(consumos);
            mod.default.aumentarProducto(nuevaProduccion.producto, nuevaProduccion.cantidadProducida);
          });
          consumos.forEach(c => {
            consumoInsumosData.push({ id: Date.now() + Math.random(), fecha: nuevaProduccion.fecha, insumo: c.insumo, cantidadConsumida: c.cantidad, unidad: '', produccion: nuevaProduccion.producto, responsable: nuevaProduccion.responsable });
          });
        }
        resolve(nuevaProduccion);
      }, 500);
    });
  }
  
  async calcularCostoProduccion(recetaId, cantidad) {
    return new Promise(resolve => {
      setTimeout(() => {
        const receta = recetasData.find(r => r.id === recetaId);
        if (receta) {
          const costoTotal = receta.costoProduccion * cantidad;
          resolve(costoTotal);
        }
      }, 500);
    });
  }

  async calcularCostoUnidad(recetaId) {
    return new Promise(resolve => {
      setTimeout(() => {
        const receta = recetasData.find(r => r.id === recetaId);
        if (receta && receta.porciones) {
          const unit = Math.round((receta.costoProduccion / receta.porciones) * 100) / 100;
          resolve(unit);
        } else {
          resolve(0);
        }
      }, 300);
    });
  }
  
  async getRendimientoProduccion(fechaInicio, fechaFin) {
    return new Promise(resolve => {
      setTimeout(() => {
        const produccionFiltrada = produccionData.filter(p => {
          const fecha = new Date(p.fecha);
          return fecha >= new Date(fechaInicio) && fecha <= new Date(fechaFin);
        });
        
        const rendimientoPromedio = produccionFiltrada.reduce((acc, p) => acc + p.rendimiento, 0) / produccionFiltrada.length;
        resolve(rendimientoPromedio);
      }, 500);
    });
  }
}

export default new ProduccionService();
