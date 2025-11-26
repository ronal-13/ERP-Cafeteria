const formatMoney = (n) => `S/ ${Number(n || 0).toFixed(2)}`;
const pad2 = (n) => String(n).padStart(2, "0");

export const buildEmailHTML = (venta, empresa) => {
  const ahora = new Date();
  const fecha = `${pad2(ahora.getDate())}/${pad2(ahora.getMonth() + 1)}/${ahora.getFullYear()}`;
  const hora = ahora.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  const numero = venta.numeroComprobante || "B001-0000";
  const igv = venta.igv ?? 0;
  const subtotal = venta.subtotal ?? 0;
  const total = venta.total ?? 0;

  const itemsRows = (venta.productos || [])
    .map((p) => {
      const linea = (Number(p.precio || 0) * Number(p.cantidad || 0)) - Number(p.descuento || 0);
      return `<tr>
        <td style="padding:8px 12px; border-bottom:1px solid #e5e7eb;">${p.nombre}</td>
        <td style="padding:8px 12px; border-bottom:1px solid #e5e7eb; text-align:center;">${p.cantidad}</td>
        <td style="padding:8px 12px; border-bottom:1px solid #e5e7eb; text-align:right;">${formatMoney(p.precio)}</td>
        <td style="padding:8px 12px; border-bottom:1px solid #e5e7eb; text-align:right;">${formatMoney(linea)}</td>
      </tr>`;
    })
    .join("");

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Comprobante ${numero}</title>
</head>
<body style="margin:0; background:#f5f6fa; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto; color:#111827;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f6fa;">
    <tr>
      <td align="center" style="padding: 24px 12px;">
        <table width="640" cellspacing="0" cellpadding="0" style="background:#ffffff; border:1px solid #e5e7eb; border-radius:12px; overflow:hidden;">
          <tr>
            <td style="padding:16px; text-align:center; background:#1f2937; color:#e2e8f0;">
              <img src="${empresa.logoUrl}" alt="Logo" width="64" height="64" style="border-radius:12px; object-fit:cover; display:block; margin:0 auto 8px;" />
              <div style="font-weight:700; font-size:18px;">${empresa.nombre}</div>
              <div style="font-size:12px; opacity:.9;">RUC: ${empresa.ruc}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:16px;">
              <div style="font-weight:700; font-size:16px; margin-bottom:8px;">${venta.tipoComprobante || 'Boleta'} ${numero}</div>
              <div style="font-size:13px; color:#64748b;">Fecha: ${fecha}</div>
              <div style="font-size:13px; color:#64748b;">Hora: ${hora}</div>
              <div style="height:1px; background:#e5e7eb; margin:12px 0;"></div>
              <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                <tr>
                  <td style="padding:6px 0; font-size:13px; color:#64748b;">Cliente</td>
                  <td style="padding:6px 0; text-align:right; font-size:13px;">${venta.cliente || '-'}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0; font-size:13px; color:#64748b;">DNI</td>
                  <td style="padding:6px 0; text-align:right; font-size:13px;">${venta.dni || '-'}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0; font-size:13px; color:#64748b;">Método de Pago</td>
                  <td style="padding:6px 0; text-align:right; font-size:13px;">${venta.metodoPago || '-'}</td>
                </tr>
              </table>
              <div style="height:1px; background:#e5e7eb; margin:12px 0;"></div>
              <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                <thead>
                  <tr>
                    <th align="left" style="padding:8px 12px; font-size:12px; color:#6b7280; text-transform:uppercase; letter-spacing:.04em;">Producto</th>
                    <th align="center" style="padding:8px 12px; font-size:12px; color:#6b7280; text-transform:uppercase; letter-spacing:.04em;">Cant</th>
                    <th align="right" style="padding:8px 12px; font-size:12px; color:#6b7280; text-transform:uppercase; letter-spacing:.04em;">Precio</th>
                    <th align="right" style="padding:8px 12px; font-size:12px; color:#6b7280; text-transform:uppercase; letter-spacing:.04em;">Importe</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRows}
                </tbody>
              </table>
              <div style="height:1px; background:#e5e7eb; margin:12px 0;"></div>
              <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                <tr>
                  <td style="padding:6px 12px;">Subtotal</td>
                  <td align="right" style="padding:6px 12px;">${formatMoney(subtotal)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 12px;">IGV 18%</td>
                  <td align="right" style="padding:6px 12px;">${formatMoney(igv)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 12px; font-weight:700;">Total</td>
                  <td align="right" style="padding:6px 12px; font-weight:700;">${formatMoney(total)}</td>
                </tr>
              </table>
              <div style="height:1px; background:#e5e7eb; margin:12px 0;"></div>
              <div style="font-size:12px; color:#64748b;">${empresa.nombre} • RUC ${empresa.ruc}</div>
              <div style="font-size:12px; color:#64748b;">${empresa.direccion}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:16px; text-align:center; font-size:12px; color:#64748b;">Gracias por su compra</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

export default buildEmailHTML;
