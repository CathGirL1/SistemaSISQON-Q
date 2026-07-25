import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Pencil,
  Save,
  X,
  Trash2,
  MapPin,
  Ruler,
  FileText,
  Hammer,
} from "lucide-react";

import SidebarCliente from "../../components/cliente/SidebarCliente";
import HeaderCliente from "../../components/cliente/HeaderCliente";

import "../../styles/PanelClienteContenido.css";
import "../../styles/DetalleProyecto.css";

interface Proyecto {
  idProyecto: number;
  idCliente: number;
  idEmpresa: number | null;
  idTipoObra: number;
  nombre: string;
  descripcion: string | null;
  ubicacion: string | null;
  estado: string;
  alto: number;
  ancho: number;
  largo: number;
  fechaCreacion: string;
}

interface FormularioProyecto {
  nombre: string;
  descripcion: string;
  ubicacion: string;
  idTipoObra: string;
  estado: string;
  alto: string;
  ancho: string;
  largo: string;
}

interface RespuestaError {
  mensaje?: string;
}

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function DetalleProyecto() {
  const navigate = useNavigate();
  const { idProyecto } = useParams();
  const [generandoCotizacion, setGenerandoCotizacion] =
    useState(false);

  const [mensajeExito, setMensajeExito] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [formulario, setFormulario] =
    useState<FormularioProyecto | null>(null);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] =
    useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    obtenerProyecto();
  }, [idProyecto]);

  const obtenerProyecto = async () => {
    try {
      setCargando(true);
      setError("");

      if (!idProyecto) {
        throw new Error("El ID del proyecto no es válido");
      }

      const response = await fetch(
        `${API_URL}/api/proyectos/${idProyecto}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.mensaje || "No se pudo obtener el proyecto"
        );
      }

      const proyectoRecibido: Proyecto = data;

      setProyecto(proyectoRecibido);
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

  const generarCotizacion = async () => {
  if (!idProyecto) {
    setError("El ID del proyecto no es válido");
    return;
  }

  try {
    setGenerandoCotizacion(true);
    setError("");
    setMensajeExito("");

    const response = await fetch(
      `${API_URL}/api/cotizaciones`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idProyecto: Number(idProyecto),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.mensaje || "No se pudo generar la cotización"
      );
    }

    setMensajeExito(
      `Cotización ${data.idCotizacion} creada correctamente`
    );

    navigate("/panel-cliente/cotizaciones");
  } catch (error) {
    const mensaje =
      error instanceof Error
        ? error.message
        : "Ocurrió un error al generar la cotización";

    setError(mensaje);
  } finally {
    setGenerandoCotizacion(false);
  }
};

  const cargarFormulario = (proyectoActual: Proyecto) => {
    setFormulario({
      nombre: proyectoActual.nombre,
      descripcion: proyectoActual.descripcion ?? "",
      ubicacion: proyectoActual.ubicacion ?? "",
      idTipoObra: proyectoActual.idTipoObra.toString(),
      estado: proyectoActual.estado,
      alto: proyectoActual.alto.toString(),
      ancho: proyectoActual.ancho.toString(),
      largo: proyectoActual.largo.toString(),
    });
  };

  const actualizarCampo = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
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

  const cancelarEdicion = () => {
    if (proyecto) {
      cargarFormulario(proyecto);
    }

    setModoEdicion(false);
    setError("");
  };

  const guardarCambios = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!formulario || !idProyecto) {
      return;
    }

    try {
      setGuardando(true);
      setError("");

      const datosActualizados = {
        nombre: formulario.nombre.trim(),
        descripcion: formulario.descripcion.trim() || null,
        ubicacion: formulario.ubicacion.trim() || null,
        idTipoObra: Number(formulario.idTipoObra),
        estado: formulario.estado,
        alto: Number(formulario.alto),
        ancho: Number(formulario.ancho),
        largo: Number(formulario.largo),
      };

      const response = await fetch(
        `${API_URL}/api/proyectos/${idProyecto}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datosActualizados),
        }
      );

      const data: RespuestaError = await response.json();

      if (!response.ok) {
        throw new Error(
          data.mensaje || "No se pudo actualizar el proyecto"
        );
      }

      await obtenerProyecto();
      setModoEdicion(false);
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

  const eliminarProyecto = async () => {
    if (!idProyecto) {
      return;
    }

    try {
      setEliminando(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/proyectos/${idProyecto}`,
        {
          method: "DELETE",
        }
      );

      const data: RespuestaError = await response.json();

      if (!response.ok) {
        throw new Error(
          data.mensaje || "No se pudo eliminar el proyecto"
        );
      }

      navigate("/panel-cliente/proyectos");
    } catch (error) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al eliminar el proyecto";

      setError(mensaje);
      setMostrarConfirmacion(false);
    } finally {
      setEliminando(false);
    }
  };

  if (cargando) {
    return (
      <div className="cliente-panel">
        <SidebarCliente
          menuOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
        />

        <main className="cliente-main">
          <HeaderCliente
            title="Detalle del proyecto"
            subtitle="Cargando información..."
            menuOpen={menuOpen}
            onToggleMenu={() =>
              setMenuOpen((prev) => !prev)
            }
          />

          <div className="detalle-proyecto-feedback">
            Cargando proyecto...
          </div>
        </main>
      </div>
    );
  }

  if (error && !proyecto) {
    return (
      <div className="cliente-panel">
        <SidebarCliente
          menuOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
        />

        <main className="cliente-main">
          <HeaderCliente
            title="Detalle del proyecto"
            subtitle="No se pudo cargar la información."
            menuOpen={menuOpen}
            onToggleMenu={() =>
              setMenuOpen((prev) => !prev)
            }
          />

          <div className="detalle-proyecto-feedback">
            <p>{error}</p>

            <button
              type="button"
              onClick={() =>
                navigate("/panel-cliente/proyectos")
              }
            >
              Volver a Mis proyectos
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!proyecto || !formulario) {
    return null;
  }

  const superficie =
    Number(proyecto.ancho) * Number(proyecto.largo);

  return (
    <div className="cliente-panel">
      <SidebarCliente
        menuOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <main className="cliente-main">
        

        <section className="detalle-proyecto-top">
          <button
            type="button"
            className="detalle-proyecto-back"
            onClick={() =>
              navigate("/panel-cliente/proyectos")
            }
          >
            <ArrowLeft size={18} />
            Volver a Mis proyectos
          </button>

          <div className="detalle-proyecto-header">
            <div>
              <div className="detalle-proyecto-title-row">
                <h2>{proyecto.nombre}</h2>

                <span
                  className={`detalle-proyecto-status detalle-proyecto-status-${normalizarEstado(
                    proyecto.estado
                  )}`}
                >
                  {proyecto.estado}
                </span>
              </div>

              <p>
                Creado el{" "}
                {formatearFecha(proyecto.fechaCreacion)}
              </p>
            </div>

            <div className="detalle-proyecto-header-actions">
              {!modoEdicion && (
                <>
                  <button
                    type="button"
                    className="detalle-button-quote"
                    onClick={generarCotizacion}
                    disabled={generandoCotizacion}
                  >
                    <FileText size={17} />

                    {generandoCotizacion
                        ? "Generando..."
                        : "Generar cotización"}
                  </button>

                  <button
                    type="button"
                    className="detalle-button-edit"
                    onClick={() =>
                      setModoEdicion(true)
                    }
                  >
                    <Pencil size={17} />
                    Editar
                  </button>

                  <button
                    type="button"
                    className="detalle-button-detele"
                    onClick={() => setMostrarConfirmacion(true)}
                  >
                    <Trash2 size={17} />
                    Eliminar
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        {error && (
          <div className="detalle-proyecto-error">
            {error}
          </div>
        )}

        {mensajeExito && (
            <div className="detalle-proyecto-success">
                {mensajeExito}
            </div>
        )}

        {!modoEdicion ? (
          <section className="detalle-proyecto-content">
            <article className="detalle-proyecto-card">
              <CardTitle
                icon={<FileText size={21} />}
                title="Información general"
              />

              <div className="detalle-proyecto-info-grid">
                <InfoItem
                  label="Nombre"
                  value={proyecto.nombre}
                />

                <InfoItem
                  label="Ubicación"
                  value={
                    proyecto.ubicacion ||
                    "No especificada"
                  }
                  icon={<MapPin size={16} />}
                />

                <InfoItem
                  label="Tipo de obra"
                  value={`Tipo #${proyecto.idTipoObra}`}
                  icon={<Hammer size={16} />}
                />

                <InfoItem
                  label="Estado"
                  value={proyecto.estado}
                />

                <div className="detalle-proyecto-description">
                  <span>Descripción</span>

                  <p>
                    {proyecto.descripcion ||
                      "Sin descripción"}
                  </p>
                </div>
              </div>
            </article>

            <article className="detalle-proyecto-card">
              <CardTitle
                icon={<Ruler size={21} />}
                title="Dimensiones"
              />

              <div className="detalle-proyecto-measures">
                <MeasureItem
                  label="Alto"
                  value={`${proyecto.alto} m`}
                />

                <MeasureItem
                  label="Ancho"
                  value={`${proyecto.ancho} m`}
                />

                <MeasureItem
                  label="Largo"
                  value={`${proyecto.largo} m`}
                />

                <MeasureItem
                  label="Superficie"
                  value={`${formatearNumero(superficie)} m²`}
                />
              </div>
            </article>
          </section>
        ) : (
          <form
            className="detalle-proyecto-edit-form"
            onSubmit={guardarCambios}
          >
            <article className="detalle-proyecto-card">
              <CardTitle
                icon={<FileText size={21} />}
                title="Editar información"
              />

              <div className="detalle-proyecto-form-grid">
                <label className="detalle-proyecto-field">
                  <span>Nombre</span>

                  <input
                    type="text"
                    name="nombre"
                    value={formulario.nombre}
                    onChange={actualizarCampo}
                    maxLength={100}
                    required
                  />
                </label>

                <label className="detalle-proyecto-field">
                  <span>Ubicación</span>

                  <input
                    type="text"
                    name="ubicacion"
                    value={formulario.ubicacion}
                    onChange={actualizarCampo}
                    maxLength={200}
                  />
                </label>

                <label className="detalle-proyecto-field">
                  <span>Tipo de obra</span>

                  <input
                    type="number"
                    name="idTipoObra"
                    min="1"
                    step="1"
                    value={formulario.idTipoObra}
                    onChange={actualizarCampo}
                    required
                  />
                </label>

                <label className="detalle-proyecto-field">
                  <span>Estado</span>

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

                    <option value="Finalizado">
                      Finalizado
                    </option>

                    <option value="En proceso">
                      En proceso
                    </option>
                  </select>
                </label>

                <label className="detalle-proyecto-field detalle-proyecto-field-full">
                  <span>Descripción</span>

                  <textarea
                    name="descripcion"
                    value={formulario.descripcion}
                    onChange={actualizarCampo}
                    maxLength={500}
                    rows={5}
                  />
                </label>
              </div>
            </article>

            <article className="detalle-proyecto-card">
              <CardTitle
                icon={<Ruler size={21} />}
                title="Editar dimensiones"
              />

              <div className="detalle-proyecto-form-measures">
                <label className="detalle-proyecto-field">
                  <span>Alto</span>

                  <input
                    type="number"
                    name="alto"
                    min="0.01"
                    step="0.01"
                    value={formulario.alto}
                    onChange={actualizarCampo}
                    required
                  />
                </label>

                <label className="detalle-proyecto-field">
                  <span>Ancho</span>

                  <input
                    type="number"
                    name="ancho"
                    min="0.01"
                    step="0.01"
                    value={formulario.ancho}
                    onChange={actualizarCampo}
                    required
                  />
                </label>

                <label className="detalle-proyecto-field">
                  <span>Largo</span>

                  <input
                    type="number"
                    name="largo"
                    min="0.01"
                    step="0.01"
                    value={formulario.largo}
                    onChange={actualizarCampo}
                    required
                  />
                </label>
              </div>
            </article>

            <div className="detalle-proyecto-edit-actions">
              <button
                type="button"
                className="detalle-button-cancel"
                onClick={cancelarEdicion}
                disabled={guardando}
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
        )}
      </main>

      {mostrarConfirmacion && (
        <div className="detalle-modal-overlay">
          <div
            className="detalle-modal"
            role="dialog"
            aria-modal="true"
          >
            <div className="detalle-modal-icon">
              <Trash2 size={25} />
            </div>

            <h3>Eliminar proyecto</h3>

            <p>
              ¿Seguro que querés eliminar{" "}
              <strong>{proyecto.nombre}</strong>? Esta acción
              no se puede deshacer.
            </p>

            <div className="detalle-modal-actions">
              <button
                type="button"
                className="detalle-button-cancel"
                onClick={() =>
                  setMostrarConfirmacion(false)
                }
                disabled={eliminando}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="detalle-button-confirm-delete"
                onClick={eliminarProyecto}
                disabled={eliminando}
              >
                {eliminando
                  ? "Eliminando..."
                  : "Eliminar proyecto"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface CardTitleProps {
  icon: React.ReactNode;
  title: string;
}

function CardTitle({ icon, title }: CardTitleProps) {
  return (
    <div className="detalle-proyecto-card-title">
      <div className="detalle-proyecto-card-icon">
        {icon}
      </div>

      <h3>{title}</h3>
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

function InfoItem({
  label,
  value,
  icon,
}: InfoItemProps) {
  return (
    <div className="detalle-proyecto-info-item">
      <span>{label}</span>

      <strong>
        {icon}
        {value}
      </strong>
    </div>
  );
}

interface MeasureItemProps {
  label: string;
  value: string;
}

function MeasureItem({
  label,
  value,
}: MeasureItemProps) {
  return (
    <div className="detalle-proyecto-measure">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function formatearFecha(fecha: string): string {
  const fechaProyecto = new Date(fecha);

  if (Number.isNaN(fechaProyecto.getTime())) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat("es-UY", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(fechaProyecto);
}

function formatearNumero(numero: number): string {
  return numero.toFixed(2).replace(".00", "");
}

function normalizarEstado(estado: string): string {
  return estado
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}