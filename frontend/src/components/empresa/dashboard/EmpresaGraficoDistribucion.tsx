import type {
  DistribucionTipoObra,
} from "../../../interfaces/Dashboard";

interface Props {
  distribucion: DistribucionTipoObra[];
}

export default function EmpresaGraficoDistribucion({
  distribucion,
}: Props) {
  const total = distribucion.reduce(
    (acc, item) => acc + item.cantidad,
    0
  );

  return (
    <div className="dashboard-card">
      <div className="card-header">
        <div>
          <h2>Distribución de proyectos</h2>
          <p>Tipos de obra más solicitados.</p>
        </div>
      </div>

      <div className="donut-container">
        <div className="donut-chart">
          <span>{total}</span>
        </div>

        <div className="donut-labels">
          {distribucion.map((item) => (
            <p key={item.nombre}>
              {item.nombre} ({item.cantidad})
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}