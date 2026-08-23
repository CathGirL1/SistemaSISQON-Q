import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
  FileText,
  Ruler,
  Save,
  X,
} from "lucide-react";

import type {
  Proyecto,
  RespuestaError,
} from "../../pages/cliente/DetalleProyecto";

import EditarMaterialesProyecto from "../../components/cliente/EditarMaterialesProyecto"

import "../../styles/PanelClienteContenido.css";
import "../../styles/EditarProyecto.css";

interface FormularioProyecto {
  nombre: string;
  descripcion: string;
  imagenUrl: string;
  ubicacion: string;
  idTipoObra: string;
  estado: string;
  alto: string;
  ancho: string;
  largo: string;
}

interface TipoObra {
  idTipoObra: number;
  nombre: string;
}

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

const IMAGEN_PREDETERMINADA =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500";

export default function EditarProyecto() {
  const navigate = useNavigate();
  const { idProyecto } = useParams();

  const [proyecto, setProyecto] =
    useState<Proyecto | null>(null);

  const [formulario, setFormulario] =
    useState<FormularioProyecto | null>(null);

  const [tiposObra, setTiposObra] =
    useState<TipoObra[]>([]);

  const [cargando, setCargando] =
    useState(true);

  const [guardando, setGuardando] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    obtenerProyecto();
  }, [idProyecto]);

  // =========================================================
  // OBTENER PROYECTO + TIPOS DE OBRA
  // =========================================================

  const obtenerProyecto = async () => {
    try {
      setCargando(true);
      setError("");

      if (!idProyecto) {
        throw new Error(
          "El ID del proyecto no es válido"
        );
      }

      const [
        responseProyecto,
        responseTiposObra,
      ] = await Promise.all([
        fetch(
          `${API_URL}/api/proyectos/${idProyecto}`
        ),

        fetch(
          `${API_URL}/api/tipos-obra`
        ),
      ]);

      const dataProyecto =
        await responseProyecto.json();

      const dataTiposObra =
        await responseTiposObra.json();

      // -----------------------------------------------------
      // PROYECTO
      // -----------------------------------------------------

      if (!responseProyecto.ok) {
        throw new Error(
          dataProyecto.mensaje ||
            "No se pudo obtener el proyecto"
        );
      }

      // -----------------------------------------------------
      // TIPOS DE OBRA
      // -----------------------------------------------------

      if (!responseTiposObra.ok) {
        throw new Error(
          dataTiposObra.mensaje ||
            "No se pudieron obtener los tipos de obra"
        );
      }

      const proyectoRecibido: Proyecto =
        dataProyecto;

      setProyecto(proyectoRecibido);

      setTiposObra(dataTiposObra);

      cargarFormulario(proyectoRecibido);

    } catch (error) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al cargar el proyecto";

      setError(mensaje);

    } finally {
      setCargando(false);
    }
  };

  // =========================================================
  // CARGAR DATOS EN EL FORMULARIO
  // =========================================================

  const cargarFormulario = (
    proyectoActual: Proyecto
  ) => {
    setFormulario({
      nombre: proyectoActual.nombre,

      descripcion:
        proyectoActual.descripcion ?? "",

      imagenUrl: proyectoActual.imagenUrl ?? "",

      ubicacion:
        proyectoActual.ubicacion ?? "",

      idTipoObra:
        proyectoActual.idTipoObra.toString(),

      estado:
        proyectoActual.estado,

      alto:
        proyectoActual.alto.toString(),

      ancho:
        proyectoActual.ancho.toString(),

      largo:
        proyectoActual.largo.toString(),
    });
  };

  // =========================================================
  // ACTUALIZAR CAMPOS
  // =========================================================

  const actualizarCampo = (
    event: ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormulario((prev) =>
      prev
        ? {
            ...prev,
            [name]: value,
          }
        : prev
    );
  };

  // =========================================================
  // CANCELAR
  // =========================================================

  const cancelarEdicion = () => {
    navigate(
      `/panel-cliente/proyectos/${idProyecto}`
    );
  };

  // =========================================================
  // GUARDAR CAMBIOS
  // =========================================================

  const guardarCambios = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    if (!formulario || !idProyecto) {
      return;
    }

    try {
      setGuardando(true);
      setError("");

      const datosActualizados = {
        nombre:
          formulario.nombre.trim(),

        descripcion:
          formulario.descripcion.trim() ||
          null,

        imagenUrl: formulario.imagenUrl?.trim() || null,

        ubicacion:
          formulario.ubicacion.trim() ||
          null,

        idTipoObra:
          Number(formulario.idTipoObra),

        estado:
          formulario.estado,

        alto:
          Number(formulario.alto),

        ancho:
          Number(formulario.ancho),

        largo:
          Number(formulario.largo),
      };

      const response = await fetch(
        `${API_URL}/api/proyectos/${idProyecto}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            datosActualizados
          ),
        }
      );

      const data: RespuestaError =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.mensaje ||
            "No se pudo actualizar el proyecto"
        );
      }

      navigate(
        `/panel-cliente/proyectos/${idProyecto}`
      );

    } catch (error) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al actualizar el proyecto";

      setError(mensaje);

    } finally {
      setGuardando(false);
    }
  };

  // =========================================================
  // CARGANDO
  // =========================================================

  if (cargando || !formulario) {
    return (
      <div className="editar-proyecto-loading">
        Cargando proyecto...
      </div>
    );
  }

  // =========================================================
  // VISTA
  // =========================================================

  return (
    <form
      onSubmit={guardarCambios}
      className="editar-proyecto-form"
    >

      {/* ===================================================
          ERROR
      =================================================== */}

      {error && (
        <div className="editar-proyecto-error">
          {error}
        </div>
      )}

      {/* ===================================================
          INFORMACIÓN DEL PROYECTO
      =================================================== */}

      <article className="detalle-proyecto-card">

        <div className="detalle-proyecto-card-title">

          <FileText size={21} />

          <h3>
            Editar información de proyecto
          </h3>

        </div>

        <div className="editar-proyecto-grid">

          {/* NOMBRE */}

          <label className="editar-proyecto-field">

            <span>
              Nombre del proyecto
            </span>

            <input
              type="text"
              name="nombre"
              value={formulario.nombre}
              onChange={actualizarCampo}
              placeholder="Ej. Quincho del fondo"
              maxLength={100}
              autoComplete="off"
              required
            />

          </label>

          {/* UBICACIÓN */}

          <label className="editar-proyecto-field">

            <span>
              Ubicación
            </span>

            <input
              type="text"
              name="ubicacion"
              value={formulario.ubicacion}
              onChange={actualizarCampo}
              placeholder="Ej. Maldonado, Uruguay"
              maxLength={200}
              autoComplete="off"
            />

          </label>

          {/* TIPO DE OBRA */}

          <label className="editar-proyecto-field">

            <span>
              Tipo de obra
            </span>

            <select
              name="idTipoObra"
              value={formulario.idTipoObra}
              onChange={actualizarCampo}
              required
            >

              <option value="">
                Seleccione un tipo de obra
              </option>

              {tiposObra.map((tipo) => (

                <option
                  key={tipo.idTipoObra}
                  value={tipo.idTipoObra}
                >
                  {tipo.nombre}
                </option>

              ))}

            </select>

          </label>

          {/* ESTADO */}

          <label className="editar-proyecto-field">

            <span>
              Estado
            </span>

            <select
              name="estado"
              value={formulario.estado}
              onChange={actualizarCampo}
            >

              <option value="Borrador">
                Borrador
              </option>

              <option value="Activo">
                Activo
              </option>

              <option value="Pendiente">
                Pendiente
              </option>

              <option value="En proceso">
                En proceso
              </option>

              <option value="Finalizado">
                Finalizado
              </option>

            </select>

          </label>

          {/* DESCRIPCIÓN */}

          <label className="editar-proyecto-field editar-proyecto-field-full">

            <span>
              Descripción
            </span>

            <textarea
              name="descripcion"
              value={formulario.descripcion}
              onChange={actualizarCampo}
              rows={6}
              maxLength={500}
              placeholder="Describa el proyecto, materiales, características o cualquier información relevante..."
            />

          </label>

          <label className="editar-proyecto-field">

            <span>
              Enlace de imagen
            </span>

            <input
              type="url"
              name="imagenUrl"
              value={formulario.imagenUrl}
              onChange={actualizarCampo}
              placeholder="Ingresá un enlace de imagen (opcional)"
              autoComplete="off"
            />

            <div className="editar-proyecto-imagen-preview">
            <img
              src={
                formulario.imagenUrl.trim() ||
                IMAGEN_PREDETERMINADA
              }
              alt="Vista previa del proyecto"
              onError={(e) => {
                e.currentTarget.src = IMAGEN_PREDETERMINADA;
              }}
            />
          </div>

          </label>

        </div>

      </article>

      {/* ===================================================
          DIMENSIONES
      =================================================== */}

      <article className="editar-proyecto-card">

        <div className="editar-proyecto-card-title">

          <Ruler size={21} />

          <h3>
            Dimensiones
          </h3>

        </div>

        <div className="editar-proyecto-medidas">

          {/* ALTO */}

          <label className="editar-proyecto-field">

            <span>
              Alto (m)
            </span>

            <input
              type="number"
              name="alto"
              value={formulario.alto}
              onChange={actualizarCampo}
              min="0.01"
              step="0.01"
              placeholder="2.50"
              required
            />

          </label>

          {/* ANCHO */}

          <label className="editar-proyecto-field">

            <span>
              Ancho (m)
            </span>

            <input
              type="number"
              name="ancho"
              value={formulario.ancho}
              onChange={actualizarCampo}
              min="0.01"
              step="0.01"
              placeholder="5"
              required
            />

          </label>

          {/* LARGO */}

          <label className="editar-proyecto-field">

            <span>
              Largo (m)
            </span>

            <input
              type="number"
              name="largo"
              value={formulario.largo}
              onChange={actualizarCampo}
              min="0.01"
              step="0.01"
              placeholder="6"
              required
            />

          </label>

        </div>

      </article>

      <EditarMaterialesProyecto
        idProyecto={Number(idProyecto)}
      />

      {/* ===================================================
          BOTONES
      =================================================== */}

      <div className="detalle-proyecto-edit-actions">

        <button
          type="button"
          className="detalle-button-cancel"
          onClick={cancelarEdicion}
        >
          <X size={17} />

          Cancelar
        </button>

        <button
          type="submit"
          className="detalle-button-save"
          disabled={guardando}
        >

          <Save size={17} />

          {guardando
            ? "Guardando..."
            : "Guardar cambios"}

        </button>

      </div>

    </form>
  );
}