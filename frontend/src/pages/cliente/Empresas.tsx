import { useState } from "react";
import {
  Search,
  ChevronDown,
  MapPin,
  Star,
  Heart,
  Building2,
  BriefcaseBusiness,
  ShieldCheck,
  Send,
  Eye,
  SlidersHorizontal,
} from "lucide-react";

import SidebarCliente from "../../components/cliente/SidebarCliente";



import "../../styles/PanelClienteContenido.css";
import "../../styles/EmpresasCliente.css";

interface Empresa {
  id: number;
  nombre: string;
  iniciales: string;
  especialidad: string;
  ubicacion: string;
  descripcion: string;
  calificacion: string;
  reseñas: number;
  proyectos: number;
  experiencia: string;
  verificada: boolean;
  disponible: boolean;
  imagen: string;
  servicios: string[];
}

const empresas: Empresa[] = [
  {
    id: 1,
    nombre: "Constructora ABC",
    iniciales: "ABC",
    especialidad: "Quinchos y terrazas",
    ubicacion: "Maldonado, Uruguay",
    descripcion:
      "Empresa especializada en quinchos, barbacoas, pérgolas y espacios exteriores.",
    calificacion: "4.8",
    reseñas: 42,
    proyectos: 68,
    experiencia: "12 años",
    verificada: true,
    disponible: true,
    imagen:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900",
    servicios: ["Quinchos", "Terrazas", "Pérgolas"],
  },
  {
    id: 2,
    nombre: "Construcciones del Norte",
    iniciales: "CN",
    especialidad: "Construcción general",
    ubicacion: "Canelones, Uruguay",
    descripcion:
      "Construcción de viviendas, ampliaciones y obras de mediana escala.",
    calificacion: "4.6",
    reseñas: 35,
    proyectos: 54,
    experiencia: "9 años",
    verificada: true,
    disponible: true,
    imagen:
      "https://images.unsplash.com/photo-1541971875076-8f970d573be6?w=900",
    servicios: ["Viviendas", "Ampliaciones", "Obra nueva"],
  },
  {
    id: 3,
    nombre: "Hogar Construcciones",
    iniciales: "HC",
    especialidad: "Remodelaciones",
    ubicacion: "Montevideo, Uruguay",
    descripcion:
      "Reformas de cocinas, baños, interiores y mejoras integrales del hogar.",
    calificacion: "4.5",
    reseñas: 28,
    proyectos: 41,
    experiencia: "7 años",
    verificada: true,
    disponible: false,
    imagen:
      "https://images.unsplash.com/photo-1523413363574-c30aa1c2a516?w=900",
    servicios: ["Cocinas", "Baños", "Interiores"],
  },
  {
    id: 4,
    nombre: "Obras y Servicios SRL",
    iniciales: "OS",
    especialidad: "Obras integrales",
    ubicacion: "Punta del Este, Uruguay",
    descripcion:
      "Soluciones completas de construcción, mantenimiento y terminaciones.",
    calificacion: "4.3",
    reseñas: 21,
    proyectos: 37,
    experiencia: "10 años",
    verificada: true,
    disponible: true,
    imagen:
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=900",
    servicios: ["Construcción", "Mantenimiento", "Terminaciones"],
  },
  {
    id: 5,
    nombre: "Madera Sur",
    iniciales: "MS",
    especialidad: "Estructuras de madera",
    ubicacion: "Rocha, Uruguay",
    descripcion:
      "Diseño y construcción de decks, pérgolas, techos y estructuras de madera.",
    calificacion: "4.7",
    reseñas: 31,
    proyectos: 46,
    experiencia: "8 años",
    verificada: true,
    disponible: true,
    imagen:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=900",
    servicios: ["Decks", "Pérgolas", "Madera"],
  },
  {
    id: 6,
    nombre: "Estudio Obra Moderna",
    iniciales: "EOM",
    especialidad: "Arquitectura y diseño",
    ubicacion: "Maldonado, Uruguay",
    descripcion:
      "Proyectos modernos con asesoramiento arquitectónico y ejecución de obra.",
    calificacion: "4.9",
    reseñas: 48,
    proyectos: 59,
    experiencia: "11 años",
    verificada: true,
    disponible: false,
    imagen:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900",
    servicios: ["Diseño", "Arquitectura", "Dirección de obra"],
  },
];

