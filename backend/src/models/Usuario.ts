import { IAutenticacion } from "../interfaces/IAutenticacion";


export class Usuario implements IAutenticacion{

    constructor(

        private id : number, 
        private nombreUsuario : string, 
        private rol : string,
        private gmail : string, 
        private telefono : string, 
        private contrasenia : string,
        private direccion : string


    ){}

    public login(): void {
        //logica login
    }

    public logout(): void {
       // logica logout
    }


}