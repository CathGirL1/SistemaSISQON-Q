import type {
  CotizacionReciente,
} from "../../../interfaces/Dashboard";

import EstadoBadge from "../../common/EstadoBadge";
import type { EstadoCotizacion } from "../../../interfaces/Cotizacion";

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

        {cotizaciones.length === 0 ? (
          <p className="dashboard-empty">
            No hay cotizaciones registradas.
          </p>
        ) : (
          cotizaciones.map((cotizacion) => (
            <div
              className="table-row"
              key={cotizacion.id_Cotizacion}
            >
              <span>{cotizacion.cliente}</span>

              <span>{cotizacion.proyecto}</span>

              <span>
                US${" "}
                {Number(
                  cotizacion.totalCotizacion
                ).toLocaleString("es-UY", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>

              <EstadoBadge
                estado={
                  cotizacion.estado as EstadoCotizacion
                }
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}