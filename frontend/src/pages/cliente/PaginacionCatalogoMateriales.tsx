import "../../styles/PaginacionCatalogoMateriales.css";

interface PaginacionProps {
  paginaActual: number;
  totalPaginas: number;
  onCambiarPagina: (pagina: number) => void;
}

export default function PaginacionCatalogoMateriales({
  paginaActual,
  totalPaginas,
  onCambiarPagina,
}: PaginacionProps) {
  if (totalPaginas <= 1) {
    return null;
  }

  return (
    <nav className="paginacion">

      <button
        className="paginacion-boton"
        disabled={paginaActual === 1}
        onClick={() =>
          onCambiarPagina(paginaActual - 1)
        }
      >
        ← Anterior
      </button>

      <div className="paginacion-numeros">
        {Array.from(
          { length: totalPaginas },
          (_, indice) => (
            <button
              key={indice + 1}
              className={`paginacion-numero ${
                paginaActual === indice + 1
                  ? "activo"
                  : ""
              }`}
              onClick={() =>
                onCambiarPagina(indice + 1)
              }
            >
              {indice + 1}
            </button>
          )
        )}
      </div>

      <button
        className="paginacion-boton"
        disabled={paginaActual === totalPaginas}
        onClick={() =>
          onCambiarPagina(paginaActual + 1)
        }
      >
        Siguiente →
      </button>

    </nav>
  );
}