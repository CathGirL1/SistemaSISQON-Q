export class Cotizacion {
  constructor(
    private _idCotizacion: number | null,
    private _idProyecto: number,
    private _fechaRealizada: Date | null,
    private _costoMateriales: number,
    private _costoManoObra: number,
    private _totalCotizacion: number,
    private _fechaCreacion: Date | null,
    private _fechaActualizacion: Date | null,
    private _estado: string,
    private _precioEstimado: number | null,
    private _observaciones: string | null
  ) {}

  public get idCotizacion(): number | null {
    return this._idCotizacion;
  }

  public set idCotizacion(value: number | null) {
    this._idCotizacion = value;
  }

  public get idProyecto(): number {
    return this._idProyecto;
  }

  public set idProyecto(value: number) {
    this._idProyecto = value;
  }

  public get fechaRealizada(): Date | null {
    return this._fechaRealizada;
  }

  public set fechaRealizada(value: Date | null) {
    this._fechaRealizada = value;
  }

  public get costoMateriales(): number {
    return this._costoMateriales;
  }

  public set costoMateriales(value: number) {
    this._costoMateriales = value;
  }

  public get costoManoObra(): number {
    return this._costoManoObra;
  }

  public set costoManoObra(value: number) {
    this._costoManoObra = value;
  }

  public get totalCotizacion(): number {
    return this._totalCotizacion;
  }

  public set totalCotizacion(value: number) {
    this._totalCotizacion = value;
  }

  public get fechaCreacion(): Date | null {
    return this._fechaCreacion;
  }

  public set fechaCreacion(value: Date | null) {
    this._fechaCreacion = value;
  }

  public get fechaActualizacion(): Date | null {
    return this._fechaActualizacion;
  }

  public set fechaActualizacion(value: Date | null) {
    this._fechaActualizacion = value;
  }

  public get estado(): string {
    return this._estado;
  }

  public set estado(value: string) {
    this._estado = value;
  }

  public get precioEstimado(): number | null {
    return this._precioEstimado;
  }

  public set precioEstimado(value: number | null) {
    this._precioEstimado = value;
  }

  public get observaciones(): string | null {
    return this._observaciones;
  }

  public set observaciones(value: string | null) {
    this._observaciones = value;
  }
}


// ======================================================
// DATOS PARA GUARDAR UNA COTIZACIÓN
// ======================================================

export interface CrearCotizacionDTO {
  idProyecto: number;
  estado: string;
  costoMateriales: number;
  costoManoObra: number;
  totalCotizacion: number;
  precioEstimado: number | null;
  observaciones: string | null;
}


// ======================================================
// DATOS PARA ACTUALIZAR UNA COTIZACIÓN
// ======================================================

export interface ActualizarCotizacionDTO {
  estado?: string;
  costoMateriales?: number;
  costoManoObra?: number;
  totalCotizacion?: number;
  precioEstimado?: number | null;
  observaciones?: string | null;
}