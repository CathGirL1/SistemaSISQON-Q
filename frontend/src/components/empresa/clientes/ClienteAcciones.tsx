import "../../../styles/empresa/clientes/ClienteAcciones.css";

import { useState } from "react";
import {
  FaWhatsapp,
  FaEdit,
  FaRegCommentDots,
  FaPhoneAlt,
  FaEllipsisV,
  FaHistory,
  FaTrashAlt,
} from "react-icons/fa";

type Props = {
  onWhatsapp: () => void;
  onEditar: () => void;
  onAgregarNota: () => void;
  onLlamar: () => void;
  onVerHistorial: () => void;
  onEliminar: () => void;
};

export default function ClienteAcciones({
  onWhatsapp,
  onEditar,
  onAgregarNota,
  onLlamar,
  onVerHistorial,
  onEliminar,
}: Props) {
  const [abierto, setAbierto] = useState(false);

  const ejecutar = (accion: () => void) => {
    accion();
    setAbierto(false);
  };

  return (
    <div className="cliente-acciones">
      <button title="WhatsApp" onClick={onWhatsapp}>
        <FaWhatsapp />
      </button>

      <button title="Editar" onClick={onEditar}>
        <FaEdit />
      </button>

      <button title="Agregar nota" onClick={onAgregarNota}>
        <FaRegCommentDots />
      </button>

      <button title="Llamar" onClick={onLlamar}>
        <FaPhoneAlt />
      </button>

      <div className="cliente-menu">
        <button
          title="Más opciones"
          className="cliente-menu-btn"
          onClick={() => setAbierto(!abierto)}
        >
          <FaEllipsisV />
        </button>

        {abierto && (
          <div className="cliente-menu-dropdown">
            <button onClick={() => ejecutar(onVerHistorial)}>
              <FaHistory />
              Ver historial
            </button>

            <button onClick={() => ejecutar(onEditar)}>
              <FaEdit />
              Editar cliente
            </button>

            <button className="danger" onClick={() => ejecutar(onEliminar)}>
              <FaTrashAlt />
              Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}