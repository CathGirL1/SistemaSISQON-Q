

import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
 
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


import { useNavigate } from "react-router-dom";
import FiltrosProyecto from "./FiltrosProyecto";
import PaginacionProyecto from "./PaginacionProyecto";
import SidebarCliente from "../../components/cliente/SidebarCliente";



import "../../styles/PanelClienteContenido.css";
import "../../styles/PaginacionProyecto.css";
import "../../styles/MisProyectos.css";





export interface ProyectoAPI {
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


const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

const ID_CLIENTE_TEMPORAL = 1;

const PROYECTOS_POR_PAGINA = 6;



const IMAGEN_PROYECTO =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500";

  
  export default function MisProyectos() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("");
  const [tipoObra, setTipoObra] = useState("");
 
  const [orden, setOrden] = useState("recientes");
  const [paginaActual, setPaginaActual] = useState(1);

  const [proyectos, setProyectos] = useState<ProyectoAPI[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerProyectos();
  }, []);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, tipoObra, estado]);

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
      let resultado = [...proyectos];

      // BUSCADOR
      if (busqueda.trim()) {
          const texto = busqueda.toLowerCase();

          resultado = resultado.filter((proyecto) =>
              `
              ${proyecto.nombre}
              ${proyecto.ubicacion ?? ""}
              ${proyecto.estado}
              ${proyecto.tipoObra}
              `
              .toLowerCase()
              .includes(texto)
          );
      }

      // ESTADO
      if (estado) {
          resultado = resultado.filter(
              (proyecto) =>
                  proyecto.estado.toLowerCase() ===
                  estado.toLowerCase()
          );
      }

      // TIPO DE OBRA
      if (tipoObra) {
        resultado = resultado.filter(
            (proyecto) =>
                proyecto.tipoObra?.trim().toLowerCase() ===
                tipoObra.trim().toLowerCase()
        );
      }

      // ORDEN
      switch (orden) {
          case "recientes":
              resultado.sort(
                  (a, b) =>
                      new Date(b.fechaCreacion).getTime() -
                      new Date(a.fechaCreacion).getTime()
              );
              break;

          case "antiguos":
              resultado.sort(
                  (a, b) =>
                      new Date(a.fechaCreacion).getTime() -
                      new Date(b.fechaCreacion).getTime()
              );
              break;

          case "az":
              resultado.sort((a, b) =>
                  a.nombre.localeCompare(b.nombre)
              );
              break;

          case "za":
              resultado.sort((a, b) =>
                  b.nombre.localeCompare(a.nombre)
              );
              break;
      }

      return resultado;
  }, [proyectos, busqueda, estado, tipoObra, orden]);



  const totalProyectos = proyectosFiltrados.length;

  const totalPaginas = Math.ceil(
    totalProyectos / PROYECTOS_POR_PAGINA
  );

  const indiceInicio =
    (paginaActual - 1) * PROYECTOS_POR_PAGINA;

  const indiceFin = Math.min(
    indiceInicio + PROYECTOS_POR_PAGINA,
    totalProyectos
  );

  const proyectosPaginados = proyectosFiltrados.slice(
    indiceInicio,
    indiceFin
  );

  


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

        <FiltrosProyecto
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          estado={estado}
          setEstado={setEstado}
          tipoObra={tipoObra}
          setTipoObra={setTipoObra}
          orden={orden}
          setOrden={setOrden}
          
        
        />

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
              {proyectosPaginados.map((proyecto) => (
                <article
                  className="proyecto-card"
                  key={proyecto.idProyecto}
                >
                  <div className="proyecto-card-image">
                    
                    <img
                      src={proyecto.imagenUrl?.trim() || IMAGEN_PROYECTO}
                      alt={proyecto.nombre}
                      onError={(e) => {
                        e.currentTarget.src = IMAGEN_PROYECTO;
                      }}
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
                          {proyecto.tipoObra}
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

                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/panel-cliente/proyectos/${proyecto.idProyecto}/editar`)
                        }
                      >
                        <Pencil size={16} />
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/panel-cliente/proyectos/${proyecto.idProyecto}/cotizar`)
                        }
                      >
                        <FileText size={16} />
                        Cotizar
                      </button>
                    </div>
                  </div>

                  
                </article>
                
              ))}
              <PaginacionProyecto
                paginaActual={paginaActual}
                totalPaginas={totalPaginas}
                indiceInicio={indiceInicio + 1}
                indiceFin={indiceFin}
                totalElementos={totalProyectos}
                onPaginaAnterior={() =>
                  setPaginaActual((prev) => Math.max(prev - 1, 1))
                }
                onPaginaSiguiente={() =>
                  setPaginaActual((prev) =>
                    Math.min(prev + 1, totalPaginas)
                  )
                }
                onCambiarPagina={setPaginaActual}
              />
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
      <div className={`proyecto-stat-icon proyecto-stat-${variant}`}>
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

  return (
    <span className={`proyecto-status proyecto-status-${estadoNormalizado}`}>
      {estado}
    </span>
  );
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

