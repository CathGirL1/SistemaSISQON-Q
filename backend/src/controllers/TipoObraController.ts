import type {
  Request,
  Response,
} from "express";

import { TipoObraService } from "../services/TipoObraService";

export class TipoObraController {
  private readonly tipoObraService: TipoObraService;

  constructor() {
    this.tipoObraService =
      new TipoObraService();
  }

  obtenerTiposObra = async (
    _req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const tiposObra =
        await this.tipoObraService.obtenerTiposObra();

      res.status(200).json(tiposObra);
    } catch (error) {
      this.responderError(res, error);
    }
  };

  obtenerTipoObraPorId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const idTipoObra = this.convertirId(
        req.params.id
      );

      const tipoObra =
        await this.tipoObraService.obtenerTipoObraPorId(
          idTipoObra
        );

      res.status(200).json(tipoObra);
    } catch (error) {
      this.responderError(res, error);
    }
  };

  crearTipoObra = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const tipoObra =
        await this.tipoObraService.crearTipoObra(
          req.body
        );

      res.status(201).json(tipoObra);
    } catch (error) {
      this.responderError(res, error);
    }
  };

  actualizarTipoObra = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const idTipoObra = this.convertirId(
        req.params.id
      );

      const tipoObra =
        await this.tipoObraService.actualizarTipoObra(
          idTipoObra,
          req.body
        );

      res.status(200).json(tipoObra);
    } catch (error) {
      this.responderError(res, error);
    }
  };

  eliminarTipoObra = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const idTipoObra = this.convertirId(
        req.params.id
      );

      await this.tipoObraService.eliminarTipoObra(
        idTipoObra
      );

      res.status(200).json({
        mensaje:
          "Tipo de obra eliminado correctamente.",
      });
    } catch (error) {
      this.responderError(res, error);
    }
  };

    private convertirId(id: string | string[]): number {
    if (Array.isArray(id)) {
        throw new Error(
        "El identificador del tipo de obra no es válido."
        );
    }

    const idConvertido = Number(id);

    if (
        !Number.isInteger(idConvertido) ||
        idConvertido <= 0
    ) {
        throw new Error(
        "El identificador del tipo de obra no es válido."
        );
    }

    return idConvertido;
    }

  private responderError(
    res: Response,
    error: unknown
  ): void {
    console.error(
      "Error en TipoObraController:",
      error
    );

    const mensaje =
      error instanceof Error
        ? error.message
        : "Ocurrió un error inesperado.";

    const mensajesNoEncontrado = [
      "El tipo de obra no existe.",
    ];

    const mensajesConflicto = [
      "Ya existe un tipo de obra con ese nombre.",
      "No se puede eliminar el tipo de obra porque está asociado a uno o más proyectos.",
    ];

    if (
      mensajesNoEncontrado.includes(mensaje)
    ) {
      res.status(404).json({ mensaje });
      return;
    }

    if (mensajesConflicto.includes(mensaje)) {
      res.status(409).json({ mensaje });
      return;
    }

    res.status(400).json({ mensaje });
  }
}