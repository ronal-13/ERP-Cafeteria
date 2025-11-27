import React from 'react';
import { useCierresCaja } from '../hooks/useCaja';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import cajaService from '../services/cajaService';
import { Wallet, CalendarCheck, Banknote, CreditCard, HandCoins } from 'lucide-react';

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

  const hoy = new Date().toISOString().split('T')[0];
  const resumenHoy = cajaService.getPagosDelDia(hoy);

  return (
    <div className="page">
      <div className="row-16" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
        <div className="title-wrap">
          <span className="kpi-icon"><Wallet size={18} /></span>
          <h1 className="section-title title-strong">Caja y Cierres</h1>
        </div>
        <Button variant="primary" icon={<CalendarCheck size={18} />} onClick={cerrarHoy}>Cerrar Caja Hoy</Button>
      </div>

      <div className="grid-3" style={{ marginBottom: 16 }}>
        <div className="card kpi">
          <div className="kpi-card">
            <div className="kpi-icon"><Banknote size={18} /></div>
            <div>
              <div className="kpi-head">
                <div className="kpi-value">S/ {resumenHoy.total.toFixed(2)}</div>
                <div className="kpi-label">Total hoy</div>
              </div>
              <div className="kpi-foot">{resumenHoy.fecha}</div>
            </div>
          </div>
        </div>
        <div className="card kpi">
          <div className="kpi-card">
            <div className="kpi-icon"><HandCoins size={18} /></div>
            <div>
              <div className="kpi-head">
                <div className="kpi-value">{cierres.find(c => c.fecha === hoy) ? 'Cerrado' : 'Abierto'}</div>
                <div className="kpi-label">Estado de hoy</div>
              </div>
              <div className="kpi-foot">{cierres.length ? `Último cierre: ${cierres[cierres.length - 1].fecha}` : 'Sin cierres'}</div>
            </div>
          </div>
        </div>
        <div className="card kpi">
          <div className="kpi-card">
            <div className="kpi-icon"><CreditCard size={18} /></div>
            <div>
              <div className="kpi-head">
                <div className="kpi-value">{Object.keys(resumenHoy.metodos).length || 0}</div>
                <div className="kpi-label">Métodos hoy</div>
              </div>
              <div className="kpi-foot">{Object.entries(resumenHoy.metodos).map(([m, val]) => `\n${m}: S/ ${val.toFixed(2)}`).join(' • ') || 'Sin pagos'}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <Table columns={columns} data={cierres} emptyMessage="Sin cierres registrados" />
      </div>
    </div>
  );
};

export default CajaPage;
