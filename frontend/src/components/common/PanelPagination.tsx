import "../../styles/CommonPanel.css";

type PanelPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function PanelPagination({
  currentPage,
  totalPages,
  onPageChange,
}: PanelPaginationProps) {

  // Si no hay páginas, no mostramos paginación
  if (totalPages <= 0) {
    return null;
  }

  const irPaginaAnterior = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const irPaginaSiguiente = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="panel-pagination">

      {/* ANTERIOR */}

      <button
        type="button"
        onClick={irPaginaAnterior}
        disabled={currentPage === 1}
      >
        {"<"}
      </button>


      {/* PÁGINAS */}

      {Array.from({
        length: totalPages,
      }).map((_, index) => {

        const pagina = index + 1;

        return (
          <button
            type="button"
            key={pagina}
            className={
              currentPage === pagina
                ? "active"
                : ""
            }
            onClick={() =>
              onPageChange(pagina)
            }
          >
            {pagina}
          </button>
        );
      })}


      {/* SIGUIENTE */}

      <button
        type="button"
        onClick={irPaginaSiguiente}
        disabled={
          currentPage === totalPages
        }
      >
        {">"}
      </button>

    </div>
  );
}