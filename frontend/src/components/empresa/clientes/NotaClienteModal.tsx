import "../../../styles/empresa/clientes/ClientesModales.css";

import ModalBase from "../../common/ModalBase";
import type { ClienteEmpresa } from "../../../interfaces/ClienteEmpresa";

type Props = {
  abierto: boolean;
  cliente: ClienteEmpresa | null;
  onCerrar: () => void;
};

export default function NotaClienteModal({ abierto, cliente, onCerrar }: Props) {
  if (!cliente) return null;

  return (
    <ModalBase abierto={abierto} titulo={`Agregar nota - ${cliente.nombre}`} onCerrar={onCerrar}>
      <div className="nota-cliente-modal">
        <label>Nota interna</label>
        <textarea defaultValue={cliente.notas}></textarea>

        <div className="cliente-modal-actions">
          <button className="btn-cancelar" onClick={onCerrar}>
            Cancelar
          </button>

          <button className="btn-guardar" onClick={onCerrar}>
            Guardar nota
          </button>
        </div>
      </div>
    </ModalBase>
  );
}