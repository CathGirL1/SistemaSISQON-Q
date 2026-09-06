import { ChevronLeft, ChevronRight } from "lucide-react";

import "../../styles/PaginacionEmpresaCliente.css";

interface PaginacionEmpresasProps {
  paginaActual: number;
  totalPaginas: number;
  onCambiarPagina: (pagina: number) => void;
}

export default function PaginacionEmpresaCliente({
  paginaActual,
  totalPaginas,
  onCambiarPagina,
}: PaginacionEmpresasProps) {
  if (totalPaginas <= 1) {
    return null;
  }

  const paginas = Array.from(
    { length: totalPaginas },
    (_, index) => index + 1
  );

  return (
    <nav
      className="paginacion-empresas"
      aria-label="Paginación de empresas"
    >
      <button
        type="button"
        className="paginacion-empresas-button paginacion-empresas-prev"
        onClick={() => onCambiarPagina(paginaActual - 1)}
        disabled={paginaActual === 1}
        aria-label="Página anterior"
      >
        <ChevronLeft size={18} />
        <span>Anterior</span>
      </button>

      <div className="paginacion-empresas-pages">
        {paginas.map((pagina) => (
          <button
            key={pagina}
            type="button"
            className={`paginacion-empresas-page ${
              pagina === paginaActual ? "active" : ""
            }`}
            onClick={() => onCambiarPagina(pagina)}
            aria-current={
              pagina === paginaActual ? "page" : undefined
            }
          >
            {pagina}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="paginacion-empresas-button paginacion-empresas-next"
        onClick={() => onCambiarPagina(paginaActual + 1)}
        disabled={paginaActual === totalPaginas}
        aria-label="Página siguiente"
      >
        <span>Siguiente</span>
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}