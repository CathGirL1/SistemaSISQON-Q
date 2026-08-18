import "../../../styles/empresa/clientes/ClienteDetallePanel.css";

import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaTimes,
} from "react-icons/fa";

import type { ClienteEmpresa } from "../../../interfaces/ClienteEmpresa";

type Props = {
  cliente: ClienteEmpresa;

  onCerrar: () => void;

  onVerHistorial: (
    cliente: ClienteEmpresa
  ) => void;
};

export default function ClienteDetallePanel({
  cliente,
  onCerrar,
  onVerHistorial,
}: Props) {
  return (
    <aside className="cliente-detalle-panel">
      <button
        type="button"
        className="cliente-panel-close"
        onClick={onCerrar}
        aria-label="Cerrar detalle"
      >
        <FaTimes />
      </button>

      <div className="cliente-panel-header">
        <div className="cliente-panel-avatar">
          {cliente.iniciales}
        </div>

        <div>
          <h3>{cliente.nombre}</h3>
          <span>{cliente.estado}</span>
        </div>
      </div>

      <div className="cliente-panel-info">
        <p>
          <FaPhoneAlt />
          {cliente.telefono || "Sin teléfono"}
        </p>

        <p>
          <FaEnvelope />
          {cliente.email || "Sin correo"}
        </p>

        <p>
          <FaMapMarkerAlt />

          {cliente.direccion
            ? cliente.direccion
            : "Sin dirección"}

          {cliente.ciudad
            ? `, ${cliente.ciudad}`
            : ""}
        </p>
      </div>

      <div className="cliente-panel-section">
        <h4>Notas internas</h4>

        <div className="nota-box">
          {cliente.notas || "Sin notas registradas."}
        </div>
      </div>

      <div className="cliente-panel-section">
        <h4>Historial de cotizaciones</h4>

        {cliente.historialCotizaciones.length > 0 ? (
          cliente.historialCotizaciones
            .slice(0, 3)
            .map((cotizacion) => (
              <div
                className="cotizacion-mini"
                key={cotizacion.id}
              >
                <div>
                  <strong>
                    {cotizacion.id}
                  </strong>

                  <p>
                    {cotizacion.fecha}
                  </p>
                </div>

                <span>
                  {cotizacion.total}
                </span>
              </div>
            ))
        ) : (
          <p className="cliente-sin-historial">
            No hay cotizaciones registradas.
          </p>
        )}

        <button
          type="button"
          className="ver-historial-btn"
          onClick={() =>
            onVerHistorial(cliente)
          }
        >
          Ver todo el historial →
        </button>
      </div>
    </aside>
  );
}