import { useEffect, useState } from "react";

import {
  Search,
  ChevronDown,
  SlidersHorizontal,
  Star,
  Hammer,
  ShieldCheck,
  Droplets,
  Sparkles,
  Building2
} from "lucide-react";

import SidebarCliente from "../../components/cliente/SidebarCliente";

import "../../styles/PanelClienteContenido.css";
import "../../styles/CatalogoMateriales.css";

import { obtenerMateriales } from "../../services/materialService";

interface Material {
  id: string;

  nombre: string;
  categoria: string;
  descripcion: string;

  imagen: string;

  precio: string;
  unidad: string;

  disponibilidad: string;

  empresaNombre: string;
  idEmpresa: number;

  durabilidad: string;
  mantenimiento: string;

  destacado?: boolean;
}

export default function CatalogoMateriales() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const [materiales, setMateriales] = useState<Material[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarMateriales();
  }, []);

  const cargarMateriales = async () => {
    try {
      setCargando(true);
      setError("");

      const materialesEmpresa = await obtenerMateriales();

      const materialesAdaptados: Material[] =
        materialesEmpresa.map((material) => ({
          id: material.id,

          nombre: material.nombre,
          categoria: material.categoria,
          descripcion: material.descripcion,

          imagen:
            material.imagenUrl,

          precio: material.precioActual,
          unidad: material.unidad,

          disponibilidad: material.disponibilidad,

          empresaNombre: material.empresaNombre,
          idEmpresa: material.idEmpresa,

          durabilidad: "Alta",
          mantenimiento: "Bajo",

          destacado: false,
        }));

      setMateriales(materialesAdaptados);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Error al cargar materiales"
      );
    } finally {
      setCargando(false);
    }
  };

  const materialesFiltrados = materiales.filter((material) => {
    const contenido =
      `${material.nombre} ${material.categoria} ${material.descripcion}`;

    return contenido
      .toLowerCase()
      .includes(busqueda.toLowerCase());
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

        {cargando && (
            <section className="catalogo-empty">
              <p>Cargando materiales...</p>
            </section>
          )}

          {!cargando && error && (
            <section className="catalogo-empty">
              <p>{error}</p>
            </section>
          )}

          {!cargando && !error && materialesFiltrados.length === 0 && (
            <section className="catalogo-empty">
              <p>No se encontraron materiales.</p>
            </section>
          )}
        {!cargando && !error && materialesFiltrados.length > 0 && (
        <section className="materiales-grid">
          {materialesFiltrados.map((material) => (
            <article className="material-card" key={material.id}>
              <div className="material-image">
                {material.imagen ? (
                  <img
                    src={material.imagen}
                    alt={material.nombre}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="material-image-placeholder">
                    
                    <p>Sin imagen</p>
                  </div>
                )}

                {material.destacado && (
                  <span className="material-featured">
                    <Star size={13} />
                    Destacado
                  </span>
                )}

              
              </div>

              <div className="material-content">
                <span className="material-category">
                  {material.categoria}
                </span>

                <h3>{material.nombre}</h3>

                <p className="material-company">
                  <Building2 size={14} />
                  {material.empresaNombre}
                </p>

                <p className="material-description">
                  {material.descripcion || "Sin descripción"}
                </p>

                <div className="material-price">
                  <strong>{material.precio}</strong>
                  <span>por {material.unidad}</span>
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
                        : material.disponibilidad === "Stock bajo"
                        ? "warning"
                        : "out"
                    }`}

                    

                  >
                    {material.disponibilidad}
                  </span>

                </div>
              </div>
            </article>
          ))}
        </section>)}

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