import { Request, Response } from "express";
import { MonedaService } from "../services/MonedaService";

export class MonedaController {

    private readonly service =
        new MonedaService();

    public obtenerDolarAPesoUruguayo =
        async (
            req: Request,
            res: Response
        ): Promise<void> => {

            try {

                const valor =
                    await this.service
                        .obtenerDolarAPesoUruguayo();

                res.status(200).json({
                    monedaOrigen: "USD",
                    monedaDestino: "UYU",
                    valor,
                    fecha: new Date()
                });

            } catch (error) {

                console.error(
                    "Error obteniendo tipo de cambio:",
                    error
                );

                res.status(500).json({
                    mensaje:
                        "No se pudo obtener el tipo de cambio"
                });
            }
        };
}