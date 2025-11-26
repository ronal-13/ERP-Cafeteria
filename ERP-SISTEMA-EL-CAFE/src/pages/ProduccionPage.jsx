import React, { useState } from 'react';
import { useProduccion, useRecetas, useConsumoInsumos } from '../hooks/useProduccion';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { Form, FormGroup, FormActions } from '../components/forms/Form';
import { Pencil, Trash2 } from 'lucide-react';

const ProduccionPage = () => {
  const { produccion, registrarProduccion } = useProduccion();
  const { recetas, crearReceta, editarReceta, eliminarReceta } = useRecetas();
  const { consumoInsumos } = useConsumoInsumos();
  
  const [activeTab, setActiveTab] = useState('produccion');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecetaModalOpen, setIsRecetaModalOpen] = useState(false);
  const [recetaEditMode, setRecetaEditMode] = useState(false);
  const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);
  const [formData, setFormData] = useState({
    producto: '',
    cantidadPlaneada: '',
    cantidadProducida: '',
    responsable: ''
  });
  
  const [recetaData, setRecetaData] = useState({
    nombre: '',
    descripcion: '',
    tiempoPreparacion: '',
    porciones: '',
    manoObra: '',
    insumos: []
  });

  const columnsProduccion = [
    { key: 'fecha', title: 'Fecha' },
    { key: 'producto', title: 'Producto' },
    { key: 'cantidadPlaneada', title: 'Cantidad Planeada' },
    { key: 'cantidadProducida', title: 'Cantidad Producida' },
    { 
      key: 'rendimiento', 
      title: 'Rendimiento %',
      render: (value) => (
        <span className={`badge ${value >= 90 ? 'badge-green' : value >= 70 ? 'badge-yellow' : 'badge-red'}`}>{value}%</span>
      )
    },
    { key: 'mermas', title: 'Mermas' },
    { key: 'costoTotal', title: 'Costo Total', render: (value) => `S/ ${value.toFixed(2)}` },
    { key: 'responsable', title: 'Responsable' },
    { 
      key: 'estado', 
      title: 'Estado',
      render: (value) => (
        <span className={`badge ${value === 'Completado' ? 'badge-green' : 'badge-blue'}`}>{value}</span>
      )
    }
  ];

  const columnsRecetas = [
    { key: 'nombre', title: 'Nombre' },
    { key: 'descripcion', title: 'Descripción' },
    { key: 'tiempoPreparacion', title: 'Tiempo (min)' },
    { key: 'porciones', title: 'Porciones' },
    { key: 'costoProduccion', title: 'Costo Producción', render: (value) => `S/ ${value.toFixed(2)}` },
    { 
      key: 'insumos', 
      title: 'Insumos',
      render: (value) => (
        <ul className="text-sm">
          {value.map((insumo, index) => (
            <li key={index}>{insumo.insumo}: {insumo.cantidad} {insumo.unidad}</li>
          ))}
        </ul>
      )
    }
  ];

  const columnsConsumo = [
    { key: 'fecha', title: 'Fecha' },
    { key: 'insumo', title: 'Insumo' },
    { key: 'cantidadConsumida', title: 'Cantidad Consumida' },
    { key: 'unidad', title: 'Unidad' },
    { key: 'produccion', title: 'Producción' },
    { key: 'responsable', title: 'Responsable' }
  ];

  const handleNuevaProduccion = () => {
    setFormData({
      producto: '',
      cantidadPlaneada: '',
      cantidadProducida: '',
      responsable: ''
    });
    setIsModalOpen(true);
  };

  const handleNuevaReceta = () => {
    setRecetaEditMode(false);
    setRecetaSeleccionada(null);
    setRecetaData({
      nombre: '',
      descripcion: '',
      tiempoPreparacion: '',
      porciones: '',
      manoObra: '',
      insumos: []
    });
    setIsRecetaModalOpen(true);
  };

  const handleEditarReceta = (receta) => {
    setRecetaEditMode(true);
    setRecetaSeleccionada(receta);
    setRecetaData({
      nombre: receta.nombre,
      descripcion: receta.descripcion,
      tiempoPreparacion: receta.tiempoPreparacion,
      porciones: receta.porciones,
      manoObra: receta.manoObra || 0,
      insumos: (receta.insumos || []).map(i => ({ insumo: i.insumo, cantidad: i.cantidad, unidad: i.unidad, costo: i.costo }))
    });
    setIsRecetaModalOpen(true);
  };

  const handleEliminarReceta = async (receta) => {
    if (window.confirm('¿Eliminar esta receta?')) {
      await eliminarReceta(receta.id);
    }
  };

  const handleSubmitProduccion = async (e) => {
    e.preventDefault();
    try {
      const produccionData = {
        ...formData,
        fecha: new Date().toISOString().split('T')[0],
        cantidadProducida: parseInt(formData.cantidadProducida),
        cantidadPlaneada: parseInt(formData.cantidadPlaneada)
      };
      
      await registrarProduccion(produccionData);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al registrar producción:', error);
    }
  };

  const opcionesProducto = recetas.map(receta => ({
    value: receta.nombre,
    label: receta.nombre
  }));

  const addInsumo = () => {
    setRecetaData(prev => ({ ...prev, insumos: [...prev.insumos, { insumo: '', cantidad: '', unidad: '', costo: '' }] }));
  };

  const updateInsumo = (idx, field, value) => {
    setRecetaData(prev => ({
      ...prev,
      insumos: prev.insumos.map((i, ix) => ix === idx ? { ...i, [field]: field === 'insumo' || field === 'unidad' ? value : Number(value) } : i)
    }));
  };

  const removeInsumo = (idx) => {
    setRecetaData(prev => ({ ...prev, insumos: prev.insumos.filter((_, ix) => ix !== idx) }));
  };

  const handleSubmitReceta = async (e) => {
    e.preventDefault();
    const payload = {
      ...recetaData,
      tiempoPreparacion: Number(recetaData.tiempoPreparacion || 0),
      porciones: Number(recetaData.porciones || 0),
      manoObra: Number(recetaData.manoObra || 0),
      insumos: (recetaData.insumos || []).map(i => ({ ...i, cantidad: Number(i.cantidad || 0), costo: Number(i.costo || 0) }))
    };
    if (recetaEditMode && recetaSeleccionada) {
      await editarReceta(recetaSeleccionada.id, payload);
    } else {
      await crearReceta(payload);
    }
    setIsRecetaModalOpen(false);
  };

  return (
    <div className="page">
      <div className="row-16" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
        <h1 className="section-title title-strong">Gestión de Producción</h1>
        <div className="row-12">
          <Button onClick={handleNuevaProduccion} variant="success">Nueva Producción</Button>
          <Button onClick={handleNuevaReceta} variant="primary">Nueva Receta</Button>
        </div>
      </div>

      <div className="card">
        <div className="tabs">
          {['produccion', 'recetas', 'consumo'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            >
              {tab === 'produccion' ? 'Producción' : tab === 'recetas' ? 'Recetas' : 'Consumo de Insumos'}
            </button>
          ))}
        </div>

        {activeTab === 'produccion' && (
          <Table columns={columnsProduccion} data={produccion} emptyMessage="No hay registros de producción" />
        )}
        {activeTab === 'recetas' && (
          <Table 
            columns={columnsRecetas} 
            data={recetas} 
            emptyMessage="No hay recetas registradas"
            renderActions={(row) => (
              <>
                <Button
                  variant="primary"
                  size="small"
                  onlyIcon
                  title="Editar"
                  onClick={(e) => { e.stopPropagation(); handleEditarReceta(row); }}
                  icon={<Pencil size={16} />}
                />
                <Button
                  variant="danger"
                  size="small"
                  onlyIcon
                  title="Eliminar"
                  onClick={(e) => { e.stopPropagation(); handleEliminarReceta(row); }}
                  icon={<Trash2 size={16} />}
                />
              </>
            )}
          />
        )}
        {activeTab === 'consumo' && (
          <Table columns={columnsConsumo} data={consumoInsumos} emptyMessage="No hay consumo de insumos registrado" />
        )}
      </div>

      {/* Modal para nueva producción */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nueva Producción"
      >
        <Form onSubmit={handleSubmitProduccion}>
          <FormGroup>
            <Select
              label="Producto"
              options={opcionesProducto}
              value={formData.producto}
              onChange={(e) => setFormData({...formData, producto: e.target.value})}
              required
            />
            <Input
              label="Cantidad Planeada"
              type="number"
              value={formData.cantidadPlaneada}
              onChange={(e) => setFormData({...formData, cantidadPlaneada: e.target.value})}
              placeholder="0"
              required
            />
            <Input
              label="Cantidad Producida"
              type="number"
              value={formData.cantidadProducida}
              onChange={(e) => setFormData({...formData, cantidadProducida: e.target.value})}
              placeholder="0"
              required
            />
            <Input
              label="Responsable"
              value={formData.responsable}
              onChange={(e) => setFormData({...formData, responsable: e.target.value})}
              placeholder="Nombre del responsable"
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
              Registrar
            </Button>
          </FormActions>
        </Form>
      </Modal>

      {/* Modal para nueva receta */}
      <Modal
        isOpen={isRecetaModalOpen}
        onClose={() => setIsRecetaModalOpen(false)}
        title={recetaEditMode ? 'Editar Receta' : 'Nueva Receta'}
        size="large"
      >
        <Form onSubmit={handleSubmitReceta}>
          <FormGroup>
            <Input
              label="Nombre"
              value={recetaData.nombre}
              onChange={(e) => setRecetaData({...recetaData, nombre: e.target.value})}
              placeholder="Nombre de la receta"
              required
            />
            <Input
              label="Descripción"
              value={recetaData.descripcion}
              onChange={(e) => setRecetaData({...recetaData, descripcion: e.target.value})}
              placeholder="Descripción de la receta"
              required
            />
            <Input
              label="Tiempo de Preparación (min)"
              type="number"
              value={recetaData.tiempoPreparacion}
              onChange={(e) => setRecetaData({...recetaData, tiempoPreparacion: e.target.value})}
              placeholder="0"
              required
            />
            <Input
              label="Porciones"
              type="number"
              value={recetaData.porciones}
              onChange={(e) => setRecetaData({...recetaData, porciones: e.target.value})}
              placeholder="0"
              required
            />
            <Input
              label="Costo Mano de Obra"
              type="number"
              step="0.01"
              value={recetaData.manoObra}
              onChange={(e) => setRecetaData({...recetaData, manoObra: e.target.value})}
              placeholder="0.00"
            />
          </FormGroup>
          <div className="card" style={{ padding: 12, marginTop: 8 }}>
            <div className="row-16" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
              <h3 className="section-title">Ingredientes</h3>
              <Button type="button" variant="secondary" onClick={addInsumo}>Agregar</Button>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Insumo</th>
                  <th>Cantidad</th>
                  <th>Unidad</th>
                  <th>Costo</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recetaData.insumos.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: '#6b7280', padding: 8 }}>Sin ingredientes</td></tr>
                ) : recetaData.insumos.map((i, idx) => (
                  <tr key={idx}>
                    <td><Input value={i.insumo} onChange={(e) => updateInsumo(idx, 'insumo', e.target.value)} placeholder="Nombre insumo" /></td>
                    <td><Input type="number" step="0.01" value={i.cantidad} onChange={(e) => updateInsumo(idx, 'cantidad', e.target.value)} /></td>
                    <td><Input value={i.unidad} onChange={(e) => updateInsumo(idx, 'unidad', e.target.value)} placeholder="kg/litro/unidad" /></td>
                    <td><Input type="number" step="0.01" value={i.costo} onChange={(e) => updateInsumo(idx, 'costo', e.target.value)} /></td>
                    <td>
                      <Button
                        type="button"
                        variant="danger"
                        size="small"
                        onlyIcon
                        title="Quitar"
                        onClick={() => removeInsumo(idx)}
                        icon={<Trash2 size={16} />}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <FormActions>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsRecetaModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary">Guardar Receta</Button>
          </FormActions>
        </Form>
      </Modal>
    </div>
  );
};

export default ProduccionPage;
