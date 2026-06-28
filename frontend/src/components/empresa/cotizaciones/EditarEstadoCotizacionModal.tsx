import ModalBase from "../../common/ModalBase";
import type { Cotizacion, EstadoCotizacion } from "../../../interfaces/Cotizacion";

type Props = {
  abierto: boolean;
  cotizacion: Cotizacion | null;
  onCerrar: () => void;
  onGuardar: (estado: EstadoCotizacion) => void;
};

export default function EditarEstadoCotizacionModal({
  abierto,
  cotizacion,
  onCerrar,
  onGuardar,
}: Props) {
  if (!cotizacion) return null;

  const estados: EstadoCotizacion[] = [
    "Nueva",
    "En revisión",
    "Contactado",
    "Aprobada",
    "Rechazada",
    "Finalizada",
  ];

  return (
    <ModalBase
      abierto={abierto}
      titulo={`Editar estado - ${cotizacion.id}`}
      onCerrar={onCerrar}
    >
      <div className="editar-estado-modal">
        <p>
          Cambiá el estado actual de la cotización de{" "}
          <strong>{cotizacion.cliente}</strong>.
        </p>

        <select
          defaultValue={cotizacion.estado}
          onChange={(e) => onGuardar(e.target.value as EstadoCotizacion)}
        >
          {estados.map((estado) => (
            <option key={estado} value={estado}>
              {estado}
            </option>
          ))}
        </select>
      </div>
    </ModalBase>
  );
}