export default function Empresas() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [favoritas, setFavoritas] = useState<number[]>([1, 5]);

  const empresasFiltradas = empresas.filter((empresa) => {
    const texto = `${empresa.nombre} ${empresa.especialidad} ${empresa.ubicacion} ${empresa.servicios.join(
      " ",
    )}`;

    return texto.toLowerCase().includes(busqueda.toLowerCase());
  });

  const alternarFavorita = (id: number) => {
    setFavoritas((actuales) =>
      actuales.includes(id)
        ? actuales.filter((empresaId) => empresaId !== id)
        : [...actuales, id],
    );
  };

  return (
    <div className="cliente-panel">
      <SidebarCliente
        menuOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <main className="cliente-main">


        <section className="empresas-heading">
          <div>
            <h2>Empresas disponibles</h2>
            <p>
              Compará experiencia, especialidades y calificaciones antes de
              solicitar una cotización.
            </p>
          </div>

          <button type="button" className="empresas-filters-button">
            <SlidersHorizontal size={18} />
            Filtros avanzados
          </button>
        </section>

        <section className="empresas-stats">
          <EmpresaStat
            icon={<Building2 size={23} />}
            value="28"
            label="Empresas registradas"
            variant="blue"
          />

          <EmpresaStat
            icon={<ShieldCheck size={23} />}
            value="24"
            label="Empresas verificadas"
            variant="green"
          />

          <EmpresaStat
            icon={<BriefcaseBusiness size={23} />}
            value="186"
            label="Proyectos realizados"
            variant="purple"
          />

          <EmpresaStat
            icon={<Star size={23} />}
            value="4.7"
            label="Calificación promedio"
            variant="orange"
          />
        </section>

        <section className="empresas-toolbar">
          <label className="empresas-search">
            <Search size={19} />

            <input
              type="search"
              placeholder="Buscar empresa, especialidad o ubicación..."
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
            />
          </label>

          <button type="button" className="empresa-filter-button">
            Todas las especialidades
            <ChevronDown size={17} />
          </button>

          <button type="button" className="empresa-filter-button">
            Todas las ubicaciones
            <ChevronDown size={17} />
          </button>

          <button type="button" className="empresa-filter-button">
            Mejor calificadas
            <ChevronDown size={17} />
          </button>
        </section>

        <section className="empresas-grid">
          {empresasFiltradas.map((empresa) => {
            const esFavorita = favoritas.includes(empresa.id);

            return (
              <article className="empresa-card" key={empresa.id}>
                <div className="empresa-cover">
                  <img src={empresa.imagen} alt={empresa.nombre} />

                  {empresa.verificada && (
                    <span className="empresa-verified">
                      <ShieldCheck size={14} />
                      Verificada
                    </span>
                  )}

                  <button
                    type="button"
                    className={`empresa-favorite ${
                      esFavorita ? "active" : ""
                    }`}
                    onClick={() => alternarFavorita(empresa.id)}
                    aria-label={
                      esFavorita
                        ? `Quitar ${empresa.nombre} de favoritas`
                        : `Agregar ${empresa.nombre} a favoritas`
                    }
                  >
                    <Heart
                      size={19}
                      fill={esFavorita ? "currentColor" : "none"}
                    />
                  </button>
                </div>

                <div className="empresa-card-body">
                  <div className="empresa-identity">
                    <div className="empresa-logo">
                      {empresa.iniciales}
                    </div>

                    <div>
                      <h3>{empresa.nombre}</h3>
                      <span>{empresa.especialidad}</span>
                    </div>
                  </div>

                  <div className="empresa-location">
                    <MapPin size={15} />
                    <span>{empresa.ubicacion}</span>
                  </div>

                  <p className="empresa-description">
                    {empresa.descripcion}
                  </p>

                  <div className="empresa-services">
                    {empresa.servicios.map((servicio) => (
                      <span key={servicio}>{servicio}</span>
                    ))}
                  </div>

                  <div className="empresa-metrics">
                    <div>
                      <span>Calificación</span>
                      <strong className="empresa-rating">
                        <Star size={15} fill="currentColor" />
                        {empresa.calificacion}
                        <small>({empresa.reseñas})</small>
                      </strong>
                    </div>

                    <div>
                      <span>Proyectos</span>
                      <strong>{empresa.proyectos}</strong>
                    </div>

                    <div>
                      <span>Experiencia</span>
                      <strong>{empresa.experiencia}</strong>
                    </div>
                  </div>

                  <div className="empresa-availability">
                    <span
                      className={
                        empresa.disponible
                          ? "availability-dot available"
                          : "availability-dot unavailable"
                      }
                    />

                    {empresa.disponible
                      ? "Disponible para nuevos proyectos"
                      : "Agenda completa temporalmente"}
                  </div>

                  <div className="empresa-actions">
                    <button type="button">
                      <Eye size={16} />
                      Ver perfil
                    </button>

                    <button
                      type="button"
                      className="empresa-primary-action"
                      disabled={!empresa.disponible}
                    >
                      <Send size={16} />
                      Solicitar cotización
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <footer className="empresas-results">
          Mostrando {empresasFiltradas.length} de {empresas.length} empresas
        </footer>
      </main>
    </div>
  );
}

interface EmpresaStatProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  variant: "blue" | "green" | "purple" | "orange";
}

function EmpresaStat({
  icon,
  value,
  label,
  variant,
}: EmpresaStatProps) {
  return (
    <article className="empresa-stat-card">
      <div className={`empresa-stat-icon empresa-stat-${variant}`}>
        {icon}
      </div>

      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </article>
  );
}