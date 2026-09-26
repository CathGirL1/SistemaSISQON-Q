import sql from "mssql";
import { connectDB } from "../server/database";

import type {
  MensajeIA,
  CrearMensajeIADTO,
} from "../models/MensajeIA";

export class MensajeIARepository {

  // ====================================================
  // CREAR MENSAJE
  // ====================================================

  public async crearMensaje(
    data: CrearMensajeIADTO
  ): Promise<number> {

    const pool = await connectDB();

    const resultado = await pool
      .request()

      .input(
        "idConversacion",
        sql.Int,
        data.idConversacion
      )

      .input(
        "tipo",
        sql.VarChar(20),
        data.tipo
      )

      .input(
        "contenido",
        sql.VarChar(sql.MAX),
        data.contenido
      )

      .query(`
        INSERT INTO MensajeIA
        (
          id_Conversacion,
          tipo,
          contenido,
          fecha
        )

        OUTPUT INSERTED.id_Mensaje

        VALUES
        (
          @idConversacion,
          @tipo,
          @contenido,
          GETDATE()
        )
      `);

    return resultado.recordset[0].id_Mensaje;
  }


  // ====================================================
  // OBTENER MENSAJES DE UNA CONVERSACIÓN
  // ====================================================

  public async obtenerMensajesPorConversacion(
    idConversacion: number
  ): Promise<MensajeIA[]> {

    const pool = await connectDB();

    const resultado = await pool
      .request()

      .input(
        "idConversacion",
        sql.Int,
        idConversacion
      )

      .query<MensajeIA>(`
        SELECT
          m.id_Mensaje AS idMensaje,
          m.id_Conversacion AS idConversacion,
          m.tipo,
          m.contenido,
          m.fecha

        FROM MensajeIA m

        WHERE m.id_Conversacion = @idConversacion

        ORDER BY
          m.fecha ASC,
          m.id_Mensaje ASC
      `);

    return resultado.recordset;
  }
}