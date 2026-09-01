import type { ClienteReciente } from "../../../interfaces/Dashboard";

interface Props {
  clientes: ClienteReciente[];
}

export default function EmpresaClientesRecientes({
  clientes,
}: Props) {
  return (
    <div className="dashboard-card">
      <div className="card-header">
        <div>
          <h2>Clientes recientes</h2>
          <p>Últimos usuarios registrados.</p>
        </div>
      </div>

      <div className="clientes-list">
        {clientes.map((cliente) => (
          <div
            className="cliente-item"
            key={cliente.id_Cliente}
          >
            <div className="cliente-avatar">
              {cliente.nombre.charAt(0)}
              {cliente.apellido.charAt(0)}
            </div>

            <div>
              <h4>
                {cliente.nombre} {cliente.apellido}
              </h4>

              <p>{cliente.proyecto}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}