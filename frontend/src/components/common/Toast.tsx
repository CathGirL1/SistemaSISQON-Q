import "../../styles/CommonPanel.css";

import { FaCheckCircle, FaExclamationCircle, FaTimes } from "react-icons/fa";

type ToastTipo = "success" | "error";

type Props = {
  visible: boolean;
  mensaje: string;
  tipo?: ToastTipo;
  onCerrar: () => void;
};

export default function Toast({
  visible,
  mensaje,
  tipo = "success",
  onCerrar,
}: Props) {
  if (!visible) return null;

  return (
    <div className={`panel-toast ${tipo}`}>
      <div className="panel-toast-icon">
        {tipo === "success" ? <FaCheckCircle /> : <FaExclamationCircle />}
      </div>

      <p>{mensaje}</p>

      <button type="button" onClick={onCerrar}>
        <FaTimes />
      </button>
    </div>
  );
}