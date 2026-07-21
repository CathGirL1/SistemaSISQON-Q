import "../../../styles/empresa/clientes/ClientesModales.css";

import { useEffect, useState } from "react";

import ModalBase from "../../common/ModalBase";
import type { ClienteEmpresa } from "../../../interfaces/ClienteEmpresa";

type Props = {
  abierto: boolean;
  cliente: ClienteEmpresa | null;
  onCerrar: () => void;
  onConfirmar: () => Promise<void> | void;
};

export default function ConfirmEliminarClienteModal({
  abierto,
  cliente,
  onCerrar,
  onConfirmar,
}: Props) {
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (abierto) {
      setEliminando(false);
      setError("");
    }
  }, [abierto]);

  if (!cliente) return null;

  const confirmar = async () => {
    try {
      setEliminando(true);
      setError("");

      await onConfirmar();
    } catch (errorDesconocido) {
      setError(
        errorDesconocido instanceof Error
          ? errorDesconocido.message
          : "No se pudo eliminar el cliente."
      );
    } finally {
      setEliminando(false);
    }
  };

  return (
    <ModalBase
      abierto={abierto}
      titulo="Eliminar cliente"
      onCerrar={onCerrar}
    >
      <div className="eliminar-cliente-modal">
        <p>
          ¿Seguro que querés eliminar a{" "}
          <strong>{cliente.nombre}</strong>?
        </p>

        <p className="cliente-eliminar-aviso">
          También se eliminará el usuario asociado de la base de datos.
        </p>

        {error && (
          <p className="cliente-form-error">{error}</p>
        )}

        <div className="cliente-modal-actions">
          <button
            type="button"
            className="btn-cancelar"
            onClick={onCerrar}
            disabled={eliminando}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="btn-eliminar"
            onClick={confirmar}
            disabled={eliminando}
          >
            {eliminando ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </ModalBase>
  );
}