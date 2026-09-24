import { Proyecto } from "./Proyecto";

import {
    ITipoObraStrategy,
    MaterialParaCotizacion
} from "../interfaces/ITipoObraStrategy";

import { ResultadoCotizacion } from "../interfaces/ResultadoCotizacion";


export class Quincho implements ITipoObraStrategy {

    /* =====================================================
     * CONFIGURACIÓN
     * ===================================================== */

    // Precio por metro cuadrado de un quincho.
    // Incluye materiales + mano de obra.
    private readonly COSTO_M2_UYU = 6000;


    /* =====================================================
     * CALCULAR COSTO
     * ===================================================== */

    public calcularCosto(
        proyecto: Proyecto,
        materiales: MaterialParaCotizacion[]
    ): ResultadoCotizacion {

        /* =================================================
         * 1. SUPERFICIE
         * =================================================
         *
         * Para Quincho se utiliza:
         *
         * ancho × largo
         *
         * El alto se mantiene como dato del proyecto.
         */

        const superficiePiso =
            proyecto.ancho *
            proyecto.largo;


        /* =================================================
         * 2. COSTO DEL QUINCHO
         * =================================================
         *
         * $6.000 UYU por cada m².
         *
         * Este valor ya incluye:
         * - Materiales
         * - Mano de obra
         */

        const costoConstruccion =
            superficiePiso *
            this.COSTO_M2_UYU;


        /* =================================================
         * 3. MATERIALES
         * =================================================
         *
         * El costo por m² ya contempla los materiales,
         * por lo tanto no se vuelven a sumar.
         */

        const totalMateriales =
            materiales.reduce(
                (total, material) =>
                    total +
                    Number(material.cantidad) *
                    Number(material.costoUnitario),
                0
            );


        /* =================================================
         * 4. MANO DE OBRA
         * =================================================
         *
         * La mano de obra también está incluida dentro
         * del precio de $6.000 UYU por m².
         */

        const manoDeObra =
            costoConstruccion;


        /* =================================================
         * 5. TOTAL GENERAL
         * ================================================= */

        const totalGeneral =
            totalMateriales +
            manoDeObra;


        /* =================================================
         * 6. RESULTADO
         * ================================================= */

        return {

            totalMateriales,

            manoDeObra,

            costoConstruccion,

            totalGeneral,

            moneda: "UYU"
        };
    }
}