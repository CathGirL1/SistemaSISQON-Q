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
      ? Math.max(
          ...ingresos.map(
            (ingreso) => Number(ingreso.total)
          )
        )
      : 1;

  return (
    <div className="dashboard-card">

      <div className="card-header">
        <div>
          <h2>Ingresos por mes</h2>

          <p>
            Ingresos por cotizaciones finalizadas.
          </p>
        </div>
      </div>

      <div className="grafico-ingresos">

        {ingresos.length === 0 ? (

          <p>
            No existen ingresos registrados.
          </p>

        ) : (

          ingresos.map((ingreso) => {

            const total = Number(ingreso.total);

            const altura =
              maximo > 0
                ? Math.max(
                    (total / maximo) * 180,
                    8
                  )
                : 8;

            return (
              <div
                key={ingreso.mes}
                className="barra-item"
              >

                {/* VALOR */}
                <small className="barra-valor">
                  US${" "}
                  {total.toLocaleString(
                    "es-UY",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </small>

                {/* BARRA */}
                <div
                  className="barra"
                  style={{
                    height: `${altura}px`,
                  }}
                />

                {/* MES */}
                <span className="barra-mes">
                  {nombresMeses[ingreso.mes]}
                </span>

              </div>
            );
          })

        )}

      </div>

    </div>
  );
}