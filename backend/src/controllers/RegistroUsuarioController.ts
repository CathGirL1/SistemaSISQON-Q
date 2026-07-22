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

            if (await this.service.existeGmail(gmail)) {

                return res.status(400).json({
                    mensaje: "El correo electrónico ya está registrado."
                });

            }

            if (await this.service.existeNombreUsuario(nombreUsuario)) {

                return res.status(400).json({
                    mensaje: "El nombre de usuario ya está registrado."
                });

            }

            if (
                rol === "cliente" &&
                cedula &&
                await this.service.existeCedula(cedula)
            ) {

                return res.status(400).json({
                    mensaje: "La cédula ya está registrada."
                });

            }

            if (
                rol === "empresa" &&
                rut &&
                await this.service.existeRut(rut)
            ) {

                return res.status(400).json({
                    mensaje: "El RUT ya está registrado."
                });

            }

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