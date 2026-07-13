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
              <th rowSpan={2}>Trabajo</th>
              <th rowSpan={2}>Descripción</th>
              <th rowSpan={2}>Unidad de medida</th>
              <th colSpan={3} className="costo-grupo">
                Costo de mano de obra
              </th>
              <th rowSpan={2}>Zona</th>
              <th rowSpan={2}>Última actualización</th>
              <th rowSpan={2}>Estado</th>
              <th rowSpan={2}>Acciones</th>
            </tr>

            <tr>
              <th>Baja</th>
              <th>Media</th>
              <th>Alta</th>
            </tr>
          </thead>

          <tbody>
            {trabajos.map((trabajo) => (
              <FilaManoObra
                key={trabajo.id}
                trabajo={trabajo}
                onEditar={onEditar}
                onCambiarEstado={onCambiarEstado}
                onEliminar={onEliminar}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="mano-obra-table-footer">
        {trabajos.length === 0 ? (
          <span>No se encontraron trabajos.</span>
        ) : (
          <span>
            Mostrando 1 a {trabajos.length} de {trabajos.length} trabajos
          </span>
        )}

        <div className="mano-obra-paginacion">
          <button type="button">‹</button>
          <button type="button" className="active">1</button>
          <button type="button">2</button>
          <button type="button">3</button>
          <button type="button">›</button>
        </div>
      </div>
    </div>
  );
}