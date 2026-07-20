import "../../../styles/empresa/manoObra/ManoObraModales.css";

import ModalBase from "../../common/ModalBase";

import type { ManoObraEmpresa } from "../../../interfaces/ManoObraEmpresa";

type Props = {
  abierto: boolean;
  trabajo: ManoObraEmpresa | null;
  onCerrar: () => void;
  onConfirmar: () => void;
};

export default function ConfirmEliminarManoObra({
  abierto,
  trabajo,
  onCerrar,
  onConfirmar,
}: Props) {
  if (!trabajo) return null;

  return (
    <ModalBase
      abierto={abierto}
      titulo="Eliminar trabajo"
      onCerrar={onCerrar}
    >
      <div className="eliminar-mano-obra-modal">
        <p>
          ¿Seguro que querés eliminar el trabajo{" "}
          <strong>{trabajo.nombre}</strong>?
        </p>

        <span>
          Esta acción eliminará el registro de la base de datos y no podrá deshacerse.
        </span>

        <div className="mano-obra-modal-actions">
          <button
            type="button"
            className="mano-obra-btn-cancelar"
            onClick={onCerrar}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="mano-obra-btn-eliminar"
            onClick={onConfirmar}
          >
            Eliminar
          </button>
        </div>
      </div>
    </ModalBase>
  );
}