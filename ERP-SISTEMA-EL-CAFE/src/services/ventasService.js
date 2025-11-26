// Datos simulados para el módulo de ventas
export const ventasData = [
  {
    id: 1,
    fecha: '2024-01-15',
    cliente: 'Juan Pérez',
    empleado: 'Ana Vendedora',
    canal: 'Mostrador',
    tipoComprobante: 'Boleta',
    numeroComprobante: 'B001-0001',
    total: 25.50,
    metodoPago: 'Efectivo',
    estado: 'Completado',
    productos: [
      { nombre: 'Café Americano', cantidad: 2, precio: 8.00 },
      { nombre: 'Croissant', cantidad: 1, precio: 9.50 }
    ]
  },
  {
    id: 2,
    fecha: '2024-01-15',
    cliente: 'María García',
    empleado: 'Carlos Vendedor',
    canal: 'Delivery',
    tipoComprobante: 'Factura',
    numeroComprobante: 'F001-0001',
    total: 45.00,
    metodoPago: 'Tarjeta',
    estado: 'Completado',
    productos: [
      { nombre: 'Capuccino', cantidad: 3, precio: 12.00 },
      { nombre: 'Tarta de Frutas', cantidad: 1, precio: 9.00 }
    ]
  },
  {
    id: 3,
    fecha: '2024-01-16',
    cliente: 'Carlos Rodríguez',
    empleado: 'Ana Vendedora',
    canal: 'Web',
    tipoComprobante: 'Boleta',
    numeroComprobante: 'B001-0002',
    total: 18.00,
    metodoPago: 'Yape',
    estado: 'Completado',
    productos: [
      { nombre: 'Espresso', cantidad: 2, precio: 7.00 },
      { nombre: 'Galleta', cantidad: 2, precio: 2.00 }
    ]
  }
];

export const clientesData = [
  { id: 1, nombre: 'Juan Pérez', dni: '12345678', telefono: '987654321', email: 'juan@email.com' },
  { id: 2, nombre: 'María García', dni: '87654321', telefono: '912345678', email: 'maria@email.com' },
  { id: 3, nombre: 'Carlos Rodríguez', dni: '11223344', telefono: '998877665', email: 'carlos@email.com' }
];

export const comprobantesData = [
  { id: 1, tipo: 'Boleta', serie: 'B001', numero: '0001', cliente: 'Juan Pérez', total: 25.50, fecha: '2024-01-15', estado: 'Emitido' },
  { id: 2, tipo: 'Factura', serie: 'F001', numero: '0001', cliente: 'María García', total: 45.00, fecha: '2024-01-15', estado: 'Emitido' },
  { id: 3, tipo: 'Boleta', serie: 'B001', numero: '0002', cliente: 'Carlos Rodríguez', total: 18.00, fecha: '2024-01-16', estado: 'Emitido' }
];

// Servicio de ventas
import inventarioService from './inventarioService';
import cajaService from './cajaService';
import sunatService from './sunatService';
import syncService from './syncService';
import authService from './authService';
import empresa from '../config/empresa';
import { buildBoletaHTML } from '../templates/boletaTemplate';
import { buildEmailHTML } from '../templates/emailTemplate';

const IGV = 0.18;

let numeracion = {
  Boleta: { serie: 'B001', correlativo: 3 },
  Factura: { serie: 'F001', correlativo: 1 }
};

class VentasService {
  async getVentas(filtros = {}) {
    return new Promise(resolve => {
      setTimeout(() => {
        const { desde, hasta, cliente, metodoPago, vendedor, estado } = filtros;
        let res = [...ventasData];
        if (desde) res = res.filter(v => v.fecha >= desde);
        if (hasta) res = res.filter(v => v.fecha <= hasta);
        if (cliente) res = res.filter(v => (v.cliente || '').toLowerCase().includes(cliente.toLowerCase()));
        if (metodoPago) res = res.filter(v => v.metodoPago === metodoPago);
        if (vendedor) res = res.filter(v => (v.empleado || '') === vendedor);
        if (estado) res = res.filter(v => v.estado === estado);
        resolve(res);
      }, 500);
    });
  }
  
  async getClientes() {
    return new Promise(resolve => {
      setTimeout(() => resolve(clientesData), 500);
    });
  }
  
