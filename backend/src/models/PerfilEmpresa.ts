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

  zonasTrabajo: string;

  condicionesComerciales: string;

  textoLegal: string;

  impuestos: number | null;
  validezCotizacion: number;

  diasLaborables: string;

  horarioInicio: string;
  horarioFin: string;

  idiomaDocumentos: string;

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

  zonasTrabajo: string;

  condicionesComerciales: string;

  textoLegal: string;

  impuestos: number | null;
  validezCotizacion: number;

  diasLaborables: string;

  horarioInicio: string;
  horarioFin: string;

  idiomaDocumentos: string;

  logo?: string;
}