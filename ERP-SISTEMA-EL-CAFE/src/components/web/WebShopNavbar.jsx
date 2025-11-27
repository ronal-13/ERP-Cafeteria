import React, { useEffect, useState } from "react";
import Input from "../../components/common/Input";
import empresa from "../../config/empresa";
import Button from "../common/Button";
import { ShoppingCart } from "lucide-react";

const WebShopNavbar = ({
  categorias = [],
  categoriaActiva = "",
  onSelectCategoria,
  buscador = "",
  onBuscar,
  onCartClick,
}) => {
  const cats = Array.isArray(categorias) ? categorias : [];
  const handleClick = (c) => {
    if (typeof onSelectCategoria === "function") onSelectCategoria(c);
  };
  const handleBuscar = (e) => {
    if (typeof onBuscar === "function") onBuscar(e.target.value);
  };
  const [count, setCount] = useState(0);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("web_cart_items");
      const arr = raw ? JSON.parse(raw) : [];
      const c = Array.isArray(arr)
        ? arr.reduce((acc, i) => acc + Number(i.cantidad || 0), 0)
        : 0;
      setCount(c);
    } catch {}
    const handler = (e) => {
      const c = e?.detail?.count;
      if (typeof c === "number") setCount(c);
      else {
        try {
          const raw2 = localStorage.getItem("web_cart_items");
          const arr2 = raw2 ? JSON.parse(raw2) : [];
          const c2 = Array.isArray(arr2)
            ? arr2.reduce((acc, i) => acc + Number(i.cantidad || 0), 0)
            : 0;
          setCount(c2);
        } catch {}
      }
    };
    window.addEventListener("web_cart_updated", handler);
    return () => window.removeEventListener("web_cart_updated", handler);
  }, []);

  return (
    <div className="navbar">
      <div className="navbar-brand">
        {empresa.logoUrl ? (
          <img src={empresa.logoUrl} alt={empresa.nombre} />
        ) : null}
      </div>
      <div className="navbar-center">
        <div className="navbar-search">
          <Input
            placeholder="Buscar productos"
            value={buscador}
            onChange={handleBuscar}
          />
        </div>
      </div>
      <div className="navbar-links">
        {(cats.length ? cats : [""]).map((c) => (
          <button
            key={c || "Todas"}
            className={`nav-link${
              (c || "") === (categoriaActiva || "") ? " active" : ""
            }`}
            onClick={() => handleClick(c)}
          >
            {c || "Todas"}
          </button>
        ))}
        <div className="cart-button">
          <Button
            onlyIcon
            variant="secondary"
            icon={<ShoppingCart size={18} />}
            onClick={() => onCartClick?.()}
          />
          {count > 0 && <span className="cart-badge">{count}</span>}
        </div>
      </div>
    </div>
  );
};

export default WebShopNavbar;
