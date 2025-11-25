import React, { useState } from 'react';
import { useWebCatalog, useCart } from '../hooks/useEcommerce';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import Table from '../components/common/Table';

const WebShopPage = () => {
  const { productos, filtros, setFiltros, loading } = useWebCatalog({ pollingMs: 15000 });
  const { addItem } = useCart();
  const [categoria, setCategoria] = useState('');

  const columns = [
    { key: 'nombre', title: 'Producto' },
    { key: 'descripcion', title: 'Descripción' },
    { key: 'precio', title: 'Precio', render: (v) => `S/ ${Number(v || 0).toFixed(2)}` },
    { key: 'stock', title: 'Stock' }
  ];

  return (
    <div className="page">
      <div className="row-16" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
        <h1 className="section-title">Web Shop</h1>
        <div className="row-12">
          <Input placeholder="Buscar" value={filtros.q} onChange={(e) => setFiltros({ ...filtros, q: e.target.value })} />
          <Select value={categoria} onChange={(v) => { setCategoria(v); setFiltros({ ...filtros, categoria: v }); }} options={[{ value: '', label: 'Todas' }, { value: 'Bebidas', label: 'Bebidas' }, { value: 'Panadería', label: 'Panadería' }]} />
        </div>
      </div>

      <Table
        columns={columns}
        data={productos}
        emptyMessage={loading ? 'Cargando...' : 'No hay productos'}
        renderActions={(row) => (
          <Button onClick={(e) => { e.stopPropagation(); addItem(row, 1); }}>Agregar</Button>
        )}
      />
    </div>
  );
};

export default WebShopPage;
