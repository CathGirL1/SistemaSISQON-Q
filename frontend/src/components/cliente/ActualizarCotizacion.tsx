import { useState } from "react";
import { RefreshCw } from "lucide-react";

interface ActualizarCotizacionProps {
  idCotizacion: number;
  onActualizada: () => void;
}

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function ActualizarCotizacion({
  idCotizacion,
  onActualizada,
}: ActualizarCotizacionProps) {

  const [actualizando, setActualizando] =
    useState(false);

  const actualizarCotizacion = async () => {

    try {

      setActualizando(true);

      const response = await fetch(
        `${API_URL}/api/cotizaciones/${idCotizacion}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },

          // No necesitamos enviar datos.
          // El backend obtiene los datos actuales
          // del proyecto y vuelve a calcular.
          body: JSON.stringify({}),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.mensaje ||
          "No se pudo actualizar la cotización"
        );
      }

      alert(
        "La cotización se actualizó correctamente."
      );

      // Volvemos a cargar las cotizaciones
      // del componente principal.
      onActualizada();

    } catch (error) {

      const mensaje =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al actualizar la cotización";

      alert(mensaje);

    } finally {

      setActualizando(false);

    }
  };

  return (
    <button
      type="button"
      onClick={actualizarCotizacion}
      disabled={actualizando}
    >

      <RefreshCw
        size={16}
        className={
          actualizando
            ? "icono-girando"
            : ""
        }
      />

      {actualizando
        ? "Actualizando..."
        : "Actualizar"}

    </button>
  );
}