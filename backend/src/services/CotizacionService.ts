import { CotizacionRepository } from "../repositories/CotizacionRepository";
import { ProyectoRepository } from "../repositories/ProyectoRepository";
import { TipoObraStrategyFactory } from "../models/TipoObraStrategyFactory";

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


        // 1. Obtener proyecto

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


        // 2. Obtener información del tipo de obra

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


        const codigoTipoObra =
            proyectoCotizacion.codigoTipoObra;

        if (!codigoTipoObra) {
            throw new Error(
                "El proyecto no tiene un código de tipo de obra válido"
            );
        }


        // 3. Obtener Strategy

        const strategy =
            TipoObraStrategyFactory.obtenerStrategy(
                codigoTipoObra
            );


        // 4. Calcular mano de obra

        const costoManoObra =
            strategy.calcularManoDeObra(
                proyecto
            );

        this.validarCosto(
            costoManoObra,
            "El costo de mano de obra"
        );


        // 5. Obtener materiales

        const materiales =
            await this.repository
                .obtenerMaterialesDelProyecto(
                    idProyecto
                );


        // 6. Calcular materiales

        const costoMateriales =
            materiales.reduce(
                (total, material) => {

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


                    return (
                        total +
                        cantidad * costoUnitario
                    );

                },
                0
            );


        // 7. Calcular total

        const totalCotizacion =
            costoMateriales +
            costoManoObra;


        this.validarCosto(
            totalCotizacion,
            "El total de la cotización"
        );


        // 8. Guardar

        return this.repository.crearCotizacion({

            idProyecto,

            estado: "Borrador",

            costoMateriales,

            costoManoObra,

            totalCotizacion,

            precioEstimado:
                totalCotizacion,

            observaciones:
                null,
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

        return this.repository
            .obtenerCotizacionesPorCliente(
                idCliente
            );
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

        return this.repository
            .obtenerCotizacionesPorProyecto(
                idProyecto
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

        return cotizacion;
    }


    // =========================================================
    // ACTUALIZAR
    // =========================================================

    public async actualizarCotizacion(
        idCotizacion: number,
        data: ActualizarCotizacionDTO
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


        this.validarActualizacion(data);


        const actualizado =
            await this.repository
                .actualizarCotizacion(
                    idCotizacion,
                    {
                        estado:
                            data.estado?.trim(),

                        costoMateriales:
                            data.costoMateriales,

                        costoManoObra:
                            data.costoManoObra,

                        totalCotizacion:
                            data.totalCotizacion,

                        precioEstimado:
                            data.precioEstimado,

                        observaciones:
                            data.observaciones !== undefined
                                ? data.observaciones?.trim() || null
                                : undefined,
                    }
                );


        if (!actualizado) {
            throw new Error(
                "No se pudo actualizar la cotización"
            );
        }
    }


    // =========================================================
    // ELIMINAR
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
    // VALIDAR ACTUALIZACIÓN
    // =========================================================

    private validarActualizacion(
        data: ActualizarCotizacionDTO
    ): void {

        if (Object.keys(data).length === 0) {
            throw new Error(
                "Debe enviar al menos un campo para actualizar"
            );
        }


        if (data.estado !== undefined) {
            this.validarEstado(
                data.estado
            );
        }


        if (data.costoMateriales !== undefined) {
            this.validarCosto(
                data.costoMateriales,
                "El costo de materiales"
            );
        }


        if (data.costoManoObra !== undefined) {
            this.validarCosto(
                data.costoManoObra,
                "El costo de mano de obra"
            );
        }


        if (data.totalCotizacion !== undefined) {
            this.validarCosto(
                data.totalCotizacion,
                "El total de la cotización"
            );
        }


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