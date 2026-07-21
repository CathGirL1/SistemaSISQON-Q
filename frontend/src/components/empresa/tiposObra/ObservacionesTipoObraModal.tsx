import "../../../styles/empresa/tiposObra/TiposObraModales.css";

import ModalBase from "../../common/ModalBase";
import type { TipoObraEmpresa } from "../../../interfaces/TipoObraEmpresa";

type Props = {
  abierto: boolean;
  tipoObra: TipoObraEmpresa | null;
  onCerrar: () => void;
};

export default function ObservacionesTipoObraModal({
  abierto,
  tipoObra,
  onCerrar,
}: Props) {
  if (!tipoObra) return null;

  return (
    <ModalBase abierto={abierto} titulo={`Observaciones - ${tipoObra.nombre}`} onCerrar={onCerrar}>
      <div className="observaciones-tipo-modal">
        <label>Observaciones internas</label>
        <textarea defaultValue={tipoObra.observaciones}></textarea>

        <div className="tipo-obra-modal-actions">
          <button className="btn-cancelar" onClick={onCerrar}>
            Cancelar
          </button>

          <button className="btn-guardar" onClick={onCerrar}>
            Guardar observaciones
          </button>
        </div>
      </div>
    </ModalBase>
  );
}