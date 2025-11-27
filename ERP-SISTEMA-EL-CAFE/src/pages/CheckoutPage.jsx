import React, { useState } from 'react';
import { useCart, useCheckout } from '../hooks/useEcommerce';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRightCircle, Package, Banknote, CreditCard, QrCode, CheckCircle } from 'lucide-react';

const CheckoutPage = () => {
  const { items, subtotal, igv, total, clear } = useCart();
  const { loading, error, pagarCulqi, pagarNiubiz, generarYapeQR, verificarYapePago, registrarPedido } = useCheckout();
  const navigate = useNavigate();

  const [cliente, setCliente] = useState({ nombre: '', email: '', telefono: '', documento: '', direccion: '' });
  const [metodoPago, setMetodoPago] = useState('Culqi');
  const [culqiToken, setCulqiToken] = useState('');
  const [niubizTarjeta, setNiubizTarjeta] = useState('');
  const [yape, setYape] = useState({ sessionId: '', qrSvg: '' });

  const columns = [
    { key: 'nombre', title: 'Producto' },
    { key: 'cantidad', title: 'Cant.' },
    { key: 'precio', title: 'Precio', render: (v) => `S/ ${Number(v || 0).toFixed(2)}` },
    { key: 'total', title: 'Total', render: (_, row) => `S/ ${(Number(row.precio) * Number(row.cantidad)).toFixed(2)}` }
  ];

  const handleGenerarYape = async () => {
    const res = await generarYapeQR({ monto: total });
    setYape({ sessionId: res.sessionId, qrSvg: res.qrSvg });
  };

  const handlePagar = async () => {
    let transaccionId = '';
    if (metodoPago === 'Culqi') {
      const res = await pagarCulqi({ monto: total, token: culqiToken });
      if (!res.ok) return alert('Pago Culqi rechazado');
      transaccionId = res.transaccionId;
    } else if (metodoPago === 'Niubiz') {
      const res = await pagarNiubiz({ monto: total, tarjeta: niubizTarjeta });
      if (!res.ok) return alert('Pago Niubiz rechazado');
      transaccionId = res.transaccionId;
    } else if (metodoPago === 'Yape') {
      if (!yape.sessionId) return alert('Genera el QR de Yape antes de continuar');
      const res = await verificarYapePago({ sessionId: yape.sessionId });
      if (!res.ok) return alert('Pago Yape no verificado');
      transaccionId = res.transaccionId;
    }

    const pedido = await registrarPedido({ cliente, items, metodoPago, transaccionId });
    clear();
    alert(`Pedido registrado: ${pedido.id}`);
    navigate('/web/admin');
  };

  return (
    <div className="page">
      <div className="row-16" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
        <div className="title-wrap">
          <span className="kpi-icon"><ShoppingBag size={18} /></span>
          <h1 className="section-title title-strong">Checkout</h1>
        </div>
        <Button
          variant="primary"
          icon={<ArrowRightCircle size={18} />}
          onClick={() => document.getElementById('pagar-btn')?.scrollIntoView({ behavior: 'smooth' })}
        >Ir a pago</Button>
      </div>

      <div className="grid-3" style={{ marginBottom: 16 }}>
        <div className="card kpi">
          <div className="kpi-card">
            <div className="kpi-icon"><Package size={18} /></div>
            <div>
              <div className="kpi-head">
                <div className="kpi-value">{items.reduce((acc, i) => acc + Number(i.cantidad || 0), 0)}</div>
                <div className="kpi-label">Productos</div>
              </div>
              <div className="kpi-foot">{items.length} ítems</div>
            </div>
          </div>
        </div>
        <div className="card kpi">
          <div className="kpi-card">
            <div className="kpi-icon"><Banknote size={18} /></div>
            <div>
              <div className="kpi-head">
                <div className="kpi-value">S/ {subtotal.toFixed(2)}</div>
                <div className="kpi-label">Subtotal</div>
              </div>
              <div className="kpi-foot">IGV: S/ {igv.toFixed(2)}</div>
            </div>
          </div>
        </div>
        <div className="card kpi">
          <div className="kpi-card">
            <div className="kpi-icon">{metodoPago === 'Yape' ? <QrCode size={18} /> : <CreditCard size={18} />}</div>
            <div>
              <div className="kpi-head">
                <div className="kpi-value">S/ {total.toFixed(2)}</div>
                <div className="kpi-label">Total · {metodoPago}</div>
              </div>
              <div className="kpi-foot">Incluye IGV</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 12 }}>
        <div className="card" style={{ padding: 16 }}>
          <h2 className="section-title">Datos del Cliente</h2>
          <div className="grid-2" style={{ gap: 16, gridTemplateColumns: '1fr 240px', alignItems: 'start' }}>
            <Input label="Nombre" value={cliente.nombre} onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })} />
            <Input label="DNI" className="input-narrow" value={cliente.documento} onChange={(e) => setCliente({ ...cliente, documento: e.target.value })} />
          </div>
          <div className="grid-2" style={{ gap: 16, marginTop: 12, gridTemplateColumns: '1fr 240px', alignItems: 'start' }}>
            <Input label="Email" value={cliente.email} onChange={(e) => setCliente({ ...cliente, email: e.target.value })} />
            <Input label="Teléfono" className="input-narrow" value={cliente.telefono} onChange={(e) => setCliente({ ...cliente, telefono: e.target.value })} />
          </div>
        </div>

        <div className="card" style={{ padding: 16 }}>
          <h2 className="section-title">Método de Pago</h2>
          <Select value={metodoPago} onChange={setMetodoPago} options={[{ value: 'Culqi', label: 'Culqi' }, { value: 'Niubiz', label: 'Niubiz' }, { value: 'Yape', label: 'Yape QR' }]} />

          {metodoPago === 'Culqi' && (
            <div className="row-16" style={{ marginTop: 8 }}>
              <Input label="Token Culqi (mock)" value={culqiToken} onChange={(e) => setCulqiToken(e.target.value)} />
            </div>
          )}
          {metodoPago === 'Niubiz' && (
            <div className="row-16" style={{ marginTop: 8 }}>
              <Input label="Tarjeta Niubiz (mock)" value={niubizTarjeta} onChange={(e) => setNiubizTarjeta(e.target.value)} />
            </div>
          )}
          {metodoPago === 'Yape' && (
            <div className="row-16" style={{ marginTop: 8, gap: 16 }}>
              <Button variant="secondary" icon={<QrCode size={18} />} onClick={handleGenerarYape}>Generar QR</Button>
              <div dangerouslySetInnerHTML={{ __html: yape.qrSvg }} />
            </div>
          )}

          {error && <div className="alert alert-error" style={{ marginTop: 8 }}>{error}</div>}

          <div className="row-16" style={{ justifyContent: 'flex-end', marginTop: 12 }}>
            <Button id="pagar-btn" variant="primary" icon={<CheckCircle size={18} />} onClick={handlePagar} disabled={items.length === 0 || loading}>Pagar y Confirmar</Button>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 16 }}>
        <h2 className="section-title">Resumen</h2>
        <Table columns={columns} data={items} emptyMessage="Sin items" />
      </div>
    </div>
  );
};

export default CheckoutPage;
