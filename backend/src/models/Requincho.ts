import { Proyecto } from "./Proyecto";

import {
    ITipoObraStrategy,
    MaterialParaCotizacion
} from "../interfaces/ITipoObraStrategy";

import { ResultadoCotizacion } from "../interfaces/ResultadoCotizacion";


export class Requincho implements ITipoObraStrategy {

    /* =====================================================
     * CONFIGURACIÓN
     * ===================================================== */

    // Precio por metro cuadrado de un requincho.
    // Incluye materiales + mano de obra.
    private readonly COSTO_M2_UYU = 3000;


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
         * Para Requincho se utiliza:
         *
         * ancho × largo
         *
         * El alto se mantiene como dato del proyecto,
         * pero no interviene en el precio por m².
         */

        const superficiePiso =
            proyecto.ancho *
            proyecto.largo;


        /* =================================================
         * 2. COSTO DEL REQUINCHO
         * =================================================
         *
         * $3.000 UYU por cada m².
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

        const totalMateriales = 0;


        /* =================================================
         * 4. MANO DE OBRA
         * =================================================
         *
         * La mano de obra también está incluida dentro
         * del precio de $3.000 UYU por m².
         */

        const manoDeObra = 0;


        /* =================================================
         * 5. TOTAL GENERAL
         * ================================================= */

        const totalGeneral =
            costoConstruccion;


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