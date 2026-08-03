import "../../styles/empresa/materiales/PaginacionMateriales.css";

type Props = {
  paginaActual: number;
  totalPaginas: number;
  onCambiarPagina: (pagina: number) => void;
};

export default function PaginacionMateriales({
  paginaActual,
  totalPaginas,
  onCambiarPagina,
}: Props) {
  if (totalPaginas <= 1) {
    return null;
  }

  const paginas: (number | string)[] = [];

  if (totalPaginas <= 7) {
    for (let i = 1; i <= totalPaginas; i++) {
      paginas.push(i);
    }
  } else {
    paginas.push(1);

    if (paginaActual > 4) {
      paginas.push("...");
    }

    const inicio = Math.max(2, paginaActual - 1);
    const fin = Math.min(totalPaginas - 1, paginaActual + 1);

    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }

    if (paginaActual < totalPaginas - 3) {
      paginas.push("...");
    }

    paginas.push(totalPaginas);
  }

  return (
    <div className="paginacion">
      <button
        className="paginacion-btn"
        disabled={paginaActual === 1}
        onClick={() =>
          onCambiarPagina(paginaActual - 1)
        }
      >
        ← Anterior
      </button>

      <div className="paginacion-numeros">
        {paginas.map((pagina, index) =>
          pagina === "..." ? (
            <span
              key={index}
              className="paginacion-puntos"
            >
              ...
            </span>
          ) : (
            <button
              key={pagina}
              className={`paginacion-numero ${
                pagina === paginaActual
                  ? "activo"
                  : ""
              }`}
              onClick={() =>
                onCambiarPagina(Number(pagina))
              }
            >
              {pagina}
            </button>
          )
        )}
      </div>

      <button
        className="paginacion-btn"
        disabled={
          paginaActual === totalPaginas
        }
        onClick={() =>
          onCambiarPagina(paginaActual + 1)
        }
      >
        Siguiente →
      </button>
    </div>
  );
}
   