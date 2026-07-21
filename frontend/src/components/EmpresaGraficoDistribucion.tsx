export default function EmpresaGraficoDistribucion() {
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
          <span>100%</span>
        </div>

        <div className="donut-labels">
          <p><span className="dot quinchos"></span> Quinchos 55%</p>
          <p><span className="dot reformas"></span> Reformas 30%</p>
          <p><span className="dot obras"></span> Obras generales 15%</p>
        </div>
      </div>
    </div>
  );
}