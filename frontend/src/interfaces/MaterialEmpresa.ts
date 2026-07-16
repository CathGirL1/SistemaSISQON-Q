export type DisponibilidadMaterial =
  | "Disponible"
  | "Stock bajo"
  | "Sin stock";

export type EstadoMaterial = "Activo" | "Inactivo";

export interface MaterialEmpresa {
  id: string;
  nombre: string;
  descripcion: string;

  categoria: string;
  unidad: string;

  costoUnitario: number;
  stockCantidad: number;

  precioActual: string;
  precioDetalle: string;
  ultimaActualizacion: string;

  disponibilidad: DisponibilidadMaterial;
  stock: string;
  estado: EstadoMaterial;
}