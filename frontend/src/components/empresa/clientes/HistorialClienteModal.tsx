import "../../../styles/empresa/clientes/ClientesModales.css";

import ModalBase from "../../common/ModalBase";
import type { ClienteEmpresa } from "../../../interfaces/ClienteEmpresa";

type Props = {
  abierto: boolean;
  cliente: ClienteEmpresa | null;
  onCerrar: () => void;
};

export default function HistorialClienteModal({
  abierto,
  cliente,
  onCerrar,
}: Props) {
  if (!cliente) return null;

  return (
    <ModalBase abierto={abierto} titulo={`Historial - ${cliente.nombre}`} onCerrar={onCerrar}>
      <div className="historial-cliente-modal">
        {cliente.historialCotizaciones.map((cotizacion) => (
          <div className="historial-cliente-item" key={cotizacion.id}>
            <div>
              <strong>{cotizacion.id}</strong>
              <p>{cotizacion.fecha}</p>
            </div>

            <span>{cotizacion.total}</span>
          </div>
        ))}
      </div>
    </ModalBase>
  );
}