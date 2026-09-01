import type {
  Request,
  Response,
} from "express";

import { UsuarioService } from "../services/UsuarioService";

export class UsuarioController {
  private service = new UsuarioService();

  public obtenerUsuarioPorId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const idUsuario = this.convertirId(
        req.params.id
      );

      const usuario =
        await this.service.obtenerUsuarioPorId(
          idUsuario
        );

      res.status(200).json(usuario);
    } catch (error) {
      const mensaje =
        this.obtenerMensajeError(error);

      const estado =
        mensaje === "Usuario no encontrado"
          ? 404
          : 400;

      res.status(estado).json({ mensaje });
    }
  };

  public actualizarUsuario = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const idUsuario = this.convertirId(
        req.params.id
      );

      const usuario =
        await this.service.actualizarUsuario(
          idUsuario,
          req.body
        );

      res.status(200).json(usuario);
    } catch (error) {
      const mensaje =
        this.obtenerMensajeError(error);

      const estado =
        mensaje === "Usuario no encontrado"
          ? 404
          : 400;

      res.status(estado).json({ mensaje });
    }
  };

  private convertirId(
    valor: string | string[]
  ): number {
    const valorId = Array.isArray(valor)
      ? valor[0]
      : valor;

    const id = Number(valorId);

    if (!Number.isInteger(id) || id <= 0) {
      throw new Error(
        "El identificador del usuario no es válido"
      );
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
}