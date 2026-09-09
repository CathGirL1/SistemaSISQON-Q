import { useEffect, useState } from "react";
import "../../../styles/empresa/cotizaciones/GestionarCotizacionModal.css";

import type { Cotizacion } from "../../../interfaces/Cotizacion";
import type { ManoObraEmpresa } from "../../../interfaces/ManoObraEmpresa";

import {
  actualizarCotizacionDesdeEmpresa,
  obtenerDetalleCotizacion,
} from "../../../services/cotizacionService";

import {
  obtenerManoObraPorEmpresa,
} from "../../../services/manoObraService";

type Props = {
  abierto: boolean;
  cotizacion: Cotizacion | null;
  onCerrar: () => void;
  onActualizada: () => Promise<void>;
};

type ManoObraSeleccionada = {
  idManoObra: number;
  nombre: string;
  unidad: string;
  costoUnitario: number;
  cantidad: string;
};

export default function GestionarCotizacionModal({
  abierto,
  cotizacion,
  onCerrar,
  onActualizada,
}: Props) {
  const [manosObraDisponibles, setManosObraDisponibles] =
    useState<ManoObraEmpresa[]>([]);

  const [manosObraSeleccionadas, setManosObraSeleccionadas] =
    useState<ManoObraSeleccionada[]>([]);

  const [idManoObraSeleccionada, setIdManoObraSeleccionada] =
    useState("");

  const [observaciones, setObservaciones] =
    useState("");

  const [guardando, setGuardando] =
    useState(false);

  const [cargandoManoObra, setCargandoManoObra] =
    useState(false);

  const [error, setError] =
    useState("");

  // =====================================================
  // CARGAR DATOS
  // =====================================================

  useEffect(() => {
    if (!abierto || !cotizacion) {
      return;
    }

    setObservaciones(
      cotizacion.observaciones ?? ""
    );

    setError("");

    const cargarManoObra = async () => {
    try {
        setCargandoManoObra(true);

        const [
        trabajos,
        detalleCotizacion,
        ] = await Promise.all([
        obtenerManoObraPorEmpresa(
            cotizacion.idEmpresa
        ),

        obtenerDetalleCotizacion(
            cotizacion.idCotizacion
        ),
        ]);

        setManosObraDisponibles(
        trabajos.filter(
            (trabajo) =>
            trabajo.estado === "Activo"
        )
        );

        setManosObraSeleccionadas(
        detalleCotizacion.manosObra.map(
            (item) => ({
            idManoObra:
                item.idManoObra,

            nombre:
                item.nombre,

            unidad:
                item.unidad ?? "",

            costoUnitario:
                item.costoUnitario,

            cantidad:
                String(item.cantidad),
            })
        )
        );

    } catch (error: unknown) {
        console.error(error);

        setError(
        error instanceof Error
            ? error.message
            : "No se pudo cargar la mano de obra."
        );
    } finally {
        setCargandoManoObra(false);
    }
    };

    cargarManoObra();

  }, [abierto, cotizacion]);

  if (!abierto || !cotizacion) {
    return null;
  }

  // =====================================================
  // AGREGAR MANO DE OBRA
  // =====================================================

  const agregarManoObra = () => {
    const idManoObra =
      Number(idManoObraSeleccionada);

    if (!idManoObra) {
      setError(
        "Seleccioná una mano de obra."
      );
      return;
    }

    const yaAgregada =
      manosObraSeleccionadas.some(
        (item) =>
          item.idManoObra === idManoObra
      );

    if (yaAgregada) {
      setError(
        "La mano de obra seleccionada ya fue agregada."
      );
      return;
    }

    const manoObra =
      manosObraDisponibles.find(
        (item) =>
          Number(item.id) === idManoObra
      );

    if (!manoObra) {
      setError(
        "No se encontró la mano de obra seleccionada."
      );
      return;
    }

    setManosObraSeleccionadas([
      ...manosObraSeleccionadas,
      {
        idManoObra,
        nombre: manoObra.nombre,
        unidad: manoObra.unidad,
        costoUnitario:
          Number(manoObra.costoUnitario),
        cantidad: "1",
      },
    ]);

    setIdManoObraSeleccionada("");
    setError("");
  };

  // =====================================================
  // CAMBIAR CANTIDAD
  // =====================================================

  const cambiarCantidad = (
    idManoObra: number,
    cantidad: string
  ) => {
    setManosObraSeleccionadas(
      manosObraSeleccionadas.map(
        (item) =>
          item.idManoObra === idManoObra
            ? {
                ...item,
                cantidad,
              }
            : item
      )
    );
  };

  // =====================================================
  // QUITAR MANO DE OBRA
  // =====================================================

  const quitarManoObra = (
    idManoObra: number
  ) => {
    setManosObraSeleccionadas(
      manosObraSeleccionadas.filter(
        (item) =>
          item.idManoObra !== idManoObra
      )
    );
  };

  // =====================================================
  // CÁLCULOS DE PREVISUALIZACIÓN
  // =====================================================

  const precioEstimado =
    cotizacion.precioEstimado ?? 0;

  const costoManoObraAdicional =
    manosObraSeleccionadas.reduce(
      (total, item) => {
        const cantidad =
          Number(item.cantidad) || 0;

        return (
          total +
          cantidad *
            item.costoUnitario
        );
      },
      0
    );

  const subtotalPreview =
    precioEstimado +
    costoManoObraAdicional;

  /*
   * Este IVA es solamente para previsualización.
   *
   * El cálculo definitivo continúa haciéndolo
   * el backend con la configuración de Empresa.
   */
  const porcentajeIVA =
    cotizacion.porcentajeIVAAplicado;

  const montoIVAPreview =
    porcentajeIVA !== null
      ? subtotalPreview *
        (porcentajeIVA / 100)
      : null;

  const totalPreview =
    montoIVAPreview !== null
      ? subtotalPreview +
        montoIVAPreview
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
    if (
      cotizacion.estado ===
      "Finalizada"
    ) {
      setError(
        "La cotización está finalizada y no puede modificarse."
      );
      return;
    }

    for (
      const item of
      manosObraSeleccionadas
    ) {
      const cantidad =
        Number(item.cantidad);

      if (
        !Number.isFinite(cantidad) ||
        cantidad <= 0
      ) {
        setError(
          `La cantidad de "${item.nombre}" debe ser mayor a cero.`
        );
        return;
      }
    }

    try {
      setGuardando(true);
      setError("");

      await actualizarCotizacionDesdeEmpresa(
        cotizacion.idCotizacion,
        {
          manosObra:
            manosObraSeleccionadas.map(
              (item) => ({
                idManoObra:
                  item.idManoObra,

                cantidad:
                  Number(item.cantidad),
              })
            ),

          observaciones:
            observaciones.trim() ||
            null,
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

          {/* ========================================== */}
          {/* PRECIO ORIGINAL */}
          {/* ========================================== */}

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


          {/* ========================================== */}
          {/* SELECCIONAR MANO DE OBRA */}
          {/* ========================================== */}

          <div className="form-group">
            <label>
              Mano de obra adicional
            </label>

            <div className="gestion-mano-obra-selector">

              <select
                value={
                  idManoObraSeleccionada
                }
                onChange={(event) =>
                  setIdManoObraSeleccionada(
                    event.target.value
                  )
                }
                disabled={
                  guardando ||
                  cargandoManoObra
                }
              >
                <option value="">
                  {cargandoManoObra
                    ? "Cargando..."
                    : "Seleccionar mano de obra"}
                </option>

                {manosObraDisponibles.map(
                  (manoObra) => (
                    <option
                      key={manoObra.id}
                      value={manoObra.id}
                    >
                      {manoObra.nombre}
                      {" - "}
                      {formatearMoneda(
                        manoObra.costoUnitario
                      )}
                      {manoObra.unidad
                        ? ` / ${manoObra.unidad}`
                        : ""}
                    </option>
                  )
                )}
              </select>

              <button
                type="button"
                onClick={agregarManoObra}
                disabled={
                  guardando ||
                  cargandoManoObra
                }
              >
                Agregar
              </button>

            </div>
          </div>


          {/* ========================================== */}
          {/* MANOS DE OBRA SELECCIONADAS */}
          {/* ========================================== */}

          {manosObraSeleccionadas.length >
            0 && (
            <div className="gestion-manos-obra-lista">

              {manosObraSeleccionadas.map(
                (item) => {

                  const cantidad =
                    Number(
                      item.cantidad
                    ) || 0;

                  const subtotal =
                    cantidad *
                    item.costoUnitario;

                  return (
                    <div
                      key={
                        item.idManoObra
                      }
                      className="gestion-mano-obra-item"
                    >

                      <div>
                        <strong>
                          {item.nombre}
                        </strong>

                        <span>
                          {formatearMoneda(
                            item.costoUnitario
                          )}
                          {item.unidad
                            ? ` / ${item.unidad}`
                            : ""}
                        </span>
                      </div>

                      <div>
                        <label>
                          Cantidad
                        </label>

                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={
                            item.cantidad
                          }
                          onChange={(
                            event
                          ) =>
                            cambiarCantidad(
                              item.idManoObra,
                              event.target
                                .value
                            )
                          }
                          disabled={
                            guardando
                          }
                        />
                      </div>

                      <div>
                        <span>
                          Subtotal
                        </span>

                        <strong>
                          {formatearMoneda(
                            subtotal
                          )}
                        </strong>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          quitarManoObra(
                            item.idManoObra
                          )
                        }
                        disabled={
                          guardando
                        }
                      >
                        Quitar
                      </button>

                    </div>
                  );
                }
              )}

            </div>
          )}


          {/* ========================================== */}
          {/* TOTAL MANO DE OBRA */}
          {/* ========================================== */}

          <div className="gestion-cotizacion-resumen">
            <div>
              <span>
                Mano de obra adicional
              </span>

              <strong>
                {formatearMoneda(
                  costoManoObraAdicional
                )}
              </strong>
            </div>
          </div>


          {/* ========================================== */}
          {/* CÁLCULO */}
          {/* ========================================== */}

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


          {/* ========================================== */}
          {/* OBSERVACIONES */}
          {/* ========================================== */}

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
            disabled={
              guardando ||
              cargandoManoObra
            }
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