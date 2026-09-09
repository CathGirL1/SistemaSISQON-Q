import { useEffect, useState } from "react";
import { Send, ChevronDown, X } from "lucide-react";

import "../../styles/EnviarCotizacion.css";


interface Empresa {
  idEmpresa: number;
  nombreEmpresa: string;
}

interface EnviarCotizacionProps {
  idCotizacion: number;
  estado: string;
  onEnviada: () => void;
}

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function EnviarCotizacion({
  idCotizacion,
  estado,
  onEnviada,
}: EnviarCotizacionProps) {
  const [abierto, setAbierto] = useState(false);

  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [idEmpresaSeleccionada, setIdEmpresaSeleccionada] =
    useState<number | "">("");

  const [cargandoEmpresas, setCargandoEmpresas] =
    useState(false);

  const [enviando, setEnviando] = useState(false);

  const [error, setError] = useState("");

  const [mensaje, setMensaje] = useState("");

  // =====================================================
  // OBTENER EMPRESAS
  // =====================================================

  const obtenerEmpresas = async () => {
    try {
      setCargandoEmpresas(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/empresa`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.mensaje ||
            "No se pudieron obtener las empresas"
        );
      }

      setEmpresas(data);
    } catch (error) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al obtener las empresas";

      setError(mensaje);
    } finally {
      setCargandoEmpresas(false);
    }
  };

  // =====================================================
  // ABRIR MODAL / DROPDOWN
  // =====================================================

  const abrirEnvio = () => {
    setAbierto(true);
    setMensaje("");
    setError("");
    setIdEmpresaSeleccionada("");

    obtenerEmpresas();
  };

  // =====================================================
  // CERRAR
  // =====================================================

  const cerrarEnvio = () => {
    if (enviando) return;

    setAbierto(false);
    setError("");
    setMensaje("");
    setIdEmpresaSeleccionada("");
  };

  // =====================================================
  // ENVIAR COTIZACIÓN
  // =====================================================

  const enviarCotizacion = async () => {
    if (!idEmpresaSeleccionada) {
      setError(
        "Debes seleccionar una empresa."
      );

      return;
    }

    try {
      setEnviando(true);
      setError("");
      setMensaje("");

      const response = await fetch(
        `${API_URL}/api/cotizaciones/${idCotizacion}/enviar`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idEmpresa: idEmpresaSeleccionada,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.mensaje ||
            "No se pudo enviar la cotización"
        );
      }

      setMensaje(
        "Cotización enviada correctamente."
      );

      // Actualizamos la tabla de MisCotizaciones
      onEnviada();

      // Cerramos después de un momento
      setTimeout(() => {
        setAbierto(false);
        setMensaje("");
        setIdEmpresaSeleccionada("");
      }, 1000);

    } catch (error) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al enviar la cotización";

      setError(mensaje);
    } finally {
      setEnviando(false);
    }
  };

  // =====================================================
  // BOTÓN
  // =====================================================

  return (
    <>
      <button
        type="button"
        className="enviar-cotizacion-trigger"
        onClick={abrirEnvio}
        disabled={estado !== "Revisada" && estado !== "Aceptada"}
      >
        <Send size={16} />
        Enviar
      </button>

      {abierto && (
        <div className="enviar-cotizacion-overlay">

          <div className="enviar-cotizacion-modal">

            <div className="enviar-cotizacion-header">

              <div>
                <h3>
                  Enviar cotización
                </h3>

                <p>
                  Seleccioná la empresa a la que
                  querés enviar esta cotización.
                </p>
              </div>

              <button
                type="button"
                onClick={cerrarEnvio}
                disabled={enviando}
              >
                <X size={20} />
              </button>

            </div>

            <div className="enviar-cotizacion-body">

              <label htmlFor={`empresa-${idCotizacion}`}>
                Empresa
              </label>

              <div className="empresa-select-wrapper">

                <select
                  id={`empresa-${idCotizacion}`}
                  value={idEmpresaSeleccionada}
                  onChange={(event) =>
                    setIdEmpresaSeleccionada(
                      event.target.value
                        ? Number(event.target.value)
                        : ""
                    )
                  }
                  disabled={
                    cargandoEmpresas || enviando
                  }
                >

                  <option value="">
                    {cargandoEmpresas
                      ? "Cargando empresas..."
                      : "Seleccioná una empresa"}
                  </option>

                  {empresas.map((empresa) => (
                    <option
                      key={empresa.idEmpresa}
                      value={empresa.idEmpresa}
                    >
                      {empresa.nombreEmpresa}
                    </option>
                  ))}

                </select>

                <ChevronDown size={18} />

              </div>

              {error && (
                <p className="enviar-cotizacion-error">
                  {error}
                </p>
              )}

              {mensaje && (
                <p className="enviar-cotizacion-success">
                  {mensaje}
                </p>
              )}

            </div>

            <div className="enviar-cotizacion-footer">

              <button
                type="button"
                onClick={cerrarEnvio}
                disabled={enviando}
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={enviarCotizacion}
                disabled={
                  enviando ||
                  !idEmpresaSeleccionada
                }
              >
                <Send size={16} />

                {enviando
                  ? "Enviando..."
                  : "Enviar cotización"}
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
}