import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Minus,
  Search,
  Package,
  Eye,
  
} from "lucide-react";

import ModalDatosMaterial from "./ModalDatosMaterial";
import {
  formatearPrecioUSD,
  formatearPrecioUYU
} from "../../utilities/formatoMoneda";

import "../../styles/EditarMaterialesProyecto.css";


interface Material {
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
}

// ======================================================
// MATERIAL ASOCIADO AL PROYECTO
// ======================================================

interface MaterialProyecto extends Material {
  idMaterialProyecto: number;
  idProyecto: number;
  cantidad: number;
}

// ======================================================
// PROPS
// ======================================================

interface EditarMaterialesProyectoProps {
  idProyecto: number;
}

// ======================================================
// API
// ======================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000";

// ======================================================
// COMPONENTE
// ======================================================

export default function EditarMaterialesProyecto({
  idProyecto,
}: EditarMaterialesProyectoProps) {
  // ====================================================
  // ESTADOS
  // ====================================================

  const [materialesProyecto, setMaterialesProyecto] =
    useState<MaterialProyecto[]>([]);

  const [materialesCatalogo, setMaterialesCatalogo] =
    useState<Material[]>([]);

  const [materialSeleccionadoId, setMaterialSeleccionadoId] =
    useState("");

  const [cantidad, setCantidad] = useState(1);
  const [tipoCambio, setTipoCambio] =
  useState<number | null>(null);

  const [busqueda, setBusqueda] = useState("");

  const [cargando, setCargando] = useState(true);

  const [guardando, setGuardando] = useState(false);

  const [error, setError] = useState("");

  const [materialModal, setMaterialModal] =
    useState<Material | null>(null);

  const [modalMaterialAbierto, setModalMaterialAbierto] =
    useState(false);

  const obtenerTipoCambio = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/moneda/usd-uyu`
      );

      const data = await response.json();

      console.log("RESPUESTA MONEDA:", data);

      if (!response.ok) {
        throw new Error(
          data.mensaje ||
            "No se pudo obtener el tipo de cambio."
        );
      }

      const cambio = Number(data.valor);

      if (
        !Number.isFinite(cambio) ||
        cambio <= 0
      ) {
        throw new Error(
          "El tipo de cambio recibido no es válido."
        );
      }

      setTipoCambio(cambio);

    } catch (error) {
      console.error(
        "Error al obtener el tipo de cambio:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo obtener el tipo de cambio."
      );
    }
  };


  // ====================================================
  // OBTENER DATOS
  // ====================================================

  useEffect(() => {
    obtenerDatos();
  }, [idProyecto]);

  const obtenerDatos = async () => {
    try {
      setCargando(true);
      setError("");

      const [
        respuestaMaterialesProyecto,
        respuestaCatalogo,
      ] = await Promise.all([
        fetch(
          `${API_URL}/api/materiales-proyecto/proyecto/${idProyecto}`
        ),

        fetch(`${API_URL}/api/materiales`),
      ]);

      if (!respuestaMaterialesProyecto.ok) {
        throw new Error(
          "No se pudieron obtener los materiales del proyecto."
        );
      }

      if (!respuestaCatalogo.ok) {
        throw new Error(
          "No se pudieron obtener los materiales disponibles."
        );
      }

      const datosProyecto =
        await respuestaMaterialesProyecto.json();

      const datosCatalogo =
        await respuestaCatalogo.json();

      // ==================================================
      // NORMALIZAR MATERIALES DEL PROYECTO
      // ==================================================

      const listaProyecto =
        datosProyecto.materiales ??
        datosProyecto.data ??
        datosProyecto ??
        [];

      const materialesProyectoNormalizados: MaterialProyecto[] =
        listaProyecto.map((material: any) => ({
          ...material,

          idMaterialProyecto:
            material.idMaterialProyecto ??
            material.id_MaterialProyecto,

          idProyecto:
            material.idProyecto ??
            material.id_Proyecto,

          idMaterial:
            material.idMaterial ??
            material.id_Material,

          idEmpresa:
            material.idEmpresa ??
            material.id_Empresa,

          nombreEmpresa:
            material.nombreEmpresa ??
            material.empresa,

          cantidad: Number(material.cantidad) || 1,

          stock: Number(material.stock) || 0,

          costoUnitario:
            Number(material.costoUnitario) || 0,
        }));

      // ==================================================
      // NORMALIZAR CATÁLOGO
      // ==================================================

      const listaCatalogo =
        datosCatalogo.materiales ??
        datosCatalogo.data ??
        datosCatalogo ??
        [];

      const materialesCatalogoNormalizados: Material[] =
        listaCatalogo.map((material: any) => ({
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

          stock: Number(material.stock) || 0,

          costoUnitario:
            Number(material.costoUnitario) || 0,
        }));

      setMaterialesProyecto(
        materialesProyectoNormalizados
      );

      setMaterialesCatalogo(
        materialesCatalogoNormalizados
      );

      await obtenerTipoCambio();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar los materiales."
      );
    } finally {
      setCargando(false);
    }
  };

  // ====================================================
  // MATERIAL SELECCIONADO DEL SELECT
  // ====================================================

  const materialSeleccionado =
    materialesCatalogo.find(
      (material) =>
        material.idMaterial ===
        Number(materialSeleccionadoId)
    );

  // ====================================================
  // FILTRAR CATÁLOGO
  // ====================================================

  const materialesFiltrados =
    materialesCatalogo.filter((material) => {
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
    });

  // ====================================================
  // ABRIR MODAL
  // ====================================================

  const abrirModalMaterial = (
    material: Material
  ) => {
    setMaterialModal(material);
    setModalMaterialAbierto(true);
  };

  // ====================================================
  // CERRAR MODAL
  // ====================================================

  const cerrarModalMaterial = () => {
    setModalMaterialAbierto(false);
    setMaterialModal(null);
  };

  // ====================================================
  // ACTUALIZAR CANTIDAD
  // ====================================================

  const actualizarCantidad = async (
    material: MaterialProyecto,
    nuevaCantidad: number
  ) => {
    if (nuevaCantidad <= 0) {
      return;
    }

    if (nuevaCantidad > material.stock) {
      setError(
        `No podés superar el stock disponible de ${material.stock} unidades para "${material.nombre}".`
      );

      return;
    }

    try {
      setError("");
      setGuardando(true);

      const respuesta = await fetch(
        `${API_URL}/api/materiales-proyecto/${material.idMaterialProyecto}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            cantidad: nuevaCantidad,
          }),
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje ||
            "No se pudo actualizar la cantidad."
        );
      }

      setMaterialesProyecto((prev) =>
        prev.map((item) =>
          item.idMaterialProyecto ===
          material.idMaterialProyecto
            ? {
                ...item,
                cantidad: nuevaCantidad,
              }
            : item
        )
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar la cantidad."
      );
    } finally {
      setGuardando(false);
    }
  };

  // ====================================================
  // DISMINUIR
  // ====================================================

  const disminuirCantidad = (
    material: MaterialProyecto
  ) => {
    if (material.cantidad <= 1) {
      return;
    }

    actualizarCantidad(
      material,
      material.cantidad - 1
    );
  };

  // ====================================================
  // AUMENTAR
  // ====================================================

  const aumentarCantidad = (
    material: MaterialProyecto
  ) => {
    if (
      material.cantidad >=
      material.stock
    ) {
      setError(
        `No podés superar el stock disponible de ${material.stock} unidades.`
      );

      return;
    }

    actualizarCantidad(
      material,
      material.cantidad + 1
    );
  };

  // ====================================================
  // ELIMINAR MATERIAL
  // ====================================================

  const eliminarMaterial = async (
    material: MaterialProyecto
  ) => {
    try {
      setError("");
      setGuardando(true);

      const respuesta = await fetch(
        `${API_URL}/api/materiales-proyecto/${material.idMaterialProyecto}`,
        {
          method: "DELETE",
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje ||
            "No se pudo eliminar el material."
        );
      }

      setMaterialesProyecto((prev) =>
        prev.filter(
          (item) =>
            item.idMaterialProyecto !==
            material.idMaterialProyecto
        )
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar el material."
      );
    } finally {
      setGuardando(false);
    }
  };

  // ====================================================
  // AGREGAR MATERIAL
  // ====================================================

  const agregarMaterial = async () => {
    if (!materialSeleccionado) {
      return;
    }

    if (cantidad <= 0) {
      setError(
        "La cantidad debe ser mayor que cero."
      );

      return;
    }

    if (
      cantidad >
      materialSeleccionado.stock
    ) {
      setError(
        `La cantidad solicitada supera el stock disponible (${materialSeleccionado.stock}).`
      );

      return;
    }

    // ==================================================
    // VERIFICAR SI YA EXISTE
    // ==================================================

    const yaExiste =
      materialesProyecto.find(
        (material) =>
          material.idMaterial ===
          materialSeleccionado.idMaterial
      );

    // ==================================================
    // SI YA EXISTE → SUMAR CANTIDAD
    // ==================================================

    if (yaExiste) {
      const nuevaCantidad =
        yaExiste.cantidad + cantidad;

      if (
        nuevaCantidad >
        yaExiste.stock
      ) {
        setError(
          `No podés agregar esa cantidad. El stock disponible de "${yaExiste.nombre}" es ${yaExiste.stock}.`
        );

        return;
      }

      await actualizarCantidad(
        yaExiste,
        nuevaCantidad
      );

      setCantidad(1);
      setMaterialSeleccionadoId("");

      return;
    }

    // ==================================================
    // AGREGAR NUEVO MATERIAL
    // ==================================================

    try {
      setError("");
      setGuardando(true);

      const respuesta = await fetch(
        `${API_URL}/api/materiales-proyecto/agregarMaterialAProyecto`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            idProyecto,
            idMaterial:
              materialSeleccionado.idMaterial,
            cantidad,
          }),
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje ||
            "No se pudo agregar el material."
        );
      }

      // ==================================================
      // OBTENER NUEVO ID
      // ==================================================

      const idMaterialProyecto =
        datos.idMaterialProyecto ??
        datos.id ??
        datos.materialProyecto?.idMaterialProyecto;

      // ==================================================
      // CREAR ELEMENTO LOCAL
      // ==================================================

      const nuevoMaterial: MaterialProyecto = {
        ...materialSeleccionado,

        idMaterialProyecto:
          idMaterialProyecto ??
          Date.now(),

        idProyecto,

        cantidad,
      };

      setMaterialesProyecto((prev) => [
        ...prev,
        nuevoMaterial,
      ]);

      setMaterialSeleccionadoId("");
      setCantidad(1);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo agregar el material."
      );
    } finally {
      setGuardando(false);
    }
  };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <>
      <section className="editar-materiales-card">

        {/* ==================================================
            ENCABEZADO
        ================================================== */}

        <div className="editar-materiales-header">

          <div className="editar-materiales-header-info">

            <div className="editar-materiales-icon">
              <Package size={21} />
            </div>

            <div>
              <h3>
                Materiales del proyecto
              </h3>

              <p>
                Modificá, eliminá o agregá
                materiales para este proyecto.
              </p>
            </div>

          </div>

          <span className="editar-materiales-contador">
            {materialesProyecto.length}{" "}
            material
            {materialesProyecto.length !== 1
              ? "es"
              : ""}
          </span>

        </div>

        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <div className="editar-materiales-error">
            {error}
          </div>
        )}

        {/* ==================================================
            MATERIALES ACTUALES
        ================================================== */}

        <div className="editar-materiales-lista">

          {cargando ? (

            <div className="editar-materiales-cargando">
              <Package size={28} />

              <span>
                Cargando materiales...
              </span>
            </div>

          ) : materialesProyecto.length === 0 ? (

            <div className="editar-materiales-vacio">

              <Package size={40} />

              <strong>
                No hay materiales asociados
              </strong>

              <span>
                Podés agregar materiales
                desde el selector de abajo.
              </span>

            </div>

          ) : (

            materialesProyecto.map(
              (material) => (

                <article
                  className="editar-material-item"
                  key={
                    material.idMaterialProyecto
                  }
                >

                  {/* IMAGEN */}

                  <div className="editar-material-imagen">

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

                  <div className="editar-material-info">

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

                    <small>
                      {tipoCambio !== null
                      ? formatearPrecioUYU(
                              material.costoUnitario * tipoCambio
                            )
                          : "Sin calcular"}{" "}
                        UYU
                    </small>
                    <p>
                      {" "}
                      (
                      {formatearPrecioUSD(
                        material.costoUnitario
                      )}{" "}
                      USD)
                    </p>

                    <p>
                      {material.unidad ?? "unidad"}
                    </p>

                    <p>
                      Stock disponible:{" "}
                      {material.stock}
                    </p>

                  </div>

                  {/* CANTIDAD */}

                  <div className="editar-material-cantidad">

                    <span>
                      Cantidad
                    </span>

                    <div className="editar-cantidad-controles">

                      <button
                        type="button"
                        onClick={() =>
                          disminuirCantidad(
                            material
                          )
                        }
                        disabled={
                          guardando ||
                          material.cantidad <= 1
                        }
                        aria-label="Disminuir cantidad"
                      >
                        <Minus size={16} />
                      </button>

                      <strong>
                        {material.cantidad}
                      </strong>

                      <button
                        type="button"
                        onClick={() =>
                          aumentarCantidad(
                            material
                          )
                        }
                        disabled={
                          guardando ||
                          material.cantidad >=
                            material.stock
                        }
                        aria-label="Aumentar cantidad"
                      >
                        <Plus size={16} />
                      </button>

                    </div>

                  </div>

                  {/* ACCIONES */}

                  <div className="editar-material-acciones">

                    <button
                      type="button"
                      className="editar-material-ver"
                      onClick={() =>
                        abrirModalMaterial(
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
                      className="editar-material-eliminar"
                      onClick={() =>
                        eliminarMaterial(
                          material
                        )
                      }
                      disabled={guardando}
                    >
                      <Trash2 size={17} />

                      <span>
                        Eliminar
                      </span>
                    </button>

                  </div>

                </article>

              )
            )

          )}

        </div>

        {/* ==================================================
            AGREGAR MATERIAL
        ================================================== */}

        <div className="editar-materiales-agregar">

          <div className="editar-materiales-agregar-header">

            <div>
              <h4>
                Agregar material
              </h4>

              <p>
                Seleccioná un material del
                catálogo y definí la cantidad.
              </p>
            </div>

          </div>

          {/* BUSCADOR */}

          <div className="editar-material-busqueda">

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

          <div className="editar-material-formulario">

            <div className="editar-material-select">

              <label htmlFor="editar-material">
                Material
              </label>

              <select
                id="editar-material"
                value={
                  materialSeleccionadoId
                }
                onChange={(e) =>
                  setMaterialSeleccionadoId(
                    e.target.value
                  )
                }
                disabled={
                  cargando ||
                  guardando
                }
              >

                <option value="">
                  Seleccionar material
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
                        material.stock <= 0 ||
                        material.estado
                          ?.toLowerCase() !==
                          "activo"
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

            <div className="editar-material-cantidad-input">

              <label htmlFor="editar-cantidad">
                Cantidad
              </label>

              <input
                id="editar-cantidad"
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
                disabled={guardando}
              />

            </div>

            <button
              type="button"
              className="editar-material-agregar-button"
              onClick={
                agregarMaterial
              }
              disabled={
                !materialSeleccionado ||
                guardando
              }
            >
              <Plus size={18} />

              {guardando
                ? "Guardando..."
                : "Agregar"}
            </button>

          </div>

          {/* PREVIEW DEL MATERIAL */}

          {materialSeleccionado && (
            <div className="editar-material-preview">

              <div className="editar-material-preview-imagen">

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

                  <Package size={26} />

                )}

              </div>

              <div className="editar-material-preview-info">

                <strong>
                  {materialSeleccionado.nombre}
                </strong>

                <span>
                  Empresa:{" "}
                  {materialSeleccionado.nombreEmpresa ??
                    "Sin empresa"}
                </span>

                <span>
                  Stock disponible:{" "}
                  {materialSeleccionado.stock}
                </span>

              </div>

              <button
                type="button"
                className="editar-material-preview-ver"
                onClick={() =>
                  abrirModalMaterial(
                    materialSeleccionado
                  )
                }
              >
                <Eye size={17} />
                Ver datos
              </button>

            </div>
          )}

        </div>

      </section>

      {/* ==================================================
          MODAL
      ================================================== */}

      <ModalDatosMaterial
        material={materialModal}
        abierto={
          modalMaterialAbierto
        }
        onCerrar={
          cerrarModalMaterial
        }
      />
    </>
  );
}