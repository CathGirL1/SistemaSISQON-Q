import {
  Search,
  ChevronDown,
  CalendarDays,
  FileText,
  Clock3,
  Send,
  ClipboardCheck,
  CircleCheck,
  CircleX,
  Eye,
  Download,
  Pencil,
  Lightbulb,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useNavigate } from "react-router-dom";

import SidebarCliente from "../../components/cliente/SidebarCliente";
import { type ProyectoAPI } from "../cliente/MisProyectos";


import "../../styles/PanelClienteContenido.css";
import "../../styles/MisCotizaciones.css";

type EstadoCotizacion =
  | "Borrador"
  | "Pendiente"
  | "Enviada"
  | "Revisada"
  | "Aceptada"
  | "Aprobada"
  | "Rechazada";

interface CotizacionAPI {
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

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

const ID_CLIENTE_TEMPORAL = 1;

export default function MisCotizaciones() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const [cotizaciones, setCotizaciones] =
    useState<CotizacionAPI[]>([]);

  const [imagenesProyectos, setImagenesProyectos] =
    useState<Record<number, string | null>>({});
 
  const [tiposObraProyectos, setTiposObraProyectos] =
  useState<Record<number, string>>({});

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerCotizaciones();
  }, []);

  const obtenerCotizaciones = async () => {
    try {
      setCargando(true);
      setError("");

      // -----------------------------------------
      // 1. OBTENER COTIZACIONES
      // -----------------------------------------

      const response = await fetch(
        `${API_URL}/api/cotizaciones/cliente/${ID_CLIENTE_TEMPORAL}`
      );

      const data: CotizacionAPI[] =
        await response.json();

      if (!response.ok) {
        throw new Error(
          "No se pudieron obtener las cotizaciones"
        );
      }

      setCotizaciones(data);

      // -----------------------------------------
      // 2. OBTENER IDS DE PROYECTOS
      // -----------------------------------------

      const proyectosUnicos: number[] = Array.from(
        new Set(
          data.map(
            (cotizacion: CotizacionAPI) =>
              cotizacion.idProyecto
          )
        )
      );

      // -----------------------------------------
      // 3. OBTENER INFORMACIÓN DE CADA PROYECTO
      // -----------------------------------------

      const resultados: {
        idProyecto: number;
        imagenUrl: string | null;
        tipoObra: string,
      }[] = await Promise.all(
        proyectosUnicos.map(
          async (idProyecto: number) => {
            try {
              const responseProyecto =
                await fetch(
                  `${API_URL}/api/proyectos/${idProyecto}`
                );

              if (!responseProyecto.ok) {
                return {
                  idProyecto,
                  imagenUrl: null,
                  tipoObra: "No especificado",
                };
              }

              const proyecto: ProyectoAPI =
                await responseProyecto.json();

              return {
                idProyecto:
                  proyecto.idProyecto,
                imagenUrl:
                  proyecto.imagenUrl,
                tipoObra: proyecto.tipoObra, 
              };
            } catch {
              return {
                idProyecto,
                imagenUrl: null,
                tipoObra: "No especificado",
              };
            }
          }
        )
      );

      // -----------------------------------------
      // 4. GUARDAR LAS IMÁGENES POR PROYECTO
      // -----------------------------------------
      const tipos: Record<number, string> = {};

      resultados.forEach((resultado) => {
      tipos[resultado.idProyecto] = resultado.tipoObra;
      });

      setTiposObraProyectos(tipos);

      const imagenes: Record<
        number,
        string | null
      > = {};

      resultados.forEach((resultado) => {
        imagenes[resultado.idProyecto] =
          resultado.imagenUrl;
      });

      setImagenesProyectos(imagenes);

    } catch (error) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al cargar las cotizaciones";

      setError(mensaje);
    } finally {
      setCargando(false);
    }
  };

  // -----------------------------------------
  // FILTRO DE BÚSQUEDA
  // -----------------------------------------

  const cotizacionesFiltradas = useMemo(() => {
    const textoBusqueda =
      busqueda.trim().toLowerCase();

    if (!textoBusqueda) {
      return cotizaciones;
    }

    return cotizaciones.filter(
      (cotizacion) => {
        const texto = `
          ${cotizacion.codigo}
          ${cotizacion.nombreProyecto}
          ${cotizacion.estado}
          ${cotizacion.ubicacion ?? ""}
          ${cotizacion.idTipoObra}
        `;

        return texto
          .toLowerCase()
          .includes(textoBusqueda);
      }
    );
  }, [busqueda, cotizaciones]);

  // -----------------------------------------
  // ESTADÍSTICAS
  // -----------------------------------------

  const totalPendientes =
    cotizaciones.filter(
      (cotizacion) =>
        cotizacion.estado === "Pendiente" ||
        cotizacion.estado === "Borrador"
    ).length;

  const totalEnviadas =
    cotizaciones.filter(
      (cotizacion) =>
        cotizacion.estado === "Enviada"
    ).length;

  const totalRevisadas =
    cotizaciones.filter(
      (cotizacion) =>
        cotizacion.estado === "Revisada"
    ).length;

  const totalAprobadas =
    cotizaciones.filter(
      (cotizacion) =>
        cotizacion.estado === "Aprobada" ||
        cotizacion.estado === "Aceptada"
    ).length;

  const totalRechazadas =
    cotizaciones.filter(
      (cotizacion) =>
        cotizacion.estado === "Rechazada"
    ).length;

  return (
    <div className="cliente-panel">

      <SidebarCliente
        menuOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <main className="cliente-main">

        {/* ---------------------------------- */}
        {/* ENCABEZADO */}
        {/* ---------------------------------- */}

        <section className="cotizaciones-heading">

          <div>

            <h2>
              Mis cotizaciones
            </h2>

            <p>
              Consultá, filtrá y gestioná todas tus
              cotizaciones desde un solo lugar.
            </p>

          </div>

        </section>

        {/* ---------------------------------- */}
        {/* ESTADÍSTICAS */}
        {/* ---------------------------------- */}

        <section className="cotizaciones-stats">

          <StatCard
            icon={<FileText size={24} />}
            value={cotizaciones.length.toString()}
            label="Total cotizaciones"
            variant="blue"
          />

          <StatCard
            icon={<Clock3 size={24} />}
            value={totalPendientes.toString()}
            label="Pendientes"
            variant="orange"
          />

          <StatCard
            icon={<Send size={24} />}
            value={totalEnviadas.toString()}
            label="Enviadas"
            variant="blue"
          />

          <StatCard
            icon={<ClipboardCheck size={24} />}
            value={totalRevisadas.toString()}
            label="Revisadas"
            variant="purple"
          />

          <StatCard
            icon={<CircleCheck size={24} />}
            value={totalAprobadas.toString()}
            label="Aprobadas"
            variant="green"
          />

          <StatCard
            icon={<CircleX size={24} />}
            value={totalRechazadas.toString()}
            label="Rechazadas"
            variant="red"
          />

        </section>

        {/* ---------------------------------- */}
        {/* FILTROS */}
        {/* ---------------------------------- */}

        <section className="cotizaciones-filters">

          <label className="cotizaciones-search">

            <Search size={19} />

            <input
              type="search"
              placeholder="Buscar cotización..."
              value={busqueda}
              onChange={(event) =>
                setBusqueda(event.target.value)
              }
            />

          </label>

          <button
            type="button"
            className="filter-button"
          >
            Todos los tipos
            <ChevronDown size={17} />
          </button>

          <button
            type="button"
            className="filter-button"
          >
            Todos los estados
            <ChevronDown size={17} />
          </button>

          <button
            type="button"
            className="filter-button date-filter"
          >
            <CalendarDays size={18} />
            Fecha: más reciente
          </button>

        </section>

        {/* ---------------------------------- */}
        {/* CARGANDO */}
        {/* ---------------------------------- */}

        {cargando && (
          <section className="cotizaciones-feedback">

            <p>
              Cargando cotizaciones...
            </p>

          </section>
        )}

        {/* ---------------------------------- */}
        {/* ERROR */}
        {/* ---------------------------------- */}

        {!cargando && error && (
          <section className="cotizaciones-feedback">

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={obtenerCotizaciones}
            >
              Volver a intentar
            </button>

          </section>
        )}

        {/* ---------------------------------- */}
        {/* TABLA */}
        {/* ---------------------------------- */}

        {!cargando &&
          !error &&
          cotizacionesFiltradas.length > 0 && (

            <section className="cotizaciones-table-card">

              <div className="cotizaciones-table-wrapper">

                <table className="cotizaciones-table">

                  <thead>

                    <tr>

                      <th>
                        Cotización
                      </th>

                      <th>
                        Fecha
                      </th>

                      <th>
                        Tipo de obra
                      </th>

                      <th>
                        Superficie
                      </th>

                      <th>
                        Estado
                      </th>

                      <th>
                        Precio estimado
                      </th>

                      <th>
                        Acciones
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {cotizacionesFiltradas.map(
                      (cotizacion) => (

                        <tr
                          key={
                            cotizacion.idCotizacion
                          }
                        >

                          {/* COTIZACIÓN */}

                          <td>

                            <div className="cotizacion-info">

                              <img
                                src={
                                  imagenesProyectos[
                                    cotizacion.idProyecto
                                  ] ??
                                  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200"
                                }
                                alt={
                                  cotizacion.nombreProyecto
                                }
                              />

                              <div>

                                <strong>
                                  {
                                    cotizacion.codigo
                                  }
                                </strong>

                                <span>
                                  {
                                    cotizacion.nombreProyecto
                                  }
                                </span>

                              </div>

                            </div>

                          </td>

                          {/* FECHA */}

                          <td>

                            <div className="table-double-line">

                              <strong>
                                {formatearFecha(
                                  cotizacion.fechaCreacion
                                )}
                              </strong>

                              <span>
                                {formatearHora(
                                  cotizacion.fechaCreacion
                                )}
                              </span>

                            </div>

                          </td>

                          {/* TIPO DE OBRA */}

                          <td>
                            {tiposObraProyectos[cotizacion.idProyecto] ??
                            "No especificado"}
                          </td>

                          {/* SUPERFICIE */}

                          <td>
                            {formatearSuperficie(
                              cotizacion.superficie
                            )}
                          </td>

                          {/* ESTADO */}

                          <td>

                            <EstadoBadge
                              estado={
                                cotizacion.estado
                              }
                            />

                          </td>

                          {/* PRECIO */}

                          <td className="cotizacion-precio">

                            {formatearPrecio(
                              cotizacion.precioEstimado
                            )}

                          </td>

                          {/* ACCIONES */}

                          <td>

                            <div className="cotizacion-actions">

                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `/panel-cliente/cotizaciones/${cotizacion.idCotizacion}`
                                  )
                                }
                              >

                                <Eye size={16} />

                                Ver detalle

                              </button>

                              <button
                                type="button"
                                disabled
                              >

                                <Download
                                  size={16}
                                />

                                PDF

                              </button>

                              <button
                                type="button"
                                disabled
                              >

                                <Send size={16} />

                                Enviar

                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `/panel-cliente/cotizaciones/${cotizacion.idCotizacion}/editar`
                                  )
                                }
                              >

                                <Pencil
                                  size={16}
                                />

                                Modificar

                              </button>

                            </div>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

              {/* ---------------------------------- */}
              {/* PAGINACIÓN */}
              {/* ---------------------------------- */}

              <footer className="cotizaciones-pagination">

                <span>

                  Mostrando 1 a{" "}
                  {
                    cotizacionesFiltradas.length
                  }{" "}
                  de{" "}
                  {cotizaciones.length}{" "}
                  cotizaciones

                </span>

              </footer>

            </section>

          )}

        {/* ---------------------------------- */}
        {/* SIN RESULTADOS */}
        {/* ---------------------------------- */}

        {!cargando &&
          !error &&
          cotizacionesFiltradas.length === 0 && (

            <section className="cotizaciones-feedback">

              <p>
                No se encontraron cotizaciones.
              </p>

            </section>

          )}

        {/* ---------------------------------- */}
        {/* CONSEJO */}
        {/* ---------------------------------- */}

        <aside className="cotizaciones-tip">

          <div className="tip-content">

            <div className="tip-icon">

              <Lightbulb size={25} />

            </div>

            <div>

              <strong>
                Consejo:
              </strong>

              <p>
                Las cotizaciones se generan desde
                el detalle de cada proyecto.
              </p>

            </div>

          </div>

        </aside>

      </main>

    </div>
  );
}

