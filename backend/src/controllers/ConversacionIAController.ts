import { Request, Response } from "express";

import {
  ConversacionIAService,
} from "../services/ConversacionIAService";

import {
  MensajeIAService,
} from "../services/MensajeIAService";

export class ConversacionIAController {

  private conversacionService =
    new ConversacionIAService();

  private mensajeService =
    new MensajeIAService();


  // ====================================================
  // CREAR CONVERSACIÓN
  // ====================================================

  public crearConversacion = async (
    req: Request,
    res: Response
  ) => {

    try {

      const {
        idCliente,
        idProyecto,
        titulo,
      } = req.body;

      if (!idCliente || !titulo) {
        return res.status(400).json({
          mensaje:
            "El cliente y el título son obligatorios",
        });
      }

      const idConversacion =
        await this.conversacionService
          .crearConversacion({
            idCliente: Number(idCliente),
            idProyecto:
              idProyecto !== undefined &&
              idProyecto !== null
                ? Number(idProyecto)
                : null,
            titulo,
          });

      return res.status(201).json({
        idConversacion,
        mensaje:
          "Conversación creada correctamente",
      });

    } catch (error) {

      console.error(
        "Error al crear conversación:",
        error
      );

      return res.status(500).json({
        mensaje:
          "Error al crear la conversación",
      });
    }
  };


  // ====================================================
  // OBTENER HISTORIAL DEL CLIENTE
  // ====================================================

  public obtenerConversacionesPorCliente =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const idCliente =
          Number(req.params.idCliente);

        if (!idCliente) {
          return res.status(400).json({
            mensaje:
              "El id del cliente es obligatorio",
          });
        }

        const conversaciones =
          await this.conversacionService
            .obtenerConversacionesPorCliente(
              idCliente
            );

        return res.status(200).json(
          conversaciones
        );

      } catch (error) {

        console.error(
          "Error al obtener conversaciones:",
          error
        );

        return res.status(500).json({
          mensaje:
            "Error al obtener el historial",
        });
      }
    };


  // ====================================================
  // OBTENER CONVERSACIÓN
  // ====================================================

  public obtenerConversacionPorId =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const idConversacion =
          Number(
            req.params.idConversacion
          );

        if (!idConversacion) {
          return res.status(400).json({
            mensaje:
              "El id de la conversación es obligatorio",
          });
        }

        const conversacion =
          await this.conversacionService
            .obtenerConversacionPorId(
              idConversacion
            );

        if (!conversacion) {
          return res.status(404).json({
            mensaje:
              "Conversación no encontrada",
          });
        }

        return res.status(200).json(
          conversacion
        );

      } catch (error) {

        console.error(
          "Error al obtener conversación:",
          error
        );

        return res.status(500).json({
          mensaje:
            "Error al obtener la conversación",
        });
      }
    };

  // ====================================================
  // ELIMINAR CONVERSACIÓN
  // ====================================================

  public eliminarConversacion = async (
    req: Request,
    res: Response
  ) => {

    try {

      const idConversacion =
        Number(req.params.idConversacion);

      if (!idConversacion) {

        return res.status(400).json({
          mensaje:
            "El ID de la conversación es obligatorio",
        });

      }

      const eliminada =
        await this.conversacionService
          .eliminarConversacion(
            idConversacion
          );

      if (!eliminada) {

        return res.status(404).json({
          mensaje:
            "Conversación no encontrada",
        });

      }

      return res.status(200).json({
        mensaje:
          "Conversación eliminada correctamente",
      });

    } catch (error) {

      console.error(
        "Error al eliminar conversación:",
        error
      );

      return res.status(500).json({
        mensaje:
          "Error al eliminar la conversación",
      });

    }

  };

  // ====================================================
  // ACTUALIZAR TÍTULO DE CONVERSACIÓN
  // ====================================================

  public actualizarTitulo = async (
    req: Request,
    res: Response
  ) => {

    try {

      const idConversacion =
        Number(req.params.idConversacion);

      const { titulo } = req.body;

      if (!idConversacion || !titulo) {

        return res.status(400).json({
          mensaje:
            "La conversación y el título son obligatorios",
        });

      }

      const actualizado =
        await this.conversacionService
          .actualizarTitulo(
            idConversacion,
            titulo
          );

      if (!actualizado) {

        return res.status(404).json({
          mensaje:
            "Conversación no encontrada",
        });

      }

      return res.status(200).json({
        mensaje:
          "Título actualizado correctamente",
      });

    } catch (error) {

      console.error(
        "Error al actualizar título:",
        error
      );

      return res.status(500).json({
        mensaje:
          "Error al actualizar el título de la conversación",
      });

    }

  };


  // ====================================================
  // OBTENER MENSAJES
  // ====================================================

  public obtenerMensajes =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const idConversacion =
          Number(
            req.params.idConversacion
          );

        if (!idConversacion) {
          return res.status(400).json({
            mensaje:
              "El id de la conversación es obligatorio",
          });
        }

        const mensajes =
          await this.mensajeService
            .obtenerMensajesPorConversacion(
              idConversacion
            );

        return res.status(200).json(
          mensajes
        );

      } catch (error) {

        console.error(
          "Error al obtener mensajes:",
          error
        );

        return res.status(500).json({
          mensaje:
            "Error al obtener los mensajes",
        });
      }
    };


  // ====================================================
  // GUARDAR MENSAJE
  // ====================================================

  public crearMensaje =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const {
          idConversacion,
          tipo,
          contenido,
        } = req.body;

        if (
          !idConversacion ||
          !tipo ||
          !contenido
        ) {
          return res.status(400).json({
            mensaje:
              "La conversación, el tipo y el contenido son obligatorios",
          });
        }

        if (
          tipo !== "usuario" &&
          tipo !== "asistente"
        ) {
          return res.status(400).json({
            mensaje:
              "El tipo de mensaje no es válido",
          });
        }

        const idMensaje =
          await this.mensajeService
            .crearMensaje({
              idConversacion:
                Number(idConversacion),
              tipo,
              contenido,
            });

        await this.conversacionService
          .actualizarFechaUltimoMensaje(
            Number(idConversacion)
          );

        return res.status(201).json({
          idMensaje,
          mensaje:
            "Mensaje guardado correctamente",
        });

      } catch (error) {

        console.error(
          "Error al crear mensaje:",
          error
        );

        return res.status(500).json({
          mensaje:
            "Error al guardar el mensaje",
        });
      }
    };
}