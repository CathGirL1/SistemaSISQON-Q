import "../../../styles/empresa/materiales/MaterialesModales.css";

import { useEffect, useState } from "react";

import ModalBase from "../../common/ModalBase";

import type { MaterialEmpresa } from "../../../interfaces/MaterialEmpresa";

type Props = {
  abierto: boolean;
  material: MaterialEmpresa | null;
  onCerrar: () => void;
  onConfirmar: () => Promise<void> | void;
};

export default function ConfirmEliminarMaterialModal({
  abierto,
  material,
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

  if (!material) {
    return null;
  }

  const confirmar = async () => {
    try {
      setEliminando(true);
      setError("");

      await onConfirmar();
    } catch (errorDesconocido) {
      setError(
        errorDesconocido instanceof Error
          ? errorDesconocido.message
          : "No se pudo eliminar el material."
      );
    } finally {
      setEliminando(false);
    }
  };

  return (
    <ModalBase
      abierto={abierto}
      titulo="Eliminar material"
      onCerrar={onCerrar}
    >
      <div className="eliminar-material-modal">
        <p>
          ¿Seguro que querés eliminar el material{" "}
          <strong>{material.nombre}</strong>?
        </p>

        <p className="material-eliminar-aviso">
          Esta acción eliminará el registro de la base de
          datos.
        </p>

        {error && (
          <p className="material-form-error">{error}</p>
        )}

        <div className="material-modal-actions">
          <button
            type="button"
            className="material-btn-cancelar"
            onClick={onCerrar}
            disabled={eliminando}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="material-btn-eliminar"
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