import { useEffect, useState } from "react";
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
import HeaderCliente from "../../components/cliente/HeaderCliente";

import "../../styles/PanelClienteContenido.css";
import "../../styles/CatalogoMateriales.css";

interface MaterialAPI {
  idMaterial: number;
  nombre: string;
  categoria: string;
  descripcion: string | null;
  unidadMedida: string;
  precioReferencia: number | null;
  marca: string | null;
  imagen: string | null;
  activo: boolean;
}

interface Material {
  id: number;
  nombre: string;
  categoria: string;
  imagen: string;
  descripcion: string;
  precio: string;
  unidad: string;
  durabilidad: string;
  mantenimiento: string;
  disponibilidad: string | null;
  destacado: boolean;
}

export default function CatalogoMateriales() {

  const [menuOpen, setMenuOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000";

  const [materiales, setMateriales] = useState<Material[]>([]);

  useEffect(() => {
    obtenerMateriales();
  }, []);



  const obtenerMateriales = async () => {

    const response = await fetch(
      `${API_URL}/api/materiales`
    );

    const data: MaterialAPI[] =
      await response.json();

    const materialesAdaptados: Material[] =
      data.map((material) => ({

        id: material.idMaterial,

        nombre: material.nombre,

        categoria: material.categoria,

        descripcion:
          material.descripcion ?? "",

        imagen:
          material.imagen ??
          "/material-default.png",

        precio:
          material.precioReferencia
            ? `$ ${material.precioReferencia.toLocaleString("es-UY")}`
            : "Sin precio",

        unidad: material.unidadMedida,

        durabilidad: "Alta",

        mantenimiento: "Bajo",

        disponibilidad: "Disponible",

        destacado: false,
      }));

    setMateriales(materialesAdaptados);
  };

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
        <HeaderCliente
          menuOpen={menuOpen}
          onToggleMenu={() => setMenuOpen((prev) => !prev)}
        />

        <section className="catalogo-heading">
          <div>
            <h2>Materiales disponibles</h2>
            <p>
              Conocé sus precios aproximados, durabilidad y mantenimiento.
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
                    className={`material-stock ${material.disponibilidad === "Disponible"
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