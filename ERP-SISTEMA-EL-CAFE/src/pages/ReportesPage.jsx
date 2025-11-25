import React, { useState } from 'react';
import { useReportesVentas, useReportesInventario, useReportesProduccion, useProductosMasVendidos, useUtilidadPorProducto, useGenerarReporte } from '../hooks/useReportes';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Input from '../components/common/Input';

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
        <div className="card">
          <h1 className="section-title">Reportes e Informes</h1>
        </div>

        <div className="card">
          <div className="row-16">
            <Input
              label="Fecha Inicio"
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
            <Input
              label="Fecha Fin"
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
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
          <Button onClick={() => handleGenerarPDF(activeTab)} variant="primary">Exportar PDF</Button>
          <Button onClick={() => handleGenerarExcel(activeTab)} variant="success">Exportar Excel</Button>
        </div>

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
