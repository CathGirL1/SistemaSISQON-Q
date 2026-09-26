export type EstadoCotizacion =
  | "Nueva"
  | "En revisión"
  | "Contactado"
  | "Aprobada"
  | "Rechazada"
  | "Finalizada";

export interface Cotizacion {
  // ==========================================
  // IDENTIFICACIÓN
  // ==========================================

  id: string;
  idCotizacion: number;
  idProyecto: number;
  idEmpresa: number;
  idCliente: number;

  // ==========================================
  // CLIENTE
  // ==========================================

  cliente: string;
  email: string;
  telefono: string | null;

  // ==========================================
  // PROYECTO
  // ==========================================

  nombreProyecto: string;
  descripcionProyecto: string | null;

  tipoObra: string;
  codigoTipoObra: string;

  ubicacion: string;

  alto: number;
  ancho: number;
  largo: number;
  superficie: number;

  // ==========================================
  // COTIZACIÓN
  // ==========================================

  fecha: string;

  total: string;

  costoMateriales: number;
  costoManoObra: number;

  // Mano de obra agregada desde Panel Empresa
  costoManoObraAdicional: number;

  // Precio original generado por SISCON-Q
  precioEstimado: number | null;

  // Cálculo realizado por la empresa
  subtotal: number | null;

  porcentajeIVAAplicado: number | null;

  montoIVA: number | null;

  totalCotizacion: number;

  estado: EstadoCotizacion;

  observaciones: string | null;

  version: number;

  // ==========================================
  // MATERIALES
  // ==========================================



  resumenMateriales: string;
  materiales: {
    idMaterialProyecto: number;
    idProyecto: number;
    idMaterial: number;
    cantidad: number;
    nombre: string;
    costoUnitario: number;
    unidad: string | null;
    subtotal: number;
  }[];

  // ==========================================
  // EMPRESA
  // ==========================================

  nombreEmpresa: string;

  // ==========================================
  // MONEDA
  // ==========================================

  // Moneda base de la cotización
  moneda: string;

  // Tipo de cambio utilizado para mostrar la conversión.
  // Si está Finalizada, corresponde al histórico.
  // Si no está Finalizada, corresponde al actual.
  tipoCambio: number;

  // Tipo de cambio histórico guardado al finalizar.
  // NULL mientras la cotización no esté finalizada.
  tipoCambioUSD: number | null;

  // Precio estimado convertido a pesos uruguayos.
  precioEstimadoUYU: number | null;

  costoMaterialesUYU: number;
  costoManoObraUYU: number;

  // Total convertido a pesos.
  // Si está Finalizada, este valor es el snapshot histórico.
  totalUYU: number | null;

  // Total UYU que entrega el backend para mostrar.
  // Histórico si está Finalizada, actual si todavía no lo está.
  totalCotizacionUYU: number;

  // Indica si la conversión quedó congelada al finalizar.
  conversionHistorica: boolean;
}