import type { ClienteEmpresa } from "../../../interfaces/ClienteEmpresa";
import ClienteEstadoBadge from "./ClienteEstadoBadge";
import ClienteAcciones from "./ClienteAcciones";

type Props = {
  cliente: ClienteEmpresa;
  activo: boolean;
  onSeleccionar: () => void;
  onWhatsapp: (cliente: ClienteEmpresa) => void;
  onEditar: (cliente: ClienteEmpresa) => void;
  onAgregarNota: (cliente: ClienteEmpresa) => void;
  onLlamar: (cliente: ClienteEmpresa) => void;
  onVerHistorial: (cliente: ClienteEmpresa) => void;
  onEliminar: (cliente: ClienteEmpresa) => void;
};

export default function FilaCliente({
  cliente,
  activo,
  onSeleccionar,
  onWhatsapp,
  onEditar,
  onAgregarNota,
  onLlamar,
  onVerHistorial,
  onEliminar,
}: Props) {
  return (
    <tr className={activo ? "cliente-fila-activa" : ""} onClick={onSeleccionar}>
      <td>
        <div className="cliente-info-cell">
          <div className="cliente-avatar">{cliente.iniciales}</div>

          <div>
            <h4>{cliente.nombre}</h4>
            <p>{cliente.email}</p>
          </div>
        </div>
      </td>

      <td>{cliente.telefono}</td>
      <td>{cliente.email}</td>

      <td>
        <strong>{cliente.direccion}</strong>
        <p>{cliente.ciudad}</p>
      </td>

      <td>
        <strong>{cliente.historial}</strong>
        <p>Última: {cliente.ultimaCotizacion}</p>
      </td>

      <td>
        <ClienteEstadoBadge estado={cliente.estado} />
      </td>

      <td onClick={(e) => e.stopPropagation()}>
        <ClienteAcciones
          onWhatsapp={() => onWhatsapp(cliente)}
          onEditar={() => onEditar(cliente)}
          onAgregarNota={() => onAgregarNota(cliente)}
          onLlamar={() => onLlamar(cliente)}
          onVerHistorial={() => onVerHistorial(cliente)}
          onEliminar={() => onEliminar(cliente)}
        />
      </td>
    </tr>
  );
}