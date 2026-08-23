import { X, Package } from "lucide-react";

import "../../styles/ModalDatosMaterial.css";

import type { Material } from "./MaterialesProyectoDropList";

interface ModalDatosMaterialProps {
  material: Material | null;
  abierto: boolean;
  onCerrar: () => void;
}

export default function ModalDatosMaterial({
  material,
  abierto,
  onCerrar,
}: ModalDatosMaterialProps) {

  if (!abierto || !material) {
    return null;
  }

  return (
    <div
      className="modal-material-overlay"
      onClick={onCerrar}
    >

      <div
        className="modal-material"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        {/* ==========================================
            ENCABEZADO
        ========================================== */}

        <div className="modal-material-header">

          <div>
            <h2>
              {material.nombre}
            </h2>

            <p>
              Información del material
            </p>
          </div>

          <button
            type="button"
            className="modal-material-cerrar"
            onClick={onCerrar}
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>

        </div>


        {/* ==========================================
            IMAGEN
        ========================================== */}

        <div className="modal-material-imagen">

          {material.imagenUrl ? (

            <img
              src={material.imagenUrl}
              alt={material.nombre}
              onError={(event) => {
                event.currentTarget.style.display =
                  "none";
              }}
            />

          ) : (

            <Package size={60} />

          )}

        </div>


        {/* ==========================================
            INFORMACIÓN
        ========================================== */}

        <div className="modal-material-datos">

          <div className="modal-material-dato">

            <span>
              Empresa
            </span>

            <strong>
              {material.nombreEmpresa ??
                "Sin empresa"}
            </strong>

          </div>


          <div className="modal-material-dato">

            <span>
              Categoría
            </span>

            <strong>
              {material.categoria ??
                "Sin categoría"}
            </strong>

          </div>


          <div className="modal-material-dato">

            <span>
              Precio
            </span>

            <strong>
              $
              {material.costoUnitario.toLocaleString(
                "es-UY"
              )}{" "}
              /{" "}
              {material.unidad ??
                "unidad"}
            </strong>

          </div>


          <div className="modal-material-dato">

            <span>
              Stock disponible
            </span>

            <strong>
              {material.stock}
            </strong>

          </div>


          <div className="modal-material-dato">

            <span>
              Disponibilidad
            </span>

            <strong>
              {material.disponibilidad ??
                "No especificada"}
            </strong>

          </div>


          <div className="modal-material-dato">

            <span>
              Estado
            </span>

            <strong>
              {material.estado ??
                "No especificado"}
            </strong>

          </div>

        </div>


        {/* ==========================================
            DESCRIPCIÓN
        ========================================== */}

        <div className="modal-material-descripcion">

          <h3>
            Descripción
          </h3>

          <p>
            {material.descripcion ??
              "No hay una descripción disponible para este material."}
          </p>

        </div>


        {/* ==========================================
            CANTIDAD DEL PROYECTO
        ========================================== */}

        {material.cantidad !== undefined && (

          <div className="modal-material-cantidad">

            <span>
              Cantidad necesaria para el proyecto
            </span>

            <strong>
              {material.cantidad}{" "}
              {material.unidad ??
                "unidad(es)"}
            </strong>

          </div>

        )}


        {/* ==========================================
            BOTÓN CERRAR
        ========================================== */}

        <div className="modal-material-footer">

          <button
            type="button"
            className="modal-material-boton-cerrar"
            onClick={onCerrar}
          >
            Cerrar
          </button>

        </div>

      </div>

    </div>
  );
}