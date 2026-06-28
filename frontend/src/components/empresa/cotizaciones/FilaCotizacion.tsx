import EstadoBadge from "../../common/EstadoBadge";
import MenuAccionesCotizacion from "./MenuAccionesCotizacion";
import type { Cotizacion } from "../../../interfaces/Cotizacion";

type FilaCotizacionProps = {
  cotizacion: Cotizacion;
  seleccionada: boolean;
  onSeleccionar: (id: string) => void;
  onVerDetalle: (cotizacion: Cotizacion) => void;
  onEditarEstado: (cotizacion: Cotizacion) => void;
  onEliminar: (cotizacion: Cotizacion) => void;
};

export default function FilaCotizacion({
  cotizacion,
  seleccionada,
  onSeleccionar,
  onVerDetalle,
  onEditarEstado,
  onEliminar,
}: FilaCotizacionProps) {
  return (
    <tr className={seleccionada ? "fila-seleccionada" : ""}>
      <td>
        <input
          type="checkbox"
          checked={seleccionada}
          onChange={() => onSeleccionar(cotizacion.id)}
        />
      </td>

      <td>
        <span className="cotizacion-id">{cotizacion.id}</span>
      </td>

      <td>
        <div className="cliente-cell">
          <div className="cliente-avatar-tabla">
            {cotizacion.cliente
              .split(" ")
              .map((nombre) => nombre[0])
              .join("")
              .slice(0, 2)}
          </div>

          <div>
            <h4>{cotizacion.cliente}</h4>
            <p>{cotizacion.email}</p>
          </div>
        </div>
      </td>

      <td>{cotizacion.tipoObra}</td>

      <td>{cotizacion.fecha}</td>

      <td>
        <strong>{cotizacion.total}</strong>
      </td>

      <td>
        <EstadoBadge estado={cotizacion.estado} />
      </td>

      <td>
        <MenuAccionesCotizacion
          onVer={() => onVerDetalle(cotizacion)}
          onEditar={() => onEditarEstado(cotizacion)}
          onEliminar={() => onEliminar(cotizacion)}
        />
      </td>
    </tr>
  );
}