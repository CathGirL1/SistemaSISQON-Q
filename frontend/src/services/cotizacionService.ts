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

  costoManoObraAdicional: number;
  subtotal: number | null;
  porcentajeIVAAplicado: number | null;
  montoIVA: number | null;

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
  materiales: string | null;

  // EMPRESA
  nombreEmpresa: string;

  // MONEDA
  moneda: string;

  tipoCambio: number;

  precioEstimadoUYU: number | null;

  // Snapshot histórico
  tipoCambioUSD: number | null;
  totalUYU: number | null;

  // Conversión preparada por backend
  totalCotizacionUYU: number;

  conversionHistorica: boolean;
}

export interface ManoObraCotizacionDetalle {
  idCotizacionManoObra: number;
  idCotizacion: number;
  idManoObra: number;
  nombre: string;
  unidad: string | null;
  cantidad: number;
  costoUnitario: number;
  subtotal: number;
}

export interface DetalleCotizacionEmpresa {
  manosObra: ManoObraCotizacionDetalle[];
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

const formatearUSD = (valor: number): string => {
  return new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
};

const formatearUYU = (valor: number): string => {
  return `UYU ${new Intl.NumberFormat("es-UY", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valor)}`;
};

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
            cotizacion.fechaCreacion
              ? new Date(
                  cotizacion.fechaCreacion
                ).toLocaleDateString("es-UY")
              : "Sin fecha",

            total: (() => {
              const totalUYU = Number(
                cotizacion.totalCotizacion
              );

              const tipoCambio = Number(
                cotizacion.tipoCambio
              );

              const totalUSD =
                tipoCambio > 0
                  ? totalUYU / tipoCambio
                  : 0;

              return `${formatearUSD(totalUSD)} (${formatearUYU(totalUYU)})`;
            })(),

              costoMateriales:
              Number(
                  cotizacion.costoMateriales
              ),

              costoManoObra:
              Number(
                  cotizacion.costoManoObra
              ),

              costoManoObraAdicional:
              Number(
                  cotizacion.costoManoObraAdicional ?? 0
              ),

              subtotal:
              cotizacion.subtotal !== null &&
              cotizacion.subtotal !== undefined
                  ? Number(cotizacion.subtotal)
                  : null,

              porcentajeIVAAplicado:
              cotizacion.porcentajeIVAAplicado !== null &&
              cotizacion.porcentajeIVAAplicado !== undefined
                  ? Number(cotizacion.porcentajeIVAAplicado)
                  : null,

              montoIVA:
              cotizacion.montoIVA !== null &&
              cotizacion.montoIVA !== undefined
                  ? Number(cotizacion.montoIVA)
                  : null,

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

          materiales:
            cotizacion.materiales
              ? JSON.parse(cotizacion.materiales).map(
                  (material: {
                    idMaterialProyecto: number;
                    idProyecto: number;
                    idMaterial: number;
                    cantidad: number;
                    nombre: string;
                    costoUnitario: number;
                    unidad: string | null;
                    subtotal: number;
                  }) => ({
                    ...material,
                    cantidad: Number(material.cantidad),
                    costoUnitario: Number(material.costoUnitario),
                    subtotal: Number(material.subtotal),
                  })
                )
              : [],

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
            cotizacion.precioEstimadoUYU !== null &&
            cotizacion.precioEstimadoUYU !== undefined
                ? Number(cotizacion.precioEstimadoUYU)
                : null,

            tipoCambioUSD:
            cotizacion.tipoCambioUSD !== null &&
            cotizacion.tipoCambioUSD !== undefined
                ? Number(cotizacion.tipoCambioUSD)
                : null,

            totalUYU:
            cotizacion.totalUYU !== null &&
            cotizacion.totalUYU !== undefined
                ? Number(cotizacion.totalUYU)
                : null,

            totalCotizacionUYU:
            Number(cotizacion.totalCotizacionUYU),

            conversionHistorica:
            Boolean(cotizacion.conversionHistorica),
        })
        );
    }

export interface ManoObraCotizacionData {
  idManoObra: number;
  cantidad: number;
}

export interface ActualizarCotizacionEmpresaData {
  manosObra: ManoObraCotizacionData[];
  observaciones?: string | null;
}

export interface ResultadoCotizacionEmpresa {
  idCotizacion: number;
  precioEstimado: number;
  costoManoObraAdicional: number;

  manosObra: {
    idManoObra: number;
    nombre: string;
    unidad: string | null;
    cantidad: number;
    costoUnitario: number;
    subtotal: number;
  }[];

  subtotal: number;
  porcentajeIVAAplicado: number;
  montoIVA: number;
  totalCotizacion: number;
  observaciones: string | null;
}


// ======================================================
// ACTUALIZAR COTIZACIÓN DESDE PANEL EMPRESA
// ======================================================

export async function actualizarCotizacionDesdeEmpresa(
  idCotizacion: number,
  data: ActualizarCotizacionEmpresaData
): Promise<ResultadoCotizacionEmpresa> {

  const response = await fetch(
    `${API_URL}/api/cotizaciones/${idCotizacion}/empresa`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const resultado = await response.json();

  if (!response.ok) {
    throw new Error(
      resultado.mensaje ||
      "No se pudo actualizar la cotización"
    );
  }

  return resultado.cotizacion;
}


// ======================================================
// FINALIZAR COTIZACIÓN
// ======================================================

export async function finalizarCotizacion(
  idCotizacion: number
): Promise<void> {

  const response = await fetch(
    `${API_URL}/api/cotizaciones/${idCotizacion}/finalizar`,
    {
      method: "PUT",
    }
  );

  const resultado = await response.json();

  if (!response.ok) {
    throw new Error(
      resultado.mensaje ||
      "No se pudo finalizar la cotización"
    );
  }
}

export async function obtenerDetalleCotizacion(
  idCotizacion: number
): Promise<DetalleCotizacionEmpresa> {

  const response = await fetch(
    `${API_URL}/api/cotizaciones/${idCotizacion}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.mensaje ||
      "No se pudo obtener el detalle de la cotización"
    );
  }

  return {
    manosObra:
      (data.manosObra ?? []).map(
        (item: ManoObraCotizacionDetalle) => ({
          ...item,

          idCotizacionManoObra:
            Number(item.idCotizacionManoObra),

          idCotizacion:
            Number(item.idCotizacion),

          idManoObra:
            Number(item.idManoObra),

          cantidad:
            Number(item.cantidad),

          costoUnitario:
            Number(item.costoUnitario),

          subtotal:
            Number(item.subtotal),
        })
      ),
  };
}