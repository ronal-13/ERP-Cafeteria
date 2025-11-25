import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';

const Sidebar = () => {
  const { pathname } = useLocation();
  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/ventas', label: 'Ventas', icon: '💰' },
    { path: '/inventario', label: 'Inventario', icon: '📦' },
    { path: '/produccion', label: 'Producción', icon: '⚙️' },
    { path: '/caja', label: 'Caja', icon: '🧾' },
    { path: '/reportes', label: 'Reportes', icon: '📈' },
    { path: '/web/shop', label: 'Web Shop', icon: '🛒' },
    { path: '/web/cart', label: 'Carrito', icon: '🧺' },
    { path: '/web/checkout', label: 'Checkout', icon: '💳' },
    { path: '/web/admin', label: 'Admin Web', icon: '🌐' }
  ];

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className="sidebar"
      style={{
        width: 240,
        background: '#0f172a',
        color: '#e2e8f0',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div className="sidebar-header" style={{ padding: 16, fontWeight: 700 }}>ERP Cafetería</div>
      <nav className="sidebar-nav" style={{ display: 'flex', flexDirection: 'column', padding: 8 }}>
        {menuItems.map((item) => {
          const active = pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="sidebar-link"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                borderRadius: 8,
                textDecoration: 'none',
                color: '#e2e8f0',
                background: active ? 'rgba(255,255,255,0.12)' : 'transparent'
              }}
              aria-current={active ? 'page' : undefined}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="sidebar-footer" style={{ marginTop: 'auto', padding: 12, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        {user && (
          <div style={{ marginBottom: 8, color: '#cbd5e1', fontSize: 13 }}>
            {user.nombre} • {user.rol}
          </div>
        )}
        <button className="btn btn-secondary" onClick={handleLogout} style={{ width: '100%' }}>Cerrar sesión</button>
      </div>
    </aside>
  );
};

export default Sidebar;
