import { Request, Response } from "express";
import { LoginService } from "../services/LoginService";

export class LoginController {

    private service = new LoginService();

    public login = async (
        req: Request,
        res: Response
    ) => {

        try {
         
            const {
                gmail,
                password
            } = req.body;
            
            const usuario = await this.service.loginUsuario(
                gmail,
                password
            );

            if (!usuario.existe) {
                return res.status(404).json({
                    mensaje:
                        "El usuario no existe. ¿Querés registrarte?"
                });
            }

            if (!usuario.usuario) {
                return res.status(401).json({
                    mensaje:
                        "La contraseña es incorrecta."
                });
            }

            res.status(200).json(usuario.usuario);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                mensaje: "Error al iniciar sesión"
            });

        }

    };

}