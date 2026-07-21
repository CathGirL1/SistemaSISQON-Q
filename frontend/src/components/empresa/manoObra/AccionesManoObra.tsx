import { useState } from "react";
import {
  FaEdit,
  FaEllipsisV,
  FaPowerOff,
  FaTrashAlt,
} from "react-icons/fa";

import type { ManoObraEmpresa } from "../../../interfaces/ManoObraEmpresa";

type Props = {
  trabajo: ManoObraEmpresa;
  onEditar: (trabajo: ManoObraEmpresa) => void;
  onCambiarEstado: (trabajo: ManoObraEmpresa) => void;
  onEliminar: (trabajo: ManoObraEmpresa) => void;
};

export default function AccionesManoObra({
  trabajo,
  onEditar,
  onCambiarEstado,
  onEliminar,
}: Props) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const ejecutar = (accion: () => void) => {
    accion();
    setMenuAbierto(false);
  };

  return (
    <div className="acciones-mano-obra">
      <button
        type="button"
        title="Editar"
        onClick={() => onEditar(trabajo)}
      >
        <FaEdit />
      </button>

      <button
        type="button"
        className={`estado-switch ${
          trabajo.estado === "Activo" ? "activo" : ""
        }`}
        title={
          trabajo.estado === "Activo"
            ? "Desactivar trabajo"
            : "Activar trabajo"
        }
        onClick={() => onCambiarEstado(trabajo)}
      >
        <span />
      </button>

      <div className="menu-mano-obra">
        <button
          type="button"
          title="Más opciones"
          onClick={() => setMenuAbierto((abierto) => !abierto)}
        >
          <FaEllipsisV />
        </button>

        {menuAbierto && (
          <div className="menu-mano-obra-dropdown">
            <button
              type="button"
              onClick={() => ejecutar(() => onEditar(trabajo))}
            >
              <FaEdit />
              Editar trabajo
            </button>

            <button
              type="button"
              onClick={() =>
                ejecutar(() => onCambiarEstado(trabajo))
              }
            >
              <FaPowerOff />
              {trabajo.estado === "Activo"
                ? "Desactivar"
                : "Activar"}
            </button>

            <button
              type="button"
              className="danger"
              onClick={() =>
                ejecutar(() => onEliminar(trabajo))
              }
            >
              <FaTrashAlt />
              Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}