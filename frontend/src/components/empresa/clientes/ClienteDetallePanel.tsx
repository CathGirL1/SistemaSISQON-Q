import "../../../styles/empresa/clientes/ClienteDetallePanel.css";

import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaTimes } from "react-icons/fa";
import type { ClienteEmpresa } from "../../../interfaces/ClienteEmpresa";

type Props = {
  cliente: ClienteEmpresa;
};

export default function ClienteDetallePanel({ cliente }: Props) {
  return (
    <aside className="cliente-detalle-panel">
      <button className="cliente-panel-close">
        <FaTimes />
      </button>

      <div className="cliente-panel-header">
        <div className="cliente-panel-avatar">{cliente.iniciales}</div>

        <div>
          <h3>{cliente.nombre}</h3>
          <span>{cliente.estado}</span>
        </div>
      </div>

      <div className="cliente-panel-info">
        <p><FaPhoneAlt /> {cliente.telefono}</p>
        <p><FaEnvelope /> {cliente.email}</p>
        <p><FaMapMarkerAlt /> {cliente.direccion}, {cliente.ciudad}</p>
      </div>

      <div className="cliente-panel-section">
        <h4>Notas internas</h4>
        <div className="nota-box">
          {cliente.notas}
          <small>Agregado por: Admin</small>
        </div>
      </div>

      <div className="cliente-panel-section">
        <h4>Historial de cotizaciones</h4>

        {cliente.historialCotizaciones.map((cotizacion) => (
          <div className="cotizacion-mini" key={cotizacion.id}>
            <div>
              <strong>{cotizacion.id}</strong>
              <p>{cotizacion.fecha}</p>
            </div>
            <span>{cotizacion.total}</span>
          </div>
        ))}

        <button className="ver-historial-btn">
          Ver todo el historial →
        </button>
      </div>
    </aside>
  );
}