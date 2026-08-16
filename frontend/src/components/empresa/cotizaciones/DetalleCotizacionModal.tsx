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
  if (!cotizacion) return null;

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

          <div className="materiales-resumen">

            <p>
              {cotizacion.resumenMateriales ||
                "Sin materiales agregados"}
            </p>

          </div>

        </section>


        {/* ========================================= */}
        {/* COSTOS */}
        {/* ========================================= */}

        <section className="detalle-seccion">

          <h3>Costos de la cotización</h3>

          <div className="costos-cotizacion">

            <div className="costo-item">

              <span>
                Materiales
              </span>

              <strong>
                ${" "}
                {cotizacion.costoMateriales.toLocaleString(
                  "es-UY",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </strong>

            </div>


            <div className="costo-item">

              <span>
                Mano de obra
              </span>

              <strong>
                ${" "}
                {cotizacion.costoManoObra.toLocaleString(
                  "es-UY",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </strong>

            </div>


            <div className="costo-item costo-total">

              <span>
                Total
              </span>

              <strong>
                ${" "}
                {cotizacion.totalCotizacion.toLocaleString(
                  "es-UY",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </strong>

            </div>

          </div>

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


            {cotizacion.precioEstimado !==
              null && (
              <div className="detalle-item">

                <strong>
                  Precio estimado
                </strong>

                <p>
                  ${" "}
                  {cotizacion.precioEstimado.toLocaleString(
                    "es-UY",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </p>

              </div>
            )}

          </div>


          {/* OBSERVACIONES */}

          {cotizacion.observaciones && (
            <div className="detalle-descripcion">

              <strong>
                Observaciones
              </strong>

              <p>
                {cotizacion.observaciones}
              </p>

            </div>
          )}

        </section>

      </div>
    </ModalBase>
  );
}