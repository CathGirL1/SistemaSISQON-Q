import type {
  ManoObraCotizacionInput,
} from "./CotizacionManoObra";

export type EstadoCotizacion =
  | "Borrador"
  | "Enviada"
  | "Revisada"
  | "Aceptada"
  | "Rechazada"
  | "Finalizada";


// ======================================================
// MODELO COTIZACIÓN
// ======================================================

export class Cotizacion {

  constructor(

    private _idCotizacion: number | null,

    private _idProyecto: number,

    private _idEmpresa: number | null,

    private _fechaRealizada: Date | null,

    // ==================================================
    // COSTOS GENERADOS ORIGINALMENTE POR SISCON-Q
    // ==================================================

    private _costoMateriales: number,

    private _costoManoObra: number,

    // ==================================================
    // COSTO ADICIONAL AGREGADO DESDE PANEL EMPRESA
    // ==================================================

    private _costoManoObraAdicional: number,

    // ==================================================
    // DESGLOSE FINAL
    // ==================================================

    private _subtotal: number | null,

    private _porcentajeIVAAplicado: number | null,

    private _montoIVA: number | null,

    private _totalCotizacion: number,

    // ==================================================
    // FECHAS Y ESTADO
    // ==================================================

    private _fechaCreacion: Date | null,

    private _fechaActualizacion: Date | null,

    private _estado: EstadoCotizacion,

    // ==================================================
    // PRECIO ORIGINAL CALCULADO POR SISCON-Q
    // ==================================================

    private _precioEstimado: number | null,

    private _observaciones: string | null,

    private _version: number = 1

  ) {}


  // ======================================================
  // ID COTIZACIÓN
  // ======================================================

  public get idCotizacion(): number | null {

    return this._idCotizacion;

  }

  public set idCotizacion(
    value: number | null
  ) {

    this._idCotizacion = value;

  }


  // ======================================================
  // PROYECTO
  // ======================================================

  public get idProyecto(): number {

    return this._idProyecto;

  }

  public set idProyecto(
    value: number
  ) {

    this._idProyecto = value;

  }


  // ======================================================
  // EMPRESA
  // ======================================================

  public get idEmpresa(): number | null {

    return this._idEmpresa;

  }

  public set idEmpresa(
    value: number | null
  ) {

    this._idEmpresa = value;

  }


  // ======================================================
  // FECHA REALIZADA
  // ======================================================

  public get fechaRealizada(): Date | null {

    return this._fechaRealizada;

  }

  public set fechaRealizada(
    value: Date | null
  ) {

    this._fechaRealizada = value;

  }


  // ======================================================
  // COSTO DE MATERIALES
  // ======================================================

  public get costoMateriales(): number {

    return this._costoMateriales;

  }

  public set costoMateriales(
    value: number
  ) {

    this._costoMateriales = value;

  }


  // ======================================================
  // COSTO MANO DE OBRA ORIGINAL
  // ======================================================

  public get costoManoObra(): number {

    return this._costoManoObra;

  }

  public set costoManoObra(
    value: number
  ) {

    this._costoManoObra = value;

  }


  // ======================================================
  // COSTO MANO DE OBRA ADICIONAL
  // ======================================================

  public get costoManoObraAdicional(): number {

    return this._costoManoObraAdicional;

  }

  public set costoManoObraAdicional(
    value: number
  ) {

    this._costoManoObraAdicional = value;

  }


  // ======================================================
  // SUBTOTAL
  // ======================================================

  public get subtotal(): number | null {

    return this._subtotal;

  }

  public set subtotal(
    value: number | null
  ) {

    this._subtotal = value;

  }


  // ======================================================
  // PORCENTAJE IVA APLICADO
  // ======================================================

  public get porcentajeIVAAplicado(): number | null {

    return this._porcentajeIVAAplicado;

  }

  public set porcentajeIVAAplicado(
    value: number | null
  ) {

    this._porcentajeIVAAplicado = value;

  }


  public get montoIVA(): number | null {

    return this._montoIVA;

  }

  public set montoIVA(
    value: number | null
  ) {

    this._montoIVA = value;

  }



  public get totalCotizacion(): number {

    return this._totalCotizacion;

  }

  public set totalCotizacion(
    value: number
  ) {

    this._totalCotizacion = value;

  }



  public get fechaCreacion(): Date | null {

    return this._fechaCreacion;

  }

  public set fechaCreacion(
    value: Date | null
  ) {

    this._fechaCreacion = value;

  }



  public get fechaActualizacion(): Date | null {

    return this._fechaActualizacion;

  }

  public set fechaActualizacion(
    value: Date | null
  ) {

    this._fechaActualizacion = value;

  }


  public get estado(): EstadoCotizacion {

    return this._estado;

  }

  public set estado(
    value: EstadoCotizacion
  ) {

    this._estado = value;

  }

  public get precioEstimado(): number | null {

    return this._precioEstimado;

  }

  public set precioEstimado(
    value: number | null
  ) {

    this._precioEstimado = value;

  }


  public get observaciones(): string | null {

    return this._observaciones;

  }

  public set observaciones(
    value: string | null
  ) {

    this._observaciones = value;

  }

  public get version(): number {

    return this._version;

  }

  public set version(
    value: number
  ) {

    this._version = value;

  }

}

export interface CrearCotizacionDTO {

  idProyecto: number;

  idEmpresa?: number | null;

  estado: string;

  costoMateriales: number;

  costoManoObra: number;

  totalCotizacion: number;

  precioEstimado: number | null;

  observaciones: string | null;

  version: number;

}

export interface ActualizarCotizacionDTO {

  idEmpresa?: number | null;

  estado?: string;

  costoMateriales?: number;

  costoManoObra?: number;

  totalCotizacion?: number;

  precioEstimado?: number | null;

  observaciones?: string | null;

}

export interface ActualizarCotizacionEmpresaDTO {
  manosObra: ManoObraCotizacionInput[];
  observaciones?: string | null;
}

// ======================================================
// RESULTADO DEL CÁLCULO DESDE PANEL EMPRESA
// ======================================================

export interface CalculoCotizacionEmpresa {

  precioEstimado: number;

  costoManoObraAdicional: number;

  subtotal: number;

  porcentajeIVAAplicado: number;

  montoIVA: number;

  totalCotizacion: number;

}