import { Request, Response } from "express";
import { MaterialProyectoService } from "../services/MaterialProyectoService";

const service = new MaterialProyectoService();

export class MaterialProyectoController {

    public async agregarMaterial(req: Request, res: Response) {
        try {

            const {
                idProyecto,
                idMaterial,
                cantidad
            } = req.body;

            const resultado = await service.agregarMaterial({
                idProyecto,
                idMaterial,
                cantidad
            });

            return res.status(201).json({
                success: true,
                mensaje: "Material agregado al proyecto correctamente",
                idMaterialProyecto: resultado
            });

        } catch (error) {

            const mensaje =
                error instanceof Error
                    ? error.message
                    : "No se pudo agregar el material al proyecto";

            return res.status(400).json({
                success: false,
                mensaje
            });
        }
    }


    public async obtenerMaterialesPorProyecto(
        req: Request,
        res: Response
    ) {
        try {

            const idProyecto = Number(req.params.idProyecto);

            const materiales =
                await service.obtenerMaterialesPorProyecto(
                    idProyecto
                );

            return res.status(200).json({
                success: true,
                materiales
            });

        } catch (error) {

            const mensaje =
                error instanceof Error
                    ? error.message
                    : "No se pudieron obtener los materiales del proyecto";

            return res.status(400).json({
                success: false,
                mensaje
            });
        }
    }

    public async obtenerComparacionMateriales(
        req: Request,
        res: Response
    ) {
        try {
            const idProyecto =
                Number(req.params.idProyecto);

            const comparacion =
                await service.obtenerComparacionMateriales(
                    idProyecto
                );

            return res.status(200).json({
                success: true,
                idProyecto,
                comparacion
            });

        } catch (error) {
            const mensaje =
                error instanceof Error
                    ? error.message
                    : "No se pudo obtener la comparación de materiales";

            return res.status(400).json({
                success: false,
                mensaje
            });
        }
    }

    public async usarMaterialAlternativo(
        req: Request,
        res: Response
    ) {
        try {
            const idMaterialProyecto =
                Number(req.params.idMaterialProyecto);

            const { idMaterialAlternativo } = req.body;

            const resultado =
                await service.usarMaterialAlternativo(
                    idMaterialProyecto,
                    Number(idMaterialAlternativo)
                );

            return res.status(200).json({
                success: true,
                mensaje: "Material alternativo aplicado correctamente",
                ...resultado
            });

        } catch (error) {
            const mensaje =
                error instanceof Error
                    ? error.message
                    : "No se pudo aplicar el material alternativo";

            return res.status(400).json({
                success: false,
                mensaje
            });
        }
    }

    public async actualizarCantidad(
        req: Request,
        res: Response
    ) {
        try {

            const idMaterialProyecto =
                Number(req.params.idMaterialProyecto);

            const { cantidad } = req.body;

            const actualizado =
                await service.actualizarCantidad(
                    idMaterialProyecto,
                    cantidad
                );

            return res.status(200).json({
                success: true,
                mensaje: "Cantidad actualizada correctamente"
            });

        } catch (error) {

            const mensaje =
                error instanceof Error
                    ? error.message
                    : "No se pudo actualizar la cantidad";

            return res.status(400).json({
                success: false,
                mensaje
            });
        }
    }


    public async eliminarMaterial(
        req: Request,
        res: Response
    ) {
        try {

            const idMaterialProyecto =
                Number(req.params.idMaterialProyecto);

            await service.eliminarMaterial(
                idMaterialProyecto
            );

            return res.status(200).json({
                success: true,
                mensaje: "Material eliminado del proyecto correctamente"
            });

        } catch (error) {

            const mensaje =
                error instanceof Error
                    ? error.message
                    : "No se pudo eliminar el material del proyecto";

            return res.status(400).json({
                success: false,
                mensaje
            });
        }
    }
}