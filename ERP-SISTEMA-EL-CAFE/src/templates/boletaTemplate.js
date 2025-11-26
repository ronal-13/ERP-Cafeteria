const formatMoney = (n) => `S/ ${Number(n || 0).toFixed(2)}`;
const pad2 = (n) => String(n).padStart(2, "0");

export const buildBoletaHTML = (venta, empresa, opts = {}) => {
  const ahora = new Date();
  const fecha = `${pad2(ahora.getDate())}/${pad2(ahora.getMonth() + 1)}/${ahora.getFullYear()}`;
  const hora = ahora.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  const igv = venta.igv ?? 0;
  const subtotal = venta.subtotal ?? 0;
  const total = venta.total ?? 0;
  const numero = venta.numeroComprobante || "B001-0000";
  const widthMm = Number(opts.widthMm || empresa.ticketWidthMm || 80);
  const widthPx = Math.round((widthMm * 96) / 25.4);
  const autoPrint = Boolean(opts.autoPrint);

  const itemsRows = (venta.productos || [])
    .map((p) => {
      const linea = (Number(p.precio || 0) * Number(p.cantidad || 0)) - Number(p.descuento || 0);
      return `<tr><td>${p.nombre}</td><td style="text-align:center;">${p.cantidad}</td><td style="text-align:right;">${formatMoney(p.precio)}</td><td style="text-align:right;">${formatMoney(linea)}</td></tr>`;
    })
    .join("");

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Boleta ${numero}</title>
<style>
  @page { size: ${widthMm}mm auto; margin: 5mm; }
  body { width: ${widthPx}px; margin: 0 auto; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto; color: #111827; }
  .ticket { width: 100%; }
  .center { text-align: center; }
  .brand { display:flex; flex-direction:column; align-items:center; gap:6px; }
  .brand img { width: 64px; height: 64px; border-radius: 12px; object-fit: cover; }
  .muted { color:#6b7280; font-size:12px; }
  .line { border-top:1px dashed #cbd5e1; margin:8px 0; }
  table { width:100%; border-collapse:collapse; }
  th, td { padding:6px 4px; font-size:12px; }
  thead th { border-bottom:1px solid #e5e7eb; color:#374151; text-transform:uppercase; font-size:11px; letter-spacing:0.03em; }
  tfoot td { font-weight:700; }
  .totals td { padding:4px 4px; }
</style>
</head>
<body>
  <div class="ticket">
    <div class="brand">
      <img src="${empresa.logoUrl}" alt="Logo" />
      <div><strong>${empresa.nombre}</strong></div>
      <div class="muted">RUC: ${empresa.ruc}</div>
      <div class="muted">${empresa.direccion}</div>
      <div class="muted">Tel: ${empresa.telefono}</div>
    </div>
    <div class="line"></div>
    <div class="center"><strong>Boleta</strong> ${numero}</div>
    <div class="center muted">Fecha: ${fecha} • Hora: ${hora}</div>
    <div class="muted">Cliente: ${venta.cliente || "-"}</div>
    <div class="muted">DNI: ${(venta.dni || "-")}</div>
    <div class="line"></div>
    <table>
      <thead>
        <tr><th>Producto</th><th>Cant</th><th>Precio</th><th>Importe</th></tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
    </table>
    <div class="line"></div>
    <table class="totals">
      <tbody>
        <tr><td>Subtotal</td><td style="text-align:right;">${formatMoney(subtotal)}</td></tr>
        <tr><td>IGV 18%</td><td style="text-align:right;">${formatMoney(igv)}</td></tr>
        <tr><td>Total</td><td style="text-align:right;">${formatMoney(total)}</td></tr>
      </tbody>
    </table>
    <div class="line"></div>
    <div class="center muted">Gracias por su compra</div>
  </div>
  ${autoPrint ? '<script>setTimeout(function(){ window.print(); }, 300);</script>' : ''}
</body>
</html>`;
};

export default buildBoletaHTML;
