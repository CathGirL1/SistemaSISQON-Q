import sql from "mssql";
import { connectDB } from "../server/database";

import type {
  ConversacionIA,
  CrearConversacionIADTO,
} from "../models/ConversacionIA";

export class ConversacionIARepository {

  // ====================================================
  // CREAR CONVERSACIÓN
  // ====================================================

  public async crearConversacion(
    data: CrearConversacionIADTO
  ): Promise<number> {

    const pool = await connectDB();

    const resultado = await pool
      .request()

      .input(
        "idCliente",
        sql.Int,
        data.idCliente
      )

      .input(
        "idProyecto",
        sql.Int,
        data.idProyecto ?? null
      )

      .input(
        "titulo",
        sql.VarChar(200),
        data.titulo
      )

      .query(`
        INSERT INTO ConversacionIA
        (
          id_Cliente,
          id_Proyecto,
          titulo,
          fechaCreacion,
          fechaUltimoMensaje
        )

        OUTPUT INSERTED.id_Conversacion

        VALUES
        (
          @idCliente,
          @idProyecto,
          @titulo,
          GETDATE(),
          GETDATE()
        )
      `);

    return resultado.recordset[0].id_Conversacion;
  }


  public async eliminarConversacion(
    idConversacion: number
  ): Promise<boolean> {

    const pool = await connectDB();

    const transaction = new sql.Transaction(pool);

    try {

      await transaction.begin();

      // Primero eliminamos los mensajes
      await new sql.Request(transaction)
        .input(
          "idConversacion",
          sql.Int,
          idConversacion
        )
        .query(`
          DELETE FROM MensajeIA
          WHERE id_Conversacion = @idConversacion
        `);

      // Luego eliminamos la conversación
      const resultado =
        await new sql.Request(transaction)
          .input(
            "idConversacion",
            sql.Int,
            idConversacion
          )
          .query(`
            DELETE FROM ConversacionIA
            WHERE id_Conversacion = @idConversacion
          `);

      await transaction.commit();

      return resultado.rowsAffected[0] > 0;

    } catch (error) {

      await transaction.rollback();

      throw error;
    }
  }


  // ====================================================
  // OBTENER CONVERSACIONES DE UN CLIENTE
  // ====================================================

  public async obtenerConversacionesPorCliente(
    idCliente: number
  ): Promise<ConversacionIA[]> {

    const pool = await connectDB();

    const resultado = await pool
      .request()

      .input(
        "idCliente",
        sql.Int,
        idCliente
      )

      .query<ConversacionIA>(`
        SELECT
          c.id_Conversacion AS idConversacion,
          c.id_Cliente AS idCliente,
          c.id_Proyecto AS idProyecto,
          c.titulo,
          c.fechaCreacion,
          c.fechaUltimoMensaje

        FROM ConversacionIA c

        WHERE c.id_Cliente = @idCliente

        ORDER BY
          c.fechaUltimoMensaje DESC,
          c.id_Conversacion DESC
      `);

    return resultado.recordset;
  }


  // ====================================================
  // OBTENER CONVERSACIÓN POR ID
  // ====================================================

  public async obtenerConversacionPorId(
    idConversacion: number
  ): Promise<ConversacionIA | null> {

    const pool = await connectDB();

    const resultado = await pool
      .request()

      .input(
        "idConversacion",
        sql.Int,
        idConversacion
      )

      .query<ConversacionIA>(`
        SELECT
          c.id_Conversacion AS idConversacion,
          c.id_Cliente AS idCliente,
          c.id_Proyecto AS idProyecto,
          c.titulo,
          c.fechaCreacion,
          c.fechaUltimoMensaje

        FROM ConversacionIA c

        WHERE c.id_Conversacion = @idConversacion
      `);

    return resultado.recordset[0] ?? null;
  }


  // ====================================================
  // ACTUALIZAR FECHA DEL ÚLTIMO MENSAJE
  // ====================================================

  public async actualizarFechaUltimoMensaje(
    idConversacion: number
  ): Promise<boolean> {

    const pool = await connectDB();

    const resultado = await pool
      .request()

      .input(
        "idConversacion",
        sql.Int,
        idConversacion
      )

      .query(`
        UPDATE ConversacionIA

        SET fechaUltimoMensaje = GETDATE()

        WHERE id_Conversacion = @idConversacion
      `);

    return resultado.rowsAffected[0] > 0;
  }

  // ====================================================
  // ACTUALIZAR TÍTULO DE CONVERSACIÓN
  // ====================================================

  public async actualizarTitulo(
    idConversacion: number,
    titulo: string
  ): Promise<boolean> {

    const pool = await connectDB();

    const resultado = await pool
      .request()
      .input(
        "idConversacion",
        sql.Int,
        idConversacion
      )
      .input(
        "titulo",
        sql.VarChar(200),
        titulo
      )
      .query(`
        UPDATE ConversacionIA
        SET titulo = @titulo
        WHERE id_Conversacion = @idConversacion
      `);

    return resultado.rowsAffected[0] > 0;
  }
}