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

            if (!usuario) {

                return res.status(401).json({
                    mensaje: "Credenciales incorrectas"
                });

            }

            res.status(200).json(usuario);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                mensaje: "Error al iniciar sesión"
            });

        }

    };

}