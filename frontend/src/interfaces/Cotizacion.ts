export type EstadoCotizacion =
  | "Nueva"
  | "En revisión"
  | "Contactado"
  | "Aprobada"
  | "Rechazada"
  | "Finalizada";

export interface Cotizacion {
  id: string;
  cliente: string;
  email: string;
  tipoObra: string;
  fecha: string;
  total: string;
  estado: EstadoCotizacion;
}