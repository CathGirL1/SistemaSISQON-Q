import {
  ConversacionIARepository,
} from "../repositories/ConversacionIARepository";

import type {
  ConversacionIA,
  CrearConversacionIADTO,
} from "../models/ConversacionIA";

export class ConversacionIAService {

  private conversacionRepository =
    new ConversacionIARepository();


  // ====================================================
  // CREAR CONVERSACIÓN
  // ====================================================

  public async crearConversacion(
    data: CrearConversacionIADTO
  ): Promise<number> {

    return await this.conversacionRepository
      .crearConversacion(data);
  }


  // ====================================================
  // OBTENER CONVERSACIONES DEL CLIENTE
  // ====================================================

  public async obtenerConversacionesPorCliente(
    idCliente: number
  ): Promise<ConversacionIA[]> {

    return await this.conversacionRepository
      .obtenerConversacionesPorCliente(idCliente);
  }


  // ====================================================
  // OBTENER CONVERSACIÓN POR ID
  // ====================================================

  public async obtenerConversacionPorId(
    idConversacion: number
  ): Promise<ConversacionIA | null> {

    return await this.conversacionRepository
      .obtenerConversacionPorId(idConversacion);
  }

  public async eliminarConversacion(
    idConversacion: number
  ): Promise<boolean> {

    return await this.conversacionRepository
      .eliminarConversacion(idConversacion);
  }


  // ====================================================
  // ACTUALIZAR FECHA DEL ÚLTIMO MENSAJE
  // ====================================================

  public async actualizarFechaUltimoMensaje(
    idConversacion: number
  ): Promise<boolean> {

    return await this.conversacionRepository
      .actualizarFechaUltimoMensaje(
        idConversacion
      );
  }

  // ====================================================
  // ACTUALIZAR TÍTULO DE CONVERSACIÓN
  // ====================================================

  public async actualizarTitulo(
    idConversacion: number,
    titulo: string
  ): Promise<boolean> {

    return await this.conversacionRepository
      .actualizarTitulo(
        idConversacion,
        titulo
      );
  }
}