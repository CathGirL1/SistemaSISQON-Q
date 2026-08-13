import { CheckCircle } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import "../../styles/GenerarCotizacion.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

const ID_CLIENTE_TEMPORAL = 1;

interface Cotizacion {
  idCotizacion: number;
  idProyecto: number;
  codigo: string;
  fechaCreacion: string;
  fechaActualizacion: string | null;
  estado: string;
  precioEstimado: number | null;
  observaciones: string | null;
  idCliente: number;
  idTipoObra: number;
  nombreProyecto: string;
  descripcionProyecto: string | null;
  ubicacion: string | null;
  alto: number;
  ancho: number;
  largo: number;
  superficie: number;
}

interface CotizacionCreadaResponse {
  idCotizacion: number;
  mensaje: string;
}

export default function GenerarCotizacion() {
  const navigate = useNavigate();
  const { idProyecto } = useParams();

  const [cotizacion, setCotizacion] =
    useState<Cotizacion | null>(null);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Evita que React cree la cotización dos veces
  // cuando StrictMode ejecuta el useEffect nuevamente.
  const cotizacionCreada = useRef(false);

  useEffect(() => {
    if (cotizacionCreada.current) {
      return;
    }

    cotizacionCreada.current = true;

    crearCotizacion();
  }, []);

  const crearCotizacion = async () => {
    try {
      setCargando(true);
      setError("");

      if (!idProyecto) {
        throw new Error("No se encontró el proyecto.");
      }

      // -----------------------------------
      // 1. CREAR COTIZACIÓN
      // -----------------------------------

      const response = await fetch(
        `${API_URL}/api/cotizaciones`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idProyecto: Number(idProyecto),
            estado: "Borrador",
            costoMateriales: 500,
            costoManoObra: 300,
            totalCotizacion: 800,
            precioEstimado: 800,
            observaciones: "Cotización inicial",
          }),
        }
      );

      const data: CotizacionCreadaResponse =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.mensaje ||
            "No se pudo generar la cotización"
        );
      }

      console.log("Cotización creada:", data);

      // -----------------------------------
      // 2. OBTENER LA COTIZACIÓN COMPLETA
      // -----------------------------------

      const cotizacionesResponse = await fetch(
        `${API_URL}/api/cotizaciones/cliente/${ID_CLIENTE_TEMPORAL}`
      );

      const cotizaciones: Cotizacion[] =
        await cotizacionesResponse.json();

      if (!cotizacionesResponse.ok) {
        throw new Error(
          "La cotización fue creada, pero no se pudieron obtener sus datos."
        );
      }

      // -----------------------------------
      // 3. BUSCAR LA COTIZACIÓN RECIÉN CREADA
      // -----------------------------------

      const cotizacionCompleta = cotizaciones.find(
        (item) =>
          item.idCotizacion === data.idCotizacion
      );

      if (!cotizacionCompleta) {
        throw new Error(
          "La cotización fue creada, pero no se encontró su información."
        );
      }

      // -----------------------------------
      // 4. GUARDARLA EN EL ESTADO
      // -----------------------------------

      setCotizacion(cotizacionCompleta);

    } catch (error) {
      console.error(
        "Error al crear cotización:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo generar la cotización"
      );
    } finally {
      setCargando(false);
    }
  };

  // -----------------------------------
  // CARGANDO
  // -----------------------------------

  if (cargando) {
    return (
      <section className="generar-cotizacion">
        <article className="gc-card">
          <h3>Generando cotización...</h3>

          <p>
            Estamos preparando la cotización de tu proyecto.
          </p>
        </article>
      </section>
    );
  }

  // -----------------------------------
  // ERROR
  // -----------------------------------

  if (error) {
    return (
      <section className="generar-cotizacion">
        <article className="gc-card">
          <h3>No se pudo generar la cotización</h3>

          <p>{error}</p>

          <button
            className="gc-button gc-secondary"
            onClick={() =>
              navigate("/panel-cliente/proyectos")
            }
          >
            Volver a proyectos
          </button>
        </article>
      </section>
    );
  }

  // -----------------------------------
  // COTIZACIÓN GENERADA
  // -----------------------------------

  if (!cotizacion) {
    return (
      <section className="generar-cotizacion">
        <article className="gc-card">
          <h3>No se encontró la cotización</h3>

          <p>
            No fue posible cargar la información de la
            cotización.
          </p>

          <button
            className="gc-button gc-secondary"
            onClick={() =>
              navigate("/panel-cliente/proyectos")
            }
          >
            Volver a proyectos
          </button>
        </article>
      </section>
    );
  }

  return (
    <section className="generar-cotizacion">

      <header className="gc-header">

        <h2>
          Cotización generada
        </h2>

        <p>
          La cotización de tu proyecto fue generada
          correctamente.
        </p>

      </header>

      <article className="gc-card gc-success-card">

        <div className="gc-success-icon">
          <CheckCircle size={55} />
        </div>

        <h3>
          Cotización generada correctamente
        </h3>

        <p className="gc-message">

          La cotización{" "}

          <strong>
            {cotizacion.codigo}
          </strong>

          {" "}fue generada correctamente.

        </p>

        <div className="gc-total">

          <span>
            Total estimado
          </span>

          <strong>
            $
            {Number(
              cotizacion.precioEstimado ?? 0
            ).toLocaleString("es-UY")}
          </strong>

        </div>

        <div className="gc-actions">

          <button
            className="gc-button gc-secondary"
            onClick={() =>
              navigate("/panel-cliente/cotizaciones")
            }
          >
            Ir a Mis cotizaciones
          </button>

        </div>

      </article>

    </section>
  );
}