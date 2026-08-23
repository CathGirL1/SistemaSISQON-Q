export interface ResultadoCotizacion {

    // ============================================
    // COSTOS
    // ============================================

    totalMateriales: number;

    manoDeObra: number;

    costoConstruccion: number;

    totalGeneral: number;


    // ============================================
    // INFORMACIÓN DE TRABAJO
    // ============================================

    horasEstimadas?: number;

    jornalesEstimados?: number;


    // ============================================
    // SUPERFICIES
    // ============================================

    superficiePiso?: number;

    superficieParedes?: number;

    superficieTrabajo?: number;
    moneda?: "USD" | "UYU";
}