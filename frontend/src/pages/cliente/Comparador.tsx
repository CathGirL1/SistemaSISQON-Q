import { useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import {
  Scale,
  Building2,
  Clock3,
  CircleCheck,
  Trophy,
  FileText,
  ArrowRight,
  Search,
  ChevronDown,
  Eye,
} from "lucide-react";

import SidebarCliente from "../../components/cliente/SidebarCliente";
import HeaderCliente from "../../components/cliente/HeaderCliente";

import "../../styles/PanelClienteContenido.css";
import "../../styles/Comparador.css";

type EstadoPropuesta =
  | "Pendiente"
  | "Recibida"
  | "Comparada"
  | "Seleccionada";

interface Propuesta {
  idPropuesta: number;
  empresa: string;
  ubicacion: string;
  precio: number;
  plazoDias: number;
  garantia: string;
  estado: EstadoPropuesta;
}

interface CotizacionSeleccionada {
  idCotizacion: number;
  codigo: string;
  nombreProyecto: string;
  estado: string;
}

/*
  Más adelante estos datos vendrán del backend.

  Por ahora dejamos el arreglo vacío para mostrar
  el estado sin propuestas.
*/
const PROPUESTAS_SIMULADAS: Propuesta[] = [];

/*
  Esta cotización también será seleccionada por el usuario
  o recibida desde una ruta cuando integremos el backend.
*/
const COTIZACION_SIMULADA: CotizacionSeleccionada = {
  idCotizacion: 7,
  codigo: "COT-2026-0007",
  nombreProyecto: "Quincho familiar",
  estado: "Esperando respuestas",
};

export default function Comparador() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [estadoSeleccionado, setEstadoSeleccionado] =
    useState("Todos");

  const propuestas = PROPUESTAS_SIMULADAS;
  const cotizacion = COTIZACION_SIMULADA;

  const propuestasFiltradas = useMemo(() => {
    const textoBusqueda = busqueda.trim().toLowerCase();

    return propuestas.filter((propuesta) => {
      const coincideBusqueda =
        !textoBusqueda ||
        propuesta.empresa.toLowerCase().includes(textoBusqueda) ||
        propuesta.ubicacion.toLowerCase().includes(textoBusqueda);

      const coincideEstado =
        estadoSeleccionado === "Todos" ||
        propuesta.estado === estadoSeleccionado;

      return coincideBusqueda && coincideEstado;
    });
  }, [busqueda, estadoSeleccionado, propuestas]);

  const totalPendientes = propuestas.filter(
    (propuesta) => propuesta.estado === "Pendiente"
  ).length;

  const totalComparadas = propuestas.filter(
    (propuesta) => propuesta.estado === "Comparada"
  ).length;

  const totalSeleccionadas = propuestas.filter(
    (propuesta) => propuesta.estado === "Seleccionada"
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
          onToggleMenu={() =>
            setMenuOpen((prev) => !prev)
          }
        />

        <section className="comparador-heading">
          <div>
            <h2>Comparador de propuestas</h2>

            <p>
              Analizá precios, plazos y garantías antes de
              seleccionar una empresa.
            </p>
          </div>

          <button
            type="button"
            className="comparador-cotizaciones-button"
            onClick={() =>
              navigate("/panel-cliente/cotizaciones")
            }
          >
            <FileText size={18} />
            Mis cotizaciones
          </button>
        </section>

        <section className="comparador-cotizacion-card">
          <div className="comparador-cotizacion-icon">
            <Scale size={27} />
          </div>

          <div className="comparador-cotizacion-content">
            <span>Cotización seleccionada</span>

            <h3>{cotizacion.nombreProyecto}</h3>

            <div className="comparador-cotizacion-data">
              <strong>{cotizacion.codigo}</strong>

              <span>{cotizacion.estado}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(
                `/panel-cliente/cotizaciones/${cotizacion.idCotizacion}`
              )
            }
          >
            Ver cotización
            <ArrowRight size={17} />
          </button>
        </section>

        <section className="comparador-stats">
          <ResumenCard
            icon={<Building2 size={23} />}
            value={propuestas.length}
            label="Propuestas recibidas"
            variant="blue"
          />

          <ResumenCard
            icon={<Clock3 size={23} />}
            value={totalPendientes}
            label="Pendientes"
            variant="orange"
          />

          <ResumenCard
            icon={<CircleCheck size={23} />}
            value={totalComparadas}
            label="Comparadas"
            variant="purple"
          />

          <ResumenCard
            icon={<Trophy size={23} />}
            value={totalSeleccionadas}
            label="Seleccionada"
            variant="green"
          />
        </section>

        {propuestas.length > 0 && (
          <section className="comparador-filters">
            <label className="comparador-search">
              <Search size={19} />

              <input
                type="search"
                placeholder="Buscar empresa..."
                value={busqueda}
                onChange={(event) =>
                  setBusqueda(event.target.value)
                }
              />
            </label>

            <label className="comparador-select">
              <select
                value={estadoSeleccionado}
                onChange={(event) =>
                  setEstadoSeleccionado(event.target.value)
                }
              >
                <option value="Todos">
                  Todos los estados
                </option>

                <option value="Pendiente">
                  Pendientes
                </option>

                <option value="Recibida">
                  Recibidas
                </option>

                <option value="Comparada">
                  Comparadas
                </option>

                <option value="Seleccionada">
                  Seleccionadas
                </option>
              </select>

              <ChevronDown size={17} />
            </label>
          </section>
        )}

        {propuestas.length === 0 ? (
          <EstadoVacio
            onIrCotizaciones={() =>
              navigate("/panel-cliente/cotizaciones")
            }
          />
        ) : (
          <section className="comparador-table-card">
            <div className="comparador-table-wrapper">
              <table className="comparador-table">
                <thead>
                  <tr>
                    <th>Empresa</th>
                    <th>Precio</th>
                    <th>Plazo estimado</th>
                    <th>Garantía</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>

                <tbody>
                  {propuestasFiltradas.map((propuesta) => (
                    <tr key={propuesta.idPropuesta}>
                      <td>
                        <div className="comparador-company">
                          <div className="comparador-company-logo">
                            <Building2 size={20} />
                          </div>

                          <div>
                            <strong>{propuesta.empresa}</strong>
                            <span>{propuesta.ubicacion}</span>
                          </div>
                        </div>
                      </td>

                      <td className="comparador-price">
                        {formatearPrecio(propuesta.precio)}
                      </td>

                      <td>
                        {propuesta.plazoDias} días
                      </td>

                      <td>{propuesta.garantia}</td>

                      <td>
                        <EstadoBadge
                          estado={propuesta.estado}
                        />
                      </td>

                      <td>
                        <button
                          type="button"
                          className="comparador-detail-button"
                        >
                          <Eye size={16} />
                          Ver propuesta
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

interface ResumenCardProps {
  icon: ReactNode;
  value: number;
  label: string;
  variant: "blue" | "orange" | "purple" | "green";
}

function ResumenCard({
  icon,
  value,
  label,
  variant,
}: ResumenCardProps) {
  return (
    <article className="comparador-stat-card">
      <div
        className={`comparador-stat-icon comparador-stat-${variant}`}
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

interface EstadoVacioProps {
  onIrCotizaciones: () => void;
}

function EstadoVacio({
  onIrCotizaciones,
}: EstadoVacioProps) {
  return (
    <section className="comparador-empty">
      <div className="comparador-empty-icon">
        <Scale size={38} />
      </div>

      <h3>Todavía no hay propuestas para comparar</h3>

      <p>
        Cuando una o más empresas respondan a tu solicitud,
        podrás comparar sus precios, plazos, garantías y
        condiciones desde esta pantalla.
      </p>

      <button type="button" onClick={onIrCotizaciones}>
        <FileText size={18} />
        Ir a Mis cotizaciones
      </button>
    </section>
  );
}

function EstadoBadge({
  estado,
}: {
  estado: EstadoPropuesta;
}) {
  const clase = `comparador-status comparador-status-${estado.toLowerCase()}`;

  return <span className={clase}>{estado}</span>;
}

function formatearPrecio(precio: number): string {
  return new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: "UYU",
    maximumFractionDigits: 0,
  }).format(precio);
}