/* ================================================= */
/* STAT CARD */
/* ================================================= */

interface StatCardProps {
  icon: ReactNode;
  value: string;
  label: string;
  variant:
    | "blue"
    | "orange"
    | "purple"
    | "green"
    | "red";
}

function StatCard({
  icon,
  value,
  label,
  variant,
}: StatCardProps) {

  return (

    <article className="cotizacion-stat-card">

      <div
        className={`stat-icon stat-${variant}`}
      >
        {icon}
      </div>

      <div>

        <strong>
          {value}
        </strong>

        <span>
          {label}
        </span>

      </div>

    </article>
  );
}

/* ================================================= */
/* ESTADO */
/* ================================================= */

function EstadoBadge({
  estado,
}: {
  estado: EstadoCotizacion;
}) {

  const className =
    `estado-badge estado-${estado
      .toLowerCase()
      .replace("ó", "o")
      .replace(/\s+/g, "-")}`;

  return (
    <span className={className}>
      {estado}
    </span>
  );
}

/* ================================================= */
/* FORMATEAR FECHA */
/* ================================================= */

function formatearFecha(
  fecha: string
): string {

  const fechaCotizacion =
    new Date(fecha);

  if (
    Number.isNaN(
      fechaCotizacion.getTime()
    )
  ) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat(
    "es-UY",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(fechaCotizacion);
}

/* ================================================= */
/* FORMATEAR HORA */
/* ================================================= */

function formatearHora(
  fecha: string
): string {

  const fechaCotizacion =
    new Date(fecha);

  if (
    Number.isNaN(
      fechaCotizacion.getTime()
    )
  ) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "es-UY",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(fechaCotizacion);
}

/* ================================================= */
/* FORMATEAR SUPERFICIE */
/* ================================================= */

function formatearSuperficie(
  superficie: number
): string {

  return `${Number(superficie).toFixed(2)} m²`;
}

/* ================================================= */
/* FORMATEAR PRECIO */
/* ================================================= */

function formatearPrecio(
  precio: number | null
): string {

  if (precio === null) {
    return "Sin calcular";
  }

  return new Intl.NumberFormat(
    "es-UY",
    {
      style: "currency",
      currency: "UYU",
      maximumFractionDigits: 0,
    }
  ).format(precio);
}