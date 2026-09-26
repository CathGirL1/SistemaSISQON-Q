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

  // GET /api/cotizaciones/empresa/:idEmpresa
  public obtenerCotizacionesPorEmpresa = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const idEmpresa = Number(
        req.params.idEmpresa
      );

      const cotizaciones =
        await this.service.obtenerCotizacionesPorEmpresa(
          idEmpresa
        );

      res.status(200).json(cotizaciones);

    } catch (error: unknown) {

      const mensaje =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al obtener las cotizaciones de la empresa";

      console.error(error);

      res.status(400).json({
        mensaje,
      });
    }
  };

  // =========================================================
  // GET /api/cotizaciones/estadisticas/cliente/:idCliente
  // =========================================================

  public obtenerEstadisticasCliente = async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const idCliente =
        Number(req.params.idCliente);

      const estadisticas =
        await this.service.obtenerEstadisticasCliente(
          idCliente
        );

      res.status(200).json(
        estadisticas
      );

    } catch (error: unknown) {

      const mensaje =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al obtener las estadísticas del cliente";

      console.error(error);

      res.status(400).json({
        mensaje,
      });
    }
  };

  // POST /api/cotizaciones/:idCotizacion/propuesta
  public crearPropuestaEmpresa = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const idCotizacion = Number(
        req.params.idCotizacion
      );

      const { idEmpresa } = req.body;

      const idNuevaCotizacion =
        await this.service.crearPropuestaEmpresa(
          idCotizacion,
          Number(idEmpresa)
        );

      res.status(201).json({
        mensaje: "Propuesta para empresa creada correctamente",
        idCotizacion: idNuevaCotizacion,
      });
    } catch (error: unknown) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al crear la propuesta para la empresa";

      console.error(error);

      res.status(400).json({
        mensaje,
      });
    }
  };

  // PUT /api/cotizaciones/:idCotizacion/propuesta
  public actualizarPropuestaEmpresa = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const idCotizacion = Number(
        req.params.idCotizacion
      );

      const {
        costoMateriales,
        costoManoObra,
        observaciones,
      } = req.body;

      await this.service.actualizarPropuestaEmpresa(
        idCotizacion,
        Number(costoMateriales),
        Number(costoManoObra),
        observaciones
      );

      res.status(200).json({
        mensaje: "Propuesta actualizada correctamente",
      });
    } catch (error: unknown) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al actualizar la propuesta";

      console.error(error);

      res.status(400).json({
        mensaje,
      });
    }
  };

  public enviarCotizacion = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const idCotizacion = Number(
        req.params.idCotizacion
      );

      const { idEmpresa } = req.body;

      await this.service.enviarCotizacion(
        idCotizacion,
        Number(idEmpresa)
      );

      res.status(200).json({
        mensaje: "Cotización enviada correctamente",
      });
    } catch (error: unknown) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al enviar la cotización";

      console.error(error);

      res.status(400).json({
        mensaje,
      });
    }
  };

  public seleccionarPropuesta = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const idCotizacion = Number(
        req.params.idCotizacion
      );

      await this.service.seleccionarPropuesta(
        idCotizacion
      );

      res.status(200).json({
        message: "Propuesta seleccionada correctamente",
      });
    } catch (error: any) {
      res.status(400).json({
        message:
          error.message ||
          "Error al seleccionar la propuesta",
      });
    }
  };

  public async actualizarCotizacionDesdeEmpresa(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const idCotizacion =
        Number(req.params.idCotizacion);

      const resultado =
        await this.service.actualizarCotizacionDesdeEmpresa(
          idCotizacion,
          req.body
        );

      return res.status(200).json({
        mensaje:
          "Cotización actualizada correctamente.",
        cotizacion: resultado,
      });
    } catch (error) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "Error al actualizar la cotización.";

      return res.status(400).json({
        mensaje,
      });
    }
  }

  public async finalizarCotizacion(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const idCotizacion =
        Number(req.params.idCotizacion);

      await this.service.finalizarCotizacion(
        idCotizacion
      );

      return res.status(200).json({
        mensaje:
          "Cotización finalizada correctamente.",
      });
    } catch (error) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "Error al finalizar la cotización.";

      return res.status(400).json({
        mensaje,
      });
    }
  }
}