import type { Request, Response } from "express";

import { ManoObraService } from "../services/ManoObraService";

export class ManoObraController {
  private service = new ManoObraService();

  public obtenerManoObra = async (
    _req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const manoObra =
        await this.service.obtenerManoObra();

      res.status(200).json(manoObra);
    } catch (error) {
      console.error("Error al obtener la mano de obra:", error);

      res.status(500).json({
        mensaje: "Error al obtener la mano de obra",
      });
    }
  };

  public obtenerManoObraPorId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const idManoObra = this.convertirId(req.params.id);

      const manoObra =
        await this.service.obtenerManoObraPorId(idManoObra);

      res.status(200).json(manoObra);
    } catch (error) {
      const mensaje = this.obtenerMensajeError(error);

      const estado =
        mensaje === "Mano de obra no encontrada" ? 404 : 400;

      res.status(estado).json({ mensaje });
    }
  };

  public crearManoObra = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const manoObra =
        await this.service.crearManoObra(req.body);

      res.status(201).json(manoObra);
    } catch (error) {
      const mensaje = this.obtenerMensajeError(error);

      res.status(400).json({ mensaje });
    }
  };

  public actualizarManoObra = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const idManoObra = this.convertirId(req.params.id);

      const manoObra =
        await this.service.actualizarManoObra(
          idManoObra,
          req.body
        );

      res.status(200).json(manoObra);
    } catch (error) {
      const mensaje = this.obtenerMensajeError(error);

      const estado =
        mensaje === "Mano de obra no encontrada" ? 404 : 400;

      res.status(estado).json({ mensaje });
    }
  };

  public eliminarManoObra = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const idManoObra = this.convertirId(req.params.id);

      await this.service.eliminarManoObra(idManoObra);

      res.status(204).send();
    } catch (error) {
      const mensaje = this.obtenerMensajeError(error);

      const estado =
        mensaje === "Mano de obra no encontrada" ? 404 : 400;

      res.status(estado).json({ mensaje });
    }
  };

  private convertirId(valor: string | string[]): number {
    const valorId = Array.isArray(valor) ? valor[0] : valor;
    const id = Number(valorId);

    if (!Number.isInteger(id) || id <= 0) {
      throw new Error(
        "El identificador de la mano de obra no es válido"
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