import type { Request, Response } from "express";

import { ClienteService } from "../services/ClienteService";

export class ClienteController {
  private service = new ClienteService();

  public obtenerClientes = async (
    _req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const clientes =
        await this.service.obtenerClientes();

      res.status(200).json(clientes);
    } catch (error) {
      console.error("Error al obtener clientes:", error);

      res.status(500).json({
        mensaje: "Error al obtener los clientes",
      });
    }
  };

    public obtenerClientesPorEmpresa = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const idEmpresa = Number(req.params.idEmpresa);

      const clientes =
        await this.service.obtenerClientesPorEmpresa(
          idEmpresa
        );

      res.status(200).json(clientes);
    } catch (error) {
      this.responderError(res, error);
    }
  };

  public obtenerClientePorId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const idCliente = this.convertirId(req.params.id);

      const cliente =
        await this.service.obtenerClientePorId(idCliente);

      res.status(200).json(cliente);
    } catch (error) {
      this.responderError(res, error);
    }
  };

  public crearCliente = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const cliente =
        await this.service.crearCliente(req.body);

      res.status(201).json(cliente);
    } catch (error) {
      this.responderError(res, error);
    }
  };

  public actualizarCliente = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const idCliente = this.convertirId(req.params.id);

      const cliente =
        await this.service.actualizarCliente(
          idCliente,
          req.body
        );

      res.status(200).json(cliente);
    } catch (error) {
      this.responderError(res, error);
    }
  };

  public eliminarCliente = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const idCliente = this.convertirId(req.params.id);

      await this.service.eliminarCliente(idCliente);

      res.status(204).send();
    } catch (error) {
      this.responderError(res, error);
    }
  };

  private convertirId(valor: string | string[]): number {
    const valorId = Array.isArray(valor) ? valor[0] : valor;
    const id = Number(valorId);

    if (!Number.isInteger(id) || id <= 0) {
      throw new Error(
        "El identificador del cliente no es válido"
      );
    }

    return id;
  }

  private responderError(
    res: Response,
    error: unknown
  ): void {
    const mensaje =
      error instanceof Error
        ? error.message
        : "Error interno del servidor";

    const estado =
      mensaje === "Cliente no encontrado"
        ? 404
        : 400;

    res.status(estado).json({ mensaje });
  }

  public obtenerHistorialCotizaciones = async (
  req: Request,
  res: Response
  ): Promise<void> => {
  try {
    const idCliente = Number(req.params.idCliente);
    const idEmpresa = Number(req.params.idEmpresa);

    const historial =
      await this.service.obtenerHistorialCotizaciones(
        idCliente,
        idEmpresa
      );

    res.status(200).json(historial);
  } catch (error) {
    this.responderError(res, error);
  }
  };  
}