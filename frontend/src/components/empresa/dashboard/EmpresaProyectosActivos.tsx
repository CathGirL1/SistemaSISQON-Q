import type {
  ProyectoActivo,
} from "../../../interfaces/Dashboard";

interface Props {
  proyectos: ProyectoActivo[];
}

export default function EmpresaProyectosActivos({
  proyectos,
}: Props) {
  return (
    <div className="dashboard-card">
      <div className="card-header">
        <div>
          <h2>Proyectos activos</h2>
          <p>Obras actualmente en seguimiento.</p>
        </div>
      </div>

      <div className="project-list">
        {proyectos.map((proyecto) => (
          <div
            key={proyecto.nombre}
            className="project-item"
          >
            <div>
              <h4>{proyecto.nombre}</h4>
              <p>{proyecto.estado}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}