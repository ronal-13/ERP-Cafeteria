import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useVentas } from '../hooks/useVentas';
import SimpleAreaChart from '../components/charts/SimpleAreaChart';
import SimpleBarChart from '../components/charts/SimpleBarChart';
import SimplePieChart from '../components/charts/SimplePieChart';
import { ShoppingCart, Boxes, Cog, BarChart3 } from 'lucide-react';

const DashboardPage = () => {
  const { ventas } = useVentas();

  const todayStr = new Date().toISOString().split('T')[0];
  const ventasDelDia = useMemo(() => ventas.filter(v => v.fecha === todayStr), [ventas, todayStr]);
  const totalDia = useMemo(() => ventasDelDia.reduce((acc, v) => acc + Number(v.total || 0), 0), [ventasDelDia]);

  const ventasPorDia = useMemo(() => {
    const map = new Map();
    ventas.forEach(v => {
      const key = v.fecha;
      map.set(key, (map.get(key) || 0) + Number(v.total || 0));
    });
    const arr = Array.from(map.entries()).sort((a,b) => a[0] > b[0] ? 1 : -1).map(([fecha, total]) => ({ fecha, total }));
    if (arr.length === 0) {
      const now = new Date();
      const sample = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(now); d.setDate(now.getDate() - (6 - i));
        const f = d.toISOString().split('T')[0];
        return { fecha: f, total: Math.round((Math.random() * 200 + 50) * 100) / 100 };
      });
      return sample;
    }
    return arr;
  }, [ventas]);

  const ventasPorMetodo = useMemo(() => {
    const map = new Map();
    ventas.forEach(v => {
      const key = v.metodoPago || 'Otro';
      map.set(key, (map.get(key) || 0) + Number(v.total || 0));
    });
    const arr = Array.from(map.entries()).map(([metodo, total]) => ({ metodo, total }));
    if (arr.length === 0) {
      return [
        { metodo: 'Efectivo', total: 300 },
        { metodo: 'Tarjeta', total: 180 },
        { metodo: 'Yape', total: 120 },
      ];
    }
    return arr;
  }, [ventas]);

  const topProductos = useMemo(() => {
    const map = new Map();
    ventas.forEach(v => (v.productos || []).forEach(p => {
      map.set(p.nombre, (map.get(p.nombre) || 0) + Number(p.cantidad || 0));
    }));
    const arr = Array.from(map.entries())
      .map(([producto, cantidad]) => ({ producto, cantidad }))
      .sort((a,b) => b.cantidad - a.cantidad)
      .slice(0, 6);
    if (arr.length === 0) {
      return [
        { producto: 'Café Americano', cantidad: 12 },
        { producto: 'Capuccino', cantidad: 9 },
        { producto: 'Croissant', cantidad: 7 },
      ];
    }
    return arr;
  }, [ventas]);

  const metodoMasUsado = ([...ventasPorMetodo].sort((a,b) => b.total - a.total)[0]?.metodo) || '-';
  const cards = [
    { title: 'Ventas del Día', value: `S/ ${totalDia.toFixed(2)}`, change: `${ventasDelDia.length} ventas` },
    { title: 'Top Producto', value: topProductos[0]?.producto || '-', change: `${topProductos[0]?.cantidad || 0} uds` },
    { title: 'Método más usado', value: metodoMasUsado, change: '↑' },
    { title: 'Comprobantes', value: ventas.length.toString(), change: 'Totales registrados' }
  ];

  const modulos = [
    { title: 'Módulo de Ventas', description: 'Gestión de pedidos, comprobantes y métodos de pago', link: '/ventas', Icon: ShoppingCart },
    { title: 'Módulo de Inventario', description: 'Control de productos, insumos y proveedores', link: '/inventario', Icon: Boxes },
    { title: 'Módulo de Producción', description: 'Control de recetas y procesos de producción', link: '/produccion', Icon: Cog },
    { title: 'Reportes e Informes', description: 'Análisis de ventas, inventario y producción', link: '/reportes', Icon: BarChart3 }
  ];

  return (
    <div className="page">
      <div className="card" style={{ marginBottom: 16 }}>
        <h1 className="section-title title-strong">Dashboard</h1>
        <p className="stat-label">Bienvenido al Sistema ERP de la Cafetería</p>
      </div>

      <div className="grid-4" style={{ marginBottom: 16 }}>
        {cards.map((card, index) => (
          <div key={index} className="card">
            <div className="stat">
              <div className="stat-value">{card.value}</div>
              <span className="stat-label">{card.title}</span>
            </div>
            <div className="stat-label" style={{ marginTop: 8 }}>{card.change}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        {modulos.map((modulo, index) => (
          <Link key={index} to={modulo.link} className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: '#eef2f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {modulo.Icon && <modulo.Icon size={22} />}
              </div>
              <h3 className="section-title" style={{ margin: 0 }}>{modulo.title}</h3>
            </div>
            <p className="stat-label" style={{ marginBottom: 12 }}>{modulo.description}</p>
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Acceder →</span>
          </Link>
        ))}
      </div>

      <div className="grid-2" style={{ marginTop: 16 }}>
        <SimpleAreaChart data={ventasPorDia} xKey="fecha" yKey="total" title="Ingresos por día" />
        <SimpleBarChart data={ventasPorMetodo} xKey="metodo" yKey="total" title="Ventas por método" color="#2563eb" />
      </div>
      <div className="grid-2" style={{ marginTop: 16 }}>
        <SimpleBarChart data={topProductos} xKey="producto" yKey="cantidad" title="Productos más vendidos" color="#f59e0b" />
        <SimplePieChart data={ventasPorMetodo} nameKey="metodo" valueKey="total" title="Distribución por método" />
      </div>
    </div>
  );
};

export default DashboardPage;
