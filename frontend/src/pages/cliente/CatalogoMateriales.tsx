import { useState } from "react";
import {
  Search,
  ChevronDown,
  SlidersHorizontal,
  Heart,
  Plus,
  Star,
  Hammer,
  ShieldCheck,
  Droplets,
  Sparkles,
} from "lucide-react";

import SidebarCliente from "../../components/cliente/SidebarCliente";


import "../../styles/PanelClienteContenido.css";
import "../../styles/CatalogoMateriales.css";

type CategoriaMaterial =
  | "Maderas"
  | "Pisos"
  | "Revestimientos"
  | "Cubiertas"
  | "Aberturas";

interface Material {
  id: number;
  nombre: string;
  categoria: CategoriaMaterial;
  imagen: string;
  descripcion: string;
  precio: string;
  unidad: string;
  durabilidad: string;
  mantenimiento: string;
  disponibilidad: string;
  destacado?: boolean;
}

const materiales: Material[] = [
  {
    id: 1,
    nombre: "Madera de pino tratada",
    categoria: "Maderas",
    imagen:
      "https://images.unsplash.com/photo-1531835551805-16d864c8d311?w=700",
    descripcion:
      "Madera tratada para estructuras, pérgolas y terminaciones exteriores.",
    precio: "$ 1.250",
    unidad: "por metro",
    durabilidad: "Alta",
    mantenimiento: "Medio",
    disponibilidad: "Disponible",
    destacado: true,
  },
  {
    id: 2,
    nombre: "Porcelanato gris",
    categoria: "Pisos",
    imagen:
      "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=700",
    descripcion:
      "Piso resistente de estilo moderno, ideal para interiores y galerías.",
    precio: "$ 1.890",
    unidad: "por m²",
    durabilidad: "Muy alta",
    mantenimiento: "Bajo",
    disponibilidad: "Disponible",
  },
  {
    id: 3,
    nombre: "Panel PVC símil madera",
    categoria: "Revestimientos",
    imagen:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=700",
    descripcion:
      "Revestimiento liviano y decorativo con instalación rápida.",
    precio: "$ 2.450",
    unidad: "por panel",
    durabilidad: "Alta",
    mantenimiento: "Bajo",
    disponibilidad: "Disponible",
  },
  {
    id: 4,
    nombre: "Chapa trapezoidal",
    categoria: "Cubiertas",
    imagen:
      "https://images.unsplash.com/photo-1632759145351-1d592919f522?w=700",
    descripcion:
      "Cubierta metálica para techos de quinchos, depósitos y ampliaciones.",
    precio: "$ 980",
    unidad: "por metro",
    durabilidad: "Alta",
    mantenimiento: "Bajo",
    disponibilidad: "Stock limitado",
  },
  {
    id: 5,
    nombre: "Ventana de aluminio",
    categoria: "Aberturas",
    imagen:
      "https://images.unsplash.com/photo-1600566753051-f0b89df2dd90?w=700",
    descripcion:
      "Abertura corrediza de aluminio con vidrio transparente.",
    precio: "$ 8.900",
    unidad: "por unidad",
    durabilidad: "Muy alta",
    mantenimiento: "Bajo",
    disponibilidad: "A pedido",
  },
  {
    id: 6,
    nombre: "Deck de madera",
    categoria: "Maderas",
    imagen:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=700",
    descripcion:
      "Solución estética para terrazas, piscinas y espacios exteriores.",
    precio: "$ 3.200",
    unidad: "por m²",
    durabilidad: "Alta",
    mantenimiento: "Medio",
    disponibilidad: "Disponible",
  },
];

export default function CatalogoMateriales() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const materialesFiltrados = materiales.filter((material) => {
    const contenido = `${material.nombre} ${material.categoria} ${material.descripcion}`;

    return contenido.toLowerCase().includes(busqueda.toLowerCase());
  });

  return (
    <div className="cliente-panel">
      <SidebarCliente
        menuOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <main className="cliente-main">

        <section className="catalogo-heading">
          <div>
            <h2>Materiales disponibles</h2>
            <p>
              Explorá materiales, compará características y agregalos a tus proyectos.
            </p>
          </div>

          <button type="button" className="catalogo-filter-main">
            <SlidersHorizontal size={18} />
            Filtros avanzados
          </button>
        </section>

        <section className="catalogo-categories">
          <Categoria
            icon={<Hammer size={23} />}
            title="Maderas"
            total="18 materiales"
            variant="green"
          />

          <Categoria
            icon={<Sparkles size={23} />}
            title="Pisos"
            total="24 materiales"
            variant="blue"
          />

          <Categoria
            icon={<ShieldCheck size={23} />}
            title="Revestimientos"
            total="16 materiales"
            variant="purple"
          />

          <Categoria
            icon={<Droplets size={23} />}
            title="Cubiertas"
            total="12 materiales"
            variant="orange"
          />
        </section>

        <section className="catalogo-filters">
          <label className="catalogo-search">
            <Search size={19} />

            <input
              type="search"
              placeholder="Buscar material..."
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
            />
          </label>

          <button type="button" className="catalogo-filter-button">
            Todas las categorías
            <ChevronDown size={17} />
          </button>

          <button type="button" className="catalogo-filter-button">
            Todos los precios
            <ChevronDown size={17} />
          </button>

          <button type="button" className="catalogo-filter-button">
            Ordenar por relevancia
            <ChevronDown size={17} />
          </button>
        </section>

        <section className="materiales-grid">
          {materialesFiltrados.map((material) => (
            <article className="material-card" key={material.id}>
              <div className="material-image">
                <img src={material.imagen} alt={material.nombre} />

                {material.destacado && (
                  <span className="material-featured">
                    <Star size={13} />
                    Destacado
                  </span>
                )}

                <button
                  type="button"
                  className="material-favorite"
                  aria-label={`Agregar ${material.nombre} a favoritos`}
                >
                  <Heart size={19} />
                </button>
              </div>

              <div className="material-content">
                <span className="material-category">
                  {material.categoria}
                </span>

                <h3>{material.nombre}</h3>
                <p className="material-description">
                  {material.descripcion}
                </p>

                <div className="material-price">
                  <strong>{material.precio}</strong>
                  <span>{material.unidad}</span>
                </div>

                <div className="material-properties">
                  <div>
                    <span>Durabilidad</span>
                    <strong>{material.durabilidad}</strong>
                  </div>

                  <div>
                    <span>Mantenimiento</span>
                    <strong>{material.mantenimiento}</strong>
                  </div>
                </div>

                <div className="material-footer">
                  <span
                    className={`material-stock ${
                      material.disponibilidad === "Disponible"
                        ? "available"
                        : "limited"
                    }`}
                  >
                    {material.disponibilidad}
                  </span>

                  <button type="button">
                    <Plus size={17} />
                    Agregar al proyecto
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        <footer className="catalogo-results">
          Mostrando {materialesFiltrados.length} de {materiales.length} materiales
        </footer>
      </main>
    </div>
  );
}

interface CategoriaProps {
  icon: React.ReactNode;
  title: string;
  total: string;
  variant: "green" | "blue" | "purple" | "orange";
}

function Categoria({
  icon,
  title,
  total,
  variant,
}: CategoriaProps) {
  return (
    <article className="catalogo-category-card">
      <div className={`category-icon category-${variant}`}>
        {icon}
      </div>

      <div>
        <strong>{title}</strong>
        <span>{total}</span>
      </div>
    </article>
  );
}