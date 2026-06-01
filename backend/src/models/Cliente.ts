import { Usuario } from "./Usuario";


export class Cliente extends Usuario{

    constructor(

        private cedula : number, 
        private nombre : string, 
        private apellido : string, 
        private usuarioID : number,
        id : number, 
        nombreUsuario : string, 
        rol : string,
        gmail : string, 
        telefono : number, 
        contrasenia : string,
        direccion : string

    ){
        super(id, nombreUsuario, rol, gmail, telefono, contrasenia, direccion);
    }


}