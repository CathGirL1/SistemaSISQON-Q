import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Pencil,
  Save,
  X,
} from "lucide-react";

import SidebarCliente from "../../components/cliente/SidebarCliente";
import HeaderCliente from "../../components/cliente/HeaderCliente";

import "../../styles/PanelClienteContenido.css";
import "../../styles/DetalleCotizacion.css";

/* ================================================= */
/* TIPOS */
/* ================================================= */

type EstadoCotizacion =
  | "Borrador"
  | "Enviada"
  | "Revisada"
  | "Aceptada"
  | "Rechazada";

interface Cotizacion {
  idCotizacion: number;
  idProyecto: number;
  codigo: string;
  fechaCreacion: string;
  fechaActualizacion: string | null;
  estado: EstadoCotizacion;

  precioEstimado: number | null;
  precioEstimadoUYU: number | null;

  observaciones: string | null;

  idCliente: number;
  idTipoObra: number;
  nombreProyecto: string;
  descripcionProyecto: string | null;
  ubicacion: string | null;

  alto: number;
  ancho: number;
  largo: number;
  superficie: number;
}

interface FormularioCotizacion {
  estado: EstadoCotizacion;
  observaciones: string;
}

interface RespuestaAPI {
  mensaje?: string;
}

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

/* ================================================= */
/* COMPONENTE PRINCIPAL */
/* ================================================= */

