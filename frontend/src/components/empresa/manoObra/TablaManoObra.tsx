import "../../../styles/empresa/manoObra/TablaManoObra.css";

import type { ManoObraEmpresa } from "../../../interfaces/ManoObraEmpresa";

import FilaManoObra from "./FilaManoObra";
import PanelPagination from "../../common/PanelPagination";

type Props = {
  trabajos: ManoObraEmpresa[];

  paginaActual: number;
  trabajosPorPagina: number;
  totalTrabajos: number;
  totalPaginas: number;

  onPageChange: (page: number) => void;

  onEditar: (trabajo: ManoObraEmpresa) => void;

  onCambiarEstado: (
    trabajo: ManoObraEmpresa
  ) => void;

  onEliminar: (
    trabajo: ManoObraEmpresa
  ) => void;
};

export default function TablaManoObra({
  trabajos,

  paginaActual,
  trabajosPorPagina,
  totalTrabajos,
  totalPaginas,

  onPageChange,

  onEditar,
  onCambiarEstado,
  onEliminar,
}: Props) {
  const primerRegistro =
    (paginaActual - 1) * trabajosPorPagina + 1;

  const ultimoRegistro = Math.min(
    paginaActual * trabajosPorPagina,
    totalTrabajos
  );

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
              trabajos.map((trabajo) => (
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
        {totalTrabajos === 0 ? (
          <span>
            No hay trabajos para mostrar.
          </span>
        ) : (
          <span>
            Mostrando {primerRegistro} a{" "}
            {ultimoRegistro} de{" "}
            {totalTrabajos} trabajos
          </span>
        )}

        {totalTrabajos > 0 && (
          <PanelPagination
            currentPage={paginaActual}
            totalPages={totalPaginas}
            onPageChange={onPageChange}
          />
        )}
      </div>
    </div>
  );
}