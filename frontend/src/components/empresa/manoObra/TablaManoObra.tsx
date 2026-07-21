import "../../../styles/empresa/manoObra/TablaManoObra.css";

import type { ManoObraEmpresa } from "../../../interfaces/ManoObraEmpresa";
import FilaManoObra from "./FilaManoObra";

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
        {trabajos.length === 0 ? (
          <span>No hay trabajos para mostrar.</span>
        ) : (
          <span>
            Mostrando 1 a {trabajos.length} de {trabajos.length} trabajos
          </span>
        )}

        <div className="mano-obra-paginacion">
          <button type="button">‹</button>
          <button type="button" className="active">
            1
          </button>
          <button type="button">2</button>
          <button type="button">3</button>
          <button type="button">›</button>
        </div>
      </div>
    </div>
  );
}