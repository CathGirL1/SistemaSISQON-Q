import EstadoBadge from "../../common/EstadoBadge";
import MenuAccionesCotizacion from "./MenuAccionesCotizacion";
import type { Cotizacion } from "../../../interfaces/Cotizacion";

type FilaCotizacionProps = {
  cotizacion: Cotizacion;



  onVerDetalle: (cotizacion: Cotizacion) => void;
  onGestionar: (cotizacion: Cotizacion) => void;
  onEditarEstado: (cotizacion: Cotizacion) => void;
  onFinalizar: (cotizacion: Cotizacion) => void;
  onEliminar: (cotizacion: Cotizacion) => void;
};

export default function FilaCotizacion({
  cotizacion,
  onVerDetalle,
  onGestionar,
  onEditarEstado,
  onFinalizar,
  onEliminar,
}: FilaCotizacionProps) {

  const finalizada =
    cotizacion.estado === "Finalizada";

  return (
    <tr>




      {/* ID */}
      <td>
        <span className="cotizacion-id">
          {cotizacion.id}
        </span>
      </td>

      {/* CLIENTE */}
      <td>
        <div className="cliente-cell">
          <div className="cliente-avatar-tabla">
            {cotizacion.cliente
              .split(" ")
              .filter(Boolean)
              .map((nombre) => nombre[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>

          <div>
            <h4>{cotizacion.cliente}</h4>

            <p>
              {cotizacion.email}
            </p>
          </div>
        </div>
      </td>

      {/* TIPO DE OBRA */}
      <td>
        <div className="tipo-obra-cell">
          <strong>
            {cotizacion.tipoObra}
          </strong>

          <span>
            {cotizacion.nombreProyecto}
          </span>
        </div>
      </td>

      {/* FECHA */}
      <td>
        {cotizacion.fecha}
      </td>

      {/* TOTAL */}
      <td>
        <div className="cotizacion-total-monedas">

          <strong>
            US${" "}
            {cotizacion.totalCotizacion.toLocaleString(
              "es-UY",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}
          </strong>

          {cotizacion.totalCotizacionUYU > 0 && (
            <span>
              ${" "}
              {cotizacion.totalCotizacionUYU.toLocaleString(
                "es-UY",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}{" "}
              UYU
            </span>
          )}

        </div>
      </td>

      {/* ESTADO */}
      <td>
        <EstadoBadge
          estado={cotizacion.estado}
        />
      </td>

      {/* ACCIONES */}
      <td>
        <MenuAccionesCotizacion
          finalizada={finalizada}

          onVer={() =>
            onVerDetalle(cotizacion)
          }

          onGestionar={() =>
            onGestionar(cotizacion)
          }

          onEditar={() =>
            onEditarEstado(cotizacion)
          }

          onFinalizar={() =>
            onFinalizar(cotizacion)
          }

          onEliminar={() =>
            onEliminar(cotizacion)
          }
        />
      </td>

    </tr>
  );
}