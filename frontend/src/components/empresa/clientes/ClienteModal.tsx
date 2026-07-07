import "../../../styles/empresa/clientes/ClientesModales.css";

import ModalBase from "../../common/ModalBase";
import type { ClienteEmpresa } from "../../../interfaces/ClienteEmpresa";

type Props = {
  abierto: boolean;
  cliente: ClienteEmpresa | null;
  onCerrar: () => void;
};

export default function ClienteModal({ abierto, cliente, onCerrar }: Props) {
  if (!cliente) return null;

  return (
    <ModalBase abierto={abierto} titulo={`Editar cliente - ${cliente.nombre}`} onCerrar={onCerrar}>
      <form className="cliente-modal-form">
        <div>
          <label>Nombre</label>
          <input type="text" defaultValue={cliente.nombre} />
        </div>

        <div>
          <label>Teléfono</label>
          <input type="text" defaultValue={cliente.telefono} />
        </div>

        <div>
          <label>Email</label>
          <input type="email" defaultValue={cliente.email} />
        </div>

        <div>
          <label>Estado</label>
          <select defaultValue={cliente.estado}>
            <option>Nuevo</option>
            <option>Interesado</option>
            <option>Contactado</option>
            <option>Cliente confirmado</option>
          </select>
        </div>

        <div className="full">
          <label>Dirección</label>
          <input type="text" defaultValue={cliente.direccion} />
        </div>

        <div className="full">
          <label>Ciudad</label>
          <input type="text" defaultValue={cliente.ciudad} />
        </div>

        <div className="cliente-modal-actions">
          <button type="button" className="btn-cancelar" onClick={onCerrar}>
            Cancelar
          </button>

          <button type="button" className="btn-guardar" onClick={onCerrar}>
            Guardar cambios
          </button>
        </div>
      </form>
    </ModalBase>
  );
}