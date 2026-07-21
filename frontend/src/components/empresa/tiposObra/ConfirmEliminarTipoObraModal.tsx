import "../../../styles/empresa/tiposObra/TiposObraModales.css";

import ModalBase from "../../common/ModalBase";
import type { TipoObraEmpresa } from "../../../interfaces/TipoObraEmpresa";

type Props = {
  abierto: boolean;
  tipoObra: TipoObraEmpresa | null;
  onCerrar: () => void;
  onConfirmar: () => void;
};

export default function ConfirmEliminarTipoObraModal({
  abierto,
  tipoObra,
  onCerrar,
  onConfirmar,
}: Props) {
  if (!tipoObra) return null;

  return (
    <ModalBase abierto={abierto} titulo="Eliminar tipo de obra" onCerrar={onCerrar}>
      <div className="eliminar-tipo-obra-modal">
        <p>
          ¿Seguro que querés eliminar el tipo de obra{" "}
          <strong>{tipoObra.nombre}</strong>?
        </p>

        <div className="tipo-obra-modal-actions">
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