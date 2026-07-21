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
  idUsuario: number;

  cedula: string;
  nombreUsuario: string;

  iniciales: string;
  nombre: string;
  nombreReal: string;
  apellido: string;

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