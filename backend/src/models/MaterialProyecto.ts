

export class MaterialProyecto{
    

    constructor(
        private _idMaterialProyecto: number, 
        private _idProyecto: number,
        private _idMaterial: number, 
        private _cantidad: number

    ){}

    public get cantidad(): number {
        return this._cantidad;
    }
    public set cantidad(value: number) {
        this._cantidad = value;
    }
    public get idMaterial(): number {
        return this._idMaterial;
    }
    public set idMaterial(value: number) {
        this._idMaterial = value;
    }
    public get idMaterialProyecto(): number {
        return this._idMaterialProyecto;
    }
    public set idMaterialProyecto(value: number) {
        this._idMaterialProyecto = value;
    }
    public get idProyecto(): number {
        return this._idProyecto;
    }
    public set idProyecto(value: number) {
        this._idProyecto = value;
    }
}

export interface AgregarMaterialProyectoDTO {
    idProyecto: number;
    idMaterial: number;
    cantidad: number;
}