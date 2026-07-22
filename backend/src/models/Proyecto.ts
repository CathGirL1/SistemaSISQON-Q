export class Proyecto {
    public get idProyecto(): number | null {
        return this._idProyecto;
    }
    public set idProyecto(value: number | null) {
        this._idProyecto = value;
    }
   
   

    constructor(

        private _idProyecto: number | null,
        private _idEmpresa: number | null,
       /*  private _usuarioID: number, */
        private _idCliente: number,
        private _tipoObraID: number,
        private _nombre: string,
        private _estado: string,
        private _alto: number,
        private _ancho: number,
        private _largo: number,
        

    ){}

    /* public get usuarioID(): number {
        return this._usuarioID;
    }
    public set usuarioID(value: number) {
        this._usuarioID = value;
    } */

    public get idCliente(): number {
        return this._idCliente;
    }
    public set idCliente(value: number) {
        this._idCliente = value;
    }
   
    
    public get idEmpresa(): number | null {
        return this._idEmpresa;
    }
    public set idEmpresa(value: number | null) {
        this._idEmpresa = value;
    }

    public get largo(): number {
        return this._largo;
    }
    public set largo(value: number) {
        this._largo = value;
    }
    public get ancho(): number {
        return this._ancho;
    }
    public set ancho(value: number) {
        this._ancho = value;
    }
    public get alto(): number {
        return this._alto;
    }
    public set alto(value: number) {
        this._alto = value;
    }
    public get estado(): string {
        return this._estado;
    }
    public set estado(value: string) {
        this._estado = value;
    }
    public get nombre(): string {
        return this._nombre;
    }
    public set nombre(value: string) {
        this._nombre = value;
    }
    public get tipoObraID(): number {
        return this._tipoObraID;
    }
    public set tipoObraID(value: number) {
        this._tipoObraID = value;
    }

   

    

}