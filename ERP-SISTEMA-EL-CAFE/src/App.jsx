import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import VentasPage from "./pages/VentasPage";
import InventarioPage from "./pages/InventarioPage";
import ProduccionPage from "./pages/ProduccionPage";
import ReportesPage from "./pages/ReportesPage";
import WebShopPage from "./pages/WebShopPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AdminWebDashboard from "./pages/AdminWebDashboard";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider, useAuth } from "./hooks/useAuth.jsx";

const AppShell = () => {
  const { token } = useAuth();
  return (
    <div className="app-layout">
      {token && <Sidebar />}
      <div
        className="content-wrapper"
        style={{
          marginLeft: token ? 240 : 0,
          minHeight: "100vh",
          background: "#f5f6fa",
        }}
      >
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/ventas" element={<VentasPage />} />
            <Route path="/inventario" element={<InventarioPage />} />
            <Route path="/produccion" element={<ProduccionPage />} />
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
