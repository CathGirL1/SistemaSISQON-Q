import { FaEdit, FaSyncAlt } from "react-icons/fa";
import MenuAccionesMaterial from "./MenuAccionesMaterial";

type Props = {
  onEditar: () => void;
  onActualizarPrecio: () => void;
  onEliminar: () => void;
};

export default function MaterialAcciones({
  onEditar,
  onActualizarPrecio,
  onEliminar,
}: Props) {
  return (
    <div className="material-acciones">
      <button title="Editar" onClick={onEditar}>
        <FaEdit />
      </button>

      <button title="Actualizar precio" onClick={onActualizarPrecio}>
        <FaSyncAlt />
      </button>

      <MenuAccionesMaterial
        onEditar={onEditar}
        onActualizarPrecio={onActualizarPrecio}
        onEliminar={onEliminar}
      />
    </div>
  );
}