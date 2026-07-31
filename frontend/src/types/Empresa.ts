export interface Empresa {
  idEmpresa?: number;

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

  fechaRegistro?: string;
}