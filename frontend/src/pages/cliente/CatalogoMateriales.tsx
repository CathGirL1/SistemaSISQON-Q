import { useEffect, useMemo, useState } from "react";
import { Star, Building2 } from "lucide-react";

import SidebarCliente from "../../components/cliente/SidebarCliente";
import CatalogoFiltros from "../cliente/CatalogoFiltros";
import PaginacionCatalogoMateriales from "../cliente/PaginacionCatalogoMateriales";

import "../../styles/PanelClienteContenido.css";
import "../../styles/CatalogoMateriales.css";

import { obtenerMateriales } from "../../services/materialService";

interface Material {
  id: string;

  nombre: string;
  categoria: string;
  descripcion: string;

  imagen: string;

  precio: number;
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

  const [materiales, setMateriales] = useState<Material[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [busqueda, setBusqueda] = useState("");

  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState("Todas");

  const [precioSeleccionado, setPrecioSeleccionado] =
    useState("Todos");

  const [ordenSeleccionado, setOrdenSeleccionado] =
    useState("Relevancia");

  const [paginaActual, setPaginaActual] = useState(1);

  const materialesPorPagina = 6;

  useEffect(() => {
    cargarMateriales();
  }, []);

  useEffect(() => {
  setPaginaActual(1);
  }, [
    busqueda,
    categoriaSeleccionada,
    precioSeleccionado,
    ordenSeleccionado,
  ]);

  const cargarMateriales = async () => {
    try {
      setCargando(true);
      setError("");

      const respuesta = await obtenerMateriales();

      const materialesAdaptados: Material[] =
        respuesta.map((material) => ({
          id: material.id,

          nombre: material.nombre,
          categoria: material.categoria,
          descripcion: material.descripcion,

          imagen: material.imagenUrl,

          precio: material.costoUnitario,
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

  const categorias = useMemo(
    () => [
      "Todas",
      ...new Set(
        materiales.map((material) => material.categoria)
      ),
    ],
    [materiales]
  );


  const materialesFiltrados = useMemo(() => {
    let resultado = [...materiales];

    // =======================
    // BUSCADOR
    // =======================

    if (busqueda.trim() !== "") {
      resultado = resultado.filter((material) => {
        const texto =
          `${material.nombre} ${material.categoria} ${material.descripcion}`
            .toLowerCase();

        return texto.includes(busqueda.toLowerCase());
      });
    }

    // =======================
    // CATEGORÍA
    // =======================

    if (categoriaSeleccionada !== "Todas") {
      resultado = resultado.filter(
        (material) => material.categoria === categoriaSeleccionada
      );
    }

    // =======================
    // PRECIO
    // =======================

    switch (precioSeleccionado) {
      case "0-500":
        resultado = resultado.filter(
          (material) => material.precio <= 500
        );
        break;

      case "500-1000":
        resultado = resultado.filter(
          (material) =>
            material.precio > 500 &&
            material.precio <= 1000
        );
        break;

      case "1000+":
        resultado = resultado.filter(
          (material) => material.precio > 1000
        );
        break;

      default:
        break;
    }

    // =======================
    // ORDEN
    // =======================

    switch (ordenSeleccionado) {
      case "Nombre":
        resultado.sort((a, b) =>
          a.nombre.localeCompare(b.nombre)
        );
        break;

      case "PrecioAsc":
        resultado.sort(
          (a, b) => a.precio - b.precio
        );
        break;

      case "PrecioDesc":
        resultado.sort(
          (a, b) => b.precio - a.precio
        );
        break;

      case "Relevancia":
      default:
        break;
    }

    return resultado;
  }, [
    materiales,
    busqueda,
    categoriaSeleccionada,
    precioSeleccionado,
    ordenSeleccionado,
  ]);



    const totalPaginas = Math.ceil(
      materialesFiltrados.length / materialesPorPagina
    );

    const indiceInicial =
      (paginaActual - 1) * materialesPorPagina;

    const indiceFinal =
      indiceInicial + materialesPorPagina;

    const materialesPagina = materialesFiltrados.slice(
      indiceInicial,
      indiceFinal
    );

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
              Explorá materiales, compará características y
              conocé sus precios aproximados.
            </p>
          </div>
        </section>

        <CatalogoFiltros
          materiales={materiales}
          categorias={categorias}
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          categoriaSeleccionada={categoriaSeleccionada}
          setCategoriaSeleccionada={
            setCategoriaSeleccionada
          }
          precioSeleccionado={precioSeleccionado}
          setPrecioSeleccionado={setPrecioSeleccionado}
          ordenSeleccionado={ordenSeleccionado}
          setOrdenSeleccionado={setOrdenSeleccionado}
        />

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

        {!cargando &&
          !error &&
          materialesFiltrados.length === 0 && (
            <section className="catalogo-empty">
              <p>No se encontraron materiales.</p>
            </section>
          )}

        {!cargando &&
          !error &&
          materialesFiltrados.length > 0 && (
            <section className="materiales-grid">
              {materialesPagina.map((material) => (
                <article
                  className="material-card"
                  key={material.id}
                >
                  <div className="material-image">
                    {material.imagen ? (
                      <img
                        src={material.imagen}
                        alt={material.nombre}
                        onError={(e) => {
                          e.currentTarget.style.display =
                            "none";
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
                      {material.descripcion ||
                        "Sin descripción"}
                    </p>

                    <div className="material-price">
                      <strong>
                        $
                        {material.precio.toLocaleString(
                          "es-UY"
                        )}
                      </strong>

                      <span>
                        por {material.unidad}
                      </span>
                    </div>

                    <div className="material-properties">
                      <div>
                        <span>Durabilidad</span>
                        <strong>
                          {material.durabilidad}
                        </strong>
                      </div>

                      <div>
                        <span>Mantenimiento</span>
                        <strong>
                          {material.mantenimiento}
                        </strong>
                      </div>
                    </div>

                    <div className="material-footer">
                      <span
                        className={`material-stock ${
                          material.disponibilidad ===
                          "Disponible"
                            ? "available"
                            : material.disponibilidad ===
                              "Stock bajo"
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
            </section>
          )}

        <footer className="catalogo-results">
           Mostrando {indiceInicial + 1} -{" "}
            {Math.min(indiceFinal, materialesFiltrados.length)}
            {" "}de {materialesFiltrados.length} materiales
        </footer>

        <PaginacionCatalogoMateriales
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          onCambiarPagina={setPaginaActual}
        />
      </main>
    </div>
  );
}

