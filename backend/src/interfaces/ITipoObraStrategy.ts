import { Proyecto } from "../models/Proyecto";
import { ResultadoCotizacion } from "./ResultadoCotizacion";

export interface MaterialParaCotizacion {
    cantidad: number;
    costoUnitario: number;
}

export interface ITipoObraStrategy {

    calcularCosto(
        proyecto: Proyecto,
        materiales: MaterialParaCotizacion[]
    ): ResultadoCotizacion;

}