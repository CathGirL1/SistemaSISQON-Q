import "../../../styles/empresa/tiposObra/TablaTiposObra.css";

import FilaTipoObra from "./FilaTipoObra";
import type { TipoObraEmpresa } from "../../../interfaces/TipoObraEmpresa";

type Props = {
  tiposObra: TipoObraEmpresa[];
  tipoSeleccionado: TipoObraEmpresa | null;

  onSeleccionarTipo: (
    tipoObra: TipoObraEmpresa
  ) => void;

  onEditar: (
    tipoObra: TipoObraEmpresa
  ) => void;

  onObservaciones: (
    tipoObra: TipoObraEmpresa
  ) => void;

  onDuplicar: (
    tipoObra: TipoObraEmpresa
  ) => void;

  onCambiarEstado: (
    tipoObra: TipoObraEmpresa
  ) => void;

  onEliminar: (
    tipoObra: TipoObraEmpresa
  ) => void;
};
export default function TablaTiposObra({
  tiposObra,
  tipoSeleccionado,
  onSeleccionarTipo,
  onEditar,
  onObservaciones,
  onDuplicar,
  onCambiarEstado,
  onEliminar,
}: Props) {
  return (
    <div className="tabla-tipos-obra-card">
      <div className="tabla-tipos-obra-wrapper">
        <table className="tabla-tipos-obra">
          <thead>
            <tr>
              <th>Tipo de obra</th>
              <th>Descripción</th>
              <th>Materiales asociados</th>
              <th>Tiempo aprox.</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {tiposObra.map((tipoObra) => (
              <FilaTipoObra
                key={tipoObra.id}
                tipoObra={tipoObra}
                activo={tipoSeleccionado?.id === tipoObra.id}
                onSeleccionar={() => onSeleccionarTipo(tipoObra)}
                onEditar={onEditar}
                onObservaciones={onObservaciones}
                onDuplicar={onDuplicar}
                onCambiarEstado={onCambiarEstado}
                onEliminar={onEliminar}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="tipos-obra-table-footer">
        Mostrando 1 a {tiposObra.length} de {tiposObra.length} tipos de obra
      </div>
    </div>
  );
}