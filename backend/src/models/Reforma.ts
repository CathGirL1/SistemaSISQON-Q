import { Proyecto } from "./Proyecto";

import {
    ITipoObraStrategy,
    MaterialParaCotizacion
} from "../interfaces/ITipoObraStrategy";

import { ResultadoCotizacion } from "../interfaces/ResultadoCotizacion";


export class Reforma implements ITipoObraStrategy {

    /* =====================================================
     * CONFIGURACIÓN BASE
     * ===================================================== */

    // Una jornada laboral equivale a 8 horas.
    private readonly HORAS_POR_JORNADA = 8;

    /*
     * Horas estimadas de trabajo por m² de superficie.
     *
     * Este valor es una referencia general de SISCON-Q.
     * La empresa podrá posteriormente ajustar la cantidad
     * de personal, valor hora, jornales, etc.
     */
    private readonly HORAS_POR_M2 = 0.5;


    /* =====================================================
     * CALCULAR COSTO
     * ===================================================== */

    public calcularCosto(
        proyecto: Proyecto,
        materiales: MaterialParaCotizacion[]
    ): ResultadoCotizacion {

        /* =================================================
         * 1. SUPERFICIE DEL PISO
         * ================================================= */

        const superficiePiso =
            proyecto.ancho *
            proyecto.largo;


        /* =================================================
         * 2. SUPERFICIE DE PAREDES
         * ================================================= */

        const superficieParedes =
            2 * (
                proyecto.ancho *
                proyecto.alto
            ) +
            2 * (
                proyecto.largo *
                proyecto.alto
            );


        /* =================================================
         * 3. SUPERFICIE TOTAL DE TRABAJO
         * ================================================= */

        const superficieTrabajo =
            superficiePiso +
            superficieParedes;


        /* =================================================
         * 4. MATERIALES
         * ================================================= */

        const totalMateriales =
            materiales.reduce(
                (total, material) =>
                    total +
                    material.cantidad *
                    material.costoUnitario,
                0
            );


        /* =================================================
         * 5. HORAS ESTIMADAS
         * =================================================
         *
         * A mayor superficie de trabajo,
         * mayor cantidad de horas estimadas.
         */

        const horasEstimadas =
            superficieTrabajo *
            this.HORAS_POR_M2;


        /* =================================================
         * 6. JORNALES ESTIMADOS
         * =================================================
         *
         * Cada jornal representa 8 horas.
         *
         * Se redondea hacia arriba para obtener
         * jornadas completas.
         */

        const jornalesEstimados =
            Math.ceil(
                horasEstimadas /
                this.HORAS_POR_JORNADA
            );


        /* =================================================
         * 7. MANO DE OBRA
         * =================================================
         *
         * La mano de obra monetaria todavía no se
         * determina automáticamente.
         *
         * La empresa podrá definir posteriormente:
         *
         * - cantidad de trabajadores
         * - costo por hora
         * - costo por jornal
         * - especialidad
         * - adicionales
         * - IVA
         */

        const manoDeObra = 0;


        /* =================================================
         * 8. COSTO DE CONSTRUCCIÓN
         * =================================================
         *
         * Reforma no utiliza el costo de construcción
         * por m² utilizado por ConstruccionObra.
         */

        const costoConstruccion = 0;


        /* =================================================
         * 9. TOTAL GENERAL
         * ================================================= */

        const totalGeneral =
            totalMateriales +
            manoDeObra +
            costoConstruccion;


        /* =================================================
         * 10. RESULTADO
         * ================================================= */

        return {

            // Costos
            totalMateriales,
            manoDeObra,
            costoConstruccion,
            totalGeneral,

            // Información de trabajo
            horasEstimadas,
            jornalesEstimados,

            // Superficies
            superficiePiso,
            superficieParedes,
            superficieTrabajo
        };
    }
}