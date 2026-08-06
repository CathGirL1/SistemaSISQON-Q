import type { IngresoMensual } from "../../../interfaces/Dashboard";

interface Props {
  ingresos: IngresoMensual[];
}

const nombresMeses = [
  "",
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

export default function EmpresaGraficoIngresos({
  ingresos,
}: Props) {
  const maximo =
    ingresos.length > 0
      ? Math.max(...ingresos.map((i) => i.total))
      : 1;

  return (
    <div className="dashboard-card">
      <div className="card-header">
        <div>
          <h2>Ingresos por mes</h2>
          <p>Ingresos generados por cotizaciones.</p>
        </div>
      </div>

      <div className="grafico-ingresos">
        {ingresos.length === 0 ? (
          <p>No existen ingresos registrados.</p>
        ) : (
          ingresos.map((ingreso) => (
            <div
              key={ingreso.mes}
              className="barra-item"
            >
              <div
                className="barra"
                style={{
                  height: `${(ingreso.total / maximo) * 180}px`,
                }}
              />

              <span className="barra-mes">
                {nombresMeses[ingreso.mes]}
              </span>

              <small>
                {new Intl.NumberFormat("es-UY", {
                  style: "currency",
                  currency: "UYU",
                  maximumFractionDigits: 0,
                }).format(ingreso.total)}
              </small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}