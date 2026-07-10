export type EstadoTipoObra = "Activo" | "Inactivo";

export interface TipoObraEmpresa {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  materialesAsociados: number;
  tiempoAproximado: string;
  dificultad: string;
  estado: EstadoTipoObra;
  formulaCalculo: string;
  manoObra: string;
  extras: string;
  observaciones: string;
}