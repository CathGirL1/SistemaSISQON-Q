




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
  Plus,
  Sparkles,
  BrainCircuit,
  Check,
  Minus,
  Star,
} from "lucide-react";

import SidebarCliente from "../../components/cliente/SidebarCliente";



import "../../styles/PanelClienteContenido.css";
import "../../styles/Comparador.css";


interface OpcionComparacion {
  id: number;
  nombre: string;
  tipo: "Económica" | "Estándar" | "Premium";
  material: string;
  precio: string;
  precioM2: string;
  durabilidad: string;
  mantenimiento: string;
  resistencia: string;
  garantia: string;
  instalacion: string;
  disponibilidad: string;
  recomendada?: boolean;
}

const opciones: OpcionComparacion[] = [
  {
    id: 1,
    nombre: "Opción económica",
    tipo: "Económica",
    material: "Pino tratado",
    precio: "$ 2.850.000",
    precioM2: "$ 95.000",
    durabilidad: "Media",
    mantenimiento: "Alto",
    resistencia: "Buena",
    garantia: "5 años",
    instalacion: "3 a 5 días",
    disponibilidad: "Inmediata",
  },
  {
    id: 2,
    nombre: "Mejor relación",
    tipo: "Estándar",
    material: "Eucalipto tratado",
    precio: "$ 4.250.000",
    precioM2: "$ 141.600",
    durabilidad: "Alta",
    mantenimiento: "Medio",
    resistencia: "Muy buena",
    garantia: "10 años",
    instalacion: "5 a 7 días",
    disponibilidad: "Inmediata",
    recomendada: true,
  },
  {
    id: 3,
    nombre: "Opción premium",
    tipo: "Premium",
    material: "Madera lapacho",
    precio: "$ 6.980.000",
    precioM2: "$ 232.600",
    durabilidad: "Muy alta",
    mantenimiento: "Bajo",
    resistencia: "Excelente",
    garantia: "15 años",
    instalacion: "7 a 10 días",
    disponibilidad: "A pedido",
  },
];


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

       

        <section className="comparador-heading">
          <div>
            <h2>Comparación del proyecto</h2>
            <p>
              Compará costos, materiales y características para elegir la mejor opción.
            </p>
          </div>

          <div className="comparador-heading-actions">
            <button type="button" className="comparador-project-select">
              Quincho familiar
              <ChevronDown size={17} />
            </button>

            <button type="button" className="comparador-new-button">
              <Plus size={19} />
              Nueva comparación
            </button>
          </div>
        </section>

        <section className="comparador-stats">
          <article className="comparador-stat-card">
            <div className="comparador-stat-icon blue">
              <Scale size={23} />
            </div>

            <div>
              <strong>3</strong>
              <span>Opciones comparadas</span>
            </div>
          </article>

          <article className="comparador-stat-card">
            <div className="comparador-stat-icon purple">
              <Sparkles size={23} />
            </div>

            <div>
              <strong>9</strong>
              <span>Características evaluadas</span>
            </div>
          </article>

          <article className="comparador-stat-card">
            <div className="comparador-stat-icon green">
              <BrainCircuit size={23} />
            </div>

            <div>
              <strong>Estándar</strong>
              <span>Recomendación de la IA</span>
            </div>
          </article>
        </section>

        <section className="comparison-card">
          <div className="comparison-table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th className="comparison-feature-title">
                    Características
                  </th>

                  {opciones.map((opcion) => (
                    <th
                      key={opcion.id}
                      className={opcion.recomendada ? "recommended-column" : ""}
                    >
                      {opcion.recomendada && (
                        <span className="recommended-label">
                          <Sparkles size={13} />
                          Recomendada
                        </span>
                      )}

                      <span
                        className={`comparison-type type-${opcion.tipo.toLowerCase()}`}
                      >
                        {opcion.tipo}
                      </span>

                      <h3>{opcion.nombre}</h3>
                      <p>{opcion.material}</p>
                      <strong className="comparison-price">
                        {opcion.precio}
                      </strong>
                      <span className="comparison-price-m2">
                        {opcion.precioM2} por m²
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                <ComparisonRow
                  label="Material principal"
                  values={opciones.map((opcion) => opcion.material)}
                />

                <ComparisonRow
                  label="Durabilidad"
                  values={opciones.map((opcion) => opcion.durabilidad)}
                />

                <ComparisonRow
                  label="Mantenimiento"
                  values={opciones.map((opcion) => opcion.mantenimiento)}
                />

                <ComparisonRow
                  label="Resistencia"
                  values={opciones.map((opcion) => opcion.resistencia)}
                />

                <ComparisonRow
                  label="Garantía"
                  values={opciones.map((opcion) => opcion.garantia)}
                />

                <ComparisonRow
                  label="Tiempo de instalación"
                  values={opciones.map((opcion) => opcion.instalacion)}
                />

                <ComparisonRow
                  label="Disponibilidad"
                  values={opciones.map((opcion) => opcion.disponibilidad)}
                />

                <tr>
                  <td className="comparison-row-label">
                    Valoración general
                  </td>

                  <td>
                    <Rating value={3} />
                  </td>

                  <td className="recommended-column">
                    <Rating value={4} />
                  </td>

                  <td>
                    <Rating value={5} />
                  </td>
                </tr>

                <tr className="comparison-actions-row">
                  <td />

                  {opciones.map((opcion) => (
                    <td
                      key={opcion.id}
                      className={opcion.recomendada ? "recommended-column" : ""}
                    >
                      <button
                        type="button"
                        className={
                          opcion.recomendada
                            ? "select-option-button recommended"
                            : "select-option-button"
                        }
                      >
                        {opcion.recomendada ? (
                          <>
                            <Check size={17} />
                            Seleccionar opción
                          </>
                        ) : (
                          "Seleccionar opción"
                        )}
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="ia-recommendation">
          <div className="ia-recommendation-main">
            <div className="ia-recommendation-icon">
              <BrainCircuit size={29} />
            </div>

            <div>
              <span className="ia-label">ANÁLISIS DE LA IA</span>
              <h3>Te recomendamos la opción Estándar</h3>
              <p>
                Presenta la mejor relación entre precio, durabilidad y
                mantenimiento para un quincho familiar de 30 m².
              </p>
            </div>
          </div>

          <div className="ia-reasons">
            <RecommendationItem text="Buen equilibrio entre costo y calidad." />
            <RecommendationItem text="Menor mantenimiento que la opción económica." />
            <RecommendationItem text="Disponibilidad inmediata en varias empresas." />
            <RecommendationItem text="Garantía adecuada para el tipo de proyecto." />
          </div>

          <button type="button" className="ia-analysis-button">
            Ver análisis completo
          </button>
        </section>

        <section className="comparison-companies">
          <div className="comparison-section-header">
            <div>
              <h3>Empresas que trabajan esta opción</h3>
              <p>
                Empresas disponibles para solicitar un presupuesto definitivo.
              </p>
            </div>

            <button type="button">Ver todas</button>
          </div>

          <div className="comparison-companies-grid">
            <CompanyCard
              initials="ABC"
              name="Constructora ABC"
              category="Quinchos y terrazas"
              rating="4.8"
              projects="42 proyectos"
            />

            <CompanyCard
              initials="CN"
              name="Construcciones del Norte"
              category="Construcción general"
              rating="4.6"
              projects="35 proyectos"
            />

            <CompanyCard
              initials="HC"
              name="Hogar Construcciones"
              category="Remodelaciones"
              rating="4.5"
              projects="28 proyectos"
            />
          </div>
        </section>


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


interface ComparisonRowProps {
  label: string;
  values: string[];
}

function ComparisonRow({
  label,
  values,
}: ComparisonRowProps) {
  return (
    <tr>
      <td className="comparison-row-label">{label}</td>

      {values.map((value, index) => (
        <td
          key={`${label}-${value}-${index}`}
          className={index === 1 ? "recommended-column" : ""}
        >
          {value}
        </td>
      ))}
    </tr>
  );
}

function Rating({ value }: { value: number }) {
  return (
    <div className="comparison-rating">
      {Array.from({ length: 5 }).map((_, index) =>
        index < value ? (
          <Star key={index} size={16} fill="currentColor" />
        ) : (
          <Minus key={index} size={16} />
        ),
      )}
    </div>
  );
}

function RecommendationItem({ text }: { text: string }) {
  return (
    <div className="ia-reason-item">
      <Check size={17} />
      <span>{text}</span>
    </div>
  );
}

interface CompanyCardProps {
  initials: string;
  name: string;
  category: string;
  rating: string;
  projects: string;
}

function CompanyCard({
  initials,
  name,
  category,
  rating,
  projects,
}: CompanyCardProps) {
  return (
    <article className="comparison-company-card">
      <div className="comparison-company-logo">
        {initials}
      </div>

      <div className="comparison-company-info">
        <h4>{name}</h4>
        <span>{category}</span>

        <div className="comparison-company-meta">
          <strong>
            <Star size={14} fill="currentColor" />
            {rating}
          </strong>

          <span>{projects}</span>
        </div>
      </div>

      <button type="button">
        <Building2 size={16} />
        Solicitar presupuesto
      </button>
    </article>
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
