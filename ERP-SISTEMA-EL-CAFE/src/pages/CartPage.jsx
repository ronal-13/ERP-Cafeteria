import React from 'react';
import { useCart } from '../hooks/useEcommerce';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Input from '../components/common/Input';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

const CartPage = () => {
  const { items, updateQty, removeItem, subtotal, igv, total } = useCart();
  const navigate = useNavigate();

  const columns = [
    { key: 'nombre', title: 'Producto' },
    { key: 'precio', title: 'Precio', render: (v) => `S/ ${Number(v || 0).toFixed(2)}` },
    { key: 'cantidad', title: 'Cantidad', render: (_, row) => (
      <Input type="number" min="1" value={row.cantidad} onChange={(e) => updateQty(row.id, e.target.value)} />
    ) },
    { key: 'total', title: 'Total', render: (_, row) => `S/ ${(Number(row.precio) * Number(row.cantidad)).toFixed(2)}` }
  ];

  return (
    <div className="page">
      <div className="row-16" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
        <h1 className="section-title">Carrito</h1>
        <Button variant="primary" onClick={() => navigate('/web/checkout')} disabled={items.length === 0}>Continuar</Button>
      </div>

      <Table
        columns={columns}
        data={items}
        emptyMessage="Carrito vacío"
        renderActions={(row) => (
          <Button
            variant="danger"
            size="small"
            onlyIcon
            title="Eliminar"
            onClick={(e) => { e.stopPropagation(); removeItem(row.id); }}
            icon={<Trash2 size={16} />}
          />
        )}
      />

      <div className="card" style={{ padding: 16, maxWidth: 320, marginLeft: 'auto', marginTop: 12 }}>
        <div className="row-12" style={{ justifyContent: 'space-between' }}>
          <span>Subtotal</span>
          <strong>S/ {subtotal.toFixed(2)}</strong>
        </div>
        <div className="row-12" style={{ justifyContent: 'space-between' }}>
          <span>IGV (18%)</span>
          <strong>S/ {igv.toFixed(2)}</strong>
        </div>
        <div className="row-12" style={{ justifyContent: 'space-between' }}>
          <span>Total</span>
          <strong>S/ {total.toFixed(2)}</strong>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
