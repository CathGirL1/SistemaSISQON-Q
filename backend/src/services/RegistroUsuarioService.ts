import { AuthRepository } from "../repositories/RegistroUsuarioRepository";

export class AuthService {

    private repository = new AuthRepository();

    public async registrarUsuario(
        nombreUsuario: string,
        gmail: string,
        telefono: string,
        password: string,
        direccion: string,
        rol: string,

        cedula?: string,
        nombre?: string,
        apellido?: string,

        nombreEmpresa?: string,
        rut?: string
    ) {

        return await this.repository.crearUsuario(
            nombreUsuario,
            gmail,
            telefono,
            password,
            direccion,
            rol,

            cedula,
            nombre,
            apellido,

            nombreEmpresa,
            rut
        );
    }

    
    public async existeGmail(
        gmail: string
    ) {

        return await this.repository.existeGmail(gmail);

    }

    public async existeNombreUsuario(
        nombreUsuario: string
    ) {

        return await this.repository.existeNombreUsuario(nombreUsuario);

    }

    public async existeCedula(
        cedula: string
    ) {

        return await this.repository.existeCedula(cedula);

    }

    public async existeRut(
        rut: string
    ) {

        return await this.repository.existeRut(rut);

    }

}