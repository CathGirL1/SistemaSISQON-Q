import type {
  Cotizacion,
  EstadoCotizacion,
} from "../interfaces/Cotizacion";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000";

interface CotizacionBackend {
  idCotizacion: number;
  idProyecto: number;
  idEmpresa: number;

  codigo: string;

  fechaRealizada: string | null;
  fechaCreacion: string;
  fechaActualizacion: string;

  version: number;

  costoMateriales: number;
  costoManoObra: number;
  totalCotizacion: number;

  estado: string;
  precioEstimado: number | null;
  observaciones: string | null;

  // CLIENTE
  idCliente: number;
  nombreCliente: string;
  emailCliente: string;
  telefonoCliente: string | null;

  // PROYECTO
  idTipoObra: number;
  tipoObra: string;
  codigoTipoObra: string;

  nombreProyecto: string;
  descripcionProyecto: string | null;

  ubicacion: string;

  alto: number;
  ancho: number;
  largo: number;
  superficie: number;

  // MATERIALES
  resumenMateriales: string;

  // EMPRESA
  nombreEmpresa: string;

  // MONEDA
  moneda: string;
  tipoCambio: number;
  precioEstimadoUYU: number | null;
}

function convertirEstado(
  estado: string
): EstadoCotizacion {

  switch (estado) {

    case "Borrador":
      return "Nueva";

    case "Enviada":
      return "En revisión";

    case "Revisada":
      return "Contactado";

    case "Aceptada":
      return "Aprobada";

    case "Rechazada":
      return "Rechazada";

    case "Finalizada":
      return "Finalizada";

    default:
      return "Nueva";
  }
}

export async function obtenerCotizacionesEmpresa(
  idEmpresa: number
): Promise<Cotizacion[]> {

  const response = await fetch(
    `${API_URL}/api/cotizaciones/empresa/${idEmpresa}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.mensaje ||
      "No se pudieron obtener las cotizaciones"
    );
  }

    const cotizaciones: CotizacionBackend[] = data;

        return cotizaciones.map(
        (cotizacion) => ({
            // ==========================================
            // IDENTIFICACIÓN
            // ==========================================

            id: cotizacion.codigo,

            idCotizacion:
            cotizacion.idCotizacion,

            idProyecto:
            cotizacion.idProyecto,

            idEmpresa:
            cotizacion.idEmpresa,

            idCliente:
            cotizacion.idCliente,

            // ==========================================
            // CLIENTE
            // ==========================================

            cliente:
            cotizacion.nombreCliente,

            email:
            cotizacion.emailCliente,

            telefono:
            cotizacion.telefonoCliente,

            // ==========================================
            // PROYECTO
            // ==========================================

            nombreProyecto:
            cotizacion.nombreProyecto,

            descripcionProyecto:
            cotizacion.descripcionProyecto,

            tipoObra:
            cotizacion.tipoObra,

            codigoTipoObra:
            cotizacion.codigoTipoObra,

            ubicacion:
            cotizacion.ubicacion,

            alto:
            Number(cotizacion.alto),

            ancho:
            Number(cotizacion.ancho),

            largo:
            Number(cotizacion.largo),

            superficie:
            Number(cotizacion.superficie),

            // ==========================================
            // COTIZACIÓN
            // ==========================================

            fecha:
            new Date(
                cotizacion.fechaCreacion
            ).toLocaleDateString("es-UY"),

            total:
            `$ ${Number(
                cotizacion.totalCotizacion
            ).toLocaleString(
                "es-UY",
                {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                }
            )}`,

            costoMateriales:
            Number(
                cotizacion.costoMateriales
            ),

            costoManoObra:
            Number(
                cotizacion.costoManoObra
            ),

            totalCotizacion:
            Number(
                cotizacion.totalCotizacion
            ),

            estado:
            convertirEstado(
                cotizacion.estado
            ),

            precioEstimado:
            cotizacion.precioEstimado !== null
                ? Number(cotizacion.precioEstimado)
                : null,

            observaciones:
            cotizacion.observaciones,

            version:
            Number(cotizacion.version),

            // ==========================================
            // MATERIALES
            // ==========================================

            resumenMateriales:
            cotizacion.resumenMateriales,

            // ==========================================
            // EMPRESA
            // ==========================================

            nombreEmpresa:
            cotizacion.nombreEmpresa,

            // ==========================================
            // MONEDA
            // ==========================================

            moneda:
            cotizacion.moneda,

            tipoCambio:
            Number(cotizacion.tipoCambio),

            precioEstimadoUYU:
            cotizacion.precioEstimadoUYU !== null
                ? Number(cotizacion.precioEstimadoUYU)
                : null,
        })
        );
    }