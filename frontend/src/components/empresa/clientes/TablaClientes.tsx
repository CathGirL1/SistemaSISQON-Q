import "../../../styles/empresa/clientes/TablaClientes.css";

import FilaCliente from "./FilaCliente";

import type { ClienteEmpresa } from "../../../interfaces/ClienteEmpresa";

type Props = {
  clientes: ClienteEmpresa[];
  clienteSeleccionado: ClienteEmpresa | null;

  cargando: boolean;
  error: string;

  onSeleccionarCliente: (
    cliente: ClienteEmpresa
  ) => void;

  onWhatsapp: (cliente: ClienteEmpresa) => void;
  onEditar: (cliente: ClienteEmpresa) => void;
  onAgregarNota: (cliente: ClienteEmpresa) => void;
  onLlamar: (cliente: ClienteEmpresa) => void;
  onVerHistorial: (cliente: ClienteEmpresa) => void;
  onEliminar: (cliente: ClienteEmpresa) => void;
};

export default function TablaClientes({
  clientes,
  clienteSeleccionado,
  cargando,
  error,
  onSeleccionarCliente,
  onWhatsapp,
  onEditar,
  onAgregarNota,
  onLlamar,
  onVerHistorial,
  onEliminar,
}: Props) {
  if (cargando) {
    return (
      <div className="tabla-clientes-card">
        <div className="clientes-estado-tabla">
          <span className="clientes-spinner" />

          <p>
            Cargando clientes desde la base de datos...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tabla-clientes-card">
        <div className="clientes-estado-tabla clientes-error">
          <h3>No se pudieron cargar los clientes</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tabla-clientes-card">
      <div className="tabla-clientes-wrapper">
        <table className="tabla-clientes">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Dirección</th>
              <th>Historial</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {clientes.length > 0 ? (
              clientes.map((cliente) => (
                <FilaCliente
                  key={cliente.id}
                  cliente={cliente}
                  activo={
                    clienteSeleccionado?.id === cliente.id
                  }
                  onSeleccionar={() =>
                    onSeleccionarCliente(cliente)
                  }
                  onWhatsapp={onWhatsapp}
                  onEditar={onEditar}
                  onAgregarNota={onAgregarNota}
                  onLlamar={onLlamar}
                  onVerHistorial={onVerHistorial}
                  onEliminar={onEliminar}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="clientes-tabla-vacia"
                >
                  No hay clientes registrados en la base
                  de datos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="clientes-table-footer">
        {clientes.length === 0
          ? "No hay clientes para mostrar"
          : `Mostrando 1 a ${clientes.length} de ${clientes.length} clientes`}
      </div>
    </div>
  );
}