import ModalBase from "../../common/ModalBase";
import type { Cotizacion } from "../../../interfaces/Cotizacion";

type Props = {
  abierto: boolean;
  cotizacion: Cotizacion | null;
  onCerrar: () => void;
  onConfirmar: () => void;
};

export default function ConfirmEliminarCotizacionModal({
  abierto,
  cotizacion,
  onCerrar,
  onConfirmar,
}: Props) {
  if (!cotizacion) return null;

  return (
    <ModalBase
      abierto={abierto}
      titulo="Eliminar cotización"
      onCerrar={onCerrar}
    >
      <div className="confirm-eliminar-modal">
        <p>
          ¿Estás seguro de que querés eliminar la cotización{" "}
          <strong>{cotizacion.id}</strong> de{" "}
          <strong>{cotizacion.cliente}</strong>?
        </p>

        <div className="confirm-actions">
          <button className="cancel-btn" onClick={onCerrar}>
            Cancelar
          </button>

          <button className="delete-btn" onClick={onConfirmar}>
            Eliminar
          </button>
        </div>
      </div>
    </ModalBase>
  );
}