import "../../../styles/empresa/cotizaciones/MenuAccionesCotizacion.css";

import { useState } from "react";

import {
  FaEllipsisV,
  FaEye,
  FaEdit,
  FaTrashAlt,
  FaDollarSign,
  FaLock,
} from "react-icons/fa";

type Props = {
  finalizada: boolean;

  onVer: () => void;
  onGestionar: () => void;
  onEditar: () => void;
  onFinalizar: () => void;
  onEliminar: () => void;
};

export default function MenuAccionesCotizacion({
  finalizada,
  onVer,
  onGestionar,
  onEditar,
  onFinalizar,
  onEliminar,
}: Props) {
  const [abierto, setAbierto] = useState(false);

  const ejecutarAccion = (
    accion: () => void
  ) => {
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

          {/* VER DETALLE: SIEMPRE DISPONIBLE */}
          <button
            onClick={() =>
              ejecutarAccion(onVer)
            }
          >
            <FaEye />
            Ver detalle
          </button>

          {/* ACCIONES SOLO SI NO ESTÁ FINALIZADA */}
          {!finalizada && (
            <>
              <button
                onClick={() =>
                  ejecutarAccion(onGestionar)
                }
              >
                <FaDollarSign />
                Gestionar cotización
              </button>

              <button
                onClick={() =>
                  ejecutarAccion(onEditar)
                }
              >
                <FaEdit />
                Editar estado
              </button>

              <button
                onClick={() =>
                  ejecutarAccion(onFinalizar)
                }
              >
                <FaLock />
                Finalizar cotización
              </button>

              <button
                className="danger"
                onClick={() =>
                  ejecutarAccion(onEliminar)
                }
              >
                <FaTrashAlt />
                Eliminar
              </button>
            </>
          )}

        </div>
      )}
    </div>
  );
}