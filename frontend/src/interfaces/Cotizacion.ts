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

  moneda: string;
  tipoCambio: number;
  precioEstimadoUYU: number | null;
}