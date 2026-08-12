export class Proyecto {

  constructor(
    private _idProyecto: number | null,
    private _idEmpresa: number | null,
    private _idCliente: number,
    private _tipoObraID: number,

    private _nombre: string,
    private _descripcion: string | null,
    private _ubicacion: string | null,
    private _imagenUrl: string | null,
    private _estado: string,

    private _alto: number,
    private _ancho: number,
    private _largo: number,

    private _fechaCreacion?: Date,
    
  ) {}

  public get idProyecto(): number | null {
    return this._idProyecto;
  }

  public set idProyecto(value: number | null) {
    this._idProyecto = value;
  }

  public get idEmpresa(): number | null {
    return this._idEmpresa;
  }

  public set idEmpresa(value: number | null) {
    this._idEmpresa = value;
  }

  public get idCliente(): number {
    return this._idCliente;
  }

  public set idCliente(value: number) {
    this._idCliente = value;
  }

  public get tipoObraID(): number {
    return this._tipoObraID;
  }

  public set tipoObraID(value: number) {
    this._tipoObraID = value;
  }

  public get nombre(): string {
    return this._nombre;
  }

  public set nombre(value: string) {
    this._nombre = value;
  }

  public get descripcion(): string | null {
    return this._descripcion;
  }

  public set descripcion(value: string | null) {
    this._descripcion = value;
  }

  public get ubicacion(): string | null {
    return this._ubicacion;
  }

  public set ubicacion(value: string | null) {
    this._ubicacion = value;
  }

  public get estado(): string {
    return this._estado;
  }

  public set estado(value: string) {
    this._estado = value;
  }

  public get alto(): number {
    return this._alto;
  }

  public set alto(value: number) {
    this._alto = value;
  }

  public get ancho(): number {
    return this._ancho;
  }

  public set ancho(value: number) {
    this._ancho = value;
  }

  public get largo(): number {
    return this._largo;
  }

  public set largo(value: number) {
    this._largo = value;
  }

  public get fechaCreacion(): Date | undefined {
    return this._fechaCreacion;
  }

  public set fechaCreacion(value: Date | undefined) {
    this._fechaCreacion = value;
  }
  
  public get imagenUrl(): string | null {
    return this._imagenUrl;
  }
  public set imagenUrl(value: string | null) {
    this._imagenUrl = value;
  }
}


export interface CrearProyectoDTO {
  idCliente: number;
  idEmpresa?: number | null;
  idTipoObra: number;
  nombre: string;
  descripcion?: string | null;
  imagenUrl?: string | null;
  ubicacion?: string | null;
  estado?: string;
  alto: number;
  ancho: number;
  largo: number;
  
}