export type DificultadTipoObra =
  | "Baja"
  | "Media"
  | "Alta";

export type EstadoTipoObra =
  | "Activo"
  | "Inactivo";

export interface TipoObra {
  idTipoObra: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;

  materialesAsociados: number;

  tiempoMinDias: number | null;
  tiempoMaxDias: number | null;

  dificultad: DificultadTipoObra;
  estado: EstadoTipoObra;

  formulaCalculo: string | null;
  manoObra: string | null;
  extras: string | null;
  observaciones: string | null;

  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export interface CrearTipoObraDTO {
  nombre: string;
  descripcion?: string | null;

  tiempoMinDias?: number | null;
  tiempoMaxDias?: number | null;

  dificultad: DificultadTipoObra;
  estado?: EstadoTipoObra;

  formulaCalculo?: string | null;
  manoObra?: string | null;
  extras?: string | null;
  observaciones?: string | null;
}

export interface ActualizarTipoObraDTO {
  nombre: string;
  descripcion?: string | null;

  tiempoMinDias?: number | null;
  tiempoMaxDias?: number | null;

  dificultad: DificultadTipoObra;
  estado: EstadoTipoObra;

  formulaCalculo?: string | null;
  manoObra?: string | null;
  extras?: string | null;
  observaciones?: string | null;
}