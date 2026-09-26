export type EstadoManoObra = "Activo" | "Inactivo";

export interface ManoObraEmpresa {
  id: string;
  codigo: string;

  nombre: string;
  descripcion: string;

  categoria: string;
  unidad: string;

  costoUnitario: number;
  costoUnitarioUSD: number;
  tipoCambio: number;

  observaciones: string;

  ultimaActualizacion: string;

  estado: EstadoManoObra;
}