import { Request, Response } from "express";
import { AuthService } from "../services/RegistroUsuarioService";

export class AuthController {

    private service = new AuthService();

    public registrar = async (
        req: Request,
        res: Response
    ) => {

        try {

            const {
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

            } = req.body;

            const idUsuario =
                await this.service.registrarUsuario(
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

            res.status(201).json({
                mensaje: "Usuario creado",
                idUsuario
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                mensaje: "Error al registrar usuario"
            });

        }
    };
}