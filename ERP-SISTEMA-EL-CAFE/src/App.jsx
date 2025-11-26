import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Layout/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import VentasPage from "./pages/VentasPage";
import InventarioPage from "./pages/InventarioPage";
import ProduccionPage from "./pages/ProduccionPage";
import ReportesPage from "./pages/ReportesPage";
import CajaPage from "./pages/CajaPage";
import WebShopPage from "./pages/WebShopPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AdminWebDashboard from "./pages/AdminWebDashboard";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider, useAuth } from "./hooks/useAuth.jsx";

const AppShell = () => {
  const { token } = useAuth();
  const { pathname } = useLocation();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const titles = {
    "/": "Dashboard",
    "/ventas": "Ventas",
    "/inventario": "Inventario",
    "/produccion": "Producción",
    "/caja": "Caja",
    "/reportes": "Reportes",
    "/web/shop": "Web Shop",
    "/web/cart": "Carrito",
    "/web/checkout": "Checkout",
    "/web/admin": "Admin Web",
  };
  const viewTitle = titles[pathname] || "ERP";
  const pad2 = (n) => String(n).padStart(2, "0");
  const dateStr = `${pad2(now.getDate())}/${pad2(
    now.getMonth() + 1
  )}/${now.getFullYear()}`;
  const timeStr = now.toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  return (
    <div className="app-layout">
      {token && <Sidebar />}
      <div
        className="content-wrapper"
        style={{
          marginLeft: token ? 'var(--sidebar-width, 240px)' : 0,
          minHeight: "100vh",
          background: "#f5f6fa",
        }}
      >
        {token && (
          <div className="topbar">
            <div className="topbar-title">{viewTitle}</div>
            <div className="topbar-right">
              <div className="topbar-datetime">
                <div className="date-text">{dateStr}</div>
                <div className="time-text">{timeStr}</div>
              </div>
            </div>
          </div>
        )}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/ventas" element={<VentasPage />} />
            <Route path="/inventario" element={<InventarioPage />} />
            <Route path="/produccion" element={<ProduccionPage />} />
            <Route path="/caja" element={<CajaPage />} />
            <Route path="/reportes" element={<ReportesPage />} />
            <Route path="/web/shop" element={<WebShopPage />} />
            <Route path="/web/cart" element={<CartPage />} />
            <Route path="/web/checkout" element={<CheckoutPage />} />
            <Route path="/web/admin" element={<AdminWebDashboard />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
