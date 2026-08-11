import { useEffect, useState } from "react";
import { Package } from "lucide-react";

import "../../styles/MaterialesProyectoDetalle.css";



interface MaterialProyecto {
  idMaterialProyecto: number;
  idProyecto: number;
  idMaterial: number;
  cantidad: number;

  nombre: string;
  descripcion?: string | null;

  stock: number;
  costoUnitario: number;

  categoria?: string | null;
  unidad?: string | null;

  ultimaActualizacion?: string | null;
  disponibilidad?: string | null;
  estado?: string | null;

  imagenUrl?: string | null;

  idEmpresa?: number | null;
  empresa?: string | null;
}

// ======================================================
// PROPS
// ======================================================

interface MaterialesProyectoDetalleProps {
  idProyecto: number;
}

// ======================================================
// API
// ======================================================

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

// ======================================================
// COMPONENTE
// ======================================================

export default function MaterialesProyectoDetalle({
  idProyecto,
}: MaterialesProyectoDetalleProps) {

  const [materiales, setMateriales] =
    useState<MaterialProyecto[]>([]);

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState("");


  // ====================================================
  // OBTENER MATERIALES
  // ====================================================

  useEffect(() => {

    const obtenerMateriales = async () => {

      try {

        setCargando(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/materiales-proyecto/proyecto/${idProyecto}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.mensaje ||
            "No se pudieron obtener los materiales."
          );
        }

        /*
         * El endpoint actualmente devuelve directamente
         * un array de materiales.
         */
        const listaMateriales =
          Array.isArray(data)
            ? data
            : data.materiales ??
              data.data ??
              [];

        setMateriales(listaMateriales);

      } catch (error) {

        console.error(
          "Error al obtener materiales del proyecto:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "No se pudieron cargar los materiales."
        );

      } finally {

        setCargando(false);

      }

    };

    obtenerMateriales();

  }, [idProyecto]);


  // ====================================================
  // LOADING
  // ====================================================

  if (cargando) {

    return (
      <article className="materiales-detalle-card">

        <div className="materiales-detalle-titulo">

          <div className="materiales-detalle-icono">
            <Package size={21} />
          </div>

          <h3>
            Materiales del proyecto
          </h3>

        </div>

        <div className="materiales-detalle-feedback">
          Cargando materiales...
        </div>

      </article>
    );
  }


  // ====================================================
  // ERROR
  // ====================================================

  if (error) {

    return (
      <article className="materiales-detalle-card">

        <div className="materiales-detalle-titulo">

          <div className="materiales-detalle-icono">
            <Package size={21} />
          </div>

          <h3>
            Materiales del proyecto
          </h3>

        </div>

        <div className="materiales-detalle-error">
          {error}
        </div>

      </article>
    );
  }


  // ====================================================
  // SIN MATERIALES
  // ====================================================

  if (materiales.length === 0) {

    return (
      <article className="materiales-detalle-card">

        <div className="materiales-detalle-titulo">

          <div className="materiales-detalle-icono">
            <Package size={21} />
          </div>

          <h3>
            Materiales del proyecto
          </h3>

        </div>

        <div className="materiales-detalle-vacio">

          <Package size={38} />

          <h4>
            No hay materiales seleccionados
          </h4>

          <p>
            Este proyecto todavía no tiene
            materiales asociados.
          </p>

        </div>

      </article>
    );
  }


  // ====================================================
  // RENDER
  // ====================================================

  return (
    <article className="materiales-detalle-card">

      {/* ================================================
          ENCABEZADO
      ================================================= */}

      <div className="materiales-detalle-titulo">

        <div className="materiales-detalle-icono">
          <Package size={21} />
        </div>

        <div>
          <h3>
            Materiales del proyecto
          </h3>

          <p>
            {materiales.length}{" "}
            material
            {materiales.length !== 1
              ? "es"
              : ""}
            {" "}seleccionado
            {materiales.length !== 1
              ? "s"
              : ""}
          </p>
        </div>

      </div>


      {/* ================================================
          LISTA
      ================================================= */}

      <div className="materiales-detalle-lista">

        {materiales.map((material) => {


          return (

            <div
              key={material.idMaterialProyecto}
              className="materiales-detalle-item"
            >

              {/* ========================================
                  IMAGEN
              ========================================= */}

              <div className="materiales-detalle-imagen">

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

                  <Package size={30} />

                )}

              </div>


              {/* ========================================
                  INFORMACIÓN
              ========================================= */}

              <div className="materiales-detalle-info">

                <h4>
                  {material.nombre}
                </h4>

                <p>
                  Empresa:{" "}
                  <strong>
                    {material.empresa ??
                      "Sin empresa"}
                  </strong>
                </p>

                <p>
                  Precio unitario:{" "}
                  <strong>
                    $
                    {Number(
                      material.costoUnitario
                    ).toLocaleString("es-UY")}
                  </strong>

                  {" / "}

                  {material.unidad ??
                    "Unidad"}
                </p>

              </div>


              {/* ========================================
                  CANTIDAD
              ========================================= */}

              <div className="materiales-detalle-dato">

                <span>
                  Cantidad
                </span>

                <strong>
                  {material.cantidad}
                </strong>

              </div>


              

            </div>

          );

        })}

      </div>

    </article>
  );
}