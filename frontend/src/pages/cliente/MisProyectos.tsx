import { useState } from "react";
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

type EstadoProyecto = "Activo" | "Borrador" | "Finalizado" | "Pendiente";

interface Proyecto {
  id: number;
  nombre: string;
  ubicacion: string;
  imagen: string;
  tipo: string;
  superficie: string;
  fecha: string;
  estado: EstadoProyecto;
  cotizaciones: number;
}

const proyectos: Proyecto[] = [
  {
    id: 1,
    nombre: "Quincho familiar",
    ubicacion: "La Serena, IV Región",
    imagen:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500",
    tipo: "Quincho",
    superficie: "30 m²",
    fecha: "28 May 2024",
    estado: "Activo",
    cotizaciones: 3,
  },
  {
    id: 2,
    nombre: "Ampliación cocina",
    ubicacion: "Coquimbo, IV Región",
    imagen:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500",
    tipo: "Ampliación",
    superficie: "18 m²",
    fecha: "26 May 2024",
    estado: "Activo",
    cotizaciones: 2,
  },
  {
    id: 3,
    nombre: "Remodelación baño",
    ubicacion: "La Serena, IV Región",
    imagen:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=500",
    tipo: "Remodelación",
    superficie: "12 m²",
    fecha: "24 May 2024",
    estado: "Borrador",
    cotizaciones: 0,
  },
  {
    id: 4,
    nombre: "Terraza y pérgola",
    ubicacion: "Coquimbo, IV Región",
    imagen:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500",
    tipo: "Terraza",
    superficie: "22 m²",
    fecha: "20 May 2024",
    estado: "Pendiente",
    cotizaciones: 1,
  },
  {
    id: 5,
    nombre: "Casa Punta del Este",
    ubicacion: "Maldonado, Uruguay",
    imagen:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=500",
    tipo: "Construcción general",
    superficie: "120 m²",
    fecha: "18 May 2024",
    estado: "Finalizado",
    cotizaciones: 4,
  },
  {
    id: 6,
    nombre: "Barbacoa moderna",
    ubicacion: "Punta del Este, Uruguay",
    imagen:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=500",
    tipo: "Quincho",
    superficie: "28 m²",
    fecha: "15 May 2024",
    estado: "Activo",
    cotizaciones: 2,
  },
];

export default function MisProyectos() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const proyectosFiltrados = proyectos.filter((proyecto) => {
    const texto = `${proyecto.nombre} ${proyecto.ubicacion} ${proyecto.tipo}`;
    return texto.toLowerCase().includes(busqueda.toLowerCase());
  });

  return (
    <div className="cliente-panel">
      <SidebarCliente
        menuOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <main className="cliente-main">
        <HeaderCliente
          title="Mis proyectos"
          subtitle="Gestioná, editá y revisá todos tus proyectos."
          menuOpen={menuOpen}
          onToggleMenu={() => setMenuOpen((prev) => !prev)}
        />

        <section className="proyectos-heading">
          <div>
            <h2>Mis proyectos</h2>
            <p>
              Organizá tus proyectos y generá cotizaciones a partir de cada uno.
            </p>
          </div>

          <button type="button" className="nuevo-proyecto-button">
            <Plus size={20} />
            Crear nuevo proyecto
          </button>
        </section>

        <section className="proyectos-stats">
          <StatCard
            icon={<FolderOpen size={23} />}
            value="6"
            label="Total proyectos"
            variant="blue"
          />

          <StatCard
            icon={<CircleDashed size={23} />}
            value="3"
            label="Activos"
            variant="green"
          />

          <StatCard
            icon={<Clock3 size={23} />}
            value="1"
            label="Pendiente"
            variant="orange"
          />

          <StatCard
            icon={<CircleCheck size={23} />}
            value="1"
            label="Finalizado"
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
              onChange={(event) => setBusqueda(event.target.value)}
            />
          </label>

          <button type="button" className="proyecto-filter-button">
            Todos los tipos
            <ChevronDown size={17} />
          </button>

          <button type="button" className="proyecto-filter-button">
            Todos los estados
            <ChevronDown size={17} />
          </button>

          <button type="button" className="proyecto-filter-button">
            Más recientes
            <ChevronDown size={17} />
          </button>
        </section>

        <section className="proyectos-grid">
          {proyectosFiltrados.map((proyecto) => (
            <article className="proyecto-card" key={proyecto.id}>
              <div className="proyecto-card-image">
                <img src={proyecto.imagen} alt={proyecto.nombre} />

                <EstadoProyectoBadge estado={proyecto.estado} />

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
                    <p>{proyecto.ubicacion}</p>
                  </div>
                </div>

                <div className="proyecto-details">
                  <div>
                    <span>Tipo de obra</span>
                    <strong>{proyecto.tipo}</strong>
                  </div>

                  <div>
                    <span>Superficie</span>
                    <strong>{proyecto.superficie}</strong>
                  </div>

                  <div>
                    <span>Actualizado</span>
                    <strong>{proyecto.fecha}</strong>
                  </div>

                  <div>
                    <span>Cotizaciones</span>
                    <strong>{proyecto.cotizaciones}</strong>
                  </div>
                </div>

                <div className="proyecto-card-actions">
                  <button type="button" className="primary-action">
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
      </main>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
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
  estado: EstadoProyecto;
}) {
  const clase = `proyecto-status proyecto-status-${estado.toLowerCase()}`;

  return <span className={clase}>{estado}</span>;
}