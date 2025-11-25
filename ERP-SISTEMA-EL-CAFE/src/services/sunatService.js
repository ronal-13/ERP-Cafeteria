const electronicos = [];

class SunatService {
  async generarXML({ tipo, serie, numero, cliente, documento, items = [], impuestos = {}, total }) {
    return new Promise(resolve => {
      setTimeout(() => {
        const itemsXml = items.map(i => `<Item nombre="${i.nombre}" cantidad="${i.cantidad}" precio="${i.precio}" />`).join('');
        const xml = `<?xml version="1.0"?><Comprobante tipo="${tipo}" serie="${serie}" numero="${numero}"><Cliente nombre="${cliente}" documento="${documento || ''}"/><Impuestos igv="${(impuestos.igv || 0).toFixed(2)}"/><Total>${Number(total).toFixed(2)}</Total><Items>${itemsXml}</Items></Comprobante>`;
        resolve(xml);
      }, 200);
    });
  }

  async emitirComprobanteElectronico({ tipo, serie, numero, cliente, documento, items = [], impuestos = {}, total }) {
    const xml = await this.generarXML({ tipo, serie, numero, cliente, documento, items, impuestos, total });
    const registro = {
      id: Date.now(),
      tipo,
      serie,
      numero,
      cliente,
      documento,
      items,
      impuestos,
      total,
      xml,
      cdr: null,
      estado: 'Pendiente',
      fecha: new Date().toISOString().split('T')[0]
    };
    electronicos.push(registro);
    return registro;
  }

  async enviarAPSE(id, proveedor = 'Nubefact') {
    return new Promise((resolve) => {
      setTimeout(() => {
        const reg = electronicos.find(e => e.id === id);
        if (!reg) return resolve(null);
        // Simular respuesta de PSE
        const aceptado = Math.random() > 0.1;
        reg.estado = aceptado ? 'Aceptado' : 'Rechazado';
        reg.proveedor = proveedor;
        reg.cdr = `CDR-${reg.serie}-${reg.numero}-${aceptado ? 'OK' : 'ERR'}`;
        resolve(reg);
      }, 400);
    });
  }

  async guardarCDR(id, cdr) {
    const reg = electronicos.find(e => e.id === id);
    if (reg) reg.cdr = cdr;
    return reg || null;
  }

  validarRUC(ruc) {
    return /^\d{11}$/.test(ruc);
  }

  validarDNI(dni) {
    return /^\d{8}$/.test(dni);
  }

  getElectronicos() {
    return [...electronicos];
  }

  getById(id) {
    return electronicos.find(e => e.id === id) || null;
  }

  async reenviar(id) {
    const reg = this.getById(id);
    if (!reg) return null;
    reg.estado = 'Pendiente';
    reg.cdr = null;
    return this.enviarAPSE(id, reg.proveedor || 'Nubefact');
  }

  getXML(id) {
    const reg = this.getById(id);
    return reg ? reg.xml : null;
  }

  getPDF(id) {
    const reg = this.getById(id);
    if (!reg) return null;
    return { id: `PDF-${reg.serie}-${reg.numero}`, content: `Comprobante ${reg.tipo} ${reg.serie}-${reg.numero} - Total S/ ${reg.total}` };
  }

  async consultarContribuyente(documento) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (this.validarRUC(documento)) {
          resolve({ tipo: 'RUC', numero: documento, nombre: `Empresa ${documento.slice(-4)}`, direccion: 'Av. Mock 123', estado: 'ACTIVO' });
        } else if (this.validarDNI(documento)) {
          resolve({ tipo: 'DNI', numero: documento, nombre: `Cliente ${documento.slice(-3)}`, direccion: 'Calle Falsa 123', estado: 'ACTIVO' });
        } else {
          resolve(null);
        }
      }, 300);
    });
  }
}

export default new SunatService();
