
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

import {
  formatearPrecioUSD,
  formatearPrecioUYU,
} from "../../utilities/formatoMoneda";

import "../../styles/GenerarCotizacion.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000";

// ======================================================
// INTERFACES
// ======================================================

interface Cotizacion {
  idCotizacion: number;
  idProyecto: number;
  codigo: string;

  fechaCreacion: string;
  fechaActualizacion: string | null;
  fechaRealizada?: string | null;

  estado: string;

  costoMateriales: number;
  costoManoObra: number;
  totalCotizacion: number;

  // Precio estimado original en USD
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

  moneda?: string;

  // Puede venir desde el backend
  tipoCambio?: number;

  costoMaterialesUYU?: number;
  costoManoObraUYU?: number;
  totalCotizacionUYU?: number;

  // Puede venir calculado desde el backend
  precioEstimadoUYU?: number | null;
}

interface CotizacionCreadaResponse {
  idCotizacion: number;
  mensaje: string;
}

// ======================================================
// COMPONENTE
// ======================================================

export default function GenerarCotizacion() {
  const navigate = useNavigate();
  const { idProyecto } = useParams();

  const [cotizacion, setCotizacion] =
    useState<Cotizacion | null>(null);

  const [tipoCambio, setTipoCambio] =
    useState<number | null>(null);

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState("");

  // Evita doble ejecución en React StrictMode
  const cotizacionCreada =
    useRef(false);

  // ====================================================
  // OBTENER TIPO DE CAMBIO
  // ====================================================

  const obtenerTipoCambio = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/moneda/usd-uyu`
      );

      const data = await response.json();

      console.log(
        "RESPUESTA MONEDA:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.mensaje ||
            "No se pudo obtener el tipo de cambio."
        );
      }

      const cambio =
        Number(data.valor);

      if (
        !Number.isFinite(cambio) ||
        cambio <= 0
      ) {
        throw new Error(
          "El tipo de cambio recibido no es válido."
        );
      }

      setTipoCambio(cambio);

      return cambio;

    } catch (error) {

      console.error(
        "Error al obtener el tipo de cambio:",
        error
      );

      throw error;
    }
  };

  // ====================================================
  // CREAR COTIZACIÓN
  // ====================================================

  useEffect(() => {
    if (cotizacionCreada.current) {
      return;
    }

    cotizacionCreada.current = true;

    crearCotizacion();

  }, [idProyecto]);

  const crearCotizacion = async () => {

    try {

      setCargando(true);
      setError("");

      if (!idProyecto) {
        throw new Error(
          "No se encontró el proyecto."
        );
      }

      const proyectoId =
        Number(idProyecto);

      if (
        !Number.isInteger(proyectoId) ||
        proyectoId <= 0
      ) {
        throw new Error(
          "El ID del proyecto no es válido."
        );
      }

      console.log(
        "ID PROYECTO DESDE URL:",
        proyectoId
      );

      // =================================================
      // 1. GENERAR COTIZACIÓN
      // =================================================

      const response =
        await fetch(
          `${API_URL}/api/cotizaciones/generar/${proyectoId}`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
          }
        );

      const data: CotizacionCreadaResponse =
        await response.json();

      console.log(
        "RESPUESTA GENERAR COTIZACIÓN:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.mensaje ||
            "No se pudo generar la cotización."
        );
      }

      // =================================================
      // 2. OBTENER COTIZACIONES DEL PROYECTO
      // =================================================

      const cotizacionesResponse =
        await fetch(
          `${API_URL}/api/cotizaciones/proyecto/${proyectoId}`
        );

      if (!cotizacionesResponse.ok) {

        const textoError =
          await cotizacionesResponse.text();

        console.error(
          "Error obteniendo cotización:",
          textoError
        );

        throw new Error(
          "La cotización fue creada, pero no se pudieron obtener sus datos."
        );
      }

      const cotizaciones:
        Cotizacion[] =
        await cotizacionesResponse.json();

      console.log(
        "COTIZACIONES DEL PROYECTO:",
        cotizaciones
      );

      // =================================================
      // 3. BUSCAR LA COTIZACIÓN CREADA
      // =================================================

      const cotizacionCompleta =
        cotizaciones.find(
          (item) =>
            item.idCotizacion ===
            data.idCotizacion
        );

      if (!cotizacionCompleta) {
        throw new Error(
          "La cotización fue creada, pero no se encontró su información."
        );
      }

      console.log(
        "COTIZACIÓN COMPLETA:",
        cotizacionCompleta
      );

      // =================================================
      // 4. OBTENER TIPO DE CAMBIO
      // =================================================

      let cambio =
        cotizacionCompleta.tipoCambio;

      if (
        !cambio ||
        !Number.isFinite(
          Number(cambio)
        ) ||
        Number(cambio) <= 0
      ) {
        cambio =
          await obtenerTipoCambio();
      } else {
        cambio = Number(cambio);

        setTipoCambio(cambio);
      }

      console.log(
        "TIPO DE CAMBIO UTILIZADO:",
        cambio
      );

      // =================================================
      // 5. GUARDAR COTIZACIÓN
      // =================================================

      setCotizacion(
        cotizacionCompleta
      );

    } catch (error) {

      console.error(
        "Error al crear cotización:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo generar la cotización."
      );

    } finally {

      setCargando(false);

    }
  };

  // ====================================================
  // PRECIO ESTIMADO USD
  // ====================================================

  const precioEstimadoUSD =
    cotizacion?.precioEstimado !== null &&
    cotizacion?.precioEstimado !== undefined
      ? Number(
          cotizacion.precioEstimado
        )
      : null;

  // ====================================================
  // PRECIO ESTIMADO UYU
  // ====================================================

  let precioEstimadoUYU:
    number | null = null;

  if (
    cotizacion?.precioEstimadoUYU !==
      null &&
    cotizacion?.precioEstimadoUYU !==
      undefined
  ) {

    precioEstimadoUYU =
      Number(
        cotizacion.precioEstimadoUYU
      );

  } else if (
    precioEstimadoUSD !== null &&
    tipoCambio !== null
  ) {

    precioEstimadoUYU =
      precioEstimadoUSD *
      tipoCambio;

  }

  // ====================================================
  // CARGANDO
  // ====================================================

  if (cargando) {

    return (
      <section className="generar-cotizacion">

        <article className="gc-card">

          <h3>
            Generando cotización...
          </h3>

          <p>
            Estamos preparando la
            cotización de tu proyecto.
          </p>

        </article>

      </section>
    );
  }

  // ====================================================
  // ERROR
  // ====================================================

  if (error) {

    return (
      <section className="generar-cotizacion">

        <article className="gc-card">

          <h3>
            No se pudo generar la
            cotización
          </h3>

          <p>
            {error}
          </p>

          <button
            className="gc-button gc-secondary"
            onClick={() =>
              navigate(
                "/panel-cliente/proyectos"
              )
            }
          >
            Volver a proyectos
          </button>

        </article>

      </section>
    );
  }

  // ====================================================
  // SIN COTIZACIÓN
  // ====================================================

  if (!cotizacion) {

    return (
      <section className="generar-cotizacion">

        <article className="gc-card">

          <h3>
            No se encontró la cotización
          </h3>

          <p>
            No fue posible cargar la
            información de la cotización.
          </p>

          <button
            className="gc-button gc-secondary"
            onClick={() =>
              navigate(
                "/panel-cliente/proyectos"
              )
            }
          >
            Volver a proyectos
          </button>

        </article>

      </section>
    );
  }

  // ====================================================
  // COTIZACIÓN GENERADA
  // ====================================================

  return (
    <section className="generar-cotizacion">

      <header className="gc-header">

        <h2>
          Cotización generada
        </h2>

        <p>
          La cotización de tu proyecto
          fue generada correctamente.
        </p>

      </header>

      <article className="gc-card gc-success-card">

        {/* ==============================================
            ICONO
        ============================================== */}

        <div className="gc-success-icon">

          <CheckCircle size={55} />

        </div>

        {/* ==============================================
            TITULO
        ============================================== */}

        <h3>
          Cotización generada
          correctamente
        </h3>

        <p className="gc-message">

          La cotización{" "}

          <strong>
            {cotizacion.codigo}
          </strong>

          {" "}fue generada correctamente.

        </p>

        {/* ==============================================
            TOTAL ESTIMADO
        ============================================== */}

        <div className="gc-total">

          <span>
            Total estimado
          </span>

          {/* PESOS URUGUAYOS */}

          <strong>

            {precioEstimadoUYU !== null
              ? formatearPrecioUYU(
                  precioEstimadoUYU
                )
              : "Sin calcular"}

            {" "}UYU

          </strong>

          {/* DÓLARES */}

          <small>

            (
            {precioEstimadoUSD !== null
              ? formatearPrecioUSD(
                  precioEstimadoUSD
                )
              : "Sin calcular"}

            {" "}USD)

          </small>

        </div>

        {/* ==============================================
            TIPO DE CAMBIO
        ============================================== */}

        {tipoCambio !== null && (
          <p className="gc-tipo-cambio">

            Tipo de cambio utilizado:{" "}

            <strong>
              1 USD ={" "}
              {formatearPrecioUYU(
                tipoCambio
              )}{" "}
              UYU
            </strong>

          </p>
        )}

        {/* ==============================================
            ACCIONES
        ============================================== */}

        <div className="gc-actions">

          <button
            className="gc-button gc-secondary"
            onClick={() =>
              navigate(
                "/panel-cliente/cotizaciones"
              )
            }
          >
            Ir a Mis cotizaciones
          </button>

        </div>

      </article>

    </section>
  );
}



