// Servicio E-Commerce (mock) con SKU compartido con inventario interno
import inventarioService from './inventarioService';

const productosWeb = [
  // Bebidas
  { id: 101, sku: 'CAF-AMER-8', nombre: 'Café Americano', descripcion: 'Taza 8oz', imagen: '', precio: 8.0, stock: 20, activo: true, categoria: 'Bebidas', tags: ['cafe'] },
  { id: 103, sku: 'CAF-LATTE-12', nombre: 'Latte', descripcion: 'Taza 12oz', imagen: '', precio: 12.0, stock: 18, activo: true, categoria: 'Bebidas', tags: ['cafe'] },
  { id: 104, sku: 'CAF-CAPPU-12', nombre: 'Cappuccino', descripcion: 'Taza 12oz', imagen: '', precio: 12.5, stock: 15, activo: true, categoria: 'Bebidas', tags: ['cafe'] },
  { id: 105, sku: 'TE-VERDE', nombre: 'Té Verde', descripcion: 'Infusión natural', imagen: '', precio: 7.5, stock: 25, activo: true, categoria: 'Bebidas', tags: ['te'] },

  // Panadería/Postres
  { id: 102, sku: 'CROISS-UNI', nombre: 'Croissant', descripcion: 'Mantequilla', imagen: '', precio: 9.5, stock: 12, activo: true, categoria: 'Panadería', tags: ['pan'] },
  { id: 106, sku: 'GAL-CHOC', nombre: 'Galleta de Chocolate', descripcion: 'Crujiente y dulce', imagen: '', precio: 4.0, stock: 40, activo: true, categoria: 'Galletas', tags: ['postre'] },
  { id: 107, sku: 'GAL-AVENA', nombre: 'Galleta de Avena', descripcion: 'Con miel y pasas', imagen: '', precio: 4.5, stock: 35, activo: true, categoria: 'Galletas', tags: ['postre'] },
  { id: 108, sku: 'QUEQ-VAIN', nombre: 'Queque de Vainilla', descripcion: 'Porción individual', imagen: '', precio: 6.5, stock: 22, activo: true, categoria: 'Queques', tags: ['postre'] },
  { id: 109, sku: 'QUEQ-CHOC', nombre: 'Queque de Chocolate', descripcion: 'Porción individual', imagen: '', precio: 7.0, stock: 20, activo: true, categoria: 'Queques', tags: ['postre'] },
  { id: 110, sku: 'TORT-ZANA', nombre: 'Torta de Zanahoria', descripcion: 'Rebanada', imagen: '', precio: 8.5, stock: 16, activo: true, categoria: 'Postres', tags: ['postre'] },
  { id: 111, sku: 'MUFF-ARAN', nombre: 'Muffin de Arándanos', descripcion: 'Esponjoso y fresco', imagen: '', precio: 6.0, stock: 24, activo: true, categoria: 'Postres', tags: ['postre'] },

  // Comida/Sándwiches
  { id: 112, sku: 'EMP-POLLO', nombre: 'Empanada de Pollo', descripcion: 'Horneada', imagen: '', precio: 7.0, stock: 25, activo: true, categoria: 'Comida', tags: ['empanada'] },
  { id: 113, sku: 'EMP-CARNE', nombre: 'Empanada de Carne', descripcion: 'Horneada', imagen: '', precio: 7.5, stock: 25, activo: true, categoria: 'Comida', tags: ['empanada'] },
  { id: 114, sku: 'SAND-JQ', nombre: 'Sándwich Jamón y Queso', descripcion: 'Pan artesanal', imagen: '', precio: 12.0, stock: 18, activo: true, categoria: 'Sándwiches', tags: ['sandwich'] },
  { id: 115, sku: 'SAND-POLLO', nombre: 'Sándwich de Pollo', descripcion: 'Con lechuga y tomate', imagen: '', precio: 13.0, stock: 18, activo: true, categoria: 'Sándwiches', tags: ['sandwich'] },
];

const clientesWeb = [
  { id: 5001, nombre: 'Cliente Web', documento: '12345678', email: 'cliente@web.com', telefono: '999999999', direccion: 'Calle 1' }
];

const pedidosWeb = [];

const IGV = 0.18;

class EcommerceService {
  // Productos Web
  async getProductos({ q = '', categoria = '', disponibles = true } = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let res = [...productosWeb];
        if (q) res = res.filter(p => (p.nombre + ' ' + p.descripcion).toLowerCase().includes(q.toLowerCase()));
        if (categoria) res = res.filter(p => p.categoria === categoria);
        if (disponibles) res = res.filter(p => p.activo && (p.stock || 0) > 0);
        resolve(res);
      }, 200);
    });
  }

  async getProducto(id) {
    return productosWeb.find(p => p.id === id) || null;
  }

  async crearProductoWeb(data) {
    const item = { id: Date.now(), ...data };
    productosWeb.push(item);
    return item;
  }

  async editarProductoWeb(id, patch) {
    const idx = productosWeb.findIndex(p => p.id === id);
    if (idx >= 0) {
      productosWeb[idx] = { ...productosWeb[idx], ...patch };
      return productosWeb[idx];
    }
    return null;
  }

  async eliminarProductoWeb(id) {
    const idx = productosWeb.findIndex(p => p.id === id);
    if (idx >= 0) productosWeb.splice(idx, 1);
    return true;
  }

  async sincronizarStockDesdeInventario() {
    // Mapea por nombre (o SKU si tu inventarioService lo soporta)
    productosWeb.forEach(p => {
      const item = inventarioService.getProductoByNombre ? inventarioService.getProductoByNombre(p.nombre) : null;
      if (item) p.stock = item.stock;
    });
    return [...productosWeb];
  }

  // Clientes Web
  async getClientesWeb() { return [...clientesWeb]; }
  async crearClienteWeb(data) { const c = { id: Date.now(), ...data }; clientesWeb.push(c); return c; }
  async editarClienteWeb(id, patch) {
    const idx = clientesWeb.findIndex(c => c.id === id);
    if (idx >= 0) { clientesWeb[idx] = { ...clientesWeb[idx], ...patch }; return clientesWeb[idx]; }
    return null;
  }

  // Pedidos Web
  async getPedidosWeb({ desde = '', hasta = '', estado = '' } = {}) {
    return pedidosWeb.filter(p => (!desde || p.fecha >= desde) && (!hasta || p.fecha <= hasta) && (!estado || p.estado === estado));
  }

  async registrarPedidoWeb({ cliente, items, metodoPago, transaccionId }) {
    // Validar stock
    const insuf = (items || []).find(i => !inventarioService.hasSufficientStock(i.nombre, i.cantidad));
    if (insuf) throw new Error(`Stock insuficiente para ${insuf.nombre}`);

    const subtotal = items.reduce((acc, it) => acc + Number(it.precio || 0) * Number(it.cantidad || 0), 0);
    const igv = Math.round(subtotal * IGV * 100) / 100;
    const total = Math.round((subtotal + igv) * 100) / 100;

    // Descontar inventario interno
    inventarioService.ajustarPorVenta(items);

    // Reflejar en productos web
    items.forEach(it => {
      const pw = productosWeb.find(p => p.nombre === it.nombre);
      if (pw) pw.stock = Math.max(0, (pw.stock || 0) - it.cantidad);
    });

    const pedido = {
      id: Date.now(),
      fecha: new Date().toISOString().split('T')[0],
      clienteId: cliente?.id || null,
      cliente,
      items,
      subtotal: Math.round(subtotal * 100) / 100,
      igv,
      total,
      metodoPago,
      transaccionId: transaccionId || '',
      estado: 'Pagado'
    };
    pedidosWeb.push(pedido);
    return pedido;
  }

  // Pagos (mock)
  async pagarCulqi({ monto, token }) {
    await this._delay(300);
    const ok = !!token && Number(monto) > 0;
    return { ok, transaccionId: ok ? `CULQI-${Date.now()}` : '', monto: Number(monto) };
  }

  async pagarNiubiz({ monto, tarjeta }) {
    await this._delay(300);
    const ok = !!tarjeta && Number(monto) > 0;
    return { ok, transaccionId: ok ? `NIUBIZ-${Date.now()}` : '', monto: Number(monto) };
  }

  async generarYapeQR({ monto }) {
    await this._delay(200);
    return { sessionId: `YAPE-${Date.now()}`, qrSvg: '<svg><!-- mock --></svg>', monto: Number(monto) };
  }

  async verificarYapePago({ sessionId }) {
    await this._delay(800);
    return { ok: true, transaccionId: `${sessionId}-OK` };
  }

  _delay(ms) { return new Promise(r => setTimeout(r, ms)); }
}

export default new EcommerceService();
