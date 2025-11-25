import React, { useMemo, useState, useEffect } from 'react';
import { useVentas, useClientes } from '../hooks/useVentas';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { Form, FormGroup, FormActions } from '../components/forms/Form';

const VentasPage = () => {
  const { ventas, loading, crearVenta, actualizarVenta, eliminarVenta, anularVenta, generarPDF, enviarComprobanteEmail, refetch } = useVentas();
  const { clientes } = useClientes();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [filtros, setFiltros] = useState({ desde: '', hasta: '', cliente: '', metodoPago: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    cliente: '',
    empleado: '',
    canal: 'Mostrador',
    tipoComprobante: 'Boleta',
    metodoPago: 'Efectivo',
    descuento: 0,
    total: 0,
    productos: []
  });

  const IGV = 0.18;

  const totales = useMemo(() => {
    const subtotal = (formData.productos || []).reduce((acc, p) => acc + (Number(p.precio || 0) * Number(p.cantidad || 0)) - (Number(p.descuento || 0)), 0);
    const base = Math.max(0, subtotal);
    const igv = Math.round(base * IGV * 100) / 100;
    const total = Math.round((base + igv) * 100) / 100;
    return { subtotal: Math.round(subtotal * 100) / 100, igv, total };
  }, [formData.productos]);

  useEffect(() => {
    if (!isNaN(totales.total)) {
      setFormData(prev => ({ ...prev, total: totales.total }));
    }
  }, [totales.total]);

  const columns = [
    { key: 'fecha', title: 'Fecha' },
    { key: 'cliente', title: 'Cliente' },
    { key: 'tipoComprobante', title: 'Tipo' },
    { key: 'numeroComprobante', title: 'Número' },
    { key: 'total', title: 'Total', render: (value) => `S/ ${value.toFixed(2)}` },
    { key: 'metodoPago', title: 'Método de Pago' },
    { 
      key: 'estado', 
      title: 'Estado',
      render: (value) => (
        <span className={`badge ${value === 'Completado' ? 'badge-green' : 'badge-yellow'}`}>{value}</span>
      )
    }
  ];

  const handleNuevaVenta = () => {
    setVentaSeleccionada(null);
    setFormData({
      cliente: '',
      empleado: '',
      canal: 'Mostrador',
      tipoComprobante: 'Boleta',
      metodoPago: 'Efectivo',
      descuento: 0,
      total: '',
      productos: []
    });
    setIsModalOpen(true);
  };

  const handleEditarVenta = (venta) => {
    setVentaSeleccionada(venta);
    setFormData({
      cliente: venta.cliente,
      empleado: venta.empleado || '',
      canal: venta.canal || 'Mostrador',
      tipoComprobante: venta.tipoComprobante,
      metodoPago: venta.metodoPago,
      descuento: venta.descuento || 0,
      total: venta.total,
      productos: (venta.productos || []).map(p => ({ nombre: p.nombre, cantidad: p.cantidad, precio: p.precio, descuento: p.descuento || 0 }))
    });
    setIsModalOpen(true);
  };

  const handleEliminarVenta = async (venta) => {
    if (window.confirm('¿Está seguro de eliminar esta venta?')) {
      await eliminarVenta(venta.id);
    }
  };

  const handleAnularVenta = async (venta) => {
    if (venta.estado === 'Anulado') return;
    if (window.confirm('¿Anular esta venta y revertir stock?')) {
      await anularVenta(venta.id, 'Anulación solicitada desde listado');
    }
  };

  const handlePDF = async (venta) => {
    const pdf = await generarPDF(venta.id);
    if (pdf) alert(`PDF generado: ${pdf.id}`);
  };

  const handleEmail = async (venta) => {
    const email = prompt('Correo destino del comprobante:', 'cliente@correo.com');
    if (email) {
      const ok = await enviarComprobanteEmail(venta.id, email);
      if (ok) alert('Comprobante enviado');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrorMsg('');
      if (ventaSeleccionada) {
        await actualizarVenta(ventaSeleccionada.id, formData);
      } else {
        await crearVenta(formData);
      }
      setIsModalOpen(false);
    } catch (error) {
      setErrorMsg(error?.message || 'Error al guardar venta');
    }
  };

  const aplicarFiltros = async () => {
    await refetch({ ...filtros });
  };

  const addProducto = () => {
    setFormData(prev => ({ ...prev, productos: [...prev.productos, { nombre: '', cantidad: 1, precio: 0, descuento: 0 }] }));
  };

  const updateProducto = (idx, field, value) => {
    setFormData(prev => ({
      ...prev,
      productos: prev.productos.map((p, i) => i === idx ? { ...p, [field]: field === 'nombre' ? value : Number(value) } : p)
    }));
  };

  const removeProducto = (idx) => {
    setFormData(prev => ({ ...prev, productos: prev.productos.filter((_, i) => i !== idx) }));
  };

  const opcionesClientes = clientes.map(cliente => ({
    value: cliente.nombre,
    label: cliente.nombre
  }));

  const opcionesComprobante = [
    { value: 'Boleta', label: 'Boleta' },
    { value: 'Factura', label: 'Factura' }
  ];

  const opcionesPago = [
    { value: 'Efectivo', label: 'Efectivo' },
    { value: 'Tarjeta', label: 'Tarjeta' },
    { value: 'Yape', label: 'Yape' },
    { value: 'Plin', label: 'Plin' },
    { value: 'Transferencia', label: 'Transferencia' }
  ];

  const opcionesCanal = [
    { value: 'Mostrador', label: 'Mostrador' },
    { value: 'Delivery', label: 'Delivery' },
    { value: 'Web', label: 'Web' }
  ];

  return (
    <div className="page">
      <div className="row-16" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
        <h1 className="section-title">Gestión de Ventas</h1>
        <Button onClick={handleNuevaVenta} variant="success" disabled={loading}>Nueva Venta</Button>
      </div>

      {errorMsg && (
        <div className="alert alert-danger" style={{ marginBottom: 12 }}>
          {errorMsg}
        </div>
      )}

      <div className="card" style={{ marginBottom: 16, padding: 16 }}>
        <div className="row-16" style={{ gap: 12, alignItems: 'flex-end' }}>
          <Input label="Desde" type="date" value={filtros.desde} onChange={(e) => setFiltros({ ...filtros, desde: e.target.value })} />
          <Input label="Hasta" type="date" value={filtros.hasta} onChange={(e) => setFiltros({ ...filtros, hasta: e.target.value })} />
          <Input label="Cliente" value={filtros.cliente} onChange={(e) => setFiltros({ ...filtros, cliente: e.target.value })} placeholder="Nombre" />
          <Select label="Método de Pago" options={opcionesPago} value={filtros.metodoPago || ''} onChange={(e) => setFiltros({ ...filtros, metodoPago: e.target.value })} />
          <Button variant="primary" onClick={aplicarFiltros} disabled={loading}>Filtrar</Button>
        </div>
      </div>

      <div className="card">
        <Table
          columns={columns}
          data={ventas}
          onEdit={handleEditarVenta}
          onDelete={handleEliminarVenta}
          renderActions={(row) => (
            <>
              <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); handleEditarVenta(row); }}>Ver</button>
              <button className="btn" onClick={(e) => { e.stopPropagation(); handlePDF(row); }}>PDF</button>
              <button className="btn" onClick={(e) => { e.stopPropagation(); handleEmail(row); }}>Email</button>
              <button disabled={row.estado === 'Anulado'} className="btn btn-warning" onClick={(e) => { e.stopPropagation(); handleAnularVenta(row); }}>Anular</button>
            </>
          )}
          emptyMessage="No hay ventas registradas"
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={ventaSeleccionada ? 'Editar Venta' : 'Nueva Venta'}
      >
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Input
              label="Empleado"
              value={formData.empleado}
              onChange={(e) => setFormData({...formData, empleado: e.target.value})}
              placeholder="Nombre del vendedor"
              required
            />
            <Select
              label="Canal"
              options={opcionesCanal}
              value={formData.canal}
              onChange={(e) => setFormData({...formData, canal: e.target.value})}
              required
            />
            <Select
              label="Cliente"
              options={opcionesClientes}
              value={formData.cliente}
              onChange={(e) => setFormData({...formData, cliente: e.target.value})}
              required
            />
            <Select
              label="Tipo de Comprobante"
              options={opcionesComprobante}
              value={formData.tipoComprobante}
              onChange={(e) => setFormData({...formData, tipoComprobante: e.target.value})}
              required
            />
            <Select
              label="Método de Pago"
              options={opcionesPago}
              value={formData.metodoPago}
              onChange={(e) => setFormData({...formData, metodoPago: e.target.value})}
              required
            />
            <Input
              label="Descuento %"
              type="number"
              value={formData.descuento}
              onChange={(e) => setFormData({...formData, descuento: parseFloat(e.target.value) || 0})}
              placeholder="0"
            />
          </FormGroup>

          <div className="card" style={{ padding: 12, marginTop: 8 }}>
            <div className="row-16" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
              <h3 className="section-title">Productos</h3>
              <Button type="button" variant="secondary" onClick={addProducto}>Agregar</Button>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Desc. línea</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {formData.productos.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: '#6b7280', padding: 8 }}>Sin productos</td></tr>
                ) : formData.productos.map((p, idx) => {
                  const subtotal = Math.max(0, (Number(p.precio || 0) * Number(p.cantidad || 0)) - Number(p.descuento || 0));
                  return (
                    <tr key={idx}>
                      <td><Input value={p.nombre} onChange={(e) => updateProducto(idx, 'nombre', e.target.value)} placeholder="Nombre" /></td>
                      <td><Input type="number" value={p.cantidad} onChange={(e) => updateProducto(idx, 'cantidad', e.target.value)} /></td>
                      <td><Input type="number" step="0.01" value={p.precio} onChange={(e) => updateProducto(idx, 'precio', e.target.value)} /></td>
                      <td><Input type="number" step="0.01" value={p.descuento || 0} onChange={(e) => updateProducto(idx, 'descuento', e.target.value)} /></td>
                      <td>S/ {subtotal.toFixed(2)}</td>
                      <td><button type="button" className="btn btn-danger" onClick={() => removeProducto(idx)}>Quitar</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="row-16" style={{ justifyContent: 'flex-end', gap: 16, marginTop: 8 }}>
              <div className="stat">
                <div className="stat-label">Subtotal</div>
                <div className="stat-value">S/ {totales.subtotal.toFixed(2)}</div>
              </div>
              <div className="stat">
                <div className="stat-label">IGV (18%)</div>
                <div className="stat-value">S/ {totales.igv.toFixed(2)}</div>
              </div>
              <div className="stat">
                <div className="stat-label">Total</div>
                <div className="stat-value">S/ {totales.total.toFixed(2)}</div>
              </div>
            </div>
          </div>
          
          <FormActions>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {ventaSeleccionada ? 'Actualizar' : 'Guardar'}
            </Button>
          </FormActions>
        </Form>
      </Modal>
    </div>
  );
};

export default VentasPage;
