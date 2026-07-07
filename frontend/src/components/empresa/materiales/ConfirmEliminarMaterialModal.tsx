import "../../../styles/empresa/materiales/MaterialesModales.css";

import ModalBase from "../../common/ModalBase";
import type { MaterialEmpresa } from "../../../interfaces/MaterialEmpresa";

type Props = {
  abierto: boolean;
  material: MaterialEmpresa | null;
  onCerrar: () => void;
  onConfirmar: () => void;
};

export default function ConfirmEliminarMaterialModal({
  abierto,
  material,
  onCerrar,
  onConfirmar,
}: Props) {
  if (!material) return null;

  return (
    <ModalBase
      abierto={abierto}
      titulo="Eliminar material"
      onCerrar={onCerrar}
    >
      <div className="eliminar-material-modal">
        <p>
          ¿Seguro que querés eliminar el material{" "}
          <strong>{material.nombre}</strong>?
        </p>

        <div className="material-modal-actions">
          <button className="material-btn-cancelar" onClick={onCerrar}>
            Cancelar
          </button>

          <button className="material-btn-eliminar" onClick={onConfirmar}>
            Eliminar
          </button>
        </div>
      </div>
    </ModalBase>
  );
}