export default function EditarCotizacion() {
  const navigate = useNavigate();
  const { idCotizacion } = useParams();

  const [cotizacion, setCotizacion] =
    useState<Cotizacion | null>(null);

  const [formulario, setFormulario] =
    useState<FormularioCotizacion | null>(null);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  /* ================================================= */
  /* OBTENER COTIZACIÓN */
  /* ================================================= */

  useEffect(() => {
    obtenerCotizacion();
  }, [idCotizacion]);

  const obtenerCotizacion = async () => {
    try {
      setCargando(true);
      setError("");

      if (!idCotizacion) {
        throw new Error(
          "El ID de la cotización no es válido"
        );
      }

      const response = await fetch(
        `${API_URL}/api/cotizaciones/${idCotizacion}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.mensaje ||
            "No se pudo obtener la cotización"
        );
      }

      const cotizacionRecibida: Cotizacion = data;

      setCotizacion(cotizacionRecibida);

      setFormulario({
        estado: cotizacionRecibida.estado,
        observaciones:
          cotizacionRecibida.observaciones ?? "",
      });
    } catch (error) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al cargar la cotización";

      setError(mensaje);
    } finally {
      setCargando(false);
    }
  };

  /* ================================================= */
  /* ACTUALIZAR CAMPOS */
  /* ================================================= */

  const actualizarCampo = (
    event: ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setFormulario((prev) =>
      prev
        ? {
            ...prev,
            [name]: value,
          }
        : prev
    );
  };

  /* ================================================= */
  /* CANCELAR EDICIÓN */
  /* ================================================= */

  const cancelarEdicion = () => {
    navigate(
      `/panel-cliente/cotizaciones/${idCotizacion}`
    );
  };

  /* ================================================= */
  /* GUARDAR CAMBIOS */
  /* ================================================= */

  const guardarCambios = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!formulario || !idCotizacion) {
      return;
    }

    try {
      setGuardando(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/cotizaciones/${idCotizacion}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            estado: formulario.estado,
            observaciones:
              formulario.observaciones.trim() || null,
          }),
        }
      );

      const data: RespuestaAPI =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.mensaje ||
            "No se pudo actualizar la cotización"
        );
      }

      navigate(
        "/panel-cliente/cotizaciones");
    } catch (error) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al actualizar la cotización";

      setError(mensaje);
    } finally {
      setGuardando(false);
    }
  };

  /* ================================================= */
  /* CARGANDO */
  /* ================================================= */

  if (cargando) {
    return (
      <EstructuraEditar>
        <div className="detalle-cotizacion-feedback">
          Cargando cotización...
        </div>
      </EstructuraEditar>
    );
  }

  /* ================================================= */
  /* ERROR */
  /* ================================================= */

  if (error && !cotizacion) {
    return (
      <EstructuraEditar>
        <div className="detalle-cotizacion-feedback">
          <p>{error}</p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/panel-cliente/cotizaciones"
              )
            }
          >
            Volver a Mis cotizaciones
          </button>
        </div>
      </EstructuraEditar>
    );
  }

  if (!cotizacion || !formulario) {
    return null;
  }

  /* ================================================= */
  /* VISTA PRINCIPAL */
  /* ================================================= */

  return (
    <div className="cliente-panel">

      <SidebarCliente
        menuOpen={false}
        onClose={() => {}}
      />

      <main className="cliente-main">

        {/* ----------------------------------------- */}
        {/* ENCABEZADO */}
        {/* ----------------------------------------- */}

        <section className="detalle-cotizacion-top">

          <button
            type="button"
            className="detalle-cotizacion-back"
            onClick={cancelarEdicion}
          >
            <ArrowLeft size={18} />
            Volver al detalle
          </button>

          <div className="detalle-cotizacion-header">

            <div>

              <div className="detalle-cotizacion-title-row">

                <h2>
                  Editar {cotizacion.codigo}
                </h2>

              </div>

              <p>
                {cotizacion.nombreProyecto}
              </p>

            </div>

          </div>

        </section>

        {/* ----------------------------------------- */}
        {/* ERROR */}
        {/* ----------------------------------------- */}

        {error && (
          <div className="detalle-cotizacion-error">
            {error}
          </div>
        )}

        {/* ----------------------------------------- */}
        {/* FORMULARIO */}
        {/* ----------------------------------------- */}

        <form
          className="detalle-cotizacion-edit-form"
          onSubmit={guardarCambios}
        >

          <article className="detalle-cotizacion-card">

            <CardTitle
              icon={<Pencil size={21} />}
              title="Editar cotización"
            />

            <div className="detalle-cotizacion-form-grid">

              {/* ESTADO */}

              <label className="detalle-cotizacion-field">

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

                  <option value="Enviada">
                    Enviada
                  </option>

                  <option value="Revisada">
                    Revisada
                  </option>

                  <option value="Aceptada">
                    Aceptada
                  </option>

                  <option value="Rechazada">
                    Rechazada
                  </option>

                </select>

              </label>

              {/* OBSERVACIONES */}

              <label className="detalle-cotizacion-field detalle-cotizacion-field-full">

                <span>
                  Observaciones
                </span>

                <textarea
                  name="observaciones"
                  value={formulario.observaciones}
                  onChange={actualizarCampo}
                  maxLength={1000}
                  rows={6}
                  placeholder="Agregá observaciones sobre la cotización..."
                />

              </label>

            </div>

          </article>

          {/* ----------------------------------------- */}
          {/* ACCIONES */}
          {/* ----------------------------------------- */}

          <div className="detalle-cotizacion-edit-actions">

            <button
              type="button"
              className="detalle-cotizacion-cancel-button"
              onClick={cancelarEdicion}
              disabled={guardando}
            >
              <X size={17} />
              Cancelar
            </button>

            <button
              type="submit"
              className="detalle-cotizacion-save-button"
              disabled={guardando}
            >
              <Save size={17} />

              {guardando
                ? "Guardando..."
                : "Guardar cambios"}

            </button>

          </div>

        </form>

      </main>

    </div>
  );
}

/* ================================================= */
/* ESTRUCTURA */
/* ================================================= */

interface EstructuraEditarProps {
  children: ReactNode;
}

function EstructuraEditar({
  children,
}: EstructuraEditarProps) {
  return (
    <div className="cliente-panel">

      <SidebarCliente
        menuOpen={false}
        onClose={() => {}}
      />

      <main className="cliente-main">

        <HeaderCliente
          title="Editar cotización"
          subtitle="Modificá la información de la cotización."
          menuOpen={false}
          onToggleMenu={() => {}}
        />

        {children}

      </main>

    </div>
  );
}

/* ================================================= */
/* CARD TITLE */
/* ================================================= */

interface CardTitleProps {
  icon: ReactNode;
  title: string;
}

function CardTitle({
  icon,
  title,
}: CardTitleProps) {
  return (
    <div className="detalle-cotizacion-card-title">

      <div className="detalle-cotizacion-card-icon">
        {icon}
      </div>

      <h3>
        {title}
      </h3>

    </div>
  );
}