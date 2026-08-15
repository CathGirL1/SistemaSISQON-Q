import { Proyecto } from "./Proyecto";
import {
    ITipoObraStrategy,
    MaterialParaCotizacion
} from "../interfaces/ITipoObraStrategy";
import { ResultadoCotizacion } from "../interfaces/ResultadoCotizacion";

export class Reforma implements ITipoObraStrategy {

    public calcularCosto(
        proyecto: Proyecto,
        materiales: MaterialParaCotizacion[]
    ): ResultadoCotizacion {


        return {
            totalMateriales : 0,
            manoDeObra : 0,
            costoConstruccion : 0,
            totalGeneral : 0
        };
    }
}