import "../../../styles/empresa/clientes/ClienteAcciones.css";

import { useState } from "react";

import {
  FaWhatsapp,
  FaExchangeAlt,
  FaRegCommentDots,
  FaPhoneAlt,
  FaEllipsisV,
  FaHistory,
  FaTrashAlt,
} from "react-icons/fa";

type Props = {
  onWhatsapp: () => void;
  onCambiarEstado: () => void;
  onAgregarNota: () => void;
  onLlamar: () => void;
  onVerHistorial: () => void;
  onEliminar: () => void;
};

export default function ClienteAcciones({
  onWhatsapp,
  onCambiarEstado,
  onAgregarNota,
  onLlamar,
  onVerHistorial,
  onEliminar,
}: Props) {
  const [abierto, setAbierto] =
    useState(false);

  const ejecutar = (
    accion: () => void
  ) => {
    accion();
    setAbierto(false);
  };

  return (
    <div className="cliente-acciones">
      <button
        type="button"
        title="WhatsApp"
        onClick={onWhatsapp}
      >
        <FaWhatsapp />
      </button>

      <button
        type="button"
        title="Cambiar estado"
        onClick={onCambiarEstado}
      >
        <FaExchangeAlt />
      </button>

      <button
        type="button"
        title="Agregar nota"
        onClick={onAgregarNota}
      >
        <FaRegCommentDots />
      </button>

      <button
        type="button"
        title="Llamar"
        onClick={onLlamar}
      >
        <FaPhoneAlt />
      </button>

      <div className="cliente-menu">
        <button
          type="button"
          title="Más opciones"
          className="cliente-menu-btn"
          onClick={() =>
            setAbierto(!abierto)
          }
        >
          <FaEllipsisV />
        </button>

        {abierto && (
          <div className="cliente-menu-dropdown">
            <button
              type="button"
              onClick={() =>
                ejecutar(onVerHistorial)
              }
            >
              <FaHistory />
              Ver historial
            </button>

            <button
              type="button"
              onClick={() =>
                ejecutar(onCambiarEstado)
              }
            >
              <FaExchangeAlt />
              Cambiar estado
            </button>

            <button
              type="button"
              className="danger"
              onClick={() =>
                ejecutar(onEliminar)
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