import { Usuario } from "./Usuario";


export class Empresa extends Usuario{
    constructor(
        private idEmpresa : number, 
        private nombre : string, 
        private rut : string, 
        id: number, 
        nombreUsuario : string, 
        rol : string,
        gmail : string, 
        telefono : string, 
        contrasenia : string,
        direccion : string


    ){
        super(id, nombreUsuario, rol, gmail, telefono, contrasenia, direccion);
    }

}