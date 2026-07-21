import "../../styles/CommonPanel.css";
import { FaTimes } from "react-icons/fa";

type ModalBaseProps = {
  abierto: boolean;
  titulo: string;
  children: React.ReactNode;
  onCerrar: () => void;
};

export default function ModalBase({
  abierto,
  titulo,
  children,
  onCerrar,
}: ModalBaseProps) {
  if (!abierto) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-base">
        <div className="modal-header">
          <h2>{titulo}</h2>

          <button onClick={onCerrar}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
}