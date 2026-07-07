import "../../../styles/empresa/clientes/ClientesModales.css";

import ModalBase from "../../common/ModalBase";
import type { ClienteEmpresa } from "../../../interfaces/ClienteEmpresa";

type Props = {
  abierto: boolean;
  cliente: ClienteEmpresa | null;
  onCerrar: () => void;
  onConfirmar: () => void;
};

export default function ConfirmEliminarClienteModal({
  abierto,
  cliente,
  onCerrar,
  onConfirmar,
}: Props) {
  if (!cliente) return null;

  return (
    <ModalBase abierto={abierto} titulo="Eliminar cliente" onCerrar={onCerrar}>
      <div className="eliminar-cliente-modal">
        <p>
          ¿Seguro que querés eliminar a <strong>{cliente.nombre}</strong>?
        </p>

        <div className="cliente-modal-actions">
          <button className="btn-cancelar" onClick={onCerrar}>
            Cancelar
          </button>

          <button className="btn-eliminar" onClick={onConfirmar}>
            Eliminar
          </button>
        </div>
      </div>
    </ModalBase>
  );
}