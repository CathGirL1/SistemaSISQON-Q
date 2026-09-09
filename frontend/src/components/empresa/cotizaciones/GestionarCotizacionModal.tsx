import { useEffect, useState } from "react";

import type { Cotizacion } from "../../../interfaces/Cotizacion";

import {
  actualizarCotizacionDesdeEmpresa,
} from "../../../services/cotizacionService";

type Props = {
  abierto: boolean;
  cotizacion: Cotizacion | null;
  onCerrar: () => void;
  onActualizada: () => Promise<void>;
};

export default function GestionarCotizacionModal({
  abierto,
  cotizacion,
  onCerrar,
  onActualizada,
}: Props) {
  const [costoManoObraAdicional, setCostoManoObraAdicional] =
    useState("");

  const [observaciones, setObservaciones] =
    useState("");

  const [guardando, setGuardando] =
    useState(false);

  const [error, setError] =
    useState("");

  // =====================================================
  // CARGAR DATOS ACTUALES
  // =====================================================

  useEffect(() => {
    if (!cotizacion) {
      return;
    }

    setCostoManoObraAdicional(
      String(cotizacion.costoManoObraAdicional ?? 0)
    );

    setObservaciones(
      cotizacion.observaciones ?? ""
    );

    setError("");
  }, [cotizacion]);

  if (!abierto || !cotizacion) {
    return null;
  }

  // =====================================================
  // PREVISUALIZACIÓN
  // =====================================================

  const precioEstimado =
    cotizacion.precioEstimado ?? 0;

  const manoObraAdicional =
    Number(costoManoObraAdicional) || 0;

  const subtotalPreview =
    precioEstimado + manoObraAdicional;

  /*
   * Si la cotización ya fue gestionada, podemos mostrar
   * el IVA que quedó registrado.
   *
   * Si todavía no fue gestionada, no inventamos un IVA.
   * El valor definitivo lo obtiene y calcula el backend.
   */
  const porcentajeIVA =
    cotizacion.porcentajeIVAAplicado;

  const montoIVAPreview =
    porcentajeIVA !== null
      ? subtotalPreview * (porcentajeIVA / 100)
      : null;

  const totalPreview =
    montoIVAPreview !== null
      ? subtotalPreview + montoIVAPreview
      : null;

  // =====================================================
  // FORMATO MONEDA
  // =====================================================

  const formatearMoneda = (
    valor: number
  ) => {
    return `$ ${valor.toLocaleString(
      "es-UY",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  // =====================================================
  // GUARDAR
  // =====================================================

  const guardar = async () => {
    if (cotizacion.estado === "Finalizada") {
      setError(
        "La cotización está finalizada y no puede modificarse."
      );
      return;
    }

    const costo =
      Number(costoManoObraAdicional);

    if (
      Number.isNaN(costo) ||
      costo < 0
    ) {
      setError(
        "La mano de obra adicional debe ser un valor válido mayor o igual a 0."
      );
      return;
    }

    try {
      setGuardando(true);
      setError("");


      await actualizarCotizacionDesdeEmpresa(
        cotizacion.idCotizacion,
        {
          costoManoObraAdicional: costo,
          observaciones:
            observaciones.trim() || null,
        }
      );

      await onActualizada();

      onCerrar();
    } catch (error: unknown) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar la cotización."
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-contenido gestionar-cotizacion-modal">

        <div className="modal-header">
          <div>
            <h2>Gestionar cotización</h2>
            <p>{cotizacion.id}</p>
          </div>

          <button
            type="button"
            onClick={onCerrar}
            disabled={guardando}
          >
            ×
          </button>
        </div>

        <div className="modal-body">

          <div className="gestion-cotizacion-resumen">
            <div>
              <span>
                Precio generado por SISCON-Q
              </span>

              <strong>
                {formatearMoneda(
                  precioEstimado
                )}
              </strong>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="manoObraAdicional">
              Mano de obra adicional
            </label>

            <input
              id="manoObraAdicional"
              type="number"
              min="0"
              step="0.01"
              value={costoManoObraAdicional}
              onChange={(event) =>
                setCostoManoObraAdicional(
                  event.target.value
                )
              }
              disabled={guardando}
            />
          </div>

          <div className="gestion-cotizacion-calculo">

            <div>
              <span>Subtotal</span>

              <strong>
                {formatearMoneda(
                  subtotalPreview
                )}
              </strong>
            </div>

            <div>
              <span>
                IVA
                {porcentajeIVA !== null
                  ? ` (${porcentajeIVA}%)`
                  : ""}
              </span>

              <strong>
                {montoIVAPreview !== null
                  ? formatearMoneda(
                      montoIVAPreview
                    )
                  : "Se calculará al guardar"}
              </strong>
            </div>

            <div className="gestion-cotizacion-total">
              <span>Total</span>

              <strong>
                {totalPreview !== null
                  ? formatearMoneda(
                      totalPreview
                    )
                  : "Se calculará al guardar"}
              </strong>
            </div>

          </div>

          <div className="form-group">
            <label htmlFor="observacionesCotizacion">
              Observaciones
            </label>

            <textarea
              id="observacionesCotizacion"
              value={observaciones}
              onChange={(event) =>
                setObservaciones(
                  event.target.value
                )
              }
              disabled={guardando}
              rows={4}
            />
          </div>

          {error && (
            <p className="modal-error">
              {error}
            </p>
          )}

        </div>

        <div className="modal-footer">
          <button
            type="button"
            onClick={onCerrar}
            disabled={guardando}
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={guardar}
            disabled={guardando}
          >
            {guardando
              ? "Guardando..."
              : "Guardar cambios"}
          </button>
        </div>

      </div>
    </div>
  );
}