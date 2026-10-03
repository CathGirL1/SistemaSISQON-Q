
import { CotizacionRepository } from "../repositories/CotizacionRepository";
import { ProyectoRepository } from "../repositories/ProyectoRepository";
import { TipoObraStrategyFactory } from "../models/TipoObraStrategyFactory";
import { MonedaService } from "./MonedaService";
import { ManoObraService } from "./ManoObraService";
import { CotizacionManoObraRepository } from "../repositories/CotizacionManoObraRepository";

import type {
    CrearCotizacionDTO,
    ActualizarCotizacionDTO,
    ActualizarCotizacionEmpresaDTO,
} from "../models/Cotizacion";

const ESTADOS_VALIDOS = [
    "Borrador",
    "Enviada",
    "Revisada",
    "Aceptada",
    "Rechazada",
    "Finalizada",
] as const;

export class CotizacionService {

    private repository = new CotizacionRepository();

    private readonly monedaService =
        new MonedaService();

    private proyectoRepository =
        new ProyectoRepository();

    private manoObraService =
        new ManoObraService();

    private cotizacionManoObraRepository =
        new CotizacionManoObraRepository();


    // =========================================================
    // CREAR COTIZACIÓN
    // =========================================================

    public async crearCotizacion(
        data: CrearCotizacionDTO
    ): Promise<number> {

        this.validarId(
            data.idProyecto,
            "El id del proyecto no es válido"
        );

        const proyectoExiste =
            await this.repository.existeProyecto(
                data.idProyecto
            );

        if (!proyectoExiste) {
            throw new Error(
                "Proyecto no encontrado"
            );
        }

        if (data.estado !== undefined) {
            this.validarEstado(data.estado);
        }

        this.validarCosto(
            data.costoMateriales,
            "El costo de materiales"
        );

        this.validarCosto(
            data.costoManoObra,
            "El costo de mano de obra"
        );

        this.validarCosto(
            data.totalCotizacion,
            "El total de la cotización"
        );

        if (data.precioEstimado !== undefined) {
            this.validarPrecio(
                data.precioEstimado
            );
        }

        if (data.observaciones !== undefined) {
            this.validarObservaciones(
                data.observaciones
            );
        }

        const estado =
            data.estado?.trim() ||
            "Borrador";

        // Si ya existe un borrador para este proyecto,
        // reutilizamos esa cotización.
        if (estado === "Borrador") {

            const borradorExistente =
                await this.repository
                    .obtenerCotizacionBorradorPorProyecto(
                        data.idProyecto
                    );

            if (borradorExistente) {
                return borradorExistente.idCotizacion;
            }
        }

        // =========================================
        // Obtener próxima versión
        // =========================================

        const version =
            await this.repository.obtenerProximaVersion(
                data.idProyecto
            );

        return this.repository.crearCotizacion({

            idProyecto:
                data.idProyecto,

            estado,

            costoMateriales:
                data.costoMateriales,

            costoManoObra:
                data.costoManoObra,

            totalCotizacion:
                data.totalCotizacion,

            precioEstimado:
                data.precioEstimado ?? null,

            observaciones:
                data.observaciones !== undefined
                    ? data.observaciones?.trim() || null
                    : null,

            version,
        });
    }

    // =========================================================
    // OBTENER ESTADÍSTICAS DEL CLIENTE
    // =========================================================

    public async obtenerEstadisticasCliente(
        idCliente: number
    ) {

        this.validarId(
            idCliente,
            "El id del cliente no es válido"
        );

        return await this.repository
            .obtenerEstadisticasCliente(idCliente);
    }


    // =========================================================
    // GENERAR COTIZACIÓN AUTOMÁTICAMENTE
    // =========================================================

