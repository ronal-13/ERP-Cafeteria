import React, { useMemo, useState } from "react";
import { useWebCatalog, useCart } from "../hooks/useEcommerce";
import Input from "../components/common/Input";
import Select from "../components/common/Select";
import Button from "../components/common/Button";
import { Coffee, Croissant, Tag, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PromotionsSection from "../components/promotions/PromotionsSection";
import WebShopNavbar from "../components/web/WebShopNavbar";

const WebShopPage = () => {
  const { productos, filtros, setFiltros, loading } = useWebCatalog({ pollingMs: 15000 });
  const { addItem, items, removeItem, subtotal, igv, total } = useCart();
  const navigate = useNavigate();
  const [categoria, setCategoria] = useState("");
  const [qtyMap, setQtyMap] = useState({});
  const categorias = useMemo(() => {
    const set = new Set([
      "",
      "Bebidas",
      "Panadería",
      "Postres",
      "Comida",
      "Sándwiches",
      "Galletas",
      "Queques",
    ]);
    productos.forEach((p) => {
      if (p.categoria) set.add(p.categoria);
    });
    return Array.from(set);
  }, [productos]);

  const imageSrcFor = (p) => {
    if (p?.imagen) return p.imagen;
    const base =
      "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?image_size=square&prompt=";
    const prompt = encodeURIComponent(
      `${p.nombre}, product shot, cafe style, soft light, wooden table, minimal background, photorealistic, 4k, SDXL`
    );
    return `${base}${prompt}`;
  };

  return (
    <div className="page">
      <div
        className="row-16"
        style={{ justifyContent: "space-between", marginBottom: 8 }}
      >
        <div className="title-wrap">
          <span className="kpi-icon">
            <ShoppingCart size={18} />
          </span>
          <h1 className="section-title title-strong">Web Shop</h1>
        </div>
      </div>

      <WebShopNavbar
        categorias={categorias}
        categoriaActiva={categoria}
        onSelectCategoria={(c) => { setCategoria(c); setFiltros({ ...filtros, categoria: c }); }}
        buscador={filtros.q}
        onBuscar={(q) => setFiltros({ ...filtros, q })}
        onCartClick={() => navigate('/web/cart')}
      />

      <PromotionsSection />
      <div className="title-underline" style={{ margin: "12px 0" }} />

      <div className="grid-4" style={{ marginBottom: 16 }}>
        {loading && (
          <div className="card" style={{ padding: 16 }}>
            Cargando...
          </div>
        )}
        {!loading && productos.length === 0 && (
          <div className="card" style={{ padding: 16 }}>
            No hay productos
          </div>
        )}
        {!loading &&
          productos.map((p) => (
            <div key={p.id} className="card" style={{ overflow: "hidden" }}>
              <div
                style={{
                  height: 160,
                  borderRadius: 8,
                  overflow: "hidden",
                  marginBottom: 12,
                }}
              >
                <img
                  src={imageSrcFor(p)}
                  alt={p.nombre}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div
                className="row-12"
                style={{ justifyContent: "space-between" }}
              >
                <div className="section-title title-dark" style={{ margin: 0 }}>
                  {p.nombre}
                </div>
                <div className="badge badge-blue">
                  S/ {Number(p.precio || 0).toFixed(2)}
                </div>
              </div>
              <p className="stat-label" style={{ marginTop: 4 }}>
                {p.descripcion || "Producto de cafetería"}
              </p>
              <div
                className="row-12"
                style={{ justifyContent: "space-between", marginTop: 8 }}
              >
                <div className="stat-label">Stock: {Number(p.stock || 0)}</div>
                <div className="row-12" style={{ gap: 8 }}>
                  <input
                    type="number"
                    min="1"
                    value={qtyMap[p.id] || 1}
                    onChange={(e) => setQtyMap(prev => ({ ...prev, [p.id]: Number(e.target.value) }))}
                    className="input"
                    style={{ width: 80 }}
                  />
                      <Button
                        variant="secondary"
                        size="small"
                        icon={
                          p.categoria === "Bebidas" ? (
                            <Coffee size={16} />
                      ) : (
                        <Croissant size={16} />
                      )
                    }
                  >
                    {p.categoria || "General"}
                  </Button>
                      <Button
                        variant="primary"
                        size="small"
                        onClick={() => { const q = Number(qtyMap[p.id] || 1); addItem(p, q); }}
                      >
                        Agregar
                      </Button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default WebShopPage;
