import "../../../styles/empresa/materiales/MaterialesModales.css";

import { useState } from "react";
import { FaEllipsisV, FaEdit, FaSyncAlt, FaTrashAlt } from "react-icons/fa";

type Props = {
  onEditar: () => void;
  onActualizarPrecio: () => void;
  onEliminar: () => void;
};

export default function MenuAccionesMaterial({
  onEditar,
  onActualizarPrecio,
  onEliminar,
}: Props) {
  const [abierto, setAbierto] = useState(false);

  const ejecutar = (accion: () => void) => {
    accion();
    setAbierto(false);
  };

  return (
    <div className="material-menu">
      <button
        className="material-menu-btn"
        onClick={() => setAbierto(!abierto)}
      >
        <FaEllipsisV />
      </button>

      {abierto && (
        <div className="material-menu-dropdown">
          <button onClick={() => ejecutar(onEditar)}>
            <FaEdit />
            Editar
          </button>

          <button onClick={() => ejecutar(onActualizarPrecio)}>
            <FaSyncAlt />
            Actualizar precio
          </button>

          <button className="danger" onClick={() => ejecutar(onEliminar)}>
            <FaTrashAlt />
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
}