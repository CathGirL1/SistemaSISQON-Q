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

  fechaRegistro?: string | null;

  zonasTrabajo: string;

  condicionesComerciales: string;

  textoLegal: string;

  impuestos: string;

  validezCotizacion: number;

  diasLaborables: string;

  horarioInicio: string;

  horarioFin: string;

  idiomaDocumentos: string;
}