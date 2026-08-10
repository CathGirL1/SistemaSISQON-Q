import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
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

export interface Proyecto {
  idProyecto: number;
  idCliente: number;
  idEmpresa: number | null;
  idTipoObra: number;
  nombre: string;
  descripcion: string | null;
  imagenUrl: string | null;
  ubicacion: string | null;
  estado: string;
  alto: number;
  ancho: number;
  largo: number;
  fechaCreacion: string;
  tipoObra: string;
}

interface FormularioProyecto {
  nombre: string;
  descripcion: string;
  imagenUrl: string | null;
  ubicacion: string;
  idTipoObra: string;
  estado: string;
  alto: string;
  ancho: string;
  largo: string;
  
}

export interface RespuestaError {
  mensaje?: string;
}

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function DetalleProyecto() {
  const navigate = useNavigate();
  const { idProyecto } = useParams();

  const [mensajeExito, setMensajeExito] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);
  const [proyecto, setProyecto] = useState<Proyecto | null>(null)
  useState<FormularioProyecto | null>(null);

  const [cargando, setCargando] = useState(true);

  const [eliminando, setEliminando] = useState(false);

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

  if (cargando || !proyecto) {
    return <p>Cargando proyecto...</p>;
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
              {(
                <>
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
                  value={proyecto.tipoObra || "No especificado"}
                  icon={<Hammer size={16} />}
                />

                <InfoItem
                  label="Estado"
                  value={proyecto.estado}
                />

                <InfoItem
                  label="Imagen de proyecto"
                  value={proyecto.imagenUrl ||
                    "No especificada"}
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