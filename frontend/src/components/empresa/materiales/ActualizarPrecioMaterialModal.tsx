import "../../../styles/empresa/materiales/MaterialesModales.css";

import ModalBase from "../../common/ModalBase";
import type { MaterialEmpresa } from "../../../interfaces/MaterialEmpresa";

type Props = {
  abierto: boolean;
  material: MaterialEmpresa | null;
  onCerrar: () => void;
};

export default function ActualizarPrecioMaterialModal({
  abierto,
  material,
  onCerrar,
}: Props) {
  if (!material) return null;

  return (
    <ModalBase
      abierto={abierto}
      titulo={`Actualizar precio - ${material.nombre}`}
      onCerrar={onCerrar}
    >
      <div className="actualizar-precio-modal">
        <p>
          Precio actual: <strong>{material.precioActual}</strong>
        </p>

        <label>Nuevo precio</label>
        <input type="text" placeholder="Ej: $ 10.500" />

        <div className="material-modal-actions">
          <button className="material-btn-cancelar" onClick={onCerrar}>
            Cancelar
          </button>

          <button className="material-btn-guardar" onClick={onCerrar}>
            Actualizar precio
          </button>
        </div>
      </div>
    </ModalBase>
  );
}