    public async generarCotizacion(
        idProyecto: number
    ): Promise<number> {

        this.validarId(
            idProyecto,
            "El id del proyecto no es válido"
        );

        // =========================================
        // 1. Obtener proyecto
        // =========================================

        const proyecto =
            await this.proyectoRepository
                .obtenerProyectoPorId(
                    idProyecto
                );

        if (!proyecto) {
            throw new Error(
                "Proyecto no encontrado"
            );
        }

        // =========================================
        // 2. Obtener información del proyecto
        // =========================================

        const proyectoCotizacion =
            await this.repository
                .obtenerProyectoParaCotizacion(
                    idProyecto
                );

        if (!proyectoCotizacion) {
            throw new Error(
                "No se pudo obtener la información del tipo de obra"
            );
        }

        const tipoObra =
            proyectoCotizacion.tipoObra;

        if (!tipoObra) {
            throw new Error(
                "El proyecto no tiene un tipo de obra válido"
            );
        }

        // =========================================
        // 3. Obtener Strategy
        // =========================================

        const strategy =
            TipoObraStrategyFactory.obtenerStrategy(
                tipoObra
            );

        // =========================================
        // 4. Obtener materiales actuales
        // =========================================

        const materiales =
            await this.repository
                .obtenerMaterialesDelProyecto(
                    idProyecto
                );

        // =========================================
        // 5. Preparar materiales
        // =========================================

        const materialesParaCotizacion =
            materiales.map(material => {

                const cantidad =
                    Number(material.cantidad);

                const costoUnitario =
                    Number(material.costoUnitario);

                if (
                    !Number.isFinite(cantidad) ||
                    cantidad < 0
                ) {
                    throw new Error(
                        `Cantidad inválida para el material "${material.nombre}"`
                    );
                }

                if (
                    !Number.isFinite(costoUnitario) ||
                    costoUnitario < 0
                ) {
                    throw new Error(
                        `Costo inválido para el material "${material.nombre}"`
                    );
                }

                return {
                    cantidad,
                    costoUnitario
                };
            });

        // =========================================
        // 6. Calcular cotización
        // =========================================

        const resultado =
            strategy.calcularCosto(
                proyecto,
                materialesParaCotizacion
            );

        let totalGeneralUSD = resultado.totalGeneral;
        let totalMaterialesUSD = resultado.totalMateriales;
        let manoDeObraUSD = resultado.manoDeObra;

        if (resultado.moneda === "UYU") {

            const tipoCambio =
                await this.monedaService
                    .obtenerDolarAPesoUruguayo();

            totalGeneralUSD =
                resultado.totalGeneral / tipoCambio;

            totalMaterialesUSD =
                resultado.totalMateriales / tipoCambio;

            manoDeObraUSD =
                resultado.manoDeObra / tipoCambio;
        }
        // =========================================
        // 7. Validar resultado
        // =========================================

        this.validarCosto(
            resultado.totalMateriales,
            "El costo de materiales"
        );

        this.validarCosto(
            resultado.manoDeObra,
            "El costo de mano de obra"
        );

        this.validarCosto(
            resultado.costoConstruccion,
            "El costo de construcción"
        );

        this.validarCosto(
            resultado.totalGeneral,
            "El total de la cotización"
        );

        const detalleCalculoReforma =
            resultado.horasEstimadas !== undefined
                ? {
                    horasEstimadas:
                        resultado.horasEstimadas,

                    jornalesEstimados:
                        resultado.jornalesEstimados,

                    superficiePiso:
                        resultado.superficiePiso,

                    superficieParedes:
                        resultado.superficieParedes,

                    superficieTrabajo:
                        resultado.superficieTrabajo,
                }
                : undefined;

        // =========================================
        // Verificar si ya existe un borrador
        // =========================================

        const borradorExistente =
            await this.repository
                .obtenerCotizacionBorradorPorProyecto(
                    idProyecto
                );

        if (borradorExistente) {

            await this.repository.actualizarCotizacion(
                borradorExistente.idCotizacion,
                {
                    costoMateriales: totalMaterialesUSD,

                    costoManoObra: manoDeObraUSD,

                    totalCotizacion:
                        totalGeneralUSD,

                    precioEstimado:
                        totalGeneralUSD
                }
            );

            return borradorExistente.idCotizacion;
        }

        // =========================================
        // 8. Obtener próxima versión
        // =========================================

        const version =
            await this.repository.obtenerProximaVersion(
                idProyecto
            );

        // =========================================
        // 9. Crear nueva cotización
        // =========================================

        const idEmpresa =
            Number(proyectoCotizacion.idEmpresa);

        if (
            !Number.isInteger(idEmpresa) ||
            idEmpresa <= 0
        ) {
            throw new Error(
                "El proyecto no tiene una empresa asociada válida"
            );
        }
        return this.repository.crearCotizacion({

            idProyecto,
            idEmpresa,
            estado: "Borrador",

            costoMateriales:
                resultado.moneda === "UYU"
                    ? 0
                    : resultado.totalMateriales,

            costoManoObra:
                resultado.moneda === "UYU"
                    ? 0
                    : resultado.manoDeObra,

            totalCotizacion:
                totalGeneralUSD,

            precioEstimado:
                totalGeneralUSD,

            observaciones:
                null,

            version,
        });
    }


    // =========================================================
    // ACTUALIZAR / GENERAR NUEVA VERSIÓN
    // =========================================================

