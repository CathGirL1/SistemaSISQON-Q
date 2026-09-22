import {
  MensajeIARepository,
} from "../repositories/MensajeIARepository";

import type {
  MensajeIA,
  CrearMensajeIADTO,
} from "../models/MensajeIA";

export class MensajeIAService {

  private mensajeRepository =
    new MensajeIARepository();


  // ====================================================
  // CREAR MENSAJE
  // ====================================================

  public async crearMensaje(
    data: CrearMensajeIADTO
  ): Promise<number> {

    return await this.mensajeRepository
      .crearMensaje(data);
  }


  // ====================================================
  // OBTENER MENSAJES DE UNA CONVERSACIÓN
  // ====================================================

  public async obtenerMensajesPorConversacion(
    idConversacion: number
  ): Promise<MensajeIA[]> {

    return await this.mensajeRepository
      .obtenerMensajesPorConversacion(
        idConversacion
      );
  }
}