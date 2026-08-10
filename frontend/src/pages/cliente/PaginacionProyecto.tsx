interface PaginacionProps {
  paginaActual: number;
  totalPaginas: number;
  indiceInicio: number;
  indiceFin: number;
  totalElementos: number;
  onPaginaAnterior: () => void;
  onPaginaSiguiente: () => void;
  onCambiarPagina: (pagina: number) => void;
}

export default function Paginacion({
  paginaActual,
  totalPaginas,
  indiceInicio,
  indiceFin,
  totalElementos,
  onPaginaAnterior,
  onPaginaSiguiente,
  onCambiarPagina,
}: PaginacionProps) {
  if (totalElementos === 0) {
    return null;
  }

  return (
    <div className="paginacion-container">
      <p className="paginacion-info">
        Mostrando {indiceInicio} - {indiceFin} de {totalElementos} proyectos
      </p>

      <div className="paginacion-controles">
        <button
          type="button"
          className="paginacion-button paginacion-anterior"
          onClick={onPaginaAnterior}
          disabled={paginaActual === 1}
        >
          ← Anterior
        </button>

        <div className="paginacion-numeros">
          {Array.from(
            { length: totalPaginas },
            (_, index) => index + 1
          ).map((pagina) => (
            <button
              key={pagina}
              type="button"
              className={`paginacion-button paginacion-numero ${
                pagina === paginaActual
                  ? "paginacion-numero-activo"
                  : ""
              }`}
              onClick={() => onCambiarPagina(pagina)}
            >
              {pagina}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="paginacion-button paginacion-siguiente"
          onClick={onPaginaSiguiente}
          disabled={paginaActual === totalPaginas}
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}