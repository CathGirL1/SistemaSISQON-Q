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
  Trash2,
  FileText,
  CircleDollarSign,
  CalendarDays,
  FolderOpen,
  Ruler,
  MapPin,
} from "lucide-react";

import SidebarCliente from "../../components/cliente/SidebarCliente";
import HeaderCliente from "../../components/cliente/HeaderCliente";

import "../../styles/PanelClienteContenido.css";
import "../../styles/DetalleCotizacion.css";

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
  precioEstimado: string;
  observaciones: string;
}

interface RespuestaAPI {
  mensaje?: string;
}

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function DetalleCotizacion() {
  const navigate = useNavigate();
  const { idCotizacion } = useParams();

  const [menuOpen, setMenuOpen] = useState(false);
  const [cotizacion, setCotizacion] =
    useState<Cotizacion | null>(null);

  const [formulario, setFormulario] =
    useState<FormularioCotizacion | null>(null);

  const [cargando, setCargando] = useState(true);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] =
    useState(false);

  const [error, setError] = useState("");

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
      cargarFormulario(cotizacionRecibida);
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

  const cargarFormulario = (
    cotizacionActual: Cotizacion
  ) => {
    setFormulario({
      estado: cotizacionActual.estado,
      precioEstimado:
        cotizacionActual.precioEstimado !== null
          ? cotizacionActual.precioEstimado.toString()
          : "",
      observaciones:
        cotizacionActual.observaciones ?? "",
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
    if (cotizacion) {
      cargarFormulario(cotizacion);
    }

    setModoEdicion(false);
    setError("");
  };

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

      const precio =
        formulario.precioEstimado.trim() === ""
          ? null
          : Number(formulario.precioEstimado);

      const response = await fetch(
        `${API_URL}/api/cotizaciones/${idCotizacion}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            estado: formulario.estado,
            precioEstimado: precio,
            observaciones:
              formulario.observaciones.trim() || null,
          }),
        }
      );

      const data: RespuestaAPI = await response.json();

      if (!response.ok) {
        throw new Error(
          data.mensaje ||
            "No se pudo actualizar la cotización"
        );
      }

      await obtenerCotizacion();
      setModoEdicion(false);
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

  const eliminarCotizacion = async () => {
    if (!idCotizacion) {
      return;
    }

    try {
      setEliminando(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/cotizaciones/${idCotizacion}`,
        {
          method: "DELETE",
        }
      );

      const data: RespuestaAPI = await response.json();

      if (!response.ok) {
        throw new Error(
          data.mensaje ||
            "No se pudo eliminar la cotización"
        );
      }

      navigate("/panel-cliente/cotizaciones");
    } catch (error) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al eliminar la cotización";

      setError(mensaje);
      setMostrarConfirmacion(false);
    } finally {
      setEliminando(false);
    }
  };

  if (cargando) {
    return (
      <EstructuraDetalle
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      >
        <div className="detalle-cotizacion-feedback">
          Cargando cotización...
        </div>
      </EstructuraDetalle>
    );
  }

  if (error && !cotizacion) {
    return (
      <EstructuraDetalle
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      >
        <div className="detalle-cotizacion-feedback">
          <p>{error}</p>

          <button
            type="button"
            onClick={() =>
              navigate("/panel-cliente/cotizaciones")
            }
          >
            Volver a Mis cotizaciones
          </button>
        </div>
      </EstructuraDetalle>
    );
  }

  if (!cotizacion || !formulario) {
    return null;
  }

  return (
    <div className="cliente-panel">
      <SidebarCliente
        menuOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <main className="cliente-main">
        <HeaderCliente
          menuOpen={menuOpen}
          onToggleMenu={() =>
            setMenuOpen((prev) => !prev)
          }
        />

        <section className="detalle-cotizacion-top">
          <button
            type="button"
            className="detalle-cotizacion-back"
            onClick={() =>
              navigate("/panel-cliente/cotizaciones")
            }
          >
            <ArrowLeft size={18} />
            Volver a Mis cotizaciones
          </button>

          <div className="detalle-cotizacion-header">
            <div>
              <div className="detalle-cotizacion-title-row">
                <h2>{cotizacion.codigo}</h2>

                <EstadoBadge estado={cotizacion.estado} />
              </div>

              <p>{cotizacion.nombreProyecto}</p>
            </div>

            {!modoEdicion && (
              <div className="detalle-cotizacion-actions">
                <button
                  type="button"
                  className="detalle-cotizacion-project-button"
                  onClick={() =>
                    navigate(
                      `/panel-cliente/proyectos/${cotizacion.idProyecto}`
                    )
                  }
                >
                  <FolderOpen size={17} />
                  Ver proyecto
                </button>

                <button
                  type="button"
                  className="detalle-cotizacion-edit-button"
                  onClick={() => setModoEdicion(true)}
                >
                  <Pencil size={17} />
                  Editar
                </button>

                <button
                  type="button"
                  className="detalle-cotizacion-delete-button"
                  onClick={() =>
                    setMostrarConfirmacion(true)
                  }
                >
                  <Trash2 size={17} />
                  Eliminar
                </button>
              </div>
            )}
          </div>
        </section>

        {error && (
          <div className="detalle-cotizacion-error">
            {error}
          </div>
        )}

        {!modoEdicion ? (
          <section className="detalle-cotizacion-content">
            <article className="detalle-cotizacion-card">
              <CardTitle
                icon={<FileText size={21} />}
                title="Información de la cotización"
              />

              <div className="detalle-cotizacion-info-grid">
                <InfoItem
                  label="Código"
                  value={cotizacion.codigo}
                />

                <InfoItem
                  label="Estado"
                  value={cotizacion.estado}
                />

                <InfoItem
                  label="Fecha de creación"
                  value={formatearFecha(
                    cotizacion.fechaCreacion
                  )}
                  icon={<CalendarDays size={16} />}
                />

                <InfoItem
                  label="Última actualización"
                  value={
                    cotizacion.fechaActualizacion
                      ? formatearFecha(
                          cotizacion.fechaActualizacion
                        )
                      : "Sin modificaciones"
                  }
                />

                <InfoItem
                  label="Precio estimado"
                  value={formatearPrecio(
                    cotizacion.precioEstimado
                  )}
                  icon={<CircleDollarSign size={16} />}
                />

                <div className="detalle-cotizacion-description">
                  <span>Observaciones</span>

                  <p>
                    {cotizacion.observaciones ||
                      "Sin observaciones"}
                  </p>
                </div>
              </div>
            </article>

            <article className="detalle-cotizacion-card">
              <CardTitle
                icon={<FolderOpen size={21} />}
                title="Proyecto relacionado"
              />

              <div className="detalle-cotizacion-info-grid">
                <InfoItem
                  label="Proyecto"
                  value={cotizacion.nombreProyecto}
                />

                <InfoItem
                  label="Ubicación"
                  value={
                    cotizacion.ubicacion ||
                    "No especificada"
                  }
                  icon={<MapPin size={16} />}
                />

                <InfoItem
                  label="Tipo de obra"
                  value={`Tipo #${cotizacion.idTipoObra}`}
                />

                <InfoItem
                  label="Superficie"
                  value={`${formatearNumero(
                    cotizacion.superficie
                  )} m²`}
                  icon={<Ruler size={16} />}
                />
              </div>

              <div className="detalle-cotizacion-measures">
                <MeasureItem
                  label="Alto"
                  value={`${cotizacion.alto} m`}
                />

                <MeasureItem
                  label="Ancho"
                  value={`${cotizacion.ancho} m`}
                />

                <MeasureItem
                  label="Largo"
                  value={`${cotizacion.largo} m`}
                />
              </div>
            </article>
          </section>
        ) : (
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
                <label className="detalle-cotizacion-field">
                  <span>Estado</span>

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

                <label className="detalle-cotizacion-field">
                  <span>Precio estimado</span>

                  <input
                    type="number"
                    name="precioEstimado"
                    min="0"
                    step="0.01"
                    value={formulario.precioEstimado}
                    onChange={actualizarCampo}
                    placeholder="Ej.: 850000"
                  />
                </label>

                <label className="detalle-cotizacion-field detalle-cotizacion-field-full">
                  <span>Observaciones</span>

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
        )}
      </main>

      {mostrarConfirmacion && (
        <div className="detalle-cotizacion-modal-overlay">
          <div
            className="detalle-cotizacion-modal"
            role="dialog"
            aria-modal="true"
          >
            <div className="detalle-cotizacion-modal-icon">
              <Trash2 size={25} />
            </div>

            <h3>Eliminar cotización</h3>

            <p>
              ¿Seguro que querés eliminar la cotización{" "}
              <strong>{cotizacion.codigo}</strong>? Esta
              acción no se puede deshacer.
            </p>

            <div className="detalle-cotizacion-modal-actions">
              <button
                type="button"
                className="detalle-cotizacion-cancel-button"
                onClick={() =>
                  setMostrarConfirmacion(false)
                }
                disabled={eliminando}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="detalle-cotizacion-confirm-delete"
                onClick={eliminarCotizacion}
                disabled={eliminando}
              >
                {eliminando
                  ? "Eliminando..."
                  : "Eliminar cotización"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface EstructuraDetalleProps {
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  children: ReactNode;
}

function EstructuraDetalle({
  menuOpen,
  setMenuOpen,
  children,
}: EstructuraDetalleProps) {
  return (
    <div className="cliente-panel">
      <SidebarCliente
        menuOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <main className="cliente-main">
        <HeaderCliente
          title="Detalle de cotización"
          subtitle="Información de la cotización."
          menuOpen={menuOpen}
          onToggleMenu={() =>
            setMenuOpen((prev) => !prev)
          }
        />

        {children}
      </main>
    </div>
  );
}

function EstadoBadge({
  estado,
}: {
  estado: EstadoCotizacion;
}) {
  const clase = `detalle-cotizacion-status detalle-cotizacion-status-${estado.toLowerCase()}`;

  return <span className={clase}>{estado}</span>;
}

interface CardTitleProps {
  icon: ReactNode;
  title: string;
}

function CardTitle({ icon, title }: CardTitleProps) {
  return (
    <div className="detalle-cotizacion-card-title">
      <div className="detalle-cotizacion-card-icon">
        {icon}
      </div>

      <h3>{title}</h3>
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
  icon?: ReactNode;
}

function InfoItem({
  label,
  value,
  icon,
}: InfoItemProps) {
  return (
    <div className="detalle-cotizacion-info-item">
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
    <div className="detalle-cotizacion-measure">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function formatearFecha(fecha: string): string {
  const fechaCotizacion = new Date(fecha);

  if (Number.isNaN(fechaCotizacion.getTime())) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat("es-UY", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(fechaCotizacion);
}

function formatearPrecio(
  precio: number | null
): string {
  if (precio === null) {
    return "Sin calcular";
  }

  return new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: "UYU",
    maximumFractionDigits: 0,
  }).format(precio);
}

function formatearNumero(numero: number): string {
  return Number(numero).toFixed(2).replace(".00", "");
}