import ModalBase from "../../common/ModalBase";
import EstadoBadge from "../../common/EstadoBadge";
import type { Cotizacion } from "../../../interfaces/Cotizacion";

type Props = {
  abierto: boolean;
  cotizacion: Cotizacion | null;
  onCerrar: () => void;
};

export default function DetalleCotizacionModal({
  abierto,
  cotizacion,
  onCerrar,
}: Props) {
  if (!cotizacion) return null;

  return (
    <ModalBase
      abierto={abierto}
      titulo={`Detalle de ${cotizacion.id}`}
      onCerrar={onCerrar}
    >
      <div className="detalle-cotizacion">
        <div>
          <strong>Cliente:</strong>
          <p>{cotizacion.cliente}</p>
        </div>

        <div>
          <strong>Email:</strong>
          <p>{cotizacion.email}</p>
        </div>

        <div>
          <strong>Tipo de obra:</strong>
          <p>{cotizacion.tipoObra}</p>
        </div>

        <div>
          <strong>Fecha:</strong>
          <p>{cotizacion.fecha}</p>
        </div>

        <div>
          <strong>Total estimado:</strong>
          <p>{cotizacion.total}</p>
        </div>

        <div>
          <strong>Estado:</strong>
          <p>
            <EstadoBadge estado={cotizacion.estado} />
          </p>
        </div>
      </div>
    </ModalBase>
  );
}