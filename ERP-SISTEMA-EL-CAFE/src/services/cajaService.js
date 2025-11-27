const pagos = [];

let cierres = [];

const cajaService = {
  registrarPago(pago) {
    pagos.push({ id: Date.now(), ...pago });
  },
  cierreDiario(fecha) {
    const delDia = pagos.filter(p => p.fecha === fecha);
    const total = delDia.reduce((acc, p) => acc + p.monto, 0);
    const resumen = { fecha, total, metodos: {} };
    delDia.forEach(p => {
      resumen.metodos[p.metodo] = (resumen.metodos[p.metodo] || 0) + p.monto;
    });
    cierres.push(resumen);
    return resumen;
  },
  getPagosDelDia(fecha) {
    const delDia = pagos.filter(p => p.fecha === fecha);
    const total = delDia.reduce((acc, p) => acc + p.monto, 0);
    const metodos = {};
    delDia.forEach(p => {
      metodos[p.metodo] = (metodos[p.metodo] || 0) + p.monto;
    });
    return { fecha, total, metodos };
  },
  getCierres() {
    return cierres;
  }
};

export default cajaService;
