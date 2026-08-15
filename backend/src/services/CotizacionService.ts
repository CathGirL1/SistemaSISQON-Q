import { CotizacionRepository } from "../repositories/CotizacionRepository";
import { ProyectoRepository } from "../repositories/ProyectoRepository";
import { TipoObraStrategyFactory } from "../models/TipoObraStrategyFactory";
import { MonedaService } from "./MonedaService";

import type {
    CrearCotizacionDTO,
    ActualizarCotizacionDTO,
} from "../models/Cotizacion";

const ESTADOS_VALIDOS = [
    "Borrador",
    "Enviada",
    "Revisada",
    "Aceptada",
    "Rechazada",
] as const;

export class CotizacionService {

    private repository = new CotizacionRepository();

    private readonly monedaService =
        new MonedaService();

    private proyectoRepository =
        new ProyectoRepository();


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

            estado:
                data.estado?.trim() ||
                "Borrador",

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

        return this.repository.crearCotizacion({

            idProyecto,

            estado: "Borrador",

            costoMateriales:
                resultado.totalMateriales,

            costoManoObra:
                resultado.manoDeObra,

            totalCotizacion:
                resultado.totalGeneral,

            precioEstimado:
                resultado.totalGeneral,

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

        return resultado[0];
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

        const tipoCambio =
            await this.monedaService
                .obtenerDolarAPesoUruguayo();

        return cotizaciones.map(
            cotizacion => ({

                ...cotizacion,

                moneda: "USD",

                tipoCambio,

                costoMaterialesUYU:
                    Number(cotizacion.costoMateriales) *
                    tipoCambio,

                costoManoObraUYU:
                    Number(cotizacion.costoManoObra) *
                    tipoCambio,

                totalCotizacionUYU:
                    Number(cotizacion.totalCotizacion) *
                    tipoCambio,

                precioEstimadoUYU:
                    cotizacion.precioEstimado !== null
                        ? Number(cotizacion.precioEstimado) *
                          tipoCambio
                        : null
            })
        );
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
}