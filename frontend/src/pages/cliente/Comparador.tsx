import { useState } from "react";
import {
  Plus,
  Scale,
  Sparkles,
  Check,
  Minus,
  Building2,
  Star,
  BrainCircuit,
  ChevronDown,
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

export default function Comparador() {
  const [menuOpen, setMenuOpen] = useState(false);

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
          key={`${label}-${value}`}
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