export interface PerfilEmpresa {
  idEmpresa: number;
  idUsuario: number;

  razonSocial: string;
  nombreComercial: string;

  rut: string;
  rubro: string;

  email: string;
  telefono: string;
  direccion: string;

  paginaWeb: string;
  descripcion: string;
  logo: string;

  fechaRegistro: Date | null;
}

export interface ActualizarPerfilEmpresaDTO {
  razonSocial: string;
  nombreComercial: string;

  rut: string;
  rubro: string;

  email: string;
  telefono: string;
  direccion: string;

  paginaWeb: string;
  descripcion: string;
  logo?: string;
}