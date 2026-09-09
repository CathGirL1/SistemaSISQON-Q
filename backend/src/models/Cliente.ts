export type EstadoCliente =
  | "Nuevo"
  | "Interesado"
  | "Contactado"
  | "Cliente confirmado";

export interface Cliente {
  id_Cliente: number;
  id_Usuario: number;

  cedula: string;
  nombre: string;
  apellido: string;

  nombreUsuario: string;
  gmail: string;
  telefono: string | null;
  direccion: string | null;

  ciudad: string | null;
  estado: EstadoCliente;
  notas: string | null;
  logo: string | null;
}

export interface CrearClienteDTO {
  nombreUsuario: string;
  gmail: string;
  telefono?: string | null;
  password: string;
  direccion?: string | null;

  cedula: string;
  nombre: string;
  apellido: string;

  ciudad?: string | null;
  estado?: EstadoCliente;
  notas?: string | null;
  logo?: string | null;
}

export interface ActualizarClienteDTO {
  nombreUsuario: string;
  gmail: string;
  telefono?: string | null;
  direccion?: string | null;

  cedula: string;
  nombre: string;
  apellido: string;

  ciudad?: string | null;
  estado: EstadoCliente;
  notas?: string | null;
  logo?: string | null;
}