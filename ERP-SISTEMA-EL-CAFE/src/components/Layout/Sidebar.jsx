import {
  BarChart3,
  Boxes,
  Cog,
  CreditCard,
  Globe,
  Home,
  LogOut,
  ShoppingBasket,
  ShoppingCart,
  Store,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toggleIcon from "../../assets/togle-sidebar.svg";
import { useAuth } from "../../hooks/useAuth.jsx";

const Sidebar = () => {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("sidebar_collapsed");
      const val = raw === "true";
      setCollapsed(val);
      document.documentElement.style.setProperty(
        "--sidebar-width",
        val ? "72px" : "240px"
      );
    } catch (e) {}
  }, []);
  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    try {
      localStorage.setItem("sidebar_collapsed", String(next));
    } catch (e) {}
    document.documentElement.style.setProperty(
      "--sidebar-width",
      next ? "72px" : "240px"
    );
  };
  const menuItems = [
    { path: "/", label: "Dashboard", Icon: Home },
    { path: "/caja", label: "Caja", Icon: CreditCard },
    { path: "/ventas", label: "Ventas", Icon: ShoppingCart },
    { path: "/web/shop", label: "Web Shop", Icon: Store },
    { path: "/web/cart", label: "Carrito", Icon: ShoppingBasket },
    { path: "/web/checkout", label: "Checkout", Icon: CreditCard },
    { path: "/produccion", label: "Producción", Icon: Cog },
    { path: "/inventario", label: "Inventario", Icon: Boxes },
    { path: "/reportes", label: "Reportes", Icon: BarChart3 },
    { path: "/web/admin", label: "Admin Web", Icon: Globe },
  ];

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className="sidebar"
      style={{
        width: "var(--sidebar-width, 240px)",
        background: "#0f172a",
        color: "#e2e8f0",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 20,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        className="sidebar-header"
        style={{
          padding: 16,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          position: "relative",
        }}
      >
        {!collapsed && (
          <div style={{ fontWeight: 700, fontSize: 18 }}>Cafetería El Café</div>
        )}
        <img
          src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=120&auto=format&fit=crop"
          alt="Logo de la empresa"
          width={collapsed ? 36 : 64}
          height={collapsed ? 36 : 64}
          style={{ borderRadius: 12, objectFit: "cover" }}
        />
        <button
          className="layout-toggle layout-float"
          title={collapsed ? "Expandir" : "Contraer"}
          aria-label="Toggle sidebar"
          onClick={toggleCollapsed}
          style={{ position: "absolute", top: 8, right: -14, zIndex: 50 }}
        >
          <img
            src={toggleIcon}
            alt=""
            style={{ width:  20, height: 20, filter: "brightness(0) invert(1)", transform: collapsed ? "rotate(180deg)" : "none" }}
          />
        </button>
      </div>
      <div className="sidebar-divider" />
      {user && (
        <div
          className="sidebar-user"
          style={{
            padding: 12,
            paddingLeft: 32,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span className="sidebar-icon" aria-hidden="true">
            <User size={18} />
          </span>
          {!collapsed && (
            <div style={{ color: "#cbd5e1", fontSize: 13 }}>
              {user.nombre} • {user.rol}
            </div>
          )}
        </div>
      )}
      <div className="sidebar-divider" />
      <nav
        className="sidebar-nav"
        style={{
          display: "flex",
          flexDirection: "column",
          padding: 8,
          paddingLeft: 20,
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
        }}
      >
        {menuItems.map((item) => {
          const active = pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link${active ? " active" : ""}`}
              title={item.label}
              aria-current={active ? "page" : undefined}
            >
              {item.Icon && (
                <span className="sidebar-icon" aria-hidden="true">
                  <item.Icon size={18} />
                </span>
              )}
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
      <div
        className="sidebar-footer"
        style={{
          marginTop: "auto",
          padding: 12,
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <button
          className={`btn btn-secondary ${collapsed ? "btn-icon" : ""}`}
          title="Cerrar sesión"
          onClick={handleLogout}
          style={{ width: collapsed ? 34 : "100%" }}
        >
          {collapsed ? <LogOut size={16} /> : "Cerrar sesión"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
