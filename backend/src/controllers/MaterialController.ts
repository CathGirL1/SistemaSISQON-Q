import type { Request, Response } from "express";

import { MaterialService } from "../services/MaterialService";

export class MaterialController {
  private service = new MaterialService();

  public obtenerMateriales = async (
    _req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const materiales =
        await this.service.obtenerMateriales();

      res.status(200).json(materiales);
    } catch (error) {
      console.error("Error al obtener materiales:", error);

      res.status(500).json({
        mensaje: "Error al obtener los materiales",
      });
    }
  };

  public obtenerMaterialPorId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const idMaterial = this.convertirId(req.params.id);

      const material =
        await this.service.obtenerMaterialPorId(idMaterial);

      res.status(200).json(material);
    } catch (error) {
      const mensaje = this.obtenerMensajeError(error);

      const estado =
        mensaje === "Material no encontrado" ? 404 : 400;

      res.status(estado).json({ mensaje });
    }
  };

  public crearMaterial = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      console.log(req.body);
      const material =
        await this.service.crearMaterial(req.body);

      res.status(201).json(material);
    } catch (error) {
      console.error(error);
      const mensaje = this.obtenerMensajeError(error);

      res.status(400).json({ mensaje });
    }
  };

  public actualizarMaterial = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const idMaterial = this.convertirId(req.params.id);

      const material =
        await this.service.actualizarMaterial(
          idMaterial,
          req.body
        );

      res.status(200).json(material);
    } catch (error) {
      const mensaje = this.obtenerMensajeError(error);

      const estado =
        mensaje === "Material no encontrado" ? 404 : 400;

      res.status(estado).json({ mensaje });
    }
  };

  public eliminarMaterial = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const idMaterial = this.convertirId(req.params.id);

      await this.service.eliminarMaterial(idMaterial);

      res.status(204).send();
    } catch (error) {
      const mensaje = this.obtenerMensajeError(error);

      const estado =
        mensaje === "Material no encontrado" ? 404 : 400;

      res.status(estado).json({ mensaje });
    }
  };

  private convertirId(valor: string | string[]): number {
    const valorId = Array.isArray(valor) ? valor[0] : valor;
    const id = Number(valorId);

    if (!Number.isInteger(id) || id <= 0) {
      throw new Error(
        "El identificador del material no es válido"
      );
    }

    return id;
  }

  private obtenerMensajeError(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    return "Error interno del servidor";
  }
}