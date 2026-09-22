import { Request, Response } from "express";
import { AsistenteIA } from "../services/AsistenteIA";

export class AsistenteIAController {

    private asistente = AsistenteIA.obtenerInstancia();

    public preguntar = async (
        req: Request,
        res: Response
    ) => {

        try {

            const {
                pregunta,
                idProyecto
            } = req.body;

            const respuesta =
                await this.asistente.preguntar(
                    pregunta,
                    idProyecto
                        ? Number(idProyecto)
                        : undefined
                );

            res.status(200).json({
                respuesta
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                mensaje:
                    "Error al consultar al asistente IA"
            });
        }
    };
}