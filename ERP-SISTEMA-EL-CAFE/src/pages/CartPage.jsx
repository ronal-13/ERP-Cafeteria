import React from 'react';
import { useCart } from '../hooks/useEcommerce';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Input from '../components/common/Input';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart, ArrowRight, Package, Banknote } from 'lucide-react';

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
        <div className="title-wrap">
          <span className="kpi-icon"><ShoppingCart size={18} /></span>
          <h1 className="section-title title-strong">Carrito</h1>
        </div>
        <Button
          variant="primary"
          icon={<ArrowRight size={18} />}
          onClick={() => navigate('/web/checkout')}
          disabled={items.length === 0}
        >Continuar</Button>
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
            <div className="kpi-icon"><Banknote size={18} /></div>
            <div>
              <div className="kpi-head">
                <div className="kpi-value">S/ {total.toFixed(2)}</div>
                <div className="kpi-label">Total</div>
              </div>
              <div className="kpi-foot">Incluye IGV</div>
            </div>
          </div>
        </div>
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
