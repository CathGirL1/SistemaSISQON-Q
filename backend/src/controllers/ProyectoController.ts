import { Request, Response } from "express";

import { Proyecto } from "../models/Proyecto";
import { ProyectoService } from "../services/ProyectoService";

export class ProyectoController {
  private service = new ProyectoService();

  public crearProyecto = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        idCliente,
        idEmpresa,
        idTipoObra,
        nombre,
        descripcion,
        ubicacion,
        estado,
        alto,
        ancho,
        largo,
      } = req.body;

      const proyecto = new Proyecto(
        null,
        idEmpresa,
        idCliente,
        idTipoObra,
        nombre,
        estado,
        alto,
        ancho,
        largo
      );

      

      const idProyecto = await this.service.crearProyecto(proyecto);

      res.status(201).json({
        mensaje: "Proyecto creado correctamente",
        idProyecto,
      });
    } catch (error: any) {
      console.error(error);

      res.status(400).json({
        mensaje: error.message,
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
        await this.service.obtenerProyectosPorCliente(idCliente);

      res.status(200).json(proyectos);
    } catch (error: any) {
      console.error(error);

      res.status(400).json({
        mensaje: error.message,
      });
    }
  };

  public obtenerProyectoPorId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const idProyecto = Number(req.params.idProyecto);

      const proyecto =
        await this.service.obtenerProyectoPorId(idProyecto);

      res.status(200).json(proyecto);
    } catch (error: any) {
      console.error(error);

      res.status(404).json({
        mensaje: error.message,
      });
    }
  };

  public actualizarProyecto = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const idProyecto = Number(req.params.idProyecto);

      await this.service.actualizarProyecto(
        idProyecto,
        req.body
      );

      res.status(200).json({
        mensaje: "Proyecto actualizado correctamente",
      });
    } catch (error: any) {
      console.error(error);

      res.status(400).json({
        mensaje: error.message,
      });
    }
  };

  public eliminarProyecto = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const idProyecto = Number(req.params.idProyecto);

      await this.service.eliminarProyecto(idProyecto);

      res.status(200).json({
        mensaje: "Proyecto eliminado correctamente",
      });
    } catch (error: any) {
      console.error(error);

      res.status(400).json({
        mensaje: error.message,
      });
    }
  };
}