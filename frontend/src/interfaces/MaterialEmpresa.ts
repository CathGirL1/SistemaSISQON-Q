export type DisponibilidadMaterial = "Disponible" | "Stock bajo" | "Sin stock";
export type EstadoMaterial = "Activo" | "Inactivo";

export interface MaterialEmpresa {
  id: string;
  nombre: string;
  categoria: string;
  unidad: string;
  precioActual: string;
  precioDetalle: string;
  ultimaActualizacion: string;
  disponibilidad: DisponibilidadMaterial;
  stock: string;
  estado: EstadoMaterial;
}