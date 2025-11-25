import React from 'react';
import { useCierresCaja } from '../hooks/useCaja';
import Button from '../components/common/Button';
import Table from '../components/common/Table';

const CajaPage = () => {
  const { cierres, cerrarHoy } = useCierresCaja();

  const columns = [
    { key: 'fecha', title: 'Fecha' },
    { key: 'total', title: 'Total', render: (v) => `S/ ${v.toFixed(2)}` },
    { key: 'metodos', title: 'Detalle', render: (v) => (
      <div>
        {Object.keys(v).map(m => (
          <div key={m} className="stat-label">{m}: S/ {v[m].toFixed(2)}</div>
        ))}
      </div>
    ) }
  ];

  return (
    <div className="page">
      <div className="row-16" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
        <h1 className="section-title">Caja y Cierres</h1>
        <Button variant="primary" onClick={cerrarHoy}>Cerrar Caja Hoy</Button>
      </div>
      <div className="card">
        <Table columns={columns} data={cierres} emptyMessage="Sin cierres registrados" />
      </div>
    </div>
  );
};

export default CajaPage;

