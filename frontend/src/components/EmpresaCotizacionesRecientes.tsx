export default function EmpresaCotizacionesRecientes() {
  return (
    <div className="dashboard-card">
      <div className="card-header">
        <div>
          <h2>Últimas cotizaciones</h2>
          <p>Solicitudes recientes de clientes.</p>
        </div>
      </div>

      <div className="dashboard-table">
        <div className="table-row table-head">
          <span>Cliente</span>
          <span>Proyecto</span>
          <span>Total</span>
          <span>Estado</span>
        </div>

        <div className="table-row">
          <span>Juan Pérez</span>
          <span>Quincho moderno</span>
          <span>$ 185.000</span>
          <span className="estado aprobada">Aprobada</span>
        </div>

        <div className="table-row">
          <span>Lucía Gómez</span>
          <span>Reforma patio</span>
          <span>$ 92.300</span>
          <span className="estado pendiente">Pendiente</span>
        </div>

        <div className="table-row">
          <span>Carlos Silva</span>
          <span>Quincho rústico</span>
          <span>$ 220.000</span>
          <span className="estado rechazada">Rechazada</span>
        </div>
      </div>
    </div>
  );
}