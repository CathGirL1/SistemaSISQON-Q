export default function EmpresaProyectosActivos() {
  return (
    <div className="dashboard-card">
      <div className="card-header">
        <div>
          <h2>Proyectos activos</h2>
          <p>Obras actualmente en seguimiento.</p>
        </div>
      </div>

      <div className="project-list">
        <div className="project-item">
          <div>
            <h4>Quincho familiar</h4>
            <p>Cliente: Martín Rodríguez</p>
          </div>
          <span>75%</span>
        </div>

        <div className="progress">
          <div style={{ width: "75%" }}></div>
        </div>

        <div className="project-item">
          <div>
            <h4>Reforma exterior</h4>
            <p>Cliente: Sofía Acosta</p>
          </div>
          <span>45%</span>
        </div>

        <div className="progress">
          <div style={{ width: "45%" }}></div>
        </div>

        <div className="project-item">
          <div>
            <h4>Construcción quincho</h4>
            <p>Cliente: Pedro Núñez</p>
          </div>
          <span>30%</span>
        </div>

        <div className="progress">
          <div style={{ width: "30%" }}></div>
        </div>
      </div>
    </div>
  );
}