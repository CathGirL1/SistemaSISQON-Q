import { useEffect, useState } from "react";
import "../../../styles/empresa/cotizaciones/DetalleCotizacionModal.css";

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
  const [editando, setEditando] = useState(false);
  const [costoMateriales, setCostoMateriales] = useState(0);
  const [costoManoObra, setCostoManoObra] = useState(0);
  const [observaciones, setObservaciones] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (!cotizacion) return;

    setCostoMateriales(cotizacion.costoMateriales);
    setCostoManoObra(cotizacion.costoManoObra);
    setObservaciones(cotizacion.observaciones ?? "");
    setEditando(false);
    setMensaje("");
  }, [cotizacion]);

  const totalPropuesta =
    costoMateriales + costoManoObra;

  const guardarPropuesta = async () => {
    if (!cotizacion) return;

    try {
      setGuardando(true);
      setMensaje("");

      const response = await fetch(
        `http://localhost:3000/api/cotizaciones/${cotizacion.idCotizacion}/propuesta`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            costoMateriales,
            costoManoObra,
            observaciones,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.mensaje ||
          "No se pudo actualizar la propuesta"
        );
      }

      setMensaje("Propuesta actualizada correctamente");
      setEditando(false);
    } catch (error) {
      setMensaje(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al actualizar la propuesta"
      );
    } finally {
      setGuardando(false);
    }
  };
  if (!cotizacion) return null;

  const formatearUSD = (valor: number) => {
    return `US$ ${Number(valor).toLocaleString(
      "es-UY",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  const formatearUYU = (valor: number) => {
    return `$ ${Number(valor).toLocaleString(
      "es-UY",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  return (
    <ModalBase
      abierto={abierto}
      titulo={`Detalle de ${cotizacion.id}`}
      onCerrar={onCerrar}
    >
      <div className="detalle-cotizacion">

        {/* ========================================= */}
        {/* CLIENTE */}
        {/* ========================================= */}

        <section className="detalle-seccion">

          <h3>Cliente</h3>

          <div className="detalle-grid">

            <div className="detalle-item">
              <strong>Nombre</strong>
              <p>
                {cotizacion.cliente}
              </p>
            </div>

            <div className="detalle-item">
              <strong>Email</strong>
              <p>
                {cotizacion.email}
              </p>
            </div>

            <div className="detalle-item">
              <strong>Teléfono</strong>
              <p>
                {cotizacion.telefono ||
                  "No especificado"}
              </p>
            </div>

          </div>

        </section>


        {/* ========================================= */}
        {/* PROYECTO */}
        {/* ========================================= */}

        <section className="detalle-seccion">

          <h3>Proyecto</h3>

          <div className="detalle-grid">

            <div className="detalle-item">
              <strong>Nombre</strong>
              <p>
                {cotizacion.nombreProyecto}
              </p>
            </div>

            <div className="detalle-item">
              <strong>Tipo de obra</strong>
              <p>
                {cotizacion.tipoObra}
              </p>
            </div>

            <div className="detalle-item">
              <strong>Ubicación</strong>
              <p>
                {cotizacion.ubicacion ||
                  "No especificada"}
              </p>
            </div>

            <div className="detalle-item">
              <strong>Superficie</strong>
              <p>
                {cotizacion.superficie.toLocaleString(
                  "es-UY",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}{" "}
                m²
              </p>
            </div>

          </div>


          {/* DESCRIPCIÓN */}

          {cotizacion.descripcionProyecto && (
            <div className="detalle-descripcion">

              <strong>
                Descripción
              </strong>

              <p>
                {cotizacion.descripcionProyecto}
              </p>

            </div>
          )}

        </section>


        {/* ========================================= */}
        {/* DIMENSIONES */}
        {/* ========================================= */}

        <section className="detalle-seccion">

          <h3>Dimensiones del proyecto</h3>

          <div className="dimensiones-grid">

            <div className="dimension-item">
              <span>Alto</span>

              <strong>
                {cotizacion.alto} m
              </strong>
            </div>

            <div className="dimension-item">
              <span>Ancho</span>

              <strong>
                {cotizacion.ancho} m
              </strong>
            </div>

            <div className="dimension-item">
              <span>Largo</span>

              <strong>
                {cotizacion.largo} m
              </strong>
            </div>

            <div className="dimension-item">
              <span>Superficie</span>

              <strong>
                {cotizacion.superficie} m²
              </strong>
            </div>

          </div>

        </section>


        {/* ========================================= */}
        {/* MATERIALES */}
        {/* ========================================= */}

        <section className="detalle-seccion">

          <h3>Materiales</h3>

          {cotizacion.materiales &&
            cotizacion.materiales.length > 0 ? (

            <div className="materiales-tabla-container">

              <table className="materiales-tabla">

                <thead>
                  <tr>
                    <th>Material</th>
                    <th>Cantidad</th>
                    <th>Precio unitario</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>

                <tbody>

                  {cotizacion.materiales.map(
                    (material) => (

                      <tr
                        key={
                          material.idMaterialProyecto
                        }
                      >

                        <td>
                          {material.nombre}
                        </td>

                        <td>
                          {material.cantidad}{" "}
                          {material.unidad}
                        </td>
                        <td>
                          {formatearUSD(
                            material.costoUnitario
                          )}
                        </td>

                        <td>
                          <strong>
                            {formatearUSD(
                              material.subtotal
                            )}
                          </strong>
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          ) : (

            <div className="materiales-resumen">

              <p>
                {cotizacion.resumenMateriales ||
                  "Sin materiales agregados"}
              </p>

            </div>

          )}

        </section>


        {/* ========================================= */}
        {/* COSTOS */}
        {/* ========================================= */}

        <section className="detalle-seccion">

          <h3>Costos de la cotización</h3>

          {!editando ? (
            <>
              <div className="costos-cotizacion">

                <div className="costo-item">
                  <span>Materiales</span>
                  <strong>
                    {formatearUSD(
                      cotizacion.costoMateriales
                    )}
                  </strong>
                </div>

                <div className="costo-item">
                  <span>Mano de obra</span>
                  <strong>
                    {formatearUSD(
                      cotizacion.costoManoObra
                    )}
                  </strong>
                </div>

                {cotizacion.costoManoObraAdicional > 0 && (
                  <div className="costo-item">
                    <span>Mano de obra adicional</span>
                    <strong>
                      {formatearUSD(
                        cotizacion.costoManoObraAdicional
                      )}
                    </strong>
                  </div>
                )}

                {cotizacion.subtotal !== null && (
                  <div className="costo-item">
                    <span>Subtotal</span>
                    <strong>
                      {formatearUSD(
                        cotizacion.subtotal
                      )}
                    </strong>
                  </div>
                )}

                {cotizacion.montoIVA !== null && (
                  <div className="costo-item">
                    <span>
                      IVA
                      {cotizacion.porcentajeIVAAplicado !== null
                        ? ` (${cotizacion.porcentajeIVAAplicado}%)`
                        : ""}
                    </span>

                    <strong>
                      {formatearUSD(
                        cotizacion.montoIVA
                      )}
                    </strong>
                  </div>
                )}

                <div className="costo-item costo-total">
                  <span>Total</span>

                  <strong className="detalle-total-monedas">
                    <span>
                      {formatearUSD(
                        cotizacion.totalCotizacion
                      )}
                    </span>

                    {cotizacion.totalCotizacionUYU > 0 && (
                      <small>
                        {formatearUYU(
                          cotizacion.totalCotizacionUYU
                        )}{" "}
                        UYU
                      </small>
                    )}
                  </strong>
                </div>

                {cotizacion.tipoCambio > 0 && (
                  <div className="detalle-tipo-cambio">
                    {cotizacion.conversionHistorica
                      ? "Tipo de cambio al finalizar"
                      : "Tipo de cambio actual"}
                    : 1 USD ={" "}
                    {formatearUYU(
                      cotizacion.tipoCambio
                    )}{" "}
                    UYU
                  </div>
                )}

              </div>

              <button
                type="button"
                onClick={() => setEditando(true)}
              >
                Editar propuesta
              </button>
            </>
          ) : (
            <div className="editar-propuesta">

              <div className="detalle-item">
                <strong>Costo de materiales</strong>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={costoMateriales}
                  onChange={(e) =>
                    setCostoMateriales(
                      Number(e.target.value)
                    )
                  }
                />
              </div>

              <div className="detalle-item">
                <strong>Costo de mano de obra</strong>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={costoManoObra}
                  onChange={(e) =>
                    setCostoManoObra(
                      Number(e.target.value)
                    )
                  }
                />
              </div>

              <div className="detalle-item">
                <strong>Observaciones</strong>

                <textarea
                  value={observaciones}
                  onChange={(e) =>
                    setObservaciones(e.target.value)
                  }
                />
              </div>

              <div className="costo-item costo-total">
                <span>Total de la propuesta</span>
                <strong>
                  {formatearUSD(totalPropuesta)}
                </strong>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setEditando(false)}
                  disabled={guardando}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={guardarPropuesta}
                  disabled={guardando}
                >
                  {guardando
                    ? "Guardando..."
                    : "Guardar propuesta"}
                </button>
              </div>

            </div>
          )}

          {mensaje && (
            <p>{mensaje}</p>
          )}
        </section>


        {/* ========================================= */}
        {/* INFORMACIÓN DE COTIZACIÓN */}
        {/* ========================================= */}

        <section className="detalle-seccion">

          <h3>Información de la cotización</h3>

          <div className="detalle-grid">

            <div className="detalle-item">

              <strong>
                Fecha
              </strong>

              <p>
                {cotizacion.fecha}
              </p>

            </div>


            <div className="detalle-item">

              <strong>
                Versión
              </strong>

              <p>
                {cotizacion.version}
              </p>

            </div>


            <div className="detalle-item">

              <strong>
                Estado
              </strong>

              <p>
                <EstadoBadge
                  estado={cotizacion.estado}
                />
              </p>

            </div>


            {cotizacion.precioEstimado !== null && (
              <div className="detalle-item">

                <strong>
                  Precio estimado
                </strong>

                <p>
                  {formatearUSD(
                    cotizacion.precioEstimado
                  )}
                </p>

              </div>
            )}

          </div>

          {/* OBSERVACIONES */}

          {
            cotizacion.observaciones && (
              <div className="detalle-descripcion">

                <strong>
                  Observaciones
                </strong>

                <p>
                  {cotizacion.observaciones}
                </p>

              </div>
            )
          }

        </section >

      </div >
    </ModalBase >
  );
}