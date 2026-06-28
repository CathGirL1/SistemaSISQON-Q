import "../styles/HistorialEmpresa.css";
import { FaCheckCircle, FaClock, FaEdit } from "react-icons/fa";

export default function HistorialEmpresa() {
  return (
    <div className="historial-card">
      <div className="historial-header">
        <h2>Historial de actividad</h2>
        <p>Últimas acciones realizadas dentro del panel.</p>
      </div>

      <div className="historial-list">
        <div className="historial-item">
          <div className="historial-icon success">
            <FaCheckCircle />
          </div>

          <div>
            <h4>Cotización aprobada</h4>
            <p>Se aprobó la cotización “Quincho moderno”.</p>
            <span>Hace 2 horas</span>
          </div>
        </div>

        <div className="historial-item">
          <div className="historial-icon edit">
            <FaEdit />
          </div>

          <div>
            <h4>Perfil actualizado</h4>
            <p>Se modificaron datos de contacto de la empresa.</p>
            <span>Ayer</span>
          </div>
        </div>

        <div className="historial-item">
          <div className="historial-icon pending">
            <FaClock />
          </div>

          <div>
            <h4>Cotización pendiente</h4>
            <p>Una nueva solicitud quedó pendiente de revisión.</p>
            <span>Hace 3 días</span>
          </div>
        </div>
      </div>
    </div>
  );
}