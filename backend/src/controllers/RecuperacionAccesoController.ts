import { Request, Response } from "express";
import { RecuperacionService } from "../services/RecuperacionAccesoService";

export class RecuperacionAccesoController {

     private service = new RecuperacionService();

    public enviarCodigo = async (
        req: Request,
        res: Response
    ) => {

        try {

            const { gmail } = req.body;

            const usuario = await this.service.enviarCodigoVerificacion(
                gmail
            );

            if (!usuario) {

                return res.status(404).json({
                    mensaje: "No existe una cuenta asociada a ese correo."
                });

            }

            return res.status(200).json({
                mensaje: "Código de verificación generado correctamente."
            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                mensaje: "Error al generar el código de verificación."
            });

        }

    };

    public verificarCodigo = async (req: Request, res: Response) => {

        try {

            const {
                gmail,
                codigoIngresado
            } = req.body;

            const resultado = await this.service.verificarCodigo(
                gmail,
                codigoIngresado
            );

            if (!resultado) {

                return res.status(404).json({
                    mensaje: "No existe una cuenta asociada a ese correo."
                });

            }

            if (!resultado.valido) {

                return res.status(400).json({
                    mensaje: resultado.mensaje
                });

            }

            return res.status(200).json({
                mensaje: "Código verificado correctamente.",
                rol: resultado.rol
            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                mensaje: "Error al verificar el código."
            });

        }

    };

}