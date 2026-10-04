type Props = {
  paginaActual: number;
  totalPaginas: number;
  onCambiarPagina: (pagina: number) => void;
};

export default function PaginacionManoObra({
  paginaActual,
  totalPaginas,
  onCambiarPagina,
}: Props) {
  if (totalPaginas <= 1) {
    return null;
  }

  const estiloBoton = {
    width: "34px",
    minWidth: "34px",
    height: "34px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    border: "1px solid #dbe3ec",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    color: "#0f3460",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
  };

  const estiloBotonActivo = {
    ...estiloBoton,
    backgroundColor: "#0f3460",
    borderColor: "#0f3460",
    color: "#ffffff",
  };

  const estiloBotonDeshabilitado = {
    ...estiloBoton,
    backgroundColor: "#f8fafc",
    borderColor: "#e5e7eb",
    color: "#cbd5e1",
    cursor: "not-allowed",
  };

  return (
    <nav
      aria-label="Paginación de trabajos de mano de obra"
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        flexWrap: "nowrap",
        width: "fit-content",
      }}
    >
      {/* Página anterior */}
      <button
        type="button"
        onClick={() => onCambiarPagina(paginaActual - 1)}
        disabled={paginaActual === 1}
        aria-label="Página anterior"
        style={
          paginaActual === 1
            ? estiloBotonDeshabilitado
            : estiloBoton
        }
      >
        ‹
      </button>

      {/* Números */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "6px",
          flexWrap: "nowrap",
        }}
      >
        {Array.from({ length: totalPaginas }, (_, index) => {
          const pagina = index + 1;

          return (
            <button
              key={pagina}
              type="button"
              onClick={() => onCambiarPagina(pagina)}
              style={
                pagina === paginaActual
                  ? estiloBotonActivo
                  : estiloBoton
              }
            >
              {pagina}
            </button>
          );
        })}
      </div>

      {/* Página siguiente */}
      <button
        type="button"
        onClick={() => onCambiarPagina(paginaActual + 1)}
        disabled={paginaActual === totalPaginas}
        aria-label="Página siguiente"
        style={
          paginaActual === totalPaginas
            ? estiloBotonDeshabilitado
            : estiloBoton
        }
      >
        ›
      </button>
    </nav>
  );
}