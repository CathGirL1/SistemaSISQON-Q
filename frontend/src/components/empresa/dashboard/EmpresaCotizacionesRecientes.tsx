import type { CotizacionReciente } from "../../../interfaces/Dashboard";

interface Props {
  cotizaciones: CotizacionReciente[];
}

export default function EmpresaCotizacionesRecientes({
  cotizaciones,
}: Props) {
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

        {cotizaciones.map((cotizacion) => (
          <div
            className="table-row"
            key={cotizacion.id_Cotizacion}
          >
            <span>{cotizacion.cliente}</span>

            <span>{cotizacion.proyecto}</span>

            <span>
              {new Intl.NumberFormat("es-UY", {
                style: "currency",
                currency: "UYU",
              }).format(cotizacion.totalCotizacion)}
            </span>

            <span
              className={`estado ${cotizacion.estado.toLowerCase()}`}
            >
              {cotizacion.estado}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}