import { useEffect, useState } from "react";

import {
  Plus,
  Trash2,
  Minus,
  Search,
  Package,
  Eye,
} from "lucide-react";

import "../../styles/MaterialesProyectoDropList.css";

// ======================================================
// INTERFAZ MATERIAL
// ======================================================

export interface Material {
  idMaterial: number;
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
  nombreEmpresa?: string | null;

  // Cantidad necesaria para el proyecto
  cantidad?: number;
  idMaterialProyecto?: number;
  idProyecto?: number;
  subtotal?: number;
}

// ======================================================
// PROPS
// ======================================================

interface MaterialesProyectoProps {
  materialesSeleccionados: Material[];

  onMaterialesChange: (
    materiales: Material[]
  ) => void;

  onVerDatosMaterial: (
    material: Material
  ) => void;
}

// ======================================================
// COMPONENTE
// ======================================================

export default function MaterialesProyectoDropList({
  materialesSeleccionados,
  onMaterialesChange,
  onVerDatosMaterial,
}: MaterialesProyectoProps) {
  // ====================================================
  // ESTADOS
  // ====================================================

  const [materiales, setMateriales] = useState<Material[]>([]);

  const [materialSeleccionadoId, setMaterialSeleccionadoId] =
    useState("");

  const [cantidad, setCantidad] = useState(1);

  const [busqueda, setBusqueda] = useState("");

  const [cargando, setCargando] = useState(true);

  const [error, setError] = useState("");

  // ====================================================
  // OBTENER MATERIALES DEL CATÁLOGO
  // ====================================================

  useEffect(() => {
    const obtenerMateriales = async () => {
      try {
        setCargando(true);
        setError("");

        const respuesta = await fetch(
          "http://localhost:3000/api/materiales"
        );

        if (!respuesta.ok) {
          throw new Error(
            "No se pudieron obtener los materiales"
          );
        }

        const datos = await respuesta.json();

        const listaMateriales =
          datos.materiales ??
          datos.data ??
          datos;

        const materialesNormalizados: Material[] =
          listaMateriales.map((material: any) => ({
            ...material,

            idMaterial:
              material.idMaterial ??
              material.id_Material,

            idEmpresa:
              material.idEmpresa ??
              material.id_Empresa,

            nombreEmpresa:
              material.nombreEmpresa ??
              material.empresa,
          }));

        console.log(
          "MATERIALES NORMALIZADOS:",
          materialesNormalizados
        );

        setMateriales(materialesNormalizados);
      } catch (error) {
        console.error(error);

        setError(
          "No se pudieron cargar los materiales disponibles."
        );
      } finally {
        setCargando(false);
      }
    };

    obtenerMateriales();
  }, []);

  // ====================================================
  // MATERIAL SELECCIONADO
  // ====================================================

  const materialSeleccionado = materiales.find(
    (material) =>
      material.idMaterial ===
      Number(materialSeleccionadoId)
  );

  // ====================================================
  // FILTRAR MATERIALES
  // ====================================================

  const materialesFiltrados = materiales.filter(
    (material) => {
      const texto = busqueda
        .toLowerCase()
        .trim();

      if (!texto) {
        return true;
      }

      return (
        material.nombre
          ?.toLowerCase()
          .includes(texto) ||

        material.nombreEmpresa
          ?.toLowerCase()
          .includes(texto) ||

        material.categoria
          ?.toLowerCase()
          .includes(texto)
      );
    }
  );

  // ====================================================
  // AGREGAR MATERIAL
  // ====================================================

  const agregarMaterial = () => {
    if (!materialSeleccionado) {
      return;
    }

    if (cantidad <= 0) {
      alert(
        "La cantidad debe ser mayor que cero."
      );
      return;
    }

    // Verificar si ya existe
    const yaExiste =
      materialesSeleccionados.find(
        (material) =>
          material.idMaterial ===
          materialSeleccionado.idMaterial
      );

    // Si ya existe, sumar cantidad
    if (yaExiste) {
      const nuevaCantidad =
        (yaExiste.cantidad ?? 0) +
        cantidad;

      actualizarCantidad(
        materialSeleccionado.idMaterial,
        nuevaCantidad
      );

      setCantidad(1);
      setMaterialSeleccionadoId("");

      return;
    }

    // Crear material seleccionado
    const nuevoMaterial: Material = {
      ...materialSeleccionado,
      cantidad,
    };

    const nuevaLista = [
      ...materialesSeleccionados,
      nuevoMaterial,
    ];

    onMaterialesChange(nuevaLista);

    // Limpiar selección
    setMaterialSeleccionadoId("");
    setCantidad(1);
  };


  // ====================================================
  // ACTUALIZAR CANTIDAD
  // ====================================================

  const actualizarCantidad = (
    idMaterial: number,
    nuevaCantidad: number
  ) => {
    if (nuevaCantidad <= 0) {
      return;
    }

    const nuevaLista =
      materialesSeleccionados.map(
        (item) =>
          item.idMaterial ===
            idMaterial
            ? {
              ...item,
              cantidad:
                nuevaCantidad,
            }
            : item
      );

    onMaterialesChange(
      nuevaLista
    );
  };

  // ====================================================
  // DISMINUIR CANTIDAD
  // ====================================================

  const disminuirCantidad = (
    material: Material
  ) => {
    const cantidadActual =
      material.cantidad ?? 1;

    if (
      cantidadActual <= 1
    ) {
      return;
    }

    actualizarCantidad(
      material.idMaterial,
      cantidadActual - 1
    );
  };

  // ====================================================
  // AUMENTAR CANTIDAD
  // ====================================================

  const aumentarCantidad = (
    material: Material
  ) => {
    const cantidadActual =
      material.cantidad ?? 1;

    actualizarCantidad(
      material.idMaterial,
      cantidadActual + 1
    );
  };

  // ====================================================
  // ELIMINAR MATERIAL
  // ====================================================

  const eliminarMaterial = (
    idMaterial: number
  ) => {
    const nuevaLista =
      materialesSeleccionados.filter(
        (material) =>
          material.idMaterial !==
          idMaterial
      );

    onMaterialesChange(
      nuevaLista
    );
  };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <section className="materiales-proyecto">

      {/* ==================================================
          ENCABEZADO
      ================================================== */}

      <div className="materiales-proyecto-header">

        <div>
          <h3>
            Materiales del proyecto
          </h3>

          <p>
            Seleccioná los materiales que
            necesitás para este proyecto.
          </p>
        </div>

        <div className="materiales-proyecto-icono">
          <Package size={24} />
        </div>

      </div>

      {/* ==================================================
          SELECTOR
      ================================================== */}

      <div className="material-selector">

        <div className="material-selector-header">

          <h3>
            Agregar material
          </h3>

          <span>
            {materialesSeleccionados.length}{" "}
            seleccionado
            {materialesSeleccionados.length !== 1
              ? "s"
              : ""}
          </span>

        </div>

        {/* BUSCADOR */}

        <div className="material-busqueda">

          <Search size={18} />

          <input
            type="text"
            placeholder="Buscar material..."
            value={busqueda}
            onChange={(e) =>
              setBusqueda(
                e.target.value
              )
            }
          />

        </div>

        {/* FORMULARIO */}

        <div className="material-formulario">

          <div className="material-select-container">

            <label htmlFor="material">
              Material
            </label>

            <select
              id="material"
              value={
                materialSeleccionadoId
              }
              onChange={(e) =>
                setMaterialSeleccionadoId(
                  e.target.value
                )
              }
              disabled={cargando}
            >

              <option value="">
                {cargando
                  ? "Cargando materiales..."
                  : "Seleccionar material"}
              </option>

              {materialesFiltrados.map(
                (material) => (
                  <option
                    key={
                      material.idMaterial
                    }
                    value={
                      material.idMaterial
                    }
                    disabled={
                      material.estado?.toLowerCase() !== "activo" ||
                      material.disponibilidad?.toLowerCase() !== "disponible"
                    }
                  >
                    {material.nombre} —{" "}
                    {material.nombreEmpresa ??
                      "Sin empresa"}
                  </option>
                )
              )}

            </select>

          </div>

          {/* CANTIDAD */}

          <div className="material-cantidad-container">

            <label htmlFor="cantidad">
              Cantidad
            </label>

            <input
              id="cantidad"
              type="number"
              min="1"
              max={
                materialSeleccionado?.stock
              }
              value={cantidad}
              onChange={(e) =>
                setCantidad(
                  Number(
                    e.target.value
                  )
                )
              }
            />

          </div>

          {/* AGREGAR */}

          <button
            type="button"
            className="material-agregar-button"
            onClick={
              agregarMaterial
            }
            disabled={
              !materialSeleccionado
            }
          >
            <Plus size={18} />
            Agregar
          </button>

        </div>

        {/* ==================================================
            PREVIEW DEL MATERIAL
        ================================================== */}

        {materialSeleccionado && (
          <div className="material-preview">

            <div className="material-preview-imagen">

              {materialSeleccionado.imagenUrl ? (
                <img
                  src={
                    materialSeleccionado.imagenUrl
                  }
                  alt={
                    materialSeleccionado.nombre
                  }
                  onError={(e) => {
                    e.currentTarget.style.display =
                      "none";
                  }}
                />
              ) : (
                <Package size={28} />
              )}

            </div>

            <div className="material-preview-info">

              <strong>
                {materialSeleccionado.nombre}
              </strong>

              <span>
                Empresa:{" "}
                <strong>
                  {materialSeleccionado.nombreEmpresa ??
                    "Sin empresa"}
                </strong>
              </span>

              <span>
                Precio: $
                {materialSeleccionado.costoUnitario.toLocaleString(
                  "es-UY"
                )}{" "}
                /{" "}
                {materialSeleccionado.unidad ??
                  "unidad"}
              </span>

              <span>
                Stock disponible:{" "}
                {materialSeleccionado.stock}
              </span>

            </div>

            <button
              type="button"
              className="material-ver-button"
              onClick={() =>
                onVerDatosMaterial(
                  materialSeleccionado
                )
              }
            >
              <Eye size={17} />
              Ver datos
            </button>

          </div>
        )}

        {/* ERROR */}

        {error && (
          <p className="materiales-error">
            {error}
          </p>
        )}

      </div>

      {/* ==================================================
          MATERIALES SELECCIONADOS
      ================================================== */}

      <div className="materiales-lista">

        <h3>
          Materiales seleccionados
        </h3>

        {materialesSeleccionados.length === 0 ? (

          <div className="materiales-vacio">

            <Package size={40} />

            <p>
              Todavía no agregaste
              materiales a este proyecto.
            </p>

            <span>
              Seleccioná un material arriba
              para comenzar.
            </span>

          </div>

        ) : (

          <div className="materiales-items">

            {materialesSeleccionados.map(
              (material) => (

                <article
                  className="material-item"
                  key={
                    material.idMaterial
                  }
                >

                  {/* IMAGEN */}

                  <div className="material-item-imagen">

                    {material.imagenUrl ? (
                      <img
                        src={
                          material.imagenUrl
                        }
                        alt={
                          material.nombre
                        }
                        onError={(e) => {
                          e.currentTarget.style.display =
                            "none";
                        }}
                      />
                    ) : (
                      <Package size={28} />
                    )}

                  </div>

                  {/* INFORMACIÓN */}

                  <div className="material-item-info">

                    <h4>
                      {material.nombre}
                    </h4>

                    <p>
                      Empresa:{" "}
                      <strong>
                        {material.nombreEmpresa ??
                          "Sin empresa"}
                      </strong>
                    </p>

                    <p>
                      $
                      {material.costoUnitario.toLocaleString(
                        "es-UY"
                      )}{" "}
                      /{" "}
                      {material.unidad ??
                        "unidad"}
                    </p>

                    <p>
                      Stock disponible:{" "}
                      {material.stock}
                    </p>

                  </div>

                  {/* CANTIDAD */}

                  <div className="material-item-cantidad">

                    <span>
                      Cantidad necesaria
                    </span>

                    <div className="cantidad-controles">

                      <button
                        type="button"
                        onClick={() =>
                          disminuirCantidad(
                            material
                          )
                        }
                        disabled={
                          (material.cantidad ??
                            1) <= 1
                        }
                      >
                        <Minus size={16} />
                      </button>

                      <strong>
                        {material.cantidad ??
                          1}
                      </strong>

                      <button
                        type="button"
                        onClick={() =>
                          aumentarCantidad(
                            material
                          )
                        }
                        disabled={
                          (material.cantidad ??
                            1) >=
                          material.stock
                        }
                      >
                        <Plus size={16} />
                      </button>

                    </div>

                  </div>

                  {/* ACCIONES */}

                  <div className="material-item-acciones">

                    <button
                      type="button"
                      className="material-ver-button"
                      onClick={() =>
                        onVerDatosMaterial(
                          material
                        )
                      }
                    >
                      <Eye size={17} />

                      <span>
                        Ver datos
                      </span>
                    </button>

                    <button
                      type="button"
                      className="material-eliminar-button"
                      onClick={() =>
                        eliminarMaterial(
                          material.idMaterial
                        )
                      }
                    >
                      <Trash2 size={17} />

                      <span>
                        Eliminar
                      </span>
                    </button>

                  </div>

                </article>

              )
            )}

          </div>

        )}

      </div>

    </section>
  );
}