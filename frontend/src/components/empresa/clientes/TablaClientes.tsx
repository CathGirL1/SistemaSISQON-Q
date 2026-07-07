import "../../../styles/empresa/clientes/TablaClientes.css";

import FilaCliente from "./FilaCliente";
import type { ClienteEmpresa } from "../../../interfaces/ClienteEmpresa";

type Props = {
  clientes: ClienteEmpresa[];
  clienteSeleccionado: ClienteEmpresa;
  onSeleccionarCliente: (cliente: ClienteEmpresa) => void;
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
  onSeleccionarCliente,
  onWhatsapp,
  onEditar,
  onAgregarNota,
  onLlamar,
  onVerHistorial,
  onEliminar,
}: Props) {
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
            {clientes.map((cliente) => (
              <FilaCliente
                key={cliente.id}
                cliente={cliente}
                activo={clienteSeleccionado.id === cliente.id}
                onSeleccionar={() => onSeleccionarCliente(cliente)}
                onWhatsapp={onWhatsapp}
                onEditar={onEditar}
                onAgregarNota={onAgregarNota}
                onLlamar={onLlamar}
                onVerHistorial={onVerHistorial}
                onEliminar={onEliminar}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="clientes-table-footer">
        Mostrando 1 a {clientes.length} de 156 clientes
      </div>
    </div>
  );
}