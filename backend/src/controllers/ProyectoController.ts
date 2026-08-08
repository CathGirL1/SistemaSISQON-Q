import { Request, Response } from "express";
import { ProyectoService } from "../services/ProyectoService";

export class ProyectoController {
  private service = new ProyectoService();

  public crearProyecto = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const idProyecto =
        await this.service.crearProyecto(req.body);

      res.status(201).json({
        mensaje: "Proyecto creado correctamente",
        idProyecto,
      });
    } catch (error: unknown) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "Error al crear el proyecto";

      console.error(error);

      res.status(400).json({
        mensaje,
      });
    }
  };

  public obtenerProyectosPorCliente = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const idCliente = Number(req.params.idCliente);

      const proyectos =
        await this.service.obtenerProyectosPorCliente(
          idCliente
        );

      res.status(200).json(proyectos);
    } catch (error: unknown) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "Error al obtener los proyectos";

      console.error(error);

      res.status(400).json({
        mensaje,
      });
    }
  };

  public obtenerProyectoPorId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const idProyecto = Number(
        req.params.idProyecto
      );

      const proyecto =
        await this.service.obtenerProyectoPorId(
          idProyecto
        );

      res.status(200).json(proyecto);
    } catch (error: unknown) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "Error al obtener el proyecto";

      console.error(error);

      res.status(404).json({
        mensaje,
      });
    }
  };

  public actualizarProyecto = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const idProyecto = Number(
        req.params.idProyecto
      );

      await this.service.actualizarProyecto(
        idProyecto,
        req.body
      );

      res.status(200).json({
        mensaje: "Proyecto actualizado correctamente",
      });
    } catch (error: unknown) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "Error al actualizar el proyecto";

      console.error(error);

      res.status(400).json({
        mensaje,
      });
    }
  };

  public eliminarProyecto = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const idProyecto = Number(
        req.params.idProyecto
      );

      await this.service.eliminarProyecto(
        idProyecto
      );

      res.status(200).json({
        mensaje: "Proyecto eliminado correctamente",
      });
    } catch (error: unknown) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "Error al eliminar el proyecto";

      console.error(error);

      res.status(400).json({
        mensaje,
      });
    }
  };
}