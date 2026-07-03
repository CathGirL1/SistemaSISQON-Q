import { RecuperacionAccesoRepository } from "../repositories/RecuperacionAccesoRepository";
import { EmailService } from "./EmailService";

export class RecuperacionService {

    private repository = new RecuperacionAccesoRepository();
    private emailService = new EmailService();

    public async obtenerUsuarioPorGmail(
        gmail: string
    ) {

        return await this.repository.buscarUsuarioPorGmail(
            gmail
        );

    }

    public async enviarCodigoVerificacion(
        gmail: string
    ) {

        const usuario = await this.repository.buscarUsuarioPorGmail(
            gmail
        );

        if (!usuario) {

            return null;

        }

        const codigoVerificacion = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        console.log("Código generado:", codigoVerificacion);

        const fechaExpiracionCodigo = new Date();

        fechaExpiracionCodigo.setMinutes(
            fechaExpiracionCodigo.getMinutes() + 10
        );

        await this.repository.guardarCodigoVerificacion(
            usuario.id_Usuario,
            codigoVerificacion,
            fechaExpiracionCodigo
        );

        await this.emailService.enviarCodigoVerificacion(

            gmail,

            codigoVerificacion

        );

        return usuario;

    }

    public async verificarCodigo(gmail: string,codigoIngresado: string) {

        const usuario = await this.repository.obtenerUsuarioPorCodigo(
            gmail
        );

        if (!usuario) {

            return null;

        }

        if (usuario.codigoVerificacion !== codigoIngresado) {

            return {
                valido: false,
                mensaje: "El código de verificación es incorrecto."
            };

        }

        const fechaActual = new Date();

        if (fechaActual > usuario.fechaExpiracionCodigo) {

            return {
                valido: false,
                mensaje: "El código de verificación ha expirado."
            };

        }

        return {
            valido: true,
            rol: usuario.rol
        };

    }

}