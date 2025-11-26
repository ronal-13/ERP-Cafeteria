import React, { useState } from 'react';
import { useInventario, useInsumos, useProveedores, useMovimientos, useAlertasStock } from '../hooks/useInventario';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { Form, FormGroup, FormActions } from '../components/forms/Form';
import { Pencil, Trash2, Wrench, List } from 'lucide-react';

const InventarioPage = () => {
  const { productos, loading, crearProducto, editarProducto, eliminarProducto, actualizarStock, ajustarInventarioSet } = useInventario();
  const { insumos } = useInsumos();
  const { proveedores } = useProveedores();
  const { movimientos, registrarMovimiento, getMovimientosByProducto, calcularConsumo } = useMovimientos();
  const { alertas } = useAlertasStock();
  
  const [activeTab, setActiveTab] = useState('productos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMovimientoModalOpen, setIsMovimientoModalOpen] = useState(false);
  const [isAjusteModalOpen, setIsAjusteModalOpen] = useState(false);
  const [isMovProdModalOpen, setIsMovProdModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    stock: '',
    stockMinimo: '',
    precioCompra: '',
    precioVenta: '',
    unidad: '',
    proveedor: ''
  });
  
  const [movimientoData, setMovimientoData] = useState({
    tipo: 'Entrada',
    producto: '',
    cantidad: '',
    motivo: '',
    responsable: ''
  });

  const [ajusteData, setAjusteData] = useState({
    producto: '',
    nuevoStock: '',
    motivo: 'Ajuste de inventario',
    responsable: ''
  });

  const [movsProducto, setMovsProducto] = useState([]);
  const [consumoPeriodo, setConsumoPeriodo] = useState('dia');
  const [consumoData, setConsumoData] = useState([]);

  const columnsProductos = [
    { key: 'nombre', title: 'Producto' },
    { key: 'categoria', title: 'Categoría' },
    { 
      key: 'stock', 
      title: 'Stock',
      render: (value, row) => (
        <span className={`badge ${value <= row.stockMinimo ? 'badge-red' : 'badge-green'}`}>
          {value} {row.unidad}
        </span>
      )
    },
    { key: 'stockMinimo', title: 'Stock Mínimo' },
    { key: 'precioCompra', title: 'Precio Compra', render: (value) => `S/ ${value.toFixed(2)}` },
    { key: 'precioVenta', title: 'Precio Venta', render: (value) => `S/ ${value.toFixed(2)}` },
    { key: 'proveedor', title: 'Proveedor' }
  ];

  const columnsInsumos = [
    { key: 'nombre', title: 'Insumo' },
    { key: 'categoria', title: 'Categoría' },
    { key: 'stock', title: 'Stock' },
    { key: 'stockMinimo', title: 'Stock Mínimo' },
    { key: 'unidad', title: 'Unidad' },
    { key: 'costoUnitario', title: 'Costo Unitario', render: (value) => `S/ ${value.toFixed(2)}` },
    { key: 'proveedor', title: 'Proveedor' }
  ];

  const columnsMovimientos = [
    { key: 'fecha', title: 'Fecha' },
    { 
      key: 'tipo', 
      title: 'Tipo',
      render: (value) => (
        <span className={`badge ${value === 'Entrada' ? 'badge-green' : 'badge-red'}`}>{value}</span>
      )
    },
    { key: 'producto', title: 'Producto' },
    { key: 'cantidad', title: 'Cantidad' },
    { key: 'motivo', title: 'Motivo' },
    { key: 'responsable', title: 'Responsable' }
  ];

  const handleNuevoProducto = () => {
    setEditMode(false);
    setSelectedProducto(null);
    setFormData({
      nombre: '',
      categoria: '',
      stock: '',
      stockMinimo: '',
      precioCompra: '',
      precioVenta: '',
      unidad: '',
      proveedor: ''
    });
    setIsModalOpen(true);
  };

  const handleEditarProducto = (row) => {
    setEditMode(true);
    setSelectedProducto(row);
    setFormData({
      nombre: row.nombre,
      categoria: row.categoria,
      stock: row.stock,
      stockMinimo: row.stockMinimo,
      precioCompra: row.precioCompra,
      precioVenta: row.precioVenta,
      unidad: row.unidad,
      proveedor: row.proveedor || ''
    });
    setIsModalOpen(true);
  };

  const handleEliminarProducto = async (row) => {
    if (window.confirm('¿Eliminar este producto?')) {
      await eliminarProducto(row.id);
    }
  };

  const handleAjusteProducto = (row) => {
    setAjusteData({ producto: row.nombre, nuevoStock: row.stock, motivo: 'Ajuste de inventario', responsable: '' });
    setSelectedProducto(row);
    setIsAjusteModalOpen(true);
  };

  const handleVerMovimientos = async (row) => {
    const data = await getMovimientosByProducto(row.nombre);
    setMovsProducto(data);
    setSelectedProducto(row);
    setIsMovProdModalOpen(true);
  };

  const handleNuevoMovimiento = () => {
    setMovimientoData({
      tipo: 'Entrada',
      producto: '',
      cantidad: '',
      motivo: '',
      responsable: ''
    });
    setIsMovimientoModalOpen(true);
  };

  const handleSubmitProducto = async (e) => {
    e.preventDefault();
    try {
      if (editMode && selectedProducto) {
        await editarProducto(selectedProducto.id, { ...formData });
      } else {
        await crearProducto(formData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al crear producto:', error);
    }
  };

  const handleSubmitMovimiento = async (e) => {
    e.preventDefault();
    try {
      await registrarMovimiento(movimientoData);
      await actualizarStock(
        productos.find(p => p.nombre === movimientoData.producto)?.id,
        parseFloat(movimientoData.cantidad),
        movimientoData.tipo === 'Entrada' ? 'entrada' : 'salida'
      );
      setIsMovimientoModalOpen(false);
    } catch (error) {
      console.error('Error al registrar movimiento:', error);
    }
  };

  const opcionesCategoria = [
    { value: 'Bebidas', label: 'Bebidas' },
    { value: 'Panadería', label: 'Panadería' },
    { value: 'Lácteos', label: 'Lácteos' },
    { value: 'Insumos', label: 'Insumos' }
  ];

  const opcionesUnidad = [
    { value: 'unidad', label: 'Unidad' },
    { value: 'kg', label: 'Kilogramo' },
    { value: 'litro', label: 'Litro' },
    { value: 'docena', label: 'Docena' }
  ];

  const opcionesProveedor = proveedores.map(prov => ({
    value: prov.nombre,
    label: prov.nombre
  }));

  const opcionesProducto = productos.map(prod => ({
    value: prod.nombre,
    label: prod.nombre
  }));

  const opcionesTipoMovimiento = [
    { value: 'Entrada', label: 'Entrada' },
    { value: 'Salida', label: 'Salida' }
  ];

  const consumoColumns = [
    { key: 'producto', title: 'Producto' },
    { key: 'periodoClave', title: 'Periodo' },
    { key: 'cantidad', title: 'Cantidad' }
  ];

  const recalcConsumo = async () => {
    const data = await calcularConsumo(consumoPeriodo);
    setConsumoData(data);
  };

  return (
    <div className="page">
      <div className="row-16" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
        <h1 className="section-title title-strong">Gestión de Inventario</h1>
        <div className="row-12">
          <Button onClick={handleNuevoProducto} variant="success" disabled={loading}>Nuevo Producto</Button>
          <Button onClick={handleNuevoMovimiento} variant="warning" disabled={loading}>Registrar Movimiento</Button>
        </div>
      </div>

      {alertas.length > 0 && (
        <div className="card" style={{ borderColor: '#fecaca' }}>
          <h3 className="section-title">Alertas de Stock Bajo</h3>
          <ul className="stack-12">
            {alertas.map((alerta, index) => (
              <li key={index} className="stat-label" style={{ color: '#991b1b' }}>
                {alerta.nombre}: {alerta.stock} unidades (mínimo: {alerta.stockMinimo})
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="card">
        <div className="tabs">
          {['productos', 'insumos', 'movimientos'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'productos' && (
          <Table 
            columns={columnsProductos} 
            data={productos} 
            emptyMessage="No hay productos registrados"
            renderActions={(row) => (
              <>
                <Button
                  variant="primary"
                  size="small"
                  onlyIcon
                  title="Editar"
                  onClick={(e) => { e.stopPropagation(); handleEditarProducto(row); }}
                  icon={<Pencil size={16} />}
                />
                <Button
                  variant="danger"
                  size="small"
                  onlyIcon
                  title="Eliminar"
                  onClick={(e) => { e.stopPropagation(); handleEliminarProducto(row); }}
                  icon={<Trash2 size={16} />}
                />
                <Button
                  variant="secondary"
                  size="small"
                  onlyIcon
                  title="Movimientos"
                  onClick={(e) => { e.stopPropagation(); handleVerMovimientos(row); }}
                  icon={<List size={16} />}
                />
                <Button
                  variant="secondary"
                  size="small"
                  onlyIcon
                  title="Ajustar"
                  onClick={(e) => { e.stopPropagation(); handleAjusteProducto(row); }}
                  icon={<Wrench size={16} />}
                />
              </>
            )}
          />
        )}
        {activeTab === 'insumos' && (
          <Table columns={columnsInsumos} data={insumos} emptyMessage="No hay insumos registrados" />
        )}
        {activeTab === 'movimientos' && (
          <Table columns={columnsMovimientos} data={movimientos} emptyMessage="No hay movimientos registrados" />
        )}
      </div>

      {/* Modal para nuevo producto */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editMode ? 'Editar Producto' : 'Nuevo Producto'}
      >
        <Form onSubmit={handleSubmitProducto}>
          <FormGroup>
            <Input
              label="Nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              placeholder="Nombre del producto"
              required
            />
            <Select
              label="Categoría"
              options={opcionesCategoria}
              value={formData.categoria}
              onChange={(e) => setFormData({...formData, categoria: e.target.value})}
              required
            />
            <Input
              label="Stock Inicial"
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({...formData, stock: parseFloat(e.target.value)})}
              placeholder="0"
              required
            />
            <Input
              label="Stock Mínimo"
              type="number"
              value={formData.stockMinimo}
              onChange={(e) => setFormData({...formData, stockMinimo: parseFloat(e.target.value)})}
              placeholder="0"
              required
            />
            <Input
              label="Precio de Compra"
              type="number"
              step="0.01"
              value={formData.precioCompra}
              onChange={(e) => setFormData({...formData, precioCompra: parseFloat(e.target.value)})}
              placeholder="0.00"
              required
            />
            <Input
              label="Precio de Venta"
              type="number"
              step="0.01"
              value={formData.precioVenta}
              onChange={(e) => setFormData({...formData, precioVenta: parseFloat(e.target.value)})}
              placeholder="0.00"
              required
            />
            <Select
              label="Unidad"
              options={opcionesUnidad}
              value={formData.unidad}
              onChange={(e) => setFormData({...formData, unidad: e.target.value})}
              required
            />
            <Select
              label="Proveedor"
              options={opcionesProveedor}
              value={formData.proveedor}
              onChange={(e) => setFormData({...formData, proveedor: e.target.value})}
              required
            />
          </FormGroup>
          
          <FormActions>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Guardar
            </Button>
          </FormActions>
        </Form>
      </Modal>

      {/* Modal para nuevo movimiento */}
      <Modal
        isOpen={isMovimientoModalOpen}
        onClose={() => setIsMovimientoModalOpen(false)}
        title="Registrar Movimiento"
      >
        <Form onSubmit={handleSubmitMovimiento}>
          <FormGroup>
            <Select
              label="Tipo de Movimiento"
              options={opcionesTipoMovimiento}
              value={movimientoData.tipo}
              onChange={(e) => setMovimientoData({...movimientoData, tipo: e.target.value})}
              required
            />
            <Select
              label="Producto"
              options={opcionesProducto}
              value={movimientoData.producto}
              onChange={(e) => setMovimientoData({...movimientoData, producto: e.target.value})}
              required
            />
            <Input
              label="Cantidad"
              type="number"
              step="0.01"
              value={movimientoData.cantidad}
              onChange={(e) => setMovimientoData({...movimientoData, cantidad: parseFloat(e.target.value)})}
              placeholder="0.00"
              required
            />
            <Input
              label="Motivo"
              value={movimientoData.motivo}
              onChange={(e) => setMovimientoData({...movimientoData, motivo: e.target.value})}
              placeholder="Motivo del movimiento"
              required
            />
            <Input
              label="Responsable"
              value={movimientoData.responsable}
              onChange={(e) => setMovimientoData({...movimientoData, responsable: e.target.value})}
              placeholder="Nombre del responsable"
              required
            />
          </FormGroup>
          
          <FormActions>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsMovimientoModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Registrar
            </Button>
          </FormActions>
        </Form>
      </Modal>

      <Modal
        isOpen={isAjusteModalOpen}
        onClose={() => setIsAjusteModalOpen(false)}
        title="Ajustar Inventario"
      >
        <Form onSubmit={async (e) => {
          e.preventDefault();
          try {
            const id = selectedProducto?.id;
            await ajustarInventarioSet(id, parseFloat(ajusteData.nuevoStock), ajusteData.responsable, ajusteData.motivo);
            setIsAjusteModalOpen(false);
          } catch (err) { console.error('Error al ajustar inventario:', err); }
        }}>
          <FormGroup>
            <Input label="Producto" value={ajusteData.producto} onChange={() => {}} disabled />
            <Input label="Nuevo Stock" type="number" value={ajusteData.nuevoStock} onChange={(e) => setAjusteData({...ajusteData, nuevoStock: e.target.value})} required />
            <Input label="Motivo" value={ajusteData.motivo} onChange={(e) => setAjusteData({...ajusteData, motivo: e.target.value})} />
            <Input label="Responsable" value={ajusteData.responsable} onChange={(e) => setAjusteData({...ajusteData, responsable: e.target.value})} />
          </FormGroup>
          <FormActions>
            <Button type="button" variant="secondary" onClick={() => setIsAjusteModalOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="primary">Guardar</Button>
          </FormActions>
        </Form>
      </Modal>

      <Modal
        isOpen={isMovProdModalOpen}
        onClose={() => setIsMovProdModalOpen(false)}
        title={`Movimientos - ${selectedProducto?.nombre || ''}`}
      >
        <div className="card">
          <Table columns={columnsMovimientos} data={movsProducto} emptyMessage="Sin movimientos" />
        </div>
      </Modal>
    </div>
  );
};

export default InventarioPage;
