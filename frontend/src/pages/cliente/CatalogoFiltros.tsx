import {
  Search,
  Hammer,
  Sparkles,
  ShieldCheck,
  Droplets,
  Package,
  Wrench,
  Mountain,
  Home,
  Paintbrush,
} from "lucide-react";

import "../../styles/CatalogoFiltros.css";

interface MaterialCategoria {
  categoria: string;
}

interface CatalogoFiltrosProps {
  materiales: MaterialCategoria[];

  busqueda: string;
  setBusqueda: React.Dispatch<React.SetStateAction<string>>;

  categoriaSeleccionada: string;
  setCategoriaSeleccionada: React.Dispatch<React.SetStateAction<string>>;

  precioSeleccionado: string;
  setPrecioSeleccionado: React.Dispatch<React.SetStateAction<string>>;

  ordenSeleccionado: string;
  setOrdenSeleccionado: React.Dispatch<React.SetStateAction<string>>;

  categorias: string[];
}

interface CategoriaProps {
  icon: React.ReactNode;
  title: string;
  total: string;
  variant:
    | "green"
    | "blue"
    | "purple"
    | "orange"
    | "gray"
    | "red"
    | "yellow"
    | "indigo"
    | "pink";
}

export default function CatalogoFiltros({
  materiales,

  busqueda,
  setBusqueda,

  categoriaSeleccionada,
  setCategoriaSeleccionada,

  precioSeleccionado,
  setPrecioSeleccionado,

  ordenSeleccionado,
  setOrdenSeleccionado,

  categorias,
}: CatalogoFiltrosProps) {
  const cantidadPorCategoria = materiales.reduce(
    (categorias, material) => {
      const nombreCategoria = material.categoria;

      if (!categorias[nombreCategoria]) {
        categorias[nombreCategoria] = 0;
      }

      categorias[nombreCategoria]++;

      return categorias;
    },
    {} as Record<string, number>
  );

  const iconos = {
    Maderas: <Hammer size={23} />,
    Pisos: <Sparkles size={23} />,
    Revestimientos: <ShieldCheck size={23} />,
    Cubiertas: <Droplets size={23} />,
    Cementos: <Package size={23} />,
    Hierros: <Wrench size={23} />,
    Áridos: <Mountain size={23} />,
    Techos: <Home size={23} />,
    Terminaciones: <Paintbrush size={23} />,
  };

  const colores = {
    Maderas: "green",
    Pisos: "blue",
    Revestimientos: "purple",
    Cubiertas: "orange",
    Cementos: "gray",
    Hierros: "red",
    Áridos: "yellow",
    Techos: "indigo",
    Terminaciones: "pink",
  } as const;

  return (
    <>
      <section className="catalogo-categories">
        {Object.entries(cantidadPorCategoria).map(
          ([categoria, cantidad]) => (
            <Categoria
              key={categoria}
              icon={
                iconos[categoria as keyof typeof iconos] ?? (
                  <Package size={23} />
                )
              }
              title={categoria}
              total={`${cantidad} materiales`}
              variant={
                colores[categoria as keyof typeof colores] ??
                "gray"
              }
            />
          )
        )}
      </section>

      <section className="catalogo-filters">
        <label className="catalogo-search">
          <Search size={19} />

          <input
            type="search"
            placeholder="Buscar material..."
            value={busqueda}
            onChange={(event) =>
              setBusqueda(event.target.value)
            }
          />
        </label>

        <select
          className="catalogo-filter-button"
          value={categoriaSeleccionada}
          onChange={(e) =>
            setCategoriaSeleccionada(e.target.value)
          }
        >
          {categorias.map((categoria) => (
            <option key={categoria} value={categoria}>
              {categoria}
            </option>
          ))}
        </select>

        <select
          className="catalogo-filter-button"
          value={precioSeleccionado}
          onChange={(e) =>
            setPrecioSeleccionado(e.target.value)
          }
        >
          <option value="Todos">Todos los precios</option>
          <option value="0-500">$0 - $500</option>
          <option value="500-1000">$500 - $1000</option>
          <option value="1000+">Más de $1000</option>
        </select>

        <select
          className="catalogo-filter-button"
          value={ordenSeleccionado}
          onChange={(e) =>
            setOrdenSeleccionado(e.target.value)
          }
        >
          <option value="Relevancia">
            Ordenar por relevancia
          </option>
          <option value="Nombre">
            Nombre (A-Z)
          </option>
          <option value="PrecioAsc">
            Precio: menor a mayor
          </option>
          <option value="PrecioDesc">
            Precio: mayor a menor
          </option>
        </select>
      </section>
    </>
  );
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