import "../../../styles/empresa/tiposObra/TiposObraModales.css";

import { useState } from "react";
import { FaEllipsisV, FaCopy, FaPowerOff, FaTrashAlt } from "react-icons/fa";

type Props = {
  onDuplicar: () => void;
  onCambiarEstado: () => void;
  onEliminar: () => void;
};

export default function MenuAccionesTipoObra({
  onDuplicar,
  onCambiarEstado,
  onEliminar,
}: Props) {
  const [abierto, setAbierto] = useState(false);

  const ejecutar = (accion: () => void) => {
    accion();
    setAbierto(false);
  };

  return (
    <div className="tipo-obra-menu">
      <button
        className="tipo-obra-menu-btn"
        onClick={() => setAbierto(!abierto)}
      >
        <FaEllipsisV />
      </button>

      {abierto && (
        <div className="tipo-obra-menu-dropdown">
          <button onClick={() => ejecutar(onDuplicar)}>
            <FaCopy />
            Duplicar
          </button>

          <button onClick={() => ejecutar(onCambiarEstado)}>
            <FaPowerOff />
            Activar / Desactivar
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