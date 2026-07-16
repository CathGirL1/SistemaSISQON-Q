import "../../../styles/empresa/materiales/MaterialesModales.css";

import { useEffect, useState } from "react";

import ModalBase from "../../common/ModalBase";

import type { MaterialEmpresa } from "../../../interfaces/MaterialEmpresa";

type Props = {
  abierto: boolean;
  material: MaterialEmpresa | null;
  onCerrar: () => void;
  onGuardar: (nuevoPrecio: number) => Promise<void> | void;
};

export default function ActualizarPrecioMaterialModal({
  abierto,
  material,
  onCerrar,
  onGuardar,
}: Props) {
  const [nuevoPrecio, setNuevoPrecio] = useState("");
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!abierto || !material) return;

    setNuevoPrecio(String(material.costoUnitario));
    setError("");
    setGuardando(false);
  }, [abierto, material]);

  if (!material) return null;

  const guardarPrecio = async () => {
    const precio = Number(nuevoPrecio);

    if (!Number.isFinite(precio) || precio < 0) {
      setError(
        "El precio debe ser un número mayor o igual a cero."
      );
      return;
    }

    try {
      setGuardando(true);
      setError("");

      await onGuardar(precio);
    } catch (errorDesconocido) {
      setError(
        errorDesconocido instanceof Error
          ? errorDesconocido.message
          : "No se pudo actualizar el precio."
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <ModalBase
      abierto={abierto}
      titulo={`Actualizar precio - ${material.nombre}`}
      onCerrar={onCerrar}
    >
      <form
        className="actualizar-precio-modal"
        onSubmit={(evento) => {
          evento.preventDefault();
          guardarPrecio();
        }}
      >
        <p>
          Precio actual:{" "}
          <strong>{material.precioActual}</strong>
        </p>

        <label htmlFor="nuevo-precio-material">
          Nuevo precio
        </label>

        <input
          id="nuevo-precio-material"
          type="number"
          min="0"
          step="0.01"
          value={nuevoPrecio}
          onChange={(evento) =>
            setNuevoPrecio(evento.target.value)
          }
        />

        {error && (
          <p className="material-form-error">{error}</p>
        )}

        <div className="material-modal-actions">
          <button
            type="button"
            className="material-btn-cancelar"
            onClick={onCerrar}
            disabled={guardando}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="material-btn-guardar"
            disabled={guardando}
          >
            {guardando
              ? "Actualizando..."
              : "Actualizar precio"}
          </button>
        </div>
      </form>
    </ModalBase>
  );
}