    public async actualizarCotizacion(
        idCotizacion: number,
        data: ActualizarCotizacionDTO
    ): Promise<number> {

        this.validarId(
            idCotizacion,
            "El id de la cotización no es válido"
        );

        // =========================================
        // 1. Obtener cotización anterior
        // =========================================

        const cotizacion =
            await this.repository
                .obtenerCotizacionPorId(
                    idCotizacion
                );

        if (!cotizacion) {
            throw new Error(
                "Cotización no encontrada"
            );
        }

        if (cotizacion.estado === "Finalizada") {
            throw new Error(
                "La cotización está finalizada y no puede ser modificada."
            );
        }

        if (data.estado?.trim() === "Finalizada") {
            throw new Error(
                "Una cotización solo puede finalizarse mediante la operación de finalización."
            );
        }

        const soloEdicion =
            (data.estado !== undefined ||
                data.observaciones !== undefined) &&
            Object.keys(data).every(
                campo =>
                    campo === "estado" ||
                    campo === "observaciones"
            );

        if (soloEdicion) {

            const nuevoEstado = data.estado;

            if (nuevoEstado !== undefined) {

                this.validarEstado(nuevoEstado);

                if (nuevoEstado.trim() === "Enviada") {
                    throw new Error(
                        "La cotización debe enviarse mediante la opción Enviar cotización"
                    );
                }

                if (nuevoEstado.trim() === "Finalizada") {
                    throw new Error(
                        "Una cotización solo puede finalizarse mediante la operación de finalización."
                    );
                }
            }

            if (data.observaciones !== undefined) {
                this.validarObservaciones(
                    data.observaciones
                );
            }

            const actualizado =
                await this.repository.actualizarCotizacion(
                    idCotizacion,
                    {
                        ...(data.estado !== undefined && {
                            estado: data.estado.trim()
                        }),

                        ...(data.observaciones !== undefined && {
                            observaciones:
                                data.observaciones?.trim() || null
                        })
                    }
                );

            if (!actualizado) {
                throw new Error(
                    "No se pudo actualizar la cotización"
                );
            }

            return idCotizacion;
        }

        // =========================================
        // 2. Obtener proyecto asociado
        // =========================================

        const idProyecto =
            Number(cotizacion.idProyecto);

        this.validarId(
            idProyecto,
            "El id del proyecto no es válido"
        );

        // =========================================
        // 3. Verificar que el proyecto exista
        // =========================================

        const proyectoExiste =
            await this.repository.existeProyecto(
                idProyecto
            );

        if (!proyectoExiste) {
            throw new Error(
                "Proyecto asociado a la cotización no encontrado"
            );
        }

        // =========================================
        // 4. Obtener datos ACTUALES del proyecto
        // =========================================

        const proyecto =
            await this.proyectoRepository
                .obtenerProyectoPorId(
                    idProyecto
                );

        if (!proyecto) {
            throw new Error(
                "Proyecto no encontrado"
            );
        }

        // =========================================
        // 5. Obtener tipo de obra actual
        // =========================================

        const proyectoCotizacion =
            await this.repository
                .obtenerProyectoParaCotizacion(
                    idProyecto
                );

        if (!proyectoCotizacion) {
            throw new Error(
                "No se pudo obtener la información del proyecto"
            );
        }

        const tipoObra =
            proyectoCotizacion.tipoObra;

        if (!tipoObra) {
            throw new Error(
                "El proyecto no tiene un tipo de obra válido"
            );
        }

        // =========================================
        // 6. Obtener Strategy actual
        // =========================================

        const strategy =
            TipoObraStrategyFactory.obtenerStrategy(
                tipoObra
            );

        // =========================================
        // 7. Obtener materiales ACTUALES
        // =========================================

        const materiales =
            await this.repository
                .obtenerMaterialesDelProyecto(
                    idProyecto
                );

        // =========================================
        // 8. Preparar materiales
        // =========================================

        const materialesParaCotizacion =
            materiales.map(material => {

                const cantidad =
                    Number(material.cantidad);

                const costoUnitario =
                    Number(material.costoUnitario);

                if (
                    !Number.isFinite(cantidad) ||
                    cantidad < 0
                ) {
                    throw new Error(
                        `Cantidad inválida para el material "${material.nombre}"`
                    );
                }

                if (
                    !Number.isFinite(costoUnitario) ||
                    costoUnitario < 0
                ) {
                    throw new Error(
                        `Costo inválido para el material "${material.nombre}"`
                    );
                }

                return {
                    cantidad,
                    costoUnitario
                };
            });

        // =========================================
        // 9. Recalcular
        // =========================================

        const resultado =
            strategy.calcularCosto(
                proyecto,
                materialesParaCotizacion
            );

        // =========================================
        // 10. Validar resultado
        // =========================================

        this.validarCosto(
            resultado.totalMateriales,
            "El costo de materiales"
        );

        this.validarCosto(
            resultado.manoDeObra,
            "El costo de mano de obra"
        );

        this.validarCosto(
            resultado.costoConstruccion,
            "El costo de construcción"
        );

        this.validarCosto(
            resultado.totalGeneral,
            "El total de la cotización"
        );

        // =========================================
        // Verificar si ya existe un borrador
        // =========================================

        const borradorExistente =
            await this.repository
                .obtenerCotizacionBorradorPorProyecto(
                    idProyecto
                );

        if (borradorExistente) {
            return borradorExistente.idCotizacion;
        }

        // =========================================
        // 11. Obtener próxima versión
        // =========================================

        const version =
            await this.repository.obtenerProximaVersion(
                idProyecto
            );

        // =========================================
        // 12. Crear NUEVA cotización
        //
        // La anterior NO se modifica.
        // =========================================

        return this.repository.crearCotizacion({

            idProyecto,

            estado:
                data.estado?.trim() ||
                "Borrador",

            costoMateriales:
                resultado.totalMateriales,

            costoManoObra:
                resultado.manoDeObra,

            totalCotizacion:
                resultado.totalGeneral,

            precioEstimado:
                resultado.totalGeneral,

            observaciones:
                data.observaciones !== undefined
                    ? data.observaciones?.trim() || null
                    : null,

            version,
        });
    }


    // =========================================================
    // OBTENER POR CLIENTE
    // =========================================================

    public async obtenerCotizacionesPorCliente(
        idCliente: number
    ) {

        this.validarId(
            idCliente,
            "El id del cliente no es válido"
        );

        const cotizaciones =
            await this.repository
                .obtenerCotizacionesPorCliente(
                    idCliente
                );

        const tipoCambio =
            await this.monedaService
                .obtenerDolarAPesoUruguayo();

        return cotizaciones.map((cotizacion) => {

            const precioEstimadoUYU =
                cotizacion.precioEstimado !== null
                    ? Number(cotizacion.precioEstimado) *
                    tipoCambio
                    : null;

            return {
                ...cotizacion,

                moneda: "USD",

                tipoCambio,

                precioEstimadoUYU,
            };
        });
    }


    // =========================================================
    // OBTENER POR PROYECTO
    // =========================================================

    public async obtenerCotizacionesPorProyecto(
        idProyecto: number
    ) {

        this.validarId(
            idProyecto,
            "El id del proyecto no es válido"
        );

        const proyectoExiste =
            await this.repository
                .existeProyecto(
                    idProyecto
                );

        if (!proyectoExiste) {
            throw new Error(
                "Proyecto no encontrado"
            );
        }

        const cotizaciones =
            await this.repository
                .obtenerCotizacionesPorProyecto(
                    idProyecto
                );

        return this.agregarConversionMonetaria(
            cotizaciones
        );
    }


    // =========================================================
    // OBTENER POR ID
    // =========================================================

    public async obtenerCotizacionPorId(
        idCotizacion: number
    ) {

        this.validarId(
            idCotizacion,
            "El id de la cotización no es válido"
        );

        const cotizacion =
            await this.repository
                .obtenerCotizacionPorId(
                    idCotizacion
                );

        if (!cotizacion) {
            throw new Error(
                "Cotización no encontrada"
            );
        }

        const resultado =
            await this.agregarConversionMonetaria(
                [cotizacion]
            );

        const cotizacionFinal =
            resultado[0];

        // =====================================================
        // DETALLE ESPECÍFICO DE REFORMA
        // =====================================================

        const proyecto =
            await this.proyectoRepository
                .obtenerProyectoPorId(
                    cotizacion.idProyecto
                );

        if (!proyecto) {
            throw new Error(
                "Proyecto no encontrado"
            );
        }

        const proyectoCotizacion =
            await this.repository
                .obtenerProyectoParaCotizacion(
                    cotizacion.idProyecto
                );

        if (!proyectoCotizacion) {
            throw new Error(
                "No se pudo obtener el tipo de obra"
            );
        }

        const strategy =
            TipoObraStrategyFactory.obtenerStrategy(
                proyectoCotizacion.tipoObra
            );

        const materiales =
            await this.repository
                .obtenerMaterialesDelProyecto(
                    cotizacion.idProyecto
                );

        const materialesParaCotizacion =
            materiales.map(material => ({
                cantidad:
                    Number(material.cantidad),

                costoUnitario:
                    Number(material.costoUnitario)
            }));

        const calculo =
            strategy.calcularCosto(
                proyecto,
                materialesParaCotizacion
            );

        const manosObra =
            await this.cotizacionManoObraRepository
                .obtenerPorCotizacion(
                    idCotizacion
                );
        // =====================================================
        // RESULTADO
        // =====================================================

        return {
            ...cotizacionFinal,
            manosObra,

            costoConstruccion:
                calculo.costoConstruccion,

            monedaCalculo:
                calculo.moneda,

            ...(proyectoCotizacion.codigoTipoObra === "OBR-000003"
                ? {
                    detalleCalculoReforma: {
                        horasEstimadas:
                            calculo.horasEstimadas,

                        jornalesEstimados:
                            calculo.jornalesEstimados,

                        superficiePiso:
                            calculo.superficiePiso,

                        superficieParedes:
                            calculo.superficieParedes,

                        superficieTrabajo:
                            calculo.superficieTrabajo
                    }
                }
                : {})
        };

    }
    // =========================================================
    // OBTENER COTIZACIONES POR EMPRESA
    // =========================================================

    public async obtenerCotizacionesPorEmpresa(
        idEmpresa: number
    ) {

        this.validarId(
            idEmpresa,
            "El id de la empresa no es válido"
        );

        const cotizaciones =
            await this.repository
                .obtenerCotizacionesPorEmpresa(
                    idEmpresa
                );

        return this.agregarConversionMonetaria(
            cotizaciones
        );
    }


    // =========================================================
    // CREAR PROPUESTA PARA EMPRESA
    // =========================================================

    public async crearPropuestaEmpresa(
        idCotizacionBase: number,
        idEmpresa: number
    ): Promise<number> {

        this.validarId(
            idCotizacionBase,
            "El id de la cotización no es válido"
        );

        this.validarId(
            idEmpresa,
            "El id de la empresa no es válido"
        );

        const cotizacionBase =
            await this.repository.obtenerCotizacionPorId(
                idCotizacionBase
            );

        if (!cotizacionBase) {
            throw new Error(
                "Cotización base no encontrada"
            );
        }

        const version =
            await this.repository.obtenerProximaVersion(
                cotizacionBase.idProyecto
            );

        return this.repository.crearCotizacion({

            idProyecto:
                cotizacionBase.idProyecto,

            idEmpresa,

            estado:
                "Borrador",

            costoMateriales:
                cotizacionBase.costoMateriales,

            costoManoObra:
                cotizacionBase.costoManoObra,

            totalCotizacion:
                cotizacionBase.totalCotizacion,

            precioEstimado:
                cotizacionBase.precioEstimado,

            observaciones:
                cotizacionBase.observaciones,

            version,
        });
    }


    // =========================================================
    // ACTUALIZAR PROPUESTA DE EMPRESA
    // =========================================================

    public async actualizarPropuestaEmpresa(
        idCotizacion: number,
        costoMateriales: number,
        costoManoObra: number,
        observaciones?: string | null
    ): Promise<void> {

        this.validarId(
            idCotizacion,
            "El id de la cotización no es válido"
        );

        const cotizacion =
            await this.repository.obtenerCotizacionPorId(
                idCotizacion
            );

        if (!cotizacion) {
            throw new Error(
                "Cotización no encontrada"
            );
        }

        if (!cotizacion.idEmpresa) {
            throw new Error(
                "La cotización no está asociada a una empresa"
            );
        }

        if (
            !Number.isFinite(costoMateriales) ||
            costoMateriales < 0
        ) {
            throw new Error(
                "El costo de materiales no es válido"
            );
        }

        if (
            !Number.isFinite(costoManoObra) ||
            costoManoObra < 0
        ) {
            throw new Error(
                "El costo de mano de obra no es válido"
            );
        }

        const totalCotizacion =
            costoMateriales + costoManoObra;

        await this.repository.actualizarCotizacion(
            idCotizacion,
            {
                costoMateriales,
                costoManoObra,
                totalCotizacion,
                precioEstimado: totalCotizacion,
                observaciones:
                    observaciones !== undefined
                        ? observaciones
                        : cotizacion.observaciones,
            }
        );
    }


    // =========================================================
    // AGREGAR CONVERSIÓN USD → UYU
    // =========================================================

    private async agregarConversionMonetaria(
        cotizaciones: any[]
    ) {

        if (cotizaciones.length === 0) {
            return [];
        }

        // Se obtiene el cambio actual una sola vez.
        // Solo será utilizado por cotizaciones no finalizadas.
        const tipoCambioActual =
            await this.monedaService
                .obtenerDolarAPesoUruguayo();

        return cotizaciones.map((cotizacion) => {

            const esFinalizada =
                cotizacion.estado === "Finalizada";

            // =================================================
            // COTIZACIÓN FINALIZADA
            // =================================================
            //
            // Utiliza exclusivamente el snapshot histórico
            // guardado al momento de finalizar.
            // =================================================

            if (
                esFinalizada &&
                cotizacion.tipoCambioUSD !== null &&
                cotizacion.tipoCambioUSD !== undefined &&
                cotizacion.totalUYU !== null &&
                cotizacion.totalUYU !== undefined
            ) {

                const tipoCambioHistorico =
                    Number(cotizacion.tipoCambioUSD);

                return {
                    ...cotizacion,

                    moneda: "USD",

                    tipoCambio:
                        tipoCambioHistorico,

                    costoMaterialesUYU:
                        Number(cotizacion.costoMateriales) *
                        tipoCambioHistorico,

                    costoManoObraUYU:
                        Number(cotizacion.costoManoObra) *
                        tipoCambioHistorico,

                    precioEstimadoUYU:
                        cotizacion.precioEstimado !== null
                            ? Number(cotizacion.precioEstimado) *
                            tipoCambioHistorico
                            : null,

                    totalCotizacionUYU:
                        Number(cotizacion.totalUYU),

                    conversionHistorica: true
                };
            }

            // =================================================
            // COTIZACIÓN NO FINALIZADA
            // =================================================
            //
            // Se utiliza el tipo de cambio actual.
            // Esta conversión todavía puede variar.
            // =================================================

            return {
                ...cotizacion,

                moneda: "USD",

                tipoCambio:
                    tipoCambioActual,

                costoMaterialesUYU:
                    Number(cotizacion.costoMateriales) *
                    tipoCambioActual,

                costoManoObraUYU:
                    Number(cotizacion.costoManoObra) *
                    tipoCambioActual,

                totalCotizacionUYU:
                    Number(cotizacion.totalCotizacion) *
                    tipoCambioActual,

                precioEstimadoUYU:
                    cotizacion.precioEstimado !== null
                        ? Number(cotizacion.precioEstimado) *
                        tipoCambioActual
                        : null,

                conversionHistorica: false
            };
        });
    }


    // =========================================================
    // ELIMINAR COTIZACIÓN
    // =========================================================

    public async eliminarCotizacion(
        idCotizacion: number
    ): Promise<void> {

        this.validarId(
            idCotizacion,
            "El id de la cotización no es válido"
        );

        const cotizacion =
            await this.repository
                .obtenerCotizacionPorId(
                    idCotizacion
                );

        if (!cotizacion) {
            throw new Error(
                "Cotización no encontrada"
            );
        }

        if (cotizacion.estado === "Finalizada") {
            throw new Error(
                "La cotización está finalizada y no puede ser eliminada."
            );
        }

        const eliminado =
            await this.repository
                .eliminarCotizacion(
                    idCotizacion
                );

        if (!eliminado) {
            throw new Error(
                "No se pudo eliminar la cotización"
            );
        }
    }

    public async enviarCotizacion(
        idCotizacion: number,
        idEmpresa: number
    ): Promise<void> {

        this.validarId(
            idCotizacion,
            "El id de la cotización no es válido"
        );

        this.validarId(
            idEmpresa,
            "El id de la empresa no es válido"
        );

        const cotizacion =
            await this.repository
                .obtenerCotizacionPorId(
                    idCotizacion
                );

        if (!cotizacion) {
            throw new Error(
                "Cotización no encontrada"
            );
        }

        if (cotizacion.estado === "Finalizada") {
            throw new Error(
                "La cotización está finalizada y no puede volver a enviarse."
            );
        }

        if (
            cotizacion.estado !== "Revisada" &&
            cotizacion.estado !== "Aceptada"
        ) {
            throw new Error(
                "Solo se puede enviar una cotización que esté en estado Revisada o Aceptada"
            );
        }

        const enviada =
            await this.repository
                .enviarCotizacion(
                    idCotizacion,
                    idEmpresa
                );

        if (!enviada) {
            throw new Error(
                "No se pudo enviar la cotización"
            );
        }
    }

    public async finalizarCotizacion(
        idCotizacion: number
    ): Promise<void> {

        this.validarId(
            idCotizacion,
            "El id de la cotización no es válido"
        );

        // =====================================================
        // 1. OBTENER COTIZACIÓN
        // =====================================================

        const cotizacion =
            await this.repository
                .obtenerCotizacionPorId(
                    idCotizacion
                );

        if (!cotizacion) {
            throw new Error(
                "Cotización no encontrada"
            );
        }

        // =====================================================
        // 2. VERIFICAR QUE NO ESTÉ FINALIZADA
        // =====================================================

        if (cotizacion.estado === "Finalizada") {
            throw new Error(
                "La cotización ya se encuentra finalizada."
            );
        }

        // =====================================================
        // 3. VALIDAR EMPRESA
        // =====================================================

        const idEmpresa =
            Number(cotizacion.idEmpresa);

        if (
            !Number.isInteger(idEmpresa) ||
            idEmpresa <= 0
        ) {
            throw new Error(
                "La cotización no tiene una empresa asociada."
            );
        }

        // =====================================================
        // 4. VALIDAR PRECIO ORIGINAL
        // =====================================================

        if (
            cotizacion.precioEstimado === null ||
            cotizacion.precioEstimado === undefined
        ) {
            throw new Error(
                "La cotización no tiene un precio estimado generado por SISCON-Q."
            );
        }

        // =====================================================
        // 5. VALIDAR CÁLCULO FINAL
        // =====================================================

        if (
            cotizacion.subtotal === null ||
            cotizacion.subtotal === undefined ||
            cotizacion.porcentajeIVAAplicado === null ||
            cotizacion.porcentajeIVAAplicado === undefined ||
            cotizacion.montoIVA === null ||
            cotizacion.montoIVA === undefined ||
            cotizacion.totalCotizacion === null ||
            cotizacion.totalCotizacion === undefined
        ) {
            throw new Error(
                "La cotización debe ser actualizada por la empresa y tener el IVA aplicado antes de finalizarse."
            );
        }

        const totalCotizacion =
            Number(cotizacion.totalCotizacion);

        if (
            !Number.isFinite(totalCotizacion) ||
            totalCotizacion < 0
        ) {
            throw new Error(
                "El total de la cotización no es válido."
            );
        }

        // =====================================================
        // 6. OBTENER TIPO DE CAMBIO ACTUAL
        // =====================================================

        const tipoCambioUSD =
            await this.monedaService
                .obtenerDolarAPesoUruguayo();

        if (
            !Number.isFinite(tipoCambioUSD) ||
            tipoCambioUSD <= 0
        ) {
            throw new Error(
                "No se pudo obtener un tipo de cambio USD/UYU válido."
            );
        }

        // =====================================================
        // 7. CALCULAR TOTAL HISTÓRICO EN USD
        //
        // 1 USD = tipoCambioUSD UYU
        // =====================================================

        const totalUYU =
            Number(
                (
                    totalCotizacion *
                    tipoCambioUSD
                ).toFixed(2)
            );
        // =====================================================
        // 8. FINALIZAR Y GUARDAR CONVERSIÓN HISTÓRICA
        // =====================================================

        const finalizada =
            await this.repository
                .finalizarCotizacion(
                    idCotizacion,
                    tipoCambioUSD,
                    totalUYU
                );

        if (!finalizada) {
            throw new Error(
                "No se pudo finalizar la cotización."
            );
        }
    }

    // =========================================================
    // VALIDAR ESTADO
    // =========================================================

    private validarEstado(
        estado: string
    ): void {

        const estadoNormalizado =
            estado.trim();

        if (!estadoNormalizado) {
            throw new Error(
                "El estado de la cotización no puede estar vacío"
            );
        }

        const esValido =
            ESTADOS_VALIDOS.includes(
                estadoNormalizado as
                (typeof ESTADOS_VALIDOS)[number]
            );

        if (!esValido) {
            throw new Error(
                `Estado inválido. Los estados permitidos son: ${ESTADOS_VALIDOS.join(", ")}`
            );
        }
    }


    // =========================================================
    // VALIDAR COSTO
    // =========================================================

    private validarCosto(
        costo: number,
        nombreCampo: string
    ): void {

        if (
            typeof costo !== "number" ||
            !Number.isFinite(costo) ||
            costo < 0
        ) {
            throw new Error(
                `${nombreCampo} debe ser un número mayor o igual a cero`
            );
        }
    }


    // =========================================================
    // VALIDAR PRECIO
    // =========================================================

    private validarPrecio(
        precio: number | null
    ): void {

        if (precio === null) {
            return;
        }

        if (
            typeof precio !== "number" ||
            !Number.isFinite(precio) ||
            precio < 0
        ) {
            throw new Error(
                "El precio estimado debe ser un número mayor o igual a cero"
            );
        }
    }


    // =========================================================
    // VALIDAR OBSERVACIONES
    // =========================================================

    private validarObservaciones(
        observaciones: string | null
    ): void {

        if (observaciones === null) {
            return;
        }

        if (
            observaciones.trim().length > 1000
        ) {
            throw new Error(
                "Las observaciones no pueden superar los 1000 caracteres"
            );
        }
    }


