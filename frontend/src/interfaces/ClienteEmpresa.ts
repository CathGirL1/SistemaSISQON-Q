export type EstadoCliente =
  | "Nuevo"
  | "Interesado"
  | "Contactado"
  | "Cliente confirmado";

export interface HistorialCotizacionCliente {
  id: string;
  fecha: string;
  total: string;
}

export interface ClienteEmpresa {
  id: number;
  iniciales: string;
  nombre: string;
  telefono: string;
  email: string;
  direccion: string;
  ciudad: string;
  historial: string;
  ultimaCotizacion: string;
  estado: EstadoCliente;
  notas: string;
  historialCotizaciones: HistorialCotizacionCliente[];
}