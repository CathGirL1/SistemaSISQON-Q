import "../../../styles/empresa/clientes/ClientesModales.css";

import { useEffect, useState } from "react";

import ModalBase from "../../common/ModalBase";
import type { ClienteEmpresa } from "../../../interfaces/ClienteEmpresa";

type Props = {
  abierto: boolean;
  cliente: ClienteEmpresa | null;
  onCerrar: () => void;
  onGuardar: (nota: string) => Promise<void> | void;
};

export default function NotaClienteModal({
  abierto,
  cliente,
  onCerrar,
  onGuardar,
}: Props) {
  const [nota, setNota] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!abierto || !cliente) return;

    setNota(cliente.notas);
    setGuardando(false);
    setError("");
  }, [abierto, cliente]);

  if (!cliente) return null;

  const guardarNota = async () => {
    try {
      setGuardando(true);
      setError("");

      await onGuardar(nota.trim());
    } catch (errorDesconocido) {
      setError(
        errorDesconocido instanceof Error
          ? errorDesconocido.message
          : "No se pudo guardar la nota."
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <ModalBase
      abierto={abierto}
      titulo={`Agregar nota - ${cliente.nombre}`}
      onCerrar={onCerrar}
    >
      <form
        className="nota-cliente-modal"
        onSubmit={(evento) => {
          evento.preventDefault();
          guardarNota();
        }}
      >
        <label htmlFor="nota-cliente">Nota interna</label>

        <textarea
          id="nota-cliente"
          value={nota}
          onChange={(evento) => setNota(evento.target.value)}
        />

        {error && (
          <p className="cliente-form-error">{error}</p>
        )}

        <div className="cliente-modal-actions">
          <button
            type="button"
            className="btn-cancelar"
            onClick={onCerrar}
            disabled={guardando}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="btn-guardar"
            disabled={guardando}
          >
            {guardando ? "Guardando..." : "Guardar nota"}
          </button>
        </div>
      </form>
    </ModalBase>
  );
}