import { Request, Response } from "express";
import { CotizacionService } from "../services/CotizacionService";

export class CotizacionController {
  private service = new CotizacionService();

  // POST /api/cotizaciones
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

  // GET /api/cotizaciones/cliente/:idCliente
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

  // GET /api/cotizaciones/proyecto/:idProyecto
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

  // GET /api/cotizaciones/:idCotizacion
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

  // PUT /api/cotizaciones/:idCotizacion
  public actualizarCotizacion = async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const idCotizacion = Number(
        req.params.idCotizacion
      );

      const nuevoIdCotizacion =
        await this.service.actualizarCotizacion(
          idCotizacion,
          req.body
        );

      res.status(200).json({
        mensaje:
          "Cotización actualizada correctamente",

        idCotizacion:
          nuevoIdCotizacion,
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

  // POST /api/cotizaciones/generar/:idProyecto
  public generarCotizacion = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const idProyecto = Number(req.params.idProyecto);

      const idCotizacion =
        await this.service.generarCotizacion(idProyecto);

      res.status(201).json({
        mensaje: "Cotización generada correctamente",
        idCotizacion,
      });
    } catch (error: unknown) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al generar la cotización";

      console.error(error);

      res.status(400).json({
        mensaje,
      });
    }
  };

  // DELETE /api/cotizaciones/:idCotizacion
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