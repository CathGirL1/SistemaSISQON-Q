import type {
  DistribucionTipoObra,
} from "../../../interfaces/Dashboard";

interface Props {
  distribucion: DistribucionTipoObra[];
}

const colores = [
  "#43b993",
  "#1671b9",
  "#f4a340",
  "#8b5cf6",
  "#ef6461",
  "#64748b",
];

export default function EmpresaGraficoDistribucion({
  distribucion,
}: Props) {

  const total = distribucion.reduce(
    (acc, item) => acc + Number(item.cantidad),
    0
  );

  let acumulado = 0;

  const segmentos = distribucion.map(
    (item, index) => {

      const cantidad = Number(item.cantidad);

      const inicio =
        total > 0
          ? (acumulado / total) * 100
          : 0;

      acumulado += cantidad;

      const fin =
        total > 0
          ? (acumulado / total) * 100
          : 0;

      return {
        ...item,
        cantidad,
        color:
          colores[index % colores.length],
        inicio,
        fin,
      };
    }
  );

  const gradiente =
    total > 0
      ? `conic-gradient(
          ${segmentos
            .map(
              (segmento) =>
                `${segmento.color} ${segmento.inicio}% ${segmento.fin}%`
            )
            .join(", ")}
        )`
      : "#e5e7eb";

  return (
    <div className="dashboard-card">

      <div className="card-header">
        <div>
          <h2>Distribución de proyectos</h2>
          <p>Tipos de obra más solicitados.</p>
        </div>
      </div>

      <div className="donut-container">

        <div
          className="donut-chart"
          style={{
            background: gradiente,
          }}
        >
          <div className="donut-centro">
            <span>{total}</span>
          </div>
        </div>

        <div className="donut-labels">

          {segmentos.map((item) => (
            <div
              className="donut-label-item"
              key={item.nombre}
            >
              <span
                className="donut-color"
                style={{
                  backgroundColor: item.color,
                }}
              />

              <span>
                {item.nombre} ({item.cantidad})
              </span>
            </div>
          ))}

        </div>

      </div>

    </div>
  );
}