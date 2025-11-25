import React, { useMemo, useState } from 'react';
import { useVentas } from '../hooks/useVentas';
import { useSunat } from '../hooks/useSunat';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { Form, FormGroup, FormActions } from '../components/forms/Form';

const IGV = 0.18;

const FacturacionPage = () => {
  const { ventas } = useVentas();
  const { comprobantes, emitir, enviar, reenviar, getXML, getPDF, validarRUC, validarDNI, refetch } = useSunat();

  const [form, setForm] = useState({
    tipo: 'Boleta',
    serie: 'B001',
    numero: '',
    cliente: '',
    documento: '',
    ventaId: '',
    items: []
  });
  const [xmlPreview, setXmlPreview] = useState('');
  const [isXmlModalOpen, setIsXmlModalOpen] = useState(false);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  const ventasOptions = ventas.map(v => ({ value: String(v.id), label: `${v.numeroComprobante || v.id} - ${v.cliente} - S/ ${v.total}` }));
  const tipoOptions = [
    { value: 'Boleta', label: 'Boleta' },
    { value: 'Factura', label: 'Factura' }
  ];

  const totales = useMemo(() => {
    const subtotal = (form.items || []).reduce((acc, it) => acc + Number(it.precio || 0) * Number(it.cantidad || 0), 0);
    const igv = Math.round(subtotal * IGV * 100) / 100;
    const total = Math.round((subtotal + igv) * 100) / 100;
    return { subtotal: Math.round(subtotal * 100) / 100, igv, total };
  }, [form.items]);

  const handleSelectVenta = (ventaId) => {
    setForm(prev => ({ ...prev, ventaId }));
    const v = ventas.find(x => String(x.id) === String(ventaId));
    if (v) {
      const tipo = v.tipoComprobante || 'Boleta';
      const serie = (v.numeroComprobante || '').split('-')[0] || (tipo === 'Factura' ? 'F001' : 'B001');
      const numero = (v.numeroComprobante || '').split('-')[1] || '';
      setForm(prev => ({
        ...prev,
        tipo,
        serie,
        numero,
        cliente: v.cliente || '',
        documento: v.dni || v.ruc || '',
        items: (v.productos || []).map(p => ({ nombre: p.nombre, cantidad: p.cantidad, precio: p.precio }))
      }));
    }
  };

  const addItem = () => {
    setForm(prev => ({ ...prev, items: [...(prev.items || []), { nombre: '', cantidad: 1, precio: 0 }] }));
  };

  const updateItem = (idx, field, value) => {
    setForm(prev => ({
      ...prev,
      items: prev.items.map((it, ix) => ix === idx ? { ...it, [field]: field === 'nombre' ? value : Number(value) } : it)
    }));
  };

  const removeItem = (idx) => {
    setForm(prev => ({ ...prev, items: prev.items.filter((_, ix) => ix !== idx) }));
  };

  const handleValidarDocumento = () => {
    if (form.tipo === 'Factura') {
      const ok = validarRUC(form.documento || '');
      if (!ok) alert('RUC inválido');
    } else {
      const ok = validarDNI(form.documento || '');
      if (!ok) alert('DNI inválido');
    }
  };

  const handleEmitir = async (e) => {
    e.preventDefault();
    if (!form.cliente) return;
    const payload = {
      tipo: form.tipo,
      serie: form.serie,
      numero: form.numero || String(Date.now()).slice(-4),
      cliente: form.cliente,
      documento: form.documento,
      items: form.items,
      impuestos: { igv: totales.igv },
      total: totales.total
    };
    const reg = await emitir(payload);
    await enviar(reg.id, 'Nubefact');
    setForm(prev => ({ ...prev, numero: '' }));
    refetch();
  };

  const handleVerXML = (row) => {
    const xml = getXML(row.id);
    setXmlPreview(xml || '');
    setIsXmlModalOpen(true);
  };

  const handleVerPDF = (row) => {
    const pdf = getPDF(row.id);
    setPdfPreview(pdf);
    setIsPdfModalOpen(true);
  };

  const columns = [
    { key: 'tipo', title: 'Tipo' },
    { key: 'serie', title: 'Serie' },
    { key: 'numero', title: 'Número' },
    { key: 'cliente', title: 'Cliente' },
    { key: 'fecha', title: 'Fecha' },
    { key: 'estado', title: 'Estado CDR' }
  ];

  return (
    <div className="page">
      <div className="row-16" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
        <h1 className="section-title">Facturación Electrónica SUNAT</h1>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
        <h2 className="section-title">Panel de Emisión</h2>
        <Form onSubmit={handleEmitir}>
          <FormGroup>
            <Select
              label="Tipo de Comprobante"
              value={form.tipo}
              onChange={(v) => setForm(prev => ({ ...prev, tipo: v, serie: v === 'Factura' ? 'F001' : 'B001' }))}
              options={tipoOptions}
            />
            <Select
              label="Desde Venta"
              value={form.ventaId}
              onChange={handleSelectVenta}
              options={[{ value: '', label: 'Seleccionar venta (opcional)' }, ...ventasOptions]}
            />
          </FormGroup>
          <FormGroup>
            <Input label="Serie" value={form.serie} onChange={(e) => setForm(prev => ({ ...prev, serie: e.target.value }))} />
            <Input label="Número" value={form.numero} onChange={(e) => setForm(prev => ({ ...prev, numero: e.target.value }))} />
          </FormGroup>
          <FormGroup>
            <Input label="Cliente" value={form.cliente} onChange={(e) => setForm(prev => ({ ...prev, cliente: e.target.value }))} />
            <Input label={form.tipo === 'Factura' ? 'RUC' : 'DNI'} value={form.documento} onChange={(e) => setForm(prev => ({ ...prev, documento: e.target.value }))} />
            <Button type="button" variant="secondary" onClick={handleValidarDocumento}>Validar</Button>
          </FormGroup>

          <div className="card" style={{ padding: 12, marginTop: 8 }}>
            <div className="row-16" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
              <h3 className="section-title">Items</h3>
              <Button type="button" variant="secondary" onClick={addItem}>Agregar</Button>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {form.items.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: 'center', color: '#6b7280', padding: 8 }}>Sin items</td></tr>
                ) : form.items.map((it, idx) => (
                  <tr key={idx}>
                    <td><Input value={it.nombre} onChange={(e) => updateItem(idx, 'nombre', e.target.value)} placeholder="Descripción" /></td>
                    <td><Input type="number" step="1" value={it.cantidad} onChange={(e) => updateItem(idx, 'cantidad', e.target.value)} /></td>
                    <td><Input type="number" step="0.01" value={it.precio} onChange={(e) => updateItem(idx, 'precio', e.target.value)} /></td>
                    <td><button type="button" className="btn btn-danger" onClick={() => removeItem(idx)}>Quitar</button></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="row-16" style={{ justifyContent: 'flex-end', marginTop: 8 }}>
              <div style={{ minWidth: 220 }}>
                <div className="row-12" style={{ justifyContent: 'space-between' }}>
                  <span>Subtotal</span>
                  <strong>S/ {totales.subtotal.toFixed(2)}</strong>
                </div>
                <div className="row-12" style={{ justifyContent: 'space-between' }}>
                  <span>IGV (18%)</span>
                  <strong>S/ {totales.igv.toFixed(2)}</strong>
                </div>
                <div className="row-12" style={{ justifyContent: 'space-between' }}>
                  <span>Total</span>
                  <strong>S/ {totales.total.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          </div>

          <FormActions>
            <Button type="submit" variant="primary">Emitir y Enviar</Button>
          </FormActions>
        </Form>
      </div>

      <div className="card" style={{ padding: 16 }}>
        <div className="row-16" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
          <h2 className="section-title">Comprobantes Electrónicos</h2>
        </div>
        <Table
          columns={columns}
          data={comprobantes}
          emptyMessage="No hay comprobantes"
          renderActions={(row) => (
            <>
              <button className="btn" onClick={(e) => { e.stopPropagation(); reenviar(row.id); }}>Reenviar</button>
              <button className="btn" onClick={(e) => { e.stopPropagation(); handleVerXML(row); }}>Ver XML</button>
              <button className="btn" onClick={(e) => { e.stopPropagation(); handleVerPDF(row); }}>Descargar PDF</button>
            </>
          )}
        />
      </div>

      <Modal isOpen={isXmlModalOpen} onClose={() => setIsXmlModalOpen(false)} title="XML del Comprobante" size="large">
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: 400, overflow: 'auto' }}>{xmlPreview}</pre>
      </Modal>

      <Modal isOpen={isPdfModalOpen} onClose={() => setIsPdfModalOpen(false)} title="PDF del Comprobante">
        {pdfPreview ? (
          <div>
            <div>ID: {pdfPreview.id}</div>
            <div style={{ marginTop: 8 }}>Contenido:</div>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{pdfPreview.content}</pre>
          </div>
        ) : (
          <div>No disponible</div>
        )}
      </Modal>
    </div>
  );
};

export default FacturacionPage;
