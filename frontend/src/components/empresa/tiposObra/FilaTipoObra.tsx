import { FaEdit, FaRegCommentDots, FaClock } from "react-icons/fa";

import type { TipoObraEmpresa } from "../../../interfaces/TipoObraEmpresa";
import TipoObraEstadoBadge from "./TipoObraEstadoBadge";
import MenuAccionesTipoObra from "./MenuAccionesTipoObra";
import IconoTipoObra from "./IconoTipoObra";

type Props = {
  tipoObra: TipoObraEmpresa;
  activo: boolean;
  onSeleccionar: () => void;
  onEditar: (tipoObra: TipoObraEmpresa) => void;
  onObservaciones: (tipoObra: TipoObraEmpresa) => void;
  onDuplicar: (tipoObra: TipoObraEmpresa) => void;
  onCambiarEstado: (tipoObra: TipoObraEmpresa) => void;
  onEliminar: (tipoObra: TipoObraEmpresa) => void;
};

export default function FilaTipoObra({
  tipoObra,
  activo,
  onSeleccionar,
  onEditar,
  onObservaciones,
  onDuplicar,
  onCambiarEstado,
  onEliminar,
}: Props) {
  return (
    <tr
      className={activo ? "tipo-obra-fila-activa" : ""}
      onClick={onSeleccionar}
    >
      <td>
        <div className="tipo-obra-cell">
          <div className={`tipo-obra-icon tipo-${tipoObra.id}`}>
            <IconoTipoObra nombre={tipoObra.nombre} />
          </div>

          <div>
            <h4>{tipoObra.nombre}</h4>
            <p>{tipoObra.codigo}</p>
          </div>
        </div>
      </td>

      <td>{tipoObra.descripcion}</td>

      <td>
        <span className="tipo-obra-tiempo">
          <FaClock />
          {tipoObra.tiempoAproximado}
        </span>
      </td>

      <td>
        <TipoObraEstadoBadge estado={tipoObra.estado} />
      </td>

      <td onClick={(evento) => evento.stopPropagation()}>
        <div className="tipo-obra-acciones">
          <button
            title="Editar"
            onClick={() => onEditar(tipoObra)}
          >
            <FaEdit />
          </button>

          <button
            title="Observaciones"
            onClick={() => onObservaciones(tipoObra)}
          >
            <FaRegCommentDots />
          </button>

          <MenuAccionesTipoObra
            onDuplicar={() => onDuplicar(tipoObra)}
            onCambiarEstado={() => onCambiarEstado(tipoObra)}
            onEliminar={() => onEliminar(tipoObra)}
          />
        </div>
      </td>
    </tr>
  );
}