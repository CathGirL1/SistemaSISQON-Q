import "../../../styles/empresa/cotizaciones/MenuAccionesCotizacion.css";

import { useState } from "react";
import { FaEllipsisV, FaEye, FaEdit, FaTrashAlt } from "react-icons/fa";

type Props = {
  onVer: () => void;
  onEditar: () => void;
  onEliminar: () => void;
};

export default function MenuAccionesCotizacion({
  onVer,
  onEditar,
  onEliminar,
}: Props) {
  const [abierto, setAbierto] = useState(false);

  const ejecutarAccion = (accion: () => void) => {
    accion();
    setAbierto(false);
  };

  return (
    <div className="menu-acciones-cotizacion">
      <button
        className="menu-acciones-btn"
        onClick={() => setAbierto(!abierto)}
      >
        <FaEllipsisV />
      </button>

      {abierto && (
        <div className="menu-acciones-dropdown">
          <button onClick={() => ejecutarAccion(onVer)}>
            <FaEye />
            Ver detalle
          </button>

          <button onClick={() => ejecutarAccion(onEditar)}>
            <FaEdit />
            Editar estado
          </button>

          <button
            className="danger"
            onClick={() => ejecutarAccion(onEliminar)}
          >
            <FaTrashAlt />
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
}