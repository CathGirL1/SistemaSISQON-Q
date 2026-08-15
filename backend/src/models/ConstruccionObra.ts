import { Proyecto } from "./Proyecto";
import {
    ITipoObraStrategy,
    MaterialParaCotizacion
} from "../interfaces/ITipoObraStrategy";
import { ResultadoCotizacion } from "../interfaces/ResultadoCotizacion";

export class ConstruccionObra implements ITipoObraStrategy {

    private readonly COSTO_CONSTRUCCION_M2_USD = 800;

    private readonly COSTO_BASE_MANO_OBRA_USD = 300;

    private readonly COSTO_MANO_OBRA_M2_USD = 0.20;

    public calcularCosto(
        proyecto: Proyecto,
        materiales: MaterialParaCotizacion[]
    ): ResultadoCotizacion {

       const superficiePiso =
            proyecto.ancho *
            proyecto.largo;

        const superficieParedes =
            2 * (
                proyecto.ancho *
                proyecto.alto
            ) +
            2 * (
                proyecto.largo *
                proyecto.alto
            );

        const superficieTrabajo =
            superficiePiso +
            superficieParedes;

        const costoConstruccion =
            superficiePiso *
            this.COSTO_CONSTRUCCION_M2_USD;

        const manoDeObra = Math.max(
            this.COSTO_BASE_MANO_OBRA_USD,
            superficieTrabajo *
            this.COSTO_MANO_OBRA_M2_USD
        );

        const totalMateriales =
            materiales.reduce(
                (total, material) =>
                    total +
                    material.cantidad *
                    material.costoUnitario,
                0
            );

        const totalGeneral =
            totalMateriales +
            manoDeObra +
            costoConstruccion;

        return {
            totalMateriales,
            manoDeObra,
            costoConstruccion,
            totalGeneral
        };
    }
}