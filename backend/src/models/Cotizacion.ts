export class Cotizacion {
  constructor(
    private _idCotizacion: number | null,
    private _idProyecto: number,
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