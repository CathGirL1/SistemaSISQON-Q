export type EstadoManoObra = "Activo" | "Inactivo";

export class ManoObra {
  constructor(
    public id_ManoObra: number,
    public id_Empresa: number,
    public codigo: string,
    public nombre: string,
    public descripcion: string | null,
    public categoria: string | null,
    public unidad: string | null,
    public costoUnitario: number,
    public observaciones: string | null,
    public ultimaActualizacion: Date,
    public estado: EstadoManoObra
  ) {}
}

export interface CrearManoObraDTO {
  idEmpresa: number;

  nombre: string;
  descripcion?: string | null;
  categoria?: string | null;
  unidad?: string | null;
  costoUnitario: number;
  observaciones?: string | null;
  estado?: EstadoManoObra;
}

export interface ActualizarManoObraDTO {
  nombre: string;
  descripcion?: string | null;
  categoria?: string | null;
  unidad?: string | null;
  costoUnitario: number;
  observaciones?: string | null;
  estado?: EstadoManoObra;
}