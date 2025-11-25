import React from 'react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const cards = [
    { title: 'Ventas del Día', value: 'S/ 245.50', change: '+12%', icon: '💰' },
    { title: 'Productos en Stock', value: '156', change: '+5', icon: '📦' },
    { title: 'Producción Hoy', value: '45 unidades', change: '+8%', icon: '⚙️' },
    { title: 'Alertas de Stock', value: '3', change: '-2', icon: '⚠️' }
  ];

  const modulos = [
    { title: 'Módulo de Ventas', description: 'Gestión de pedidos, comprobantes y métodos de pago', link: '/ventas', icon: '💰' },
    { title: 'Módulo de Inventario', description: 'Control de productos, insumos y proveedores', link: '/inventario', icon: '📦' },
    { title: 'Módulo de Producción', description: 'Control de recetas y procesos de producción', link: '/produccion', icon: '⚙️' },
    { title: 'Reportes e Informes', description: 'Análisis de ventas, inventario y producción', link: '/reportes', icon: '📈' }
  ];

  return (
    <div className="page">
      <div className="card" style={{ marginBottom: 16 }}>
        <h1 className="section-title">Dashboard</h1>
        <p className="stat-label">Bienvenido al Sistema ERP de la Cafetería</p>
      </div>

      <div className="grid-4" style={{ marginBottom: 16 }}>
        {cards.map((card, index) => (
          <div key={index} className="card">
            <div className="stat">
              <div className="stat-value">{card.value}</div>
              <span className="stat-label">{card.title}</span>
            </div>
            <div className="stat-label" style={{ marginTop: 8 }}>{card.icon} {card.change}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        {modulos.map((modulo, index) => (
          <Link key={index} to={modulo.link} className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: '#eef2f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                {modulo.icon}
              </div>
              <h3 className="section-title" style={{ margin: 0 }}>{modulo.title}</h3>
            </div>
            <p className="stat-label" style={{ marginBottom: 12 }}>{modulo.description}</p>
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Acceder →</span>
          </Link>
        ))}
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h2 className="section-title">Estadísticas del Mes</h2>
        <div className="grid-4">
          <div>
            <div className="stat-value" style={{ color: 'var(--primary)' }}>1,245</div>
            <div className="stat-label">Ventas Realizadas</div>
          </div>
          <div>
            <div className="stat-value" style={{ color: 'var(--success)' }}>S/ 12,450</div>
            <div className="stat-label">Ingresos Totales</div>
          </div>
          <div>
            <div className="stat-value" style={{ color: 'var(--warning)' }}>892</div>
            <div className="stat-label">Productos Producidos</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
