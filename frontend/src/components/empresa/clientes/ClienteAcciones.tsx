import "../../../styles/empresa/clientes/ClienteAcciones.css";

import {
  FaWhatsapp,
  FaExchangeAlt,
  FaRegCommentDots,
  FaHistory,
} from "react-icons/fa";

type Props = {
  onWhatsapp: () => void;
  onCambiarEstado: () => void;
  onAgregarNota: () => void;
  onVerHistorial: () => void;
};

export default function ClienteAcciones({
  onWhatsapp,
  onCambiarEstado,
  onAgregarNota,
  onVerHistorial,
}: Props) {
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
        title="Ver historial de cotizaciones"
        onClick={onVerHistorial}
      >
        <FaHistory />
      </button>

    </div>
  );
}