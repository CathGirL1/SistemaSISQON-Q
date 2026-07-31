export interface PerfilUsuario {
  idUsuario: number;
  nombreUsuario: string;
  gmail: string;
  telefono: string;
  direccion: string;
  rol: string;

  nombre: string;
  apellido: string;
  ciudad: string;
  pais: string;
  cargo: string;
  departamento: string;
  zonaTrabajo: string;

  idioma: string;
  moneda: string;
  zonaHoraria: string;
  fotoPerfil: string | null;

  fechaRegistro: Date | null;
  ultimoAcceso: Date | null;
}

export interface ActualizarPerfilUsuarioDTO {
  nombreUsuario: string;
  gmail: string;
  telefono: string;
  direccion: string;

  nombre: string;
  apellido: string;
  ciudad: string;
  pais: string;
  cargo: string;
  departamento: string;
  zonaTrabajo?: string;

  idioma?: string;
  moneda?: string;
  zonaHoraria?: string;
  fotoPerfil?: string | null;
}