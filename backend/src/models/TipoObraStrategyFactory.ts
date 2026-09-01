import { ITipoObraStrategy } from "../interfaces/ITipoObraStrategy";

import { Quincho } from "./Quincho";
import { Reforma } from "./Reforma";
import { Requincho } from "./Requincho";
import { ConstruccionObra } from "./ConstruccionObra";

export class TipoObraStrategyFactory {

    public static obtenerStrategy(
        tipoObra: string
    ): ITipoObraStrategy {

        const tipoNormalizado = tipoObra
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toUpperCase()
            .trim();

        switch (tipoNormalizado) {

            case "QUINCHO":
                return new Quincho();

            case "REFORMA":
                return new Reforma();

            case "REQUINCHO":
                return new Requincho();

            case "CONSTRUCCION":
            case "CONSTRUCCION NUEVA":
                return new ConstruccionObra();

            default:
                throw new Error(
                    `No existe una estrategia para el tipo de obra: ${tipoObra}`
                );
        }
    }
}