import { Request, Response } from "express";
import { CotizacionService } from "../services/CotizacionService";

export class CotizacionController {
  private service = new CotizacionService();

  public crearCotizacion = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const idCotizacion =
        await this.service.crearCotizacion(req.body);

      res.status(201).json({
        mensaje: "Cotización creada correctamente",
        idCotizacion,
      });
    } catch (error: unknown) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al crear la cotización";

      console.error(error);

      res.status(400).json({
        mensaje,
      });
    }
  };

  public obtenerCotizacionesPorCliente = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const idCliente = Number(req.params.idCliente);

      const cotizaciones =
        await this.service.obtenerCotizacionesPorCliente(
          idCliente
        );

      res.status(200).json(cotizaciones);
    } catch (error: unknown) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al obtener las cotizaciones";

      console.error(error);

      res.status(400).json({
        mensaje,
      });
    }
  };

  public obtenerCotizacionesPorProyecto = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const idProyecto = Number(req.params.idProyecto);

      const cotizaciones =
        await this.service.obtenerCotizacionesPorProyecto(
          idProyecto
        );

      res.status(200).json(cotizaciones);
    } catch (error: unknown) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al obtener las cotizaciones";

      console.error(error);

      res.status(400).json({
        mensaje,
      });
    }
  };

  public obtenerCotizacionPorId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const idCotizacion = Number(
        req.params.idCotizacion
      );

      const cotizacion =
        await this.service.obtenerCotizacionPorId(
          idCotizacion
        );

      res.status(200).json(cotizacion);
    } catch (error: unknown) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al obtener la cotización";

      console.error(error);

      res.status(404).json({
        mensaje,
      });
    }
  };

  public actualizarCotizacion = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const idCotizacion = Number(
        req.params.idCotizacion
      );

      await this.service.actualizarCotizacion(
        idCotizacion,
        req.body
      );

      res.status(200).json({
        mensaje: "Cotización actualizada correctamente",
      });
    } catch (error: unknown) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al actualizar la cotización";

      console.error(error);

      res.status(400).json({
        mensaje,
      });
    }
  };

  public eliminarCotizacion = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const idCotizacion = Number(
        req.params.idCotizacion
      );

      await this.service.eliminarCotizacion(
        idCotizacion
      );

      res.status(200).json({
        mensaje: "Cotización eliminada correctamente",
      });
    } catch (error: unknown) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al eliminar la cotización";

      console.error(error);

      res.status(400).json({
        mensaje,
      });
    }
  };
}