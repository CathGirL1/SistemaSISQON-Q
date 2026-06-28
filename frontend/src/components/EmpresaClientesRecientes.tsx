export default function EmpresaClientesRecientes() {
  return (
    <div className="dashboard-card">
      <div className="card-header">
        <div>
          <h2>Clientes recientes</h2>
          <p>Últimos usuarios que solicitaron cotización.</p>
        </div>
      </div>

      <div className="clientes-list">
        <div className="cliente-item">
          <div className="cliente-avatar">JP</div>
          <div>
            <h4>Juan Pérez</h4>
            <p>Quincho moderno</p>
          </div>
        </div>

        <div className="cliente-item">
          <div className="cliente-avatar">LG</div>
          <div>
            <h4>Lucía Gómez</h4>
            <p>Reforma exterior</p>
          </div>
        </div>

        <div className="cliente-item">
          <div className="cliente-avatar">CS</div>
          <div>
            <h4>Carlos Silva</h4>
            <p>Quincho rústico</p>
          </div>
        </div>
      </div>
    </div>
  );
}