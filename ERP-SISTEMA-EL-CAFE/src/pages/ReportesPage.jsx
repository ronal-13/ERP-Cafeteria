import React, { useMemo, useState } from 'react';
import { useReportesVentas, useReportesInventario, useReportesProduccion, useProductosMasVendidos, useUtilidadPorProducto, useGenerarReporte } from '../hooks/useReportes';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { BarChart3, CalendarRange, FileSpreadsheet, FileText } from 'lucide-react';

const ReportesPage = () => {
  const [fechaInicio, setFechaInicio] = useState('2024-01-01');
  const [fechaFin, setFechaFin] = useState('2024-01-31');
  const [activeTab, setActiveTab] = useState('ventas');
  
  const { reportes: reportesVentas, loading: loadingVentas } = useReportesVentas(fechaInicio, fechaFin);
  const { reportes: reportesInventario, loading: loadingInventario } = useReportesInventario();
  const { reportes: reportesProduccion, loading: loadingProduccion } = useReportesProduccion(fechaInicio, fechaFin);
  const { productos: productosMasVendidos, loading: loadingMasVendidos } = useProductosMasVendidos(fechaInicio, fechaFin);
  const { utilidad: utilidadPorProducto, loading: loadingUtilidad } = useUtilidadPorProducto();
  const { generarReportePDF, generarReporteExcel } = useGenerarReporte();
  const [quickRange, setQuickRange] = useState('');

  const setQuickRangeDates = (val) => {
    const now = new Date();
    const toISO = (d) => new Date(d).toISOString().split('T')[0];
    if (val === 'hoy') {
      const s = toISO(now);
      setFechaInicio(s);
      setFechaFin(s);
      return;
    }
    if (val === 'semana') {
      const day = now.getDay();
      const diff = day === 0 ? 6 : day - 1;
      const start = new Date(now);
      start.setDate(now.getDate() - diff);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      setFechaInicio(toISO(start));
      setFechaFin(toISO(end));
      return;
    }
    if (val === 'mes') {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      setFechaInicio(toISO(start));
      setFechaFin(toISO(end));
      return;
    }
    if (val === 'ult7') {
      const start = new Date(now);
      start.setDate(now.getDate() - 6);
      setFechaInicio(toISO(start));
      setFechaFin(toISO(now));
      return;
    }
    if (val === 'ult30') {
      const start = new Date(now);
      start.setDate(now.getDate() - 29);
      setFechaInicio(toISO(start));
      setFechaFin(toISO(now));
      return;
    }
  };

  const summary = useMemo(() => {
    try {
      if (activeTab === 'ventas') {
        const total = (reportesVentas || []).reduce((acc, r) => acc + (r.totalVentas || 0), 0);
        const num = (reportesVentas || []).reduce((acc, r) => acc + (r.numeroVentas || 0), 0);
        const top = (reportesVentas || [])[0]?.productoMasVendido || '-';
        return [{ label: 'Total Ventas', value: `S/ ${total.toFixed(2)}` }, { label: 'N° Ventas', value: num }, { label: 'Top Producto', value: top }];
      }
      if (activeTab === 'inventario') {
        const bajo = (reportesInventario || []).filter(r => r.estado === 'Crítico').length;
        const productos = (reportesInventario || []).length;
        const diasProm = Math.round(((reportesInventario || []).reduce((acc, r) => acc + (r.diasRestantes || 0), 0) / Math.max(1, productos)));
        return [{ label: 'Ítems', value: productos }, { label: 'Stock bajo', value: bajo }, { label: 'Días restantes prom.', value: isNaN(diasProm) ? '-' : diasProm }];
      }
      if (activeTab === 'produccion') {
        const registros = (reportesProduccion || []).length;
        const rendimientoProm = Math.round(((reportesProduccion || []).reduce((acc, r) => acc + (r.rendimiento || 0), 0) / Math.max(1, registros)));
        const costo = (reportesProduccion || []).reduce((acc, r) => acc + (r.costoTotal || 0), 0);
        return [{ label: 'Registros', value: registros }, { label: 'Rendimiento prom.', value: isNaN(rendimientoProm) ? '-' : `${rendimientoProm}%` }, { label: 'Costo total', value: `S/ ${costo.toFixed(2)}` }];
      }
      if (activeTab === 'productos-vendidos') {
        const total = (productosMasVendidos || []).reduce((acc, r) => acc + (r.montoTotal || 0), 0);
        const items = (productosMasVendidos || []).reduce((acc, r) => acc + (r.cantidadVendida || 0), 0);
        const top = (productosMasVendidos || [])[0]?.producto || '-';
        return [{ label: 'Ingresos', value: `S/ ${total.toFixed(2)}` }, { label: 'Unidades', value: items }, { label: 'Top', value: top }];
      }
      if (activeTab === 'utilidad') {
        const util = (utilidadPorProducto || []).reduce((acc, r) => acc + (r.utilidad || 0), 0);
        const ventas = (utilidadPorProducto || []).reduce((acc, r) => acc + (r.montoTotal || 0), 0);
        const margen = ventas ? Math.round((util / ventas) * 100) : 0;
        return [{ label: 'Ventas', value: `S/ ${ventas.toFixed(2)}` }, { label: 'Utilidad', value: `S/ ${util.toFixed(2)}` }, { label: 'Margen', value: `${margen}%` }];
      }
    } catch {}
    return [];
  }, [activeTab, reportesVentas, reportesInventario, reportesProduccion, productosMasVendidos, utilidadPorProducto]);

  const columnsVentas = [
    { key: 'fecha', title: 'Fecha' },
    { key: 'totalVentas', title: 'Total Ventas', render: (value) => `S/ ${value.toFixed(2)}` },
    { key: 'numeroVentas', title: 'Número de Ventas' },
    { key: 'productoMasVendido', title: 'Producto Más Vendido' },
    { key: 'metodoPagoMasUsado', title: 'Método de Pago Más Usado' }
  ];

  const columnsInventario = [
    { key: 'producto', title: 'Producto' },
    { key: 'stockActual', title: 'Stock Actual' },
    { key: 'stockMinimo', title: 'Stock Mínimo' },
    { key: 'consumoPromedio', title: 'Consumo Promedio' },
    { key: 'diasRestantes', title: 'Días Restantes' },
    { 
      key: 'estado', 
      title: 'Estado',
      render: (value) => (
        <span className={`px-2 py-1 rounded text-xs ${
          value === 'Normal' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    }
  ];

  const columnsProduccion = [
    { key: 'fecha', title: 'Fecha' },
    { key: 'producto', title: 'Producto' },
    { key: 'cantidadProducida', title: 'Cantidad Producida' },
    { key: 'cantidadPlaneada', title: 'Cantidad Planeada' },
    { key: 'rendimiento', title: 'Rendimiento %' },
    { key: 'mermas', title: 'Mermas' },
    { key: 'costoTotal', title: 'Costo Total', render: (value) => `S/ ${value.toFixed(2)}` }
  ];

  const columnsProductosMasVendidos = [
    { key: 'producto', title: 'Producto' },
    { key: 'cantidadVendida', title: 'Cantidad Vendida' },
    { key: 'montoTotal', title: 'Monto Total', render: (value) => `S/ ${value.toFixed(2)}` },
    { 
      key: 'porcentaje', 
      title: 'Porcentaje',
      render: (value) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 80, background: '#e5e7eb', borderRadius: 9999, height: 8 }}>
            <div style={{ background: 'var(--primary)', height: 8, borderRadius: 9999, width: `${value}%` }} />
          </div>
          <span className="stat-label">{value}%</span>
        </div>
      )
    }
  ];

  const columnsUtilidad = [
    { key: 'producto', title: 'Producto' },
    { key: 'montoTotal', title: 'Ventas Totales', render: (value) => `S/ ${value.toFixed(2)}` },
    { key: 'costoProduccion', title: 'Costo Producción', render: (value) => `S/ ${value.toFixed(2)}` },
    { key: 'utilidad', title: 'Utilidad', render: (value) => `S/ ${value.toFixed(2)}` },
    { 
      key: 'margen', 
      title: 'Margen %',
      render: (value, row) => {
        const margen = (row.utilidad / row.montoTotal) * 100;
        return (
          <span className={`px-2 py-1 rounded text-xs ${
            margen >= 40 ? 'bg-green-100 text-green-800' : 
            margen >= 20 ? 'bg-yellow-100 text-yellow-800' : 
            'bg-red-100 text-red-800'
          }`}>
            {margen.toFixed(1)}%
          </span>
        );
      }
    }
  ];

  const handleGenerarPDF = async (tipo) => {
    try {
      const reporte = await generarReportePDF(tipo, fechaInicio, fechaFin);
      alert(`Reporte ${tipo} generado exitosamente: ${reporte.rutaArchivo}`);
    } catch (error) {
      alert('Error al generar el reporte PDF');
    }
  };

  const handleGenerarExcel = async (tipo) => {
    try {
      const reporte = await generarReporteExcel(tipo, fechaInicio, fechaFin);
      alert(`Reporte ${tipo} generado exitosamente: ${reporte.rutaArchivo}`);
    } catch (error) {
      alert('Error al generar el reporte Excel');
    }
  };

  return (
    <div className="page">
      <div className="stack-16">
        <div className="row-16" style={{ justifyContent: 'space-between' }}>
          <div className="title-wrap">
            <span className="kpi-icon"><BarChart3 size={18} /></span>
            <h1 className="section-title title-strong">Reportes e Informes</h1>
          </div>
          <div className="row-12">
            <Button variant="secondary" icon={<CalendarRange size={16} />}>Período</Button>
          </div>
        </div>

        <div className="card" style={{ padding: 16 }}>
          <div className="title-wrap" style={{ marginBottom: 8 }}>
            <span className="kpi-icon"><CalendarRange size={18} /></span>
            <h2 className="section-title">Filtros</h2>
          </div>
          <div className="filters-row">
            <Input label="Fecha Inicio" type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
            <Input label="Fecha Fin" type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
            <Select
              label="Rango rápido"
              value={quickRange}
              onChange={(e) => { const v = e.target.value; setQuickRange(v); setQuickRangeDates(v); }}
              options={[
                { value: '', label: 'Seleccionar' },
                { value: 'hoy', label: 'Hoy' },
                { value: 'semana', label: 'Semana actual' },
                { value: 'mes', label: 'Mes actual' },
                { value: 'ult7', label: 'Últimos 7 días' },
                { value: 'ult30', label: 'Últimos 30 días' }
              ]}
            />
            <div className="row-12" style={{ alignItems: 'flex-end' }}>
              <Button variant="secondary" size="small" onClick={() => { setQuickRange(''); }}>Limpiar</Button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="tabs">
            {['ventas', 'inventario', 'produccion', 'productos-vendidos', 'utilidad'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              >
                {tab === 'productos-vendidos' ? 'Productos Más Vendidos' : 
                 tab === 'utilidad' ? 'Utilidad por Producto' :
                 tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="row-12" style={{ justifyContent: 'flex-start' }}>
          <Button onClick={() => handleGenerarPDF(activeTab)} variant="primary" icon={<FileText size={16} />}>Exportar PDF</Button>
          <Button onClick={() => handleGenerarExcel(activeTab)} variant="success" icon={<FileSpreadsheet size={16} />}>Exportar Excel</Button>
        </div>

        {summary.length > 0 && (
          <div className="grid-3">
            {summary.map((s, i) => (
              <div key={i} className="card kpi">
                <div className="kpi-card">
                  <div className="kpi-icon"><BarChart3 size={18} /></div>
                  <div>
                    <div className="kpi-head">
                      <div className="kpi-value">{s.value}</div>
                      <div className="kpi-label">{s.label}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="card">
          {activeTab === 'ventas' && (
            <>
              <h2 className="section-title">Reporte de Ventas</h2>
              <Table columns={columnsVentas} data={reportesVentas} loading={loadingVentas} emptyMessage="No hay datos de ventas para el período seleccionado" />
            </>
          )}

          {activeTab === 'inventario' && (
            <>
              <h2 className="section-title">Reporte de Inventario</h2>
              <Table columns={columnsInventario} data={reportesInventario} loading={loadingInventario} emptyMessage="No hay datos de inventario" />
            </>
          )}

          {activeTab === 'produccion' && (
            <>
              <h2 className="section-title">Reporte de Producción</h2>
              <Table columns={columnsProduccion} data={reportesProduccion} loading={loadingProduccion} emptyMessage="No hay datos de producción para el período seleccionado" />
            </>
          )}

          {activeTab === 'productos-vendidos' && (
            <>
              <h2 className="section-title">Productos Más Vendidos</h2>
              <Table columns={columnsProductosMasVendidos} data={productosMasVendidos} loading={loadingMasVendidos} emptyMessage="No hay datos de productos más vendidos para el período seleccionado" />
            </>
          )}

          {activeTab === 'utilidad' && (
            <>
              <h2 className="section-title">Utilidad por Producto</h2>
              <Table columns={columnsUtilidad} data={utilidadPorProducto} loading={loadingUtilidad} emptyMessage="No hay datos de utilidad disponibles" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportesPage;
