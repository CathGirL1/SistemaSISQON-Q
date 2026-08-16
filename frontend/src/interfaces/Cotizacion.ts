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
  totalCotizacion: number;

  estado: EstadoCotizacion;

  precioEstimado: number | null;
  observaciones: string | null;
  version: number;

  // ==========================================
  // MATERIALES
  // ==========================================

  resumenMateriales: string;

  // ==========================================
  // EMPRESA
  // ==========================================

  nombreEmpresa: string;

  // ==========================================
  // MONEDA
  // ==========================================

  moneda: string;
  tipoCambio: number;
  precioEstimadoUYU: number | null;
}