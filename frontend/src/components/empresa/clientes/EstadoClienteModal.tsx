import "../../../styles/empresa/clientes/ClientesModales.css";

import { useEffect, useState } from "react";

import ModalBase from "../../common/ModalBase";

import type {
  ClienteEmpresa,
  EstadoCliente,
} from "../../../interfaces/ClienteEmpresa";

type Props = {
  abierto: boolean;
  cliente: ClienteEmpresa | null;
  onCerrar: () => void;
  onGuardar: (
    estado: EstadoCliente
  ) => Promise<void> | void;
};

export default function EstadoClienteModal({
  abierto,
  cliente,
  onCerrar,
  onGuardar,
}: Props) {
  const [estado, setEstado] =
    useState<EstadoCliente>("Nuevo");

  const [guardando, setGuardando] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!abierto || !cliente) {
      return;
    }

    setEstado(cliente.estado);
    setError("");
    setGuardando(false);
  }, [abierto, cliente]);

  const guardar = async () => {
    if (!cliente) {
      return;
    }

    try {
      setGuardando(true);
      setError("");

      await onGuardar(estado);
    } catch (errorDesconocido) {
      setError(
        errorDesconocido instanceof Error
          ? errorDesconocido.message
          : "No se pudo actualizar el estado."
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <ModalBase
      abierto={abierto}
      titulo={`Cambiar estado - ${cliente?.nombre ?? ""}`}
      onCerrar={onCerrar}
    >
      <form
        className="cliente-modal-form"
        onSubmit={(evento) => {
          evento.preventDefault();
          guardar();
        }}
      >
        <div className="full">
          <label htmlFor="estadoCliente">
            Estado del cliente
          </label>

          <select
            id="estadoCliente"
            value={estado}
            disabled={guardando}
            onChange={(evento) =>
              setEstado(
                evento.target.value as EstadoCliente
              )
            }
          >
            <option value="Nuevo">
              Nuevo
            </option>

            <option value="Interesado">
              Interesado
            </option>

            <option value="Contactado">
              Contactado
            </option>

            <option value="Cliente confirmado">
              Cliente confirmado
            </option>
          </select>
        </div>

        {error && (
          <p className="cliente-form-error">
            {error}
          </p>
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
            disabled={
              guardando ||
              estado === cliente?.estado
            }
          >
            {guardando
              ? "Guardando..."
              : "Guardar cambio"}
          </button>
        </div>
      </form>
    </ModalBase>
  );
}