// Datos simulados para el módulo de inventario
export const productosData = [
  {
    id: 1,
    nombre: 'Café Americano',
    sku: '750100000001',
    categoria: 'Bebidas',
    stock: 50,
    stockMinimo: 10,
    precioCompra: 5.00,
    precioVenta: 8.00,
    unidad: 'unidad',
    proveedor: 'Café Premium S.A.',
    fechaVencimiento: '2024-12-31'
  },
  {
    id: 2,
    nombre: 'Croissant',
    sku: '750100000002',
    categoria: 'Panadería',
    stock: 30,
    stockMinimo: 15,
    precioCompra: 6.00,
    precioVenta: 9.50,
    unidad: 'unidad',
    proveedor: 'Panadería Central',
    fechaVencimiento: '2024-01-20'
  },
  {
    id: 3,
    nombre: 'Leche',
    sku: '750100000003',
    categoria: 'Lácteos',
    stock: 25,
    stockMinimo: 5,
    precioCompra: 3.50,
    precioVenta: 0,
    unidad: 'litro',
    proveedor: 'Lácteos San Pedro',
    fechaVencimiento: '2024-01-25'
  }
];

export const insumosData = [
  {
    id: 1,
    nombre: 'Café Molido',
    categoria: 'Insumos',
    stock: 5,
    stockMinimo: 2,
    unidad: 'kg',
    proveedor: 'Café Premium S.A.',
    costoUnitario: 20.00,
    fechaVencimiento: '2024-06-30'
  },
  {
    id: 2,
    nombre: 'Harina',
    categoria: 'Insumos',
    stock: 10,
    stockMinimo: 5,
    unidad: 'kg',
    proveedor: 'Molinos Andinos',
    costoUnitario: 3.00,
    fechaVencimiento: '2024-08-15'
  },
  {
    id: 3,
    nombre: 'Azúcar',
    categoria: 'Insumos',
    stock: 8,
    stockMinimo: 3,
    unidad: 'kg',
    proveedor: 'Azucarera Central',
    costoUnitario: 2.50,
    fechaVencimiento: '2024-10-30'
  }
];

export const proveedoresData = [
  { id: 1, nombre: 'Café Premium S.A.', ruc: '20123456789', telefono: '012345678', email: 'contacto@cafepremium.com', direccion: 'Av. Industrial 123' },
  { id: 2, nombre: 'Panadería Central', ruc: '20987654321', telefono: '098765432', email: 'info@panaderiacentral.com', direccion: 'Calle Comercial 456' },
  { id: 3, nombre: 'Lácteos San Pedro', ruc: '20567890123', telefono: '087654321', email: 'ventas@lacteossanpedro.com', direccion: 'Jr. Los Leones 789' }
];

export const movimientosData = [
  {
    id: 1,
    tipo: 'Entrada',
    producto: 'Café Molido',
    cantidad: 5,
    fecha: '2024-01-10',
    motivo: 'Compra de proveedor',
    responsable: 'Juan Pérez'
  },
  {
    id: 2,
    tipo: 'Salida',
    producto: 'Café Molido',
    cantidad: 2,
    fecha: '2024-01-15',
    motivo: 'Producción de café',
    responsable: 'María García'
  },
  {
    id: 3,
    tipo: 'Entrada',
    producto: 'Harina',
    cantidad: 10,
    fecha: '2024-01-12',
    motivo: 'Compra de proveedor',
    responsable: 'Carlos Rodríguez'
  }
];

// Servicio de inventario
class InventarioService {
  async getProductos() {
    return new Promise(resolve => {
      setTimeout(() => resolve(productosData), 500);
    });
  }
  getProductoByNombre(nombre) {
    return productosData.find(p => p.nombre === nombre) || null;
  }
  getProductoByCodigo(codigo) {
    return productosData.find(p => String(p.sku || '').trim() === String(codigo || '').trim()) || null;
  }
  hasSufficientStock(nombre, cantidad) {
    const p = this.getProductoByNombre(nombre);
    if (!p) return false;
    return (p.stock || 0) >= cantidad;
  }
  
  ajustarPorVenta(items) {
    items.forEach(it => {
      const prod = productosData.find(p => p.nombre === it.nombre);
      if (prod) prod.stock = Math.max(0, prod.stock - it.cantidad);
    });
  }

  async getInsumos() {
    return new Promise(resolve => {
      setTimeout(() => resolve(insumosData), 500);
    });
  }
  
  async getProveedores() {
    return new Promise(resolve => {
      setTimeout(() => resolve(proveedoresData), 500);
    });
  }
  
  async getMovimientos() {
    return new Promise(resolve => {
      setTimeout(() => resolve(movimientosData), 500);
    });
  }
  
  async crearProducto(producto) {
    return new Promise(resolve => {
      setTimeout(() => {
        const nuevoProducto = { ...producto, id: Date.now() };
        productosData.push(nuevoProducto);
        resolve(nuevoProducto);
      }, 500);
    });
  }
  
  async editarProducto(id, patch) {
    return new Promise(resolve => {
      setTimeout(() => {
        const idx = productosData.findIndex(p => p.id === id);
        if (idx !== -1) {
          productosData[idx] = { ...productosData[idx], ...patch };
          resolve(productosData[idx]);
        }
      }, 400);
    });
  }

  async eliminarProducto(id) {
    return new Promise(resolve => {
      setTimeout(() => {
        const idx = productosData.findIndex(p => p.id === id);
        if (idx !== -1) {
          productosData.splice(idx, 1);
          resolve(true);
        }
      }, 400);
    });
  }
  
  async actualizarStock(id, cantidad, tipo) {
    return new Promise(resolve => {
      setTimeout(() => {
        const producto = productosData.find(p => p.id === id);
        if (producto) {
          if (tipo === 'entrada') {
            producto.stock += cantidad;
          } else if (tipo === 'salida') {
            producto.stock -= cantidad;
          }
          resolve(producto);
        }
      }, 500);
    });
  }
  
  async registrarMovimiento(movimiento) {
    return new Promise(resolve => {
      setTimeout(() => {
        const hoy = new Date().toISOString().split('T')[0];
        const nuevoMovimiento = { ...movimiento, id: Date.now(), fecha: movimiento.fecha || hoy };
        movimientosData.push(nuevoMovimiento);
        resolve(nuevoMovimiento);
      }, 500);
    });
  }
  
  async getAlertasStock() {
    return new Promise(resolve => {
      setTimeout(() => {
        const alertas = productosData.filter(p => p.stock <= p.stockMinimo);
        resolve(alertas);
      }, 500);
    });
  }

  consumirInsumos(consumos) {
    consumos.forEach(c => {
      const ins = insumosData.find(i => i.nombre === c.insumo);
      if (ins) ins.stock = Math.max(0, ins.stock - c.cantidad);
    });
  }

  aumentarProducto(nombre, cantidad) {
    const prod = productosData.find(p => p.nombre === nombre);
    if (prod) prod.stock += cantidad;
  }

  async ajustarInventarioSet(id, nuevoStock, responsable = '', motivo = 'Ajuste de inventario') {
    return new Promise(resolve => {
      setTimeout(() => {
        const prod = productosData.find(p => p.id === id);
        if (prod) {
          const diferencia = (nuevoStock - (prod.stock || 0));
          prod.stock = nuevoStock;
          const tipo = diferencia >= 0 ? 'Entrada' : 'Salida';
          const cantidad = Math.abs(diferencia);
          if (cantidad > 0) {
            movimientosData.push({ id: Date.now(), tipo, producto: prod.nombre, cantidad, fecha: new Date().toISOString().split('T')[0], motivo, responsable });
          }
          resolve(prod);
        }
      }, 400);
    });
  }

  async calcularConsumo(periodo = 'dia') {
    return new Promise(resolve => {
      setTimeout(() => {
        const salidas = movimientosData.filter(m => m.tipo === 'Salida');
        const agrupar = {};
        salidas.forEach(m => {
          const d = new Date(m.fecha);
          let clave = '';
          if (periodo === 'semana') {
            const onejan = new Date(d.getFullYear(),0,1);
            const week = Math.ceil((((d - onejan) / 86400000) + onejan.getDay()+1)/7);
            clave = `${d.getFullYear()}-W${week}`;
          } else if (periodo === 'mes') {
            clave = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
          } else {
            clave = d.toISOString().split('T')[0];
          }
          const key = `${m.producto}||${clave}`;
          agrupar[key] = (agrupar[key] || 0) + Number(m.cantidad || 0);
        });
        const resultado = Object.entries(agrupar).map(([k, cantidad]) => {
          const [producto, periodoClave] = k.split('||');
          return { producto, periodoClave, cantidad };
        });
        resolve(resultado);
      }, 300);
    });
  }

  async getMovimientosByProducto(nombre) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(movimientosData.filter(m => m.producto === nombre));
      }, 200);
    });
  }
}

export default new InventarioService();
