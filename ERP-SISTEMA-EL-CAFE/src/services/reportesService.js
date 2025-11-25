// Datos simulados para reportes
export const reportesVentasData = [
  {
    fecha: '2024-01-15',
    totalVentas: 88.50,
    numeroVentas: 3,
    productoMasVendido: 'Café Americano',
    metodoPagoMasUsado: 'Efectivo'
  },
  {
    fecha: '2024-01-16',
    totalVentas: 45.00,
    numeroVentas: 2,
    productoMasVendido: 'Capuccino',
    metodoPagoMasUsado: 'Tarjeta'
  },
  {
    fecha: '2024-01-17',
    totalVentas: 120.00,
    numeroVentas: 5,
    productoMasVendido: 'Croissant',
    metodoPagoMasUsado: 'Yape'
  }
];

export const reportesInventarioData = [
  {
    producto: 'Café Molido',
    stockActual: 5,
    stockMinimo: 2,
    consumoPromedio: 0.3,
    diasRestantes: 17,
    estado: 'Normal'
  },
  {
    producto: 'Leche',
    stockActual: 25,
    stockMinimo: 5,
    consumoPromedio: 2.25,
    diasRestantes: 11,
    estado: 'Normal'
  },
  {
    producto: 'Harina',
    stockActual: 10,
    stockMinimo: 5,
    consumoPromedio: 0.42,
    diasRestantes: 24,
    estado: 'Normal'
  }
];

export const reportesProduccionData = [
  {
    fecha: '2024-01-15',
    producto: 'Café Americano',
    cantidadProducida: 20,
    cantidadPlaneada: 25,
    rendimiento: 80,
    mermas: 0,
    costoTotal: 100.00
  },
  {
    fecha: '2024-01-15',
    producto: 'Capuccino',
    cantidadProducida: 15,
    cantidadPlaneada: 15,
    rendimiento: 100,
    mermas: 0,
    costoTotal: 120.00
  },
  {
    fecha: '2024-01-16',
    producto: 'Croissant',
    cantidadProducida: 10,
    cantidadPlaneada: 12,
    rendimiento: 83,
    mermas: 2,
    costoTotal: 60.00
  }
];

export const productosMasVendidosData = [
  { producto: 'Café Americano', cantidadVendida: 45, montoTotal: 360.00, porcentaje: 35 },
  { producto: 'Capuccino', cantidadVendida: 30, montoTotal: 360.00, porcentaje: 25 },
  { producto: 'Croissant', cantidadVendida: 25, montoTotal: 237.50, porcentaje: 20 },
  { producto: 'Tarta de Frutas', cantidadVendida: 15, montoTotal: 135.00, porcentaje: 12 },
  { producto: 'Espresso', cantidadVendida: 10, montoTotal: 70.00, porcentaje: 8 }
];

// Servicio de reportes
class ReportesService {
  async getReporteVentas(fechaInicio, fechaFin) {
    return new Promise(resolve => {
      setTimeout(() => {
        const reportesFiltrados = reportesVentasData.filter(r => {
          const fecha = new Date(r.fecha);
          return fecha >= new Date(fechaInicio) && fecha <= new Date(fechaFin);
        });
        resolve(reportesFiltrados);
      }, 500);
    });
  }
  
  async getReporteInventario() {
    return new Promise(resolve => {
      setTimeout(() => resolve(reportesInventarioData), 500);
    });
  }
  
  async getReporteProduccion(fechaInicio, fechaFin) {
    return new Promise(resolve => {
      setTimeout(() => {
        const reportesFiltrados = reportesProduccionData.filter(r => {
          const fecha = new Date(r.fecha);
          return fecha >= new Date(fechaInicio) && fecha <= new Date(fechaFin);
        });
        resolve(reportesFiltrados);
      }, 500);
    });
  }
  
  async getProductosMasVendidos(fechaInicio, fechaFin) {
    return new Promise(resolve => {
      setTimeout(() => resolve(productosMasVendidosData), 500);
    });
  }
  
  async getUtilidadPorProducto() {
    return new Promise(resolve => {
      setTimeout(() => {
        const utilidad = productosMasVendidosData.map(producto => ({
          ...producto,
          costoProduccion: producto.montoTotal * 0.6, // 60% de costo
          utilidad: producto.montoTotal * 0.4 // 40% de utilidad
        }));
        resolve(utilidad);
      }, 500);
    });
  }
  
  async generarReportePDF(tipo, fechaInicio, fechaFin) {
    return new Promise(resolve => {
      setTimeout(() => {
        // Simular generación de PDF
        resolve({
          mensaje: `Reporte ${tipo} generado exitosamente`,
          fechaGeneracion: new Date().toISOString(),
          rutaArchivo: `/reportes/${tipo}_${fechaInicio}_${fechaFin}.pdf`
        });
      }, 1000);
    });
  }
  
  async generarReporteExcel(tipo, fechaInicio, fechaFin) {
    return new Promise(resolve => {
      setTimeout(() => {
        // Simular generación de Excel
        resolve({
          mensaje: `Reporte ${tipo} generado exitosamente`,
          fechaGeneracion: new Date().toISOString(),
          rutaArchivo: `/reportes/${tipo}_${fechaInicio}_${fechaFin}.xlsx`
        });
      }, 1000);
    });
  }
}

export default new ReportesService();