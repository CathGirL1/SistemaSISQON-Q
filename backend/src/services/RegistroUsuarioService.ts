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
}