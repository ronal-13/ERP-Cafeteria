import React, { useState } from 'react';
import { useCart, useCheckout } from '../hooks/useEcommerce';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import { useNavigate } from 'react-router-dom';

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
        <h1 className="section-title">Checkout</h1>
        <div className="row-12">
          <div style={{ minWidth: 260, textAlign: 'right' }}>
            <div>Subtotal: <strong>S/ {subtotal.toFixed(2)}</strong></div>
            <div>IGV (18%): <strong>S/ {igv.toFixed(2)}</strong></div>
            <div>Total: <strong>S/ {total.toFixed(2)}</strong></div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <h2 className="section-title">Datos del Cliente</h2>
        <div className="row-16">
          <Input label="Nombre" value={cliente.nombre} onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })} />
          <Input label="Email" value={cliente.email} onChange={(e) => setCliente({ ...cliente, email: e.target.value })} />
          <Input label="Teléfono" value={cliente.telefono} onChange={(e) => setCliente({ ...cliente, telefono: e.target.value })} />
        </div>
        <div className="row-16">
          <Input label="Documento" value={cliente.documento} onChange={(e) => setCliente({ ...cliente, documento: e.target.value })} />
          <Input label="Dirección" value={cliente.direccion} onChange={(e) => setCliente({ ...cliente, direccion: e.target.value })} />
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
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
            <Button variant="secondary" onClick={handleGenerarYape}>Generar QR</Button>
            <div dangerouslySetInnerHTML={{ __html: yape.qrSvg }} />
          </div>
        )}

        {error && <div className="alert alert-error" style={{ marginTop: 8 }}>{error}</div>}

        <div className="row-16" style={{ justifyContent: 'flex-end', marginTop: 12 }}>
          <Button variant="primary" onClick={handlePagar} disabled={items.length === 0 || loading}>Pagar y Confirmar</Button>
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