    // =========================================================
    // OBTENER COTIZACIONES FINALIZADAS POR CLIENTE
    // =========================================================

    public async obtenerCotizacionesFinalizadasPorCliente(
        idCliente: number
    ) {
        this.validarId(
            idCliente,
            "El id del cliente no es válido"
        );

        const cotizaciones =
            await this.repository
                .obtenerCotizacionesFinalizadasPorCliente(
                    idCliente
                );

        return this.agregarConversionMonetaria(
            cotizaciones
        );
    }


    // =========================================================
    // VALIDAR ID
    // =========================================================

    private validarId(
        id: number,
        mensaje: string
    ): void {

        if (
            !Number.isInteger(id) ||
            id <= 0
        ) {
            throw new Error(mensaje);
        }
    }


    public async actualizarCotizacionDesdeEmpresa(
        idCotizacion: number,
        data: ActualizarCotizacionEmpresaDTO
    ) {

        // ----------------------------------------------------
        // VALIDAR ID
        // ----------------------------------------------------

        if (
            !Number.isInteger(idCotizacion) ||
            idCotizacion <= 0
        ) {
            throw new Error(
                "El id de la cotización no es válido."
            );
        }


        // ----------------------------------------------------
        // OBTENER COTIZACIÓN ACTUAL
        // ----------------------------------------------------

        const cotizacion =
            await this.repository.obtenerCotizacionPorId(
                idCotizacion
            );

        if (!cotizacion) {
            throw new Error(
                "La cotización no existe."
            );
        }


        // ----------------------------------------------------
        // BLOQUEAR COTIZACIONES FINALIZADAS
        // ----------------------------------------------------

        if (cotizacion.estado === "Finalizada") {
            throw new Error(
                "La cotización está finalizada y no puede ser modificada."
            );
        }


        // ----------------------------------------------------
        // VALIDAR EMPRESA
        // ----------------------------------------------------

        const idEmpresa =
            Number(cotizacion.idEmpresa);

        if (
            !Number.isInteger(idEmpresa) ||
            idEmpresa <= 0
        ) {
            throw new Error(
                "La cotización no tiene una empresa asociada."
            );
        }


        // ----------------------------------------------------
        // VALIDAR PRECIO ORIGINAL
        // ----------------------------------------------------

        if (
            cotizacion.precioEstimado === null ||
            cotizacion.precioEstimado === undefined
        ) {
            throw new Error(
                "La cotización no tiene un precio estimado generado por SISCON-Q."
            );
        }

        const precioEstimado =
            Number(cotizacion.precioEstimado);

        if (
            !Number.isFinite(precioEstimado) ||
            precioEstimado < 0
        ) {
            throw new Error(
                "El precio estimado de la cotización no es válido."
            );
        }


        // ----------------------------------------------------
        // VALIDAR OBSERVACIONES
        // ----------------------------------------------------

        if (data.observaciones !== undefined) {
            this.validarObservaciones(
                data.observaciones
            );
        }


        // ----------------------------------------------------
        // VALIDAR MANOS DE OBRA RECIBIDAS
        // ----------------------------------------------------

        if (!Array.isArray(data.manosObra)) {
            throw new Error(
                "La lista de manos de obra no es válida."
            );
        }


        // ----------------------------------------------------
        // CALCULAR MANO DE OBRA ADICIONAL
        //
        // El frontend solamente envía:
        // - idManoObra
        // - cantidad
        //
        // El precio, unidad y nombre se obtienen desde
        // la configuración de ManoObra de la empresa.
        // ----------------------------------------------------

        const manosObraCalculadas: {
            idManoObra: number;
            nombre: string;
            unidad: string | null;
            cantidad: number;
            costoUnitario: number;
            subtotal: number;
        }[] = [];

        let costoManoObraAdicional = 0;

        for (const item of data.manosObra) {

            const idManoObra =
                Number(item.idManoObra);

            const cantidad =
                Number(item.cantidad);

            if (
                !Number.isInteger(idManoObra) ||
                idManoObra <= 0
            ) {
                throw new Error(
                    "Una de las manos de obra seleccionadas no es válida."
                );
            }

            if (
                !Number.isFinite(cantidad) ||
                cantidad <= 0
            ) {
                throw new Error(
                    "La cantidad de la mano de obra debe ser mayor a cero."
                );
            }


            // ------------------------------------------------
            // BUSCAR MANO DE OBRA DE ESA EMPRESA
            // ------------------------------------------------

            const manoObra =
                await this.manoObraService
                    .obtenerManoObraPorId(
                        idManoObra,
                        idEmpresa
                    );


            // ------------------------------------------------
            // SOLO MANOS DE OBRA ACTIVAS
            // ------------------------------------------------

            if (manoObra.estado !== "Activo") {
                throw new Error(
                    `La mano de obra "${manoObra.nombre}" no se encuentra activa.`
                );
            }


            // ------------------------------------------------
            // VALIDAR COSTO UNITARIO
            // ------------------------------------------------

            const costoUnitario =
                Number(manoObra.costoUnitario);

            if (
                !Number.isFinite(costoUnitario) ||
                costoUnitario < 0
            ) {
                throw new Error(
                    `El costo unitario de "${manoObra.nombre}" no es válido.`
                );
            }


            // ------------------------------------------------
            // CALCULAR SUBTOTAL DE ESTA MANO DE OBRA
            // ------------------------------------------------

            const subtotalManoObra =
                Number(
                    (
                        cantidad *
                        costoUnitario
                    ).toFixed(2)
                );


            // ------------------------------------------------
            // ACUMULAR
            // ------------------------------------------------

            costoManoObraAdicional +=
                subtotalManoObra;


            // ------------------------------------------------
            // PREPARAR SNAPSHOT PARA COTIZACIONMANOOBRA
            // ------------------------------------------------

            manosObraCalculadas.push({
                idManoObra:
                    manoObra.id_ManoObra,

                nombre:
                    manoObra.nombre,

                unidad:
                    manoObra.unidad,

                cantidad,

                costoUnitario,

                subtotal:
                    subtotalManoObra,
            });
        }


        costoManoObraAdicional =
            Number(
                costoManoObraAdicional.toFixed(2)
            );


        // ----------------------------------------------------
        // OBTENER IVA DE LA EMPRESA
        // ----------------------------------------------------

        const porcentajeIVA =
            await this.repository.obtenerImpuestoEmpresa(
                idEmpresa
            );

        if (
            porcentajeIVA === null ||
            porcentajeIVA === undefined
        ) {
            throw new Error(
                "La empresa debe configurar el porcentaje de IVA antes de actualizar la cotización."
            );
        }

        const porcentajeIVAAplicado =
            Number(porcentajeIVA);

        if (
            !Number.isFinite(porcentajeIVAAplicado) ||
            porcentajeIVAAplicado < 0
        ) {
            throw new Error(
                "El porcentaje de IVA configurado por la empresa no es válido."
            );
        }


        // ----------------------------------------------------
        // CALCULAR SUBTOTAL GENERAL
        //
        // precioEstimado ya fue generado por SISCON-Q.
        // NO se vuelve a ejecutar ninguna Strategy.
        // ----------------------------------------------------

        const subtotal =
            precioEstimado +
            costoManoObraAdicional;


        // ----------------------------------------------------
        // CALCULAR IVA
        // ----------------------------------------------------

        const montoIVA =
            subtotal *
            (porcentajeIVAAplicado / 100);


        // ----------------------------------------------------
        // CALCULAR TOTAL
        // ----------------------------------------------------

        const totalCotizacion =
            subtotal +
            montoIVA;


        // ----------------------------------------------------
        // REDONDEO
        // ----------------------------------------------------

        const subtotalRedondeado =
            Number(subtotal.toFixed(2));

        const montoIVARedondeado =
            Number(montoIVA.toFixed(2));

        const totalCotizacionRedondeado =
            Number(totalCotizacion.toFixed(2));


        // ----------------------------------------------------
        // ACTUALIZAR COTIZACIÓN
        // ----------------------------------------------------

        const actualizado =
            await this.repository
                .actualizarCotizacionDesdeEmpresa(
                    idCotizacion,
                    costoManoObraAdicional,
                    subtotalRedondeado,
                    porcentajeIVAAplicado,
                    montoIVARedondeado,
                    totalCotizacionRedondeado,
                    data.observaciones
                );

        if (!actualizado) {
            throw new Error(
                "No se pudo actualizar la cotización. Puede que haya sido finalizada."
            );
        }


        // ----------------------------------------------------
        // REEMPLAZAR DETALLE DE MANO DE OBRA
        // ----------------------------------------------------

        await this.cotizacionManoObraRepository
            .eliminarPorCotizacion(
                idCotizacion
            );

        for (const manoObra of manosObraCalculadas) {

            await this.cotizacionManoObraRepository
                .crear({
                    idCotizacion,

                    idManoObra:
                        manoObra.idManoObra,

                    cantidad:
                        manoObra.cantidad,

                    nombre:
                        manoObra.nombre,

                    unidad:
                        manoObra.unidad,

                    costoUnitario:
                        manoObra.costoUnitario,

                    subtotal:
                        manoObra.subtotal,
                });
        }


        // ----------------------------------------------------
        // RESPUESTA
        // ----------------------------------------------------

        return {
            idCotizacion,

            precioEstimado,

            costoManoObraAdicional,

            manosObra:
                manosObraCalculadas,

            subtotal:
                subtotalRedondeado,

            porcentajeIVAAplicado,

            montoIVA:
                montoIVARedondeado,

            totalCotizacion:
                totalCotizacionRedondeado,

            observaciones:
                data.observaciones !== undefined
                    ? data.observaciones
                    : cotizacion.observaciones,
        };
    }
    // =========================================================
    // SELECCIONAR PROPUESTA
    // =========================================================

    public async seleccionarPropuesta(
        idCotizacion: number
    ): Promise<void> {

        this.validarId(
            idCotizacion,
            "El id de la cotización no es válido"
        );

        const cotizacion =
            await this.repository.obtenerCotizacionPorId(
                idCotizacion
            );

        if (!cotizacion) {
            throw new Error(
                "Cotización no encontrada"
            );
        }

        if (
            cotizacion.idEmpresa === null ||
            cotizacion.idEmpresa === undefined
        ) {
            throw new Error(
                "La cotización seleccionada no pertenece a una empresa"
            );
        }

        if (cotizacion.estado !== "Borrador") {
            throw new Error(
                "Solo se puede seleccionar una propuesta en estado Borrador"
            );
        }

        const seleccionada =
            await this.repository.seleccionarPropuesta(
                idCotizacion
            );

        if (!seleccionada) {
            throw new Error(
                "No se pudo seleccionar la propuesta"
            );
        }
    }
}