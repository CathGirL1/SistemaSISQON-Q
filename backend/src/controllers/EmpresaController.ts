import type {
  Request,
  Response,
} from "express";

import { EmpresaService } from "../services/EmpresaService";

export class EmpresaController {
  private service = new EmpresaService();

  public obtenerEmpresaPorId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const idEmpresa = this.convertirId(
        req.params.id,
        "El identificador de la empresa no es válido"
      );

      const empresa =
        await this.service.obtenerEmpresaPorId(idEmpresa);

      res.status(200).json(empresa);
    } catch (error) {
      const mensaje =
        this.obtenerMensajeError(error);

      const estado =
        mensaje === "Empresa no encontrada"
          ? 404
          : 400;

      res.status(estado).json({ mensaje });
    }
  };

  public obtenerEmpresaPorUsuario = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const idUsuario = this.convertirId(
        req.params.idUsuario,
        "El identificador del usuario no es válido"
      );

      const empresa =
        await this.service.obtenerEmpresaPorUsuario(
          idUsuario
        );

      res.status(200).json(empresa);
    } catch (error) {
      const mensaje =
        this.obtenerMensajeError(error);

      const estado =
        mensaje ===
        "No se encontró una empresa asociada al usuario"
          ? 404
          : 400;

      res.status(estado).json({ mensaje });
    }
  };

  public actualizarEmpresa = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const idEmpresa = this.convertirId(
        req.params.id,
        "El identificador de la empresa no es válido"
      );

      const empresa =
        await this.service.actualizarEmpresa(
          idEmpresa,
          req.body
        );

      res.status(200).json(empresa);
    } catch (error) {
      const mensaje =
        this.obtenerMensajeError(error);

      const estado =
        mensaje === "Empresa no encontrada"
          ? 404
          : 400;

      res.status(estado).json({ mensaje });
    }
  };

  private convertirId(
    valor: string | string[],
    mensaje: string
  ): number {
    const valorId = Array.isArray(valor)
      ? valor[0]
      : valor;

    const id = Number(valorId);

    if (!Number.isInteger(id) || id <= 0) {
      throw new Error(mensaje);
    }

    return id;
  }

  private obtenerMensajeError(
    error: unknown
  ): string {
    if (error instanceof Error) {
      return error.message;
    }

    return "Error interno del servidor";
  }

    public actualizarLogoEmpresa = async (
    req: Request,
    res: Response
    ): Promise<void> => {
    try {
      const idEmpresa = this.convertirId(
        req.params.id,
        "El identificador de la empresa no es válido"
      );

      if (!req.file) {
        res.status(400).json({
          mensaje: "Debés seleccionar una imagen.",
        });

        return;
      }

      const logo =
        `/uploads/logos/${req.file.filename}`;

      const empresa =
        await this.service.actualizarLogoEmpresa(
          idEmpresa,
          logo
        );

      res.status(200).json(empresa);
      } catch (error) {
      const mensaje =
        this.obtenerMensajeError(error);

      const estado =
        mensaje === "Empresa no encontrada"
          ? 404
          : 400;

      res.status(estado).json({ mensaje });
      }
    };
}