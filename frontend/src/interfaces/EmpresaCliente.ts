export interface EmpresaCliente {
  idEmpresa: number;
  nombreEmpresa: string;
  rut: string;
  rubro: string;
  descripcion: string;
  telefono: string;
  email: string;
  direccion: string;
  logo: string;
  paginaWeb: string;
  fechaRegistro: string | null;

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