import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/DarDeBajaPerfilCliente.css";

interface BajaClienteProps {
  idCliente: number;
}

export default function DarDeBajaPerfilCliente({
  idCliente,
}: BajaClienteProps) {
  const navigate = useNavigate();

  const [confirmando, setConfirmando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState("");

  const manejarBaja = async () => {
    setEliminando(true);
    setError("");

    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/clientes/${idCliente}/baja`,
        {
          method: "DELETE",
        }
      );

      if (!respuesta.ok) {
        const datosError =
          await respuesta.json().catch(() => null);

        throw new Error(
          datosError?.mensaje ||
            "No se pudo dar de baja la cuenta."
        );
      }

      localStorage.removeItem("usuario");

      navigate("/login");
    } catch (error) {
      console.error(
        "Error al dar de baja el cliente:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo dar de baja la cuenta."
      );

      setEliminando(false);
    }
  };

  return (
    <section className="baja-cliente">
      <div className="baja-cliente-header">
        <div>
          <h3>Darse de baja</h3>

          <p>
            Eliminá tu cuenta de SISCON-Q y todos los
            datos asociados.
          </p>
        </div>
      </div>

      <div className="baja-cliente-content">
        <p>
          Al darte de baja se eliminarán tus datos
          personales, proyectos, cotizaciones y los
          materiales asociados a tus proyectos.
        </p>

        <p className="baja-cliente-advertencia">
          Esta acción es permanente y no se puede
          deshacer.
        </p>

        {error && (
          <div className="baja-cliente-error">
            {error}
          </div>
        )}

        {!confirmando ? (
          <button
            type="button"
            className="baja-cliente-button"
            onClick={() => {
              setError("");
              setConfirmando(true);
            }}
          >
            Darme de baja
          </button>
        ) : (
          <div className="baja-cliente-confirmacion">
            <p>
              ¿Estás seguro de que querés eliminar tu
              cuenta?
            </p>

            <div className="baja-cliente-actions">
              <button
                type="button"
                className="baja-cliente-cancelar"
                onClick={() => {
                  setConfirmando(false);
                  setError("");
                }}
                disabled={eliminando}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="baja-cliente-confirmar"
                onClick={manejarBaja}
                disabled={eliminando}
              >
                {eliminando
                  ? "Eliminando..."
                  : "Sí, eliminar mi cuenta"}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}