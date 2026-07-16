export type EstadoMaterial = "Activo" | "Inactivo";

export type DisponibilidadMaterial =
  | "Disponible"
  | "Stock bajo"
  | "Sin stock";

export class Material {
  constructor(
    public id_Material: number,
    public nombre: string,
    public descripcion: string | null,
    public stock: number,
    public costoUnitario: number,
    public categoria: string | null,
    public unidad: string | null,
    public ultimaActualizacion: Date,
    public disponibilidad: DisponibilidadMaterial,
    public estado: EstadoMaterial
  ) {}
}

export interface CrearMaterialDTO {
  nombre: string;
  descripcion?: string | null;
  stock: number;
  costoUnitario: number;
  categoria?: string | null;
  unidad?: string | null;
  disponibilidad?: DisponibilidadMaterial;
  estado?: EstadoMaterial;
}

export interface ActualizarMaterialDTO extends CrearMaterialDTO {}