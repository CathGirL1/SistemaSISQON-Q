import "../../../styles/empresa/manoObra/TablaManoObra.css";

import type { ManoObraEmpresa } from "../../../interfaces/ManoObraEmpresa";
import FilaManoObra from "./FilaManoObra";

import { useEffect, useState } from "react";

import PaginacionManoObra from "./PaginacionManoObra";

type Props = {
  trabajos: ManoObraEmpresa[];
  onEditar: (trabajo: ManoObraEmpresa) => void;
  onCambiarEstado: (trabajo: ManoObraEmpresa) => void;
  onEliminar: (trabajo: ManoObraEmpresa) => void;
};

export default function TablaManoObra({
  trabajos,
  onEditar,
  onCambiarEstado,
  onEliminar,
}: Props) {

  const TRABAJOS_POR_PAGINA = 4;
  const [paginaActual, setPaginaActual] = useState(1);

  const totalPaginas = Math.ceil(trabajos.length / TRABAJOS_POR_PAGINA);
  const trabajosPaginados = trabajos.slice(
    (paginaActual - 1) * TRABAJOS_POR_PAGINA,
    paginaActual * TRABAJOS_POR_PAGINA
  );

  const indiceInicial = (paginaActual - 1) * TRABAJOS_POR_PAGINA;

  const desde = indiceInicial + 1;

  const hasta = Math.min(
    indiceInicial + TRABAJOS_POR_PAGINA,
    trabajos.length
  );

    useEffect(() => {
      if (paginaActual > totalPaginas && totalPaginas > 0) {
        setPaginaActual(totalPaginas);
      }
    }, [paginaActual, totalPaginas]);

  return (
    <div className="tabla-mano-obra-card">
      <div className="tabla-mano-obra-wrapper">
        <table className="tabla-mano-obra">
          <thead>
            <tr>
              <th>Trabajo</th>
              <th>Descripción</th>
              <th>Categoría</th>
              <th>Unidad</th>
              <th>Costo unitario</th>
              <th>Última actualización</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {trabajos.length > 0 ? (
              trabajosPaginados.map((trabajo) => (
                <FilaManoObra
                  key={trabajo.id}
                  trabajo={trabajo}
                  onEditar={onEditar}
                  onCambiarEstado={onCambiarEstado}
                  onEliminar={onEliminar}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="materiales-tabla-vacia"
                >
                  No hay trabajos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mano-obra-table-footer">
        {trabajos.length === 0 ? (
          <span>No hay trabajos para mostrar.</span>
        ) : (
          <span>
            Mostrando {desde} a {hasta} de {trabajos.length} trabajos
          </span>
        )}

        <PaginacionManoObra
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          onCambiarPagina={setPaginaActual}
        />
      </div>
    </div>
  );
}