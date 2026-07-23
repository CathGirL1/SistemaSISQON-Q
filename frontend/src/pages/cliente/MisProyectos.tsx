import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  Search,
  ChevronDown,
  Plus,
  FolderOpen,
  Clock3,
  CircleCheck,
  CircleDashed,
  Eye,
  Pencil,
  FileText,
  MoreVertical,
} from "lucide-react";


import SidebarCliente from "../../components/cliente/SidebarCliente";
import HeaderCliente from "../../components/cliente/HeaderCliente";

import "../../styles/PanelClienteContenido.css";
import "../../styles/MisProyectos.css";

interface ProyectoAPI {
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

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

const ID_CLIENTE_TEMPORAL = 1;

const IMAGEN_PROYECTO =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500";

  
  export default function MisProyectos() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const [proyectos, setProyectos] = useState<ProyectoAPI[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerProyectos();
  }, []);

  const obtenerProyectos = async () => {
    try {
      setCargando(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/proyectos/cliente/${ID_CLIENTE_TEMPORAL}`
      );

      if (!response.ok) {
        const respuestaError = await response.json();

        throw new Error(
          respuestaError.mensaje ||
            "No se pudieron obtener los proyectos"
        );
      }

      const data: ProyectoAPI[] = await response.json();

      setProyectos(data);
    } catch (error) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al cargar los proyectos";

      setError(mensaje);
    } finally {
      setCargando(false);
    }
  };

  const proyectosFiltrados = useMemo(() => {
    const textoBusqueda = busqueda.trim().toLowerCase();

    if (!textoBusqueda) {
      return proyectos;
    }

    return proyectos.filter((proyecto) => {
      const texto = `
        ${proyecto.nombre}
        ${proyecto.ubicacion ?? ""}
        ${proyecto.estado}
        ${proyecto.idTipoObra}
      `;

      return texto.toLowerCase().includes(textoBusqueda);
    });
  }, [busqueda, proyectos]);

  const totalActivos = proyectos.filter(
    (proyecto) =>
      proyecto.estado.toLowerCase() === "activo" ||
      proyecto.estado.toLowerCase() === "en proceso"
  ).length;

  const totalPendientes = proyectos.filter(
    (proyecto) =>
      proyecto.estado.toLowerCase() === "pendiente"
  ).length;

  const totalFinalizados = proyectos.filter(
    (proyecto) =>
      proyecto.estado.toLowerCase() === "finalizado"
  ).length;

  return (
    <div className="cliente-panel">
      <SidebarCliente
        menuOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <main className="cliente-main">
        <HeaderCliente
          menuOpen={menuOpen}
          onToggleMenu={() => setMenuOpen((prev) => !prev)}
        />

        <section className="proyectos-heading">
          <div>
            <h2>Mis proyectos</h2>

            <p>
              Organizá tus proyectos y generá cotizaciones a partir de
              cada uno.
            </p>
          </div>

          <button
            type="button"
            className="nuevo-proyecto-button"
            onClick={() => 
              navigate("/panel-cliente/proyectos/crear")
            }
          >
            <Plus size={20} />
            Crear nuevo proyecto
          </button>
        </section>

        <section className="proyectos-stats">
          <StatCard
            icon={<FolderOpen size={23} />}
            value={proyectos.length.toString()}
            label="Total proyectos"
            variant="blue"
          />

          <StatCard
            icon={<CircleDashed size={23} />}
            value={totalActivos.toString()}
            label="Activos"
            variant="green"
          />

          <StatCard
            icon={<Clock3 size={23} />}
            value={totalPendientes.toString()}
            label="Pendientes"
            variant="orange"
          />

          <StatCard
            icon={<CircleCheck size={23} />}
            value={totalFinalizados.toString()}
            label="Finalizados"
            variant="purple"
          />
        </section>

        <section className="proyectos-filters">
          <label className="proyectos-search">
            <Search size={19} />

            <input
              type="search"
              placeholder="Buscar proyecto..."
              value={busqueda}
              onChange={(event) =>
                setBusqueda(event.target.value)
              }
            />
          </label>

          <button
            type="button"
            className="proyecto-filter-button"
          >
            Todos los tipos
            <ChevronDown size={17} />
          </button>

          <button
            type="button"
            className="proyecto-filter-button"
          >
            Todos los estados
            <ChevronDown size={17} />
          </button>

          <button
            type="button"
            className="proyecto-filter-button"
          >
            Más recientes
            <ChevronDown size={17} />
          </button>
        </section>

        {cargando && (
          <section className="proyectos-feedback">
            <p>Cargando proyectos...</p>
          </section>
        )}

        {!cargando && error && (
          <section className="proyectos-feedback">
            <p>{error}</p>

            <button
              type="button"
              onClick={obtenerProyectos}
            >
              Volver a intentar
            </button>
          </section>
        )}

        {!cargando &&
          !error &&
          proyectosFiltrados.length === 0 && (
            <section className="proyectos-feedback">
              <FolderOpen size={40} />

              <h3>No se encontraron proyectos</h3>

              <p>
                Todavía no hay proyectos registrados para este
                cliente.
              </p>
            </section>
          )}

        {!cargando &&
          !error &&
          proyectosFiltrados.length > 0 && (
            <section className="proyectos-grid">
              {proyectosFiltrados.map((proyecto) => (
                <article
                  className="proyecto-card"
                  key={proyecto.idProyecto}
                >
                  <div className="proyecto-card-image">
                    <img
                      src={IMAGEN_PROYECTO}
                      alt={proyecto.nombre}
                    />

                    <EstadoProyectoBadge
                      estado={proyecto.estado}
                    />

                    <button
                      type="button"
                      className="proyecto-options"
                      aria-label={`Opciones de ${proyecto.nombre}`}
                    >
                      <MoreVertical size={19} />
                    </button>
                  </div>

                  <div className="proyecto-card-content">
                    <div className="proyecto-card-title">
                      <div>
                        <h3>{proyecto.nombre}</h3>

                        <p>
                          {proyecto.ubicacion ||
                            "Ubicación no especificada"}
                        </p>
                      </div>
                    </div>

                    <div className="proyecto-details">
                      <div>
                        <span>Tipo de obra</span>

                        <strong>
                          Tipo #{proyecto.idTipoObra}
                        </strong>
                      </div>

                      <div>
                        <span>Superficie</span>

                        <strong>
                          {calcularSuperficie(proyecto)} m²
                        </strong>
                      </div>

                      <div>
                        <span>Creado</span>

                        <strong>
                          {formatearFecha(
                            proyecto.fechaCreacion
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>Altura</span>

                        <strong>{proyecto.alto} m</strong>
                      </div>
                    </div>

                    <div className="proyecto-card-actions">
                      <button
                        type="button"
                        className="primary-action"
                        onClick={() =>
                          navigate(`/panel-cliente/proyectos/${proyecto.idProyecto}`)
                        }
                      >
                        <Eye size={16} />
                        Ver detalle
                      </button>

                      <button type="button">
                        <Pencil size={16} />
                        Editar
                      </button>

                      <button type="button">
                        <FileText size={16} />
                        Cotizar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          )}
      </main>
    </div>
  );
}

interface StatCardProps {
  icon: ReactNode;
  value: string;
  label: string;
  variant: "blue" | "green" | "orange" | "purple";
}

function StatCard({
  icon,
  value,
  label,
  variant,
}: StatCardProps) {
  return (
    <article className="proyecto-stat-card">
      <div
        className={`proyecto-stat-icon proyecto-stat-${variant}`}
      >
        {icon}
      </div>

      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </article>
  );
}

function EstadoProyectoBadge({
  estado,
}: {
  estado: string;
}) {
  const estadoNormalizado = estado
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

  const clase = `proyecto-status proyecto-status-${estadoNormalizado}`;

  return <span className={clase}>{estado}</span>;
}

function calcularSuperficie(proyecto: ProyectoAPI): string {
  const superficie =
    Number(proyecto.ancho) * Number(proyecto.largo);

  return superficie.toFixed(2).replace(".00", "");
}

function formatearFecha(fecha: string): string {
  const fechaProyecto = new Date(fecha);

  if (Number.isNaN(fechaProyecto.getTime())) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat("es-UY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(fechaProyecto);
}