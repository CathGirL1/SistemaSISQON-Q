type Props = {
  paginaActual: number;
  totalPaginas: number;
  totalResultados: number;
  desde: number;
  hasta: number;
  onCambiarPagina: (pagina: number) => void;
};

export default function PaginacionCotizaciones({
  paginaActual,
  totalPaginas,
  totalResultados,
  desde,
  hasta,
  onCambiarPagina,
}: Props) {
  if (totalResultados === 0) {
    return null;
  }

  return (
    <footer className="cotizaciones-pagination">
      <span>
        Mostrando {desde} a {hasta} de {totalResultados} cotizaciones
      </span>

      {totalPaginas > 1 && (
        <nav
          className="cotizaciones-pagination-controls"
          aria-label="Paginación de cotizaciones"
        >
          <button
            type="button"
            onClick={() => onCambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
            aria-label="Página anterior"
          >
            ‹
          </button>

          <div className="cotizaciones-pagination-pages">
            {Array.from(
              { length: totalPaginas },
              (_, index) => {
                const pagina = index + 1;

                return (
                  <button
                    key={pagina}
                    type="button"
                    onClick={() => onCambiarPagina(pagina)}
                    className={
                      pagina === paginaActual
                        ? "pagina-activa"
                        : ""
                    }
                  >
                    {pagina}
                  </button>
                );
              }
            )}
          </div>

          <button
            type="button"
            onClick={() => onCambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
            aria-label="Página siguiente"
          >
            ›
          </button>
        </nav>
      )}
    </footer>
  );
}