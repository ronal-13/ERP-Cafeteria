import React, { useState } from 'react';
import { useWebAdmin } from '../hooks/useEcommerce';
import { usePromotions } from '../hooks/usePromotions';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import { Form, FormGroup, FormActions } from '../components/forms/Form';
import { Pencil, Trash2 } from 'lucide-react';

const AdminWebDashboard = () => {
  const { productos, pedidos, loading, error, refetchProductos, refetchPedidos, crearProductoWeb, editarProductoWeb, eliminarProductoWeb } = useWebAdmin();
  const { promos, crear: crearPromo, eliminar: eliminarPromo } = usePromotions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [form, setForm] = useState({ sku: '', nombre: '', descripcion: '', precio: 0, stock: 0, categoria: '', activo: true });
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [promoForm, setPromoForm] = useState({ titulo: '', descripcion: '', categoria: '' });

  const colsProductos = [
    { key: 'sku', title: 'SKU' },
    { key: 'nombre', title: 'Nombre' },
    { key: 'precio', title: 'Precio', render: (v) => `S/ ${Number(v || 0).toFixed(2)}` },
    { key: 'stock', title: 'Stock' },
    { key: 'categoria', title: 'Categoría' },
    { key: 'activo', title: 'Activo', render: (v) => (v ? 'Sí' : 'No') }
  ];

  const colsPedidos = [
    { key: 'id', title: 'ID' },
    { key: 'fecha', title: 'Fecha' },
    { key: 'cliente', title: 'Cliente', render: (v, row) => row.cliente?.nombre || '-' },
    { key: 'total', title: 'Total', render: (v) => `S/ ${Number(v || 0).toFixed(2)}` },
    { key: 'metodoPago', title: 'Pago' },
    { key: 'estado', title: 'Estado' }
  ];

  const openNew = () => {
    setEditRow(null);
    setForm({ sku: '', nombre: '', descripcion: '', precio: 0, stock: 0, categoria: '', activo: true });
    setIsModalOpen(true);
  };

  const openEdit = (row) => {
    setEditRow(row);
    setForm({ sku: row.sku, nombre: row.nombre, descripcion: row.descripcion, precio: row.precio, stock: row.stock, categoria: row.categoria || '', activo: !!row.activo });
    setIsModalOpen(true);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (editRow) {
      await editarProductoWeb(editRow.id, { ...form, precio: Number(form.precio), stock: Number(form.stock) });
    } else {
      await crearProductoWeb({ ...form, precio: Number(form.precio), stock: Number(form.stock) });
    }
    setIsModalOpen(false);
  };

  const submitPromoForm = async (e) => {
    e.preventDefault();
    await crearPromo({ ...promoForm });
    setIsPromoModalOpen(false);
    setPromoForm({ titulo: '', descripcion: '', categoria: '' });
  };

  return (
    <div className="page">
      <div className="row-16" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
        <h1 className="section-title">Admin Web</h1>
        <div className="row-12">
          <Button onClick={openNew}>Nuevo Producto</Button>
          <Button variant="secondary" onClick={() => refetchProductos()}>Sincronizar Stock</Button>
          <Button variant="secondary" onClick={() => refetchPedidos()}>Actualizar Pedidos</Button>
          <Button variant="secondary" onClick={() => setIsPromoModalOpen(true)}>Nueva Promoción</Button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card" style={{ padding: 12, marginBottom: 12 }}>
        <h2 className="section-title">Productos Web</h2>
        <Table
          columns={colsProductos}
          data={productos}
          emptyMessage={loading ? 'Cargando...' : 'Sin productos'}
          renderActions={(row) => (
            <>
              <Button
                variant="primary"
                size="small"
                onlyIcon
                title="Editar"
                onClick={(e) => { e.stopPropagation(); openEdit(row); }}
                icon={<Pencil size={16} />}
              />
              <Button
                variant="danger"
                size="small"
                onlyIcon
                title="Eliminar"
                onClick={(e) => { e.stopPropagation(); eliminarProductoWeb(row.id); }}
                icon={<Trash2 size={16} />}
              />
            </>
          )}
        />
      </div>

      <div className="card" style={{ padding: 12 }}>
        <h2 className="section-title">Pedidos Web</h2>
        <Table columns={colsPedidos} data={pedidos} emptyMessage={loading ? 'Cargando...' : 'Sin pedidos'} />
      </div>

      <div className="card" style={{ padding: 12, marginTop: 12 }}>
        <h2 className="section-title">Promociones</h2>
        <Table
          columns={[
            { key: 'titulo', title: 'Título' },
            { key: 'categoria', title: 'Categoría' },
          ]}
          data={promos}
          emptyMessage={'Sin promociones'}
          renderActions={(row) => (
            <Button
              variant="danger"
              size="small"
              onClick={(e) => { e.stopPropagation(); eliminarPromo(row.id); }}
            >Eliminar</Button>
          )}
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editRow ? 'Editar Producto Web' : 'Nuevo Producto Web'}>
        <Form onSubmit={submitForm}>
          <FormGroup>
            <Input label="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
            <Input label="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
          </FormGroup>
          <FormGroup>
            <Input label="Descripción" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
          </FormGroup>
          <FormGroup>
            <Input label="Precio" type="number" step="0.01" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} />
            <Input label="Stock" type="number" step="1" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          </FormGroup>
          <FormGroup>
            <Input label="Categoría" value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} />
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={form.activo} onChange={(e) => setForm({ ...form, activo: e.target.checked })} /> Activo
            </label>
          </FormGroup>
          <FormActions>
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="primary">Guardar</Button>
          </FormActions>
        </Form>
      </Modal>

      <Modal isOpen={isPromoModalOpen} onClose={() => setIsPromoModalOpen(false)} title={'Nueva Promoción'}>
        <Form onSubmit={submitPromoForm}>
          <FormGroup>
            <Input label="Título" value={promoForm.titulo} onChange={(e) => setPromoForm({ ...promoForm, titulo: e.target.value })} required />
          </FormGroup>
          <FormGroup>
            <Input label="Descripción" value={promoForm.descripcion} onChange={(e) => setPromoForm({ ...promoForm, descripcion: e.target.value })} />
          </FormGroup>
          <FormGroup>
            <Input label="Categoría" value={promoForm.categoria} onChange={(e) => setPromoForm({ ...promoForm, categoria: e.target.value })} />
          </FormGroup>
          <FormActions>
            <Button type="button" variant="secondary" onClick={() => setIsPromoModalOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="primary">Guardar</Button>
          </FormActions>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminWebDashboard;