  async getComprobantes() {
    return new Promise(resolve => {
      setTimeout(() => resolve(comprobantesData), 500);
    });
  }
  
  async crearVenta(venta) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const insuficiente = (venta.productos || []).find(p => !inventarioService.hasSufficientStock(p.nombre, p.cantidad));
        if (insuficiente) {
          reject(new Error(`Stock insuficiente para ${insuficiente.nombre}`));
          return;
        }
        const serieInfo = numeracion[venta.tipoComprobante] || numeracion.Boleta;
        serieInfo.correlativo += 1;
        const numeroComprobante = `${serieInfo.serie}-${String(serieInfo.correlativo).padStart(4, '0')}`;

        const subtotal = venta.productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
        const descuentoMonto = venta.descuento ? subtotal * (venta.descuento / 100) : 0;
        const base = subtotal - descuentoMonto;
        const igvMonto = Math.round(base * IGV * 100) / 100;
        const total = Math.round((base + igvMonto) * 100) / 100;

        const nuevaVenta = { 
          ...venta, 
          id: Date.now(), 
          numeroComprobante,
          subtotal: Math.round(subtotal * 100) / 100,
          igv: igvMonto,
          total,
          estado: 'Completado'
        };
        ventasData.push(nuevaVenta);

        inventarioService.ajustarPorVenta(nuevaVenta.productos);
        cajaService.registrarPago({ fecha: nuevaVenta.fecha || new Date().toISOString().split('T')[0], metodo: nuevaVenta.metodoPago, monto: total });
        syncService.sincronizarVenta(nuevaVenta);
        sunatService.emitirComprobanteElectronico({ tipo: nuevaVenta.tipoComprobante, serie: numeroComprobante.split('-')[0], numero: numeroComprobante.split('-')[1], cliente: nuevaVenta.cliente, total });

        resolve(nuevaVenta);
      }, 500);
    });
  }
  
  async actualizarVenta(id, ventaActualizada) {
    return new Promise(resolve => {
      setTimeout(() => {
        const index = ventasData.findIndex(v => v.id === id);
        if (index !== -1) {
          ventasData[index] = { ...ventasData[index], ...ventaActualizada };
          resolve(ventasData[index]);
        }
      }, 500);
    });
  }
  
  async eliminarVenta(id) {
    return new Promise(resolve => {
      setTimeout(() => {
        const index = ventasData.findIndex(v => v.id === id);
        if (index !== -1) {
          ventasData.splice(index, 1);
          resolve(true);
        }
      }, 500);
    });
  }

  async anularVenta(id, motivo = '') {
    return new Promise(resolve => {
      setTimeout(() => {
        const v = ventasData.find(x => x.id === id);
        if (v && v.estado !== 'Anulado') {
          v.estado = 'Anulado';
          v.motivoAnulacion = motivo;
          v.productos.forEach(p => inventarioService.aumentarProducto(p.nombre, p.cantidad));
          resolve(v);
        }
      }, 400);
    });
  }

  async generarPDF(id) {
    return new Promise(resolve => {
      setTimeout(() => {
        const v = ventasData.find(x => x.id === id);
        if (!v) return resolve(null);
        const html = buildBoletaHTML(v, empresa);
        resolve({ id: `PDF-${v.numeroComprobante}`, html });
      }, 200);
    });
  }

  async enviarComprobanteEmail(id, email) {
    return new Promise(resolve => {
      setTimeout(() => {
        const v = ventasData.find(x => x.id === id);
        const user = authService.getCurrentUser();
        if (!v) return resolve(false);
        v.emailEnviadoA = email || (v.clienteEmail || '');
        v.emailEnviadoPor = user ? user.email : '';
        v.emailHtml = buildEmailHTML(v, empresa);
        resolve(true);
      }, 200);
    });
  }

  async registrarImpresion(id, opciones = {}) {
    return new Promise(resolve => {
      setTimeout(() => {
        const v = ventasData.find(x => x.id === id);
        const user = authService.getCurrentUser();
        if (!v) return resolve(false);
        v.impresoAt = new Date().toISOString();
        v.impresoPor = user ? user.email : '';
        v.impresoWidthMm = opciones.widthMm || null;
        resolve(true);
      }, 150);
    });
  }
}

export default new VentasService();
