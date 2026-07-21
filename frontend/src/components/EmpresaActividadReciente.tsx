import { FaCheckCircle, FaClock, FaExclamationCircle } from "react-icons/fa";

export default function EmpresaActividadReciente() {
  return (
    <div className="dashboard-card">
      <div className="card-header">
        <div>
          <h2>Actividad reciente</h2>
          <p>Últimos movimientos registrados.</p>
        </div>
      </div>

      <div className="activity-list">
        <div className="activity-item">
          <div className="activity-icon success">
            <FaCheckCircle />
          </div>

          <div>
            <h4>Cotización aprobada</h4>
            <p>Quincho rústico de 24m²</p>
            <span>Hace 2 horas</span>
          </div>
        </div>

        <div className="activity-item">
          <div className="activity-icon warning">
            <FaClock />
          </div>

          <div>
            <h4>Cotización pendiente</h4>
            <p>Reforma exterior</p>
            <span>Hace 5 horas</span>
          </div>
        </div>

        <div className="activity-item">
          <div className="activity-icon danger">
            <FaExclamationCircle />
          </div>

          <div>
            <h4>Stock bajo</h4>
            <p>Madera tratada</p>
            <span>Ayer</span>
          </div>
        </div>
      </div>
    </div>
  );
}