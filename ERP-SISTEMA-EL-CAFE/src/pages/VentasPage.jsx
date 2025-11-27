import React, { useMemo, useState, useEffect, useRef } from "react";
import { useVentas, useClientes } from "../hooks/useVentas";
import Button from "../components/common/Button";
import Table from "../components/common/Table";
import Modal from "../components/common/Modal";
import Input from "../components/common/Input";
import Select from "../components/common/Select";
import { Form, FormGroup, FormActions } from "../components/forms/Form";
import { ShoppingCart, Eye, FileText, Mail, Ban } from "lucide-react";
import empresa from "../config/empresa";
import { buildEmailHTML } from "../templates/emailTemplate";
import { buildBoletaHTML } from "../templates/boletaTemplate";
import inventarioService from "../services/inventarioService";

const VentasPage = () => {
  const {
    ventas,
    loading,
    crearVenta,
    actualizarVenta,
    eliminarVenta,
    anularVenta,
    generarPDF,
    enviarComprobanteEmail,
    registrarImpresion,
    refetch,
  } = useVentas();
  const { clientes } = useClientes();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [filtros, setFiltros] = useState({
    desde: "",
    hasta: "",
    cliente: "",
    metodoPago: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [isEmailPreviewOpen, setIsEmailPreviewOpen] = useState(false);
  const [emailHtml, setEmailHtml] = useState("");
  const [emailDestino, setEmailDestino] = useState("");
  const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false);
  const [pdfHtml, setPdfHtml] = useState("");
  const [ticketWidth, setTicketWidth] = useState(empresa.ticketWidthMm || 80);
  const pdfFrameRef = useRef(null);
  const [codigoScan, setCodigoScan] = useState("");
  const [scanError, setScanError] = useState("");
  const [formData, setFormData] = useState({
    cliente: "",
    empleado: "",
    canal: "Mostrador",
    tipoComprobante: "Boleta",
    metodoPago: "Efectivo",
    descuento: 0,
    total: 0,
    productos: [],
  });

  const IGV = 0.18;

  const totales = useMemo(() => {
    const subtotal = (formData.productos || []).reduce(
      (acc, p) =>
        acc +
        Number(p.precio || 0) * Number(p.cantidad || 0) -
        Number(p.descuento || 0),
      0
    );
    const base = Math.max(0, subtotal);
    const igv = Math.round(base * IGV * 100) / 100;
    const total = Math.round((base + igv) * 100) / 100;
    return { subtotal: Math.round(subtotal * 100) / 100, igv, total };
  }, [formData.productos]);

  useEffect(() => {
    if (!isNaN(totales.total)) {
      setFormData((prev) => ({ ...prev, total: totales.total }));
    }
  }, [totales.total]);

  const columns = [
    { key: "fecha", title: "Fecha", align: "left" },
    { key: "cliente", title: "Cliente", align: "left" },
    { key: "tipoComprobante", title: "Tipo", align: "left" },
    { key: "numeroComprobante", title: "Número", align: "left" },
    {
      key: "total",
      title: "Total",
      align: "right",
      render: (value) => `S/ ${value.toFixed(2)}`,
    },
    { key: "metodoPago", title: "Método de Pago", align: "left" },
    {
      key: "estado",
      title: "Estado",
      align: "center",
      render: (value) => (
        <span
          className={`badge ${
            value === "Completado" ? "badge-green" : "badge-yellow"
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  const handleNuevaVenta = () => {
    setVentaSeleccionada(null);
    setFormData({
      cliente: "",
      empleado: "",
      canal: "Mostrador",
      tipoComprobante: "Boleta",
      metodoPago: "Efectivo",
      descuento: 0,
      total: "",
      productos: [],
    });
    setIsModalOpen(true);
  };

  const handleEditarVenta = (venta) => {
    setVentaSeleccionada(venta);
    setFormData({
      cliente: venta.cliente,
      empleado: venta.empleado || "",
      canal: venta.canal || "Mostrador",
      tipoComprobante: venta.tipoComprobante,
      metodoPago: venta.metodoPago,
      descuento: venta.descuento || 0,
      total: venta.total,
      productos: (venta.productos || []).map((p) => ({
        nombre: p.nombre,
        cantidad: p.cantidad,
        precio: p.precio,
        descuento: p.descuento || 0,
      })),
    });
    setIsModalOpen(true);
  };

  const handleEliminarVenta = async (venta) => {
    if (window.confirm("¿Está seguro de eliminar esta venta?")) {
      await eliminarVenta(venta.id);
    }
  };

  const handleAnularVenta = async (venta) => {
    if (venta.estado === "Anulado") return;
    if (window.confirm("¿Anular esta venta y revertir stock?")) {
      await anularVenta(venta.id, "Anulación solicitada desde listado");
    }
  };

  const handlePDF = (venta) => {
    setPdfHtml(
      buildBoletaHTML(venta, empresa, {
        widthMm: ticketWidth,
        autoPrint: false,
      })
    );
    setVentaSeleccionada(venta);
    setIsPdfPreviewOpen(true);
  };

  const handleEmail = (venta) => {
    const clienteInfo = clientes.find((c) => c.nombre === venta.cliente);
    const emailDefault = clienteInfo?.email || "cliente@correo.com";
    setEmailDestino(emailDefault);
    setEmailHtml(buildEmailHTML(venta, empresa));
    setVentaSeleccionada(venta);
    setIsEmailPreviewOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrorMsg("");
      if (ventaSeleccionada) {
        await actualizarVenta(ventaSeleccionada.id, formData);
      } else {
        await crearVenta(formData);
      }
      setIsModalOpen(false);
    } catch (error) {
      setErrorMsg(error?.message || "Error al guardar venta");
    }
  };

  const aplicarFiltros = async () => {
    await refetch({ ...filtros });
  };

  const addProducto = () => {
    setFormData((prev) => ({
      ...prev,
      productos: [
        ...prev.productos,
        { nombre: "", cantidad: 1, precio: 0, descuento: 0 },
      ],
    }));
  };

  const updateProducto = (idx, field, value) => {
    setFormData((prev) => ({
      ...prev,
      productos: prev.productos.map((p, i) =>
        i === idx
          ? { ...p, [field]: field === "nombre" ? value : Number(value) }
          : p
      ),
    }));
  };

  const removeProducto = (idx) => {
    setFormData((prev) => ({
      ...prev,
      productos: prev.productos.filter((_, i) => i !== idx),
    }));
  };

  const opcionesClientes = clientes.map((cliente) => ({
    value: cliente.nombre,
    label: cliente.nombre,
  }));

  const opcionesComprobante = [
    { value: "Boleta", label: "Boleta" },
    { value: "Factura", label: "Factura" },
  ];

  const opcionesPago = [
    { value: "Efectivo", label: "Efectivo" },
    { value: "Tarjeta", label: "Tarjeta" },
    { value: "Yape", label: "Yape" },
    { value: "Plin", label: "Plin" },
    { value: "Transferencia", label: "Transferencia" },
  ];

  const opcionesCanal = [
    { value: "Mostrador", label: "Mostrador" },
    { value: "Delivery", label: "Delivery" },
    { value: "Web", label: "Web" },
  ];

  return (
    <div className="page">
      <div
        className="row-16"
        style={{ justifyContent: "space-between", marginBottom: 16 }}
      >
        <div className="title-wrap">
          <ShoppingCart size={20} />
          <h1 className="section-title title-strong">Gestión de Ventas</h1>
        </div>
        <Button onClick={handleNuevaVenta} variant="success" disabled={loading}>
          Nueva Venta
        </Button>
      </div>

      {errorMsg && (
        <div className="alert alert-danger" style={{ marginBottom: 12 }}>
          {errorMsg}
        </div>
      )}

      <div className="card" style={{ marginBottom: 16, padding: 16 }}>
        <div className="filters-row">
          <Input
            label="Desde"
            type="date"
            value={filtros.desde}
            onChange={(e) => setFiltros({ ...filtros, desde: e.target.value })}
          />
          <Input
            label="Hasta"
            type="date"
            value={filtros.hasta}
            onChange={(e) => setFiltros({ ...filtros, hasta: e.target.value })}
          />
          <Input
            label="Cliente"
            value={filtros.cliente}
            onChange={(e) =>
              setFiltros({ ...filtros, cliente: e.target.value })
            }
            placeholder="Nombre"
          />
          <Select
            label="Método de Pago"
            options={opcionesPago}
            value={filtros.metodoPago || ""}
            onChange={(e) =>
              setFiltros({ ...filtros, metodoPago: e.target.value })
            }
          />
          <Button variant="primary" onClick={aplicarFiltros} disabled={loading}>
            Filtrar
          </Button>
        </div>
      </div>

      <div className="card">
        <Table
          columns={columns}
          data={ventas}
          onEdit={handleEditarVenta}
          onDelete={handleEliminarVenta}
          renderActions={(row) => (
            <>
              <Button
                variant="primary"
                size="small"
                onlyIcon
                title="Ver"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditarVenta(row);
                }}
                icon={<Eye size={16} />}
              />
              <Button
                variant="secondary"
                size="small"
                onlyIcon
                title="PDF"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePDF(row);
                }}
                icon={<FileText size={16} />}
              />
              <Button
                variant="secondary"
                size="small"
                onlyIcon
                title="Email"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEmail(row);
                }}
                icon={<Mail size={16} />}
              />
              <Button
                variant="warning"
                size="small"
                onlyIcon
                title="Anular"
                disabled={row.estado === "Anulado"}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAnularVenta(row);
                }}
                icon={<Ban size={16} />}
              />
            </>
          )}
          emptyMessage="No hay ventas registradas"
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={ventaSeleccionada ? "Editar Venta" : "Nueva Venta"}
      >
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Input
              label="Empleado"
              value={formData.empleado}
              onChange={(e) =>
                setFormData({ ...formData, empleado: e.target.value })
              }
              placeholder="Nombre del vendedor"
              required
            />
            <div className="grid-2">
              <Select
                label="Canal"
                options={opcionesCanal}
                value={formData.canal}
                onChange={(e) =>
                  setFormData({ ...formData, canal: e.target.value })
                }
                required
              />
              <Select
                label="Cliente"
                options={opcionesClientes}
                value={formData.cliente}
                onChange={(e) =>
                  setFormData({ ...formData, cliente: e.target.value })
                }
                required
              />
            </div>
            <div className="grid-3">
              <Select
                label="Tipo de Comprobante"
                options={opcionesComprobante}
                value={formData.tipoComprobante}
                onChange={(e) =>
                  setFormData({ ...formData, tipoComprobante: e.target.value })
                }
                required
              />
              <Select
                label="Método de Pago"
                options={opcionesPago}
                value={formData.metodoPago}
                onChange={(e) =>
                  setFormData({ ...formData, metodoPago: e.target.value })
                }
                required
              />
              <Input
                label="Descuento %"
                type="number"
                value={formData.descuento}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    descuento: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0"
              />
            </div>
          </FormGroup>

          <div className="card" style={{ padding: 12, marginTop: 8 }}>
            <div
              className="row-16"
              style={{ justifyContent: "space-between", marginBottom: 8 }}
            >
              <h3 className="section-title">Productos</h3>
              <Button type="button" variant="secondary" onClick={addProducto}>
                Agregar
              </Button>
            </div>
            <div className="row-16" style={{ marginBottom: 8 }}>
              <Input
                label="Código de barras / SKU"
                value={codigoScan}
                onChange={(e) => setCodigoScan(e.target.value)}
                placeholder="Escanee o escriba el código"
              />
              <Button
                type="button"
                variant="primary"
                onClick={agregarPorCodigo}
              >
                Agregar por código
              </Button>
            </div>
            {scanError && (
              <div className="error-text" style={{ marginBottom: 8 }}>
                {scanError}
              </div>
            )}
            <table className="table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Desc. línea</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {formData.productos.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        textAlign: "center",
                        color: "#6b7280",
                        padding: 8,
                      }}
                    >
                      Sin productos
                    </td>
                  </tr>
                ) : (
                  formData.productos.map((p, idx) => {
                    const subtotal = Math.max(
                      0,
                      Number(p.precio || 0) * Number(p.cantidad || 0) -
                        Number(p.descuento || 0)
                    );
                    return (
                      <tr key={idx}>
                        <td>
                          <Input
                            value={p.nombre}
                            onChange={(e) =>
                              updateProducto(idx, "nombre", e.target.value)
                            }
                            placeholder="Nombre"
                          />
                        </td>
                        <td>
                          <Input
                            type="number"
                            value={p.cantidad}
                            onChange={(e) =>
                              updateProducto(idx, "cantidad", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <Input
                            type="number"
                            step="0.01"
                            value={p.precio}
                            onChange={(e) =>
                              updateProducto(idx, "precio", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <Input
                            type="number"
                            step="0.01"
                            value={p.descuento || 0}
                            onChange={(e) =>
                              updateProducto(idx, "descuento", e.target.value)
                            }
                          />
                        </td>
                        <td>S/ {subtotal.toFixed(2)}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => removeProducto(idx)}
                          >
                            Quitar
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            <div
              className="row-16"
              style={{ justifyContent: "flex-end", gap: 16, marginTop: 8 }}
            >
              <div className="stat">
                <div className="stat-label">Subtotal</div>
                <div className="stat-value">
                  S/ {totales.subtotal.toFixed(2)}
                </div>
              </div>
              <div className="stat">
                <div className="stat-label">IGV (18%)</div>
                <div className="stat-value">S/ {totales.igv.toFixed(2)}</div>
              </div>
              <div className="stat">
                <div className="stat-label">Total</div>
                <div className="stat-value">S/ {totales.total.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <FormActions>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {ventaSeleccionada ? "Actualizar" : "Guardar"}
            </Button>
          </FormActions>
        </Form>
      </Modal>

      <Modal
        isOpen={isPdfPreviewOpen}
        onClose={() => setIsPdfPreviewOpen(false)}
        title={"Previsualización de boleta"}
      >
        <div className="stack-16">
          <div
            className="row-16"
            style={{ alignItems: "center", justifyContent: "space-between" }}
          >
            <div className="row-12" style={{ alignItems: "center" }}>
              <Select
                label="Ancho papel (mm)"
                options={[
                  { value: "58", label: "58 mm" },
                  { value: "80", label: "80 mm" },
                ]}
                value={String(ticketWidth)}
                onChange={(e) => {
                  const w = Number(e.target.value);
                  setTicketWidth(w);
                  if (ventaSeleccionada)
                    setPdfHtml(
                      buildBoletaHTML(ventaSeleccionada, empresa, {
                        widthMm: w,
                        autoPrint: false,
                      })
                    );
                }}
              />
            </div>
            <Button
              variant="primary"
              onClick={() => {
                const frame = pdfFrameRef.current;
                if (frame && frame.contentWindow) {
                  frame.contentWindow.focus();
                  frame.contentWindow.print();
                }
                if (ventaSeleccionada) {
                  registrarImpresion(ventaSeleccionada.id, {
                    widthMm: ticketWidth,
                  });
                }
              }}
            >
              Imprimir boleta
            </Button>
          </div>
          <div className="card" style={{ padding: 0 }}>
            <iframe
              title="pdf-preview"
              srcDoc={pdfHtml}
              ref={pdfFrameRef}
              style={{
                width: "100%",
                height: 520,
                border: "none",
                borderRadius: 12,
              }}
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isEmailPreviewOpen}
        onClose={() => setIsEmailPreviewOpen(false)}
        title={"Previsualización de correo"}
      >
        <div className="stack-16">
          <Input
            label="Correo destino"
            value={emailDestino}
            onChange={(e) => setEmailDestino(e.target.value)}
            placeholder="cliente@correo.com"
          />
          <div className="card" style={{ padding: 0 }}>
            <iframe
              title="email-preview"
              srcDoc={emailHtml}
              style={{
                width: "100%",
                height: 480,
                border: "none",
                borderRadius: 12,
              }}
            />
          </div>
          <div className="form-actions">
            <Button
              variant="secondary"
              onClick={() => setIsEmailPreviewOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={async () => {
                const ok = await enviarComprobanteEmail(
                  ventaSeleccionada.id,
                  emailDestino
                );
                if (ok) {
                  setIsEmailPreviewOpen(false);
                  alert("Comprobante enviado");
                }
              }}
            >
              Enviar correo
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default VentasPage;
const agregarPorCodigo = () => {
  setScanError("");
  const prod = inventarioService.getProductoByCodigo(codigoScan);
  if (!prod) {
    setScanError("Código no encontrado");
    return;
  }
  setFormData((prev) => ({
    ...prev,
    productos: [
      ...prev.productos,
      {
        nombre: prod.nombre,
        cantidad: 1,
        precio: Number(prod.precioVenta || 0),
        descuento: 0,
      },
    ],
  }));
  setCodigoScan("");
};
