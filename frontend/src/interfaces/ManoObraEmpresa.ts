export type EstadoManoObra = "Activo" | "Inactivo";

export type UnidadManoObra =
  | "m²"
  | "día"
  | "punto"
  | "unidad"
  | "metro"
  | "hora";

export interface ManoObraEmpresa {
  id: number;
  codigo: string;
  trabajo: string;
  descripcion: string;
  unidad: UnidadManoObra;

  costoBaja: number;
  costoMedia: number;
  costoAlta: number;

  zona: string;
  ultimaActualizacion: string;
  horaActualizacion: string;

  estado: EstadoManoObra;
}