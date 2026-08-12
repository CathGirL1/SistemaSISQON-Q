import { ITipoObraStrategy } from "../interfaces/ITipoObraStrategy";

import { Quincho } from "./Quincho";
import { Reforma } from "./Reforma";
import { Requincho } from "./Requincho";
import { ConstruccionObra } from "./ConstruccionObra";

export class TipoObraStrategyFactory {

    public static obtenerStrategy(
        codigoTipoObra: string
    ): ITipoObraStrategy {

        switch (codigoTipoObra.toUpperCase()) {

            case "QUINCHO":
                return new Quincho();

            case "REFORMA":
                return new Reforma();

            case "REQUINCHO":
                return new Requincho();

            case "CONSTRUCCION":
                return new ConstruccionObra();

            default:
                throw new Error(
                    `No existe una estrategia para el tipo de obra: ${codigoTipoObra}`
                );
        }
    }
}