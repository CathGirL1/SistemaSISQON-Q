import sql from "mssql";
import { connectDB } from "../server/database";

import type {
  CrearCotizacionManoObraDTO,
  CotizacionManoObraDetalle,
} from "../models/CotizacionManoObra";

export class CotizacionManoObraRepository {

  /**
   * Obtiene todas las manos de obra adicionales
   * asociadas a una cotización.
   */
  public async obtenerPorCotizacion(
    idCotizacion: number
  ): Promise<CotizacionManoObraDetalle[]> {

    const pool = await connectDB();

    const resultado = await pool
      .request()
      .input(
        "idCotizacion",
        sql.Int,
        idCotizacion
      )
      .query(`
        SELECT
          id_CotizacionManoObra AS idCotizacionManoObra,
          id_Cotizacion AS idCotizacion,
          id_ManoObra AS idManoObra,
          nombre,
          unidad,
          cantidad,
          costoUnitario,
          subtotal
        FROM CotizacionManoObra
        WHERE id_Cotizacion = @idCotizacion
        ORDER BY id_CotizacionManoObra ASC
      `);

    return resultado.recordset;
  }


  /**
   * Inserta una mano de obra adicional
   * dentro de una cotización.
   */
  public async crear(
    data: CrearCotizacionManoObraDTO
  ): Promise<void> {

    const pool = await connectDB();

    await pool
      .request()
      .input(
        "idCotizacion",
        sql.Int,
        data.idCotizacion
      )
      .input(
        "idManoObra",
        sql.Int,
        data.idManoObra
      )
      .input(
        "cantidad",
        sql.Decimal(12, 2),
        data.cantidad
      )
      .input(
        "nombre",
        sql.VarChar(100),
        data.nombre
      )
      .input(
        "unidad",
        sql.VarChar(50),
        data.unidad
      )
      .input(
        "costoUnitario",
        sql.Decimal(12, 2),
        data.costoUnitario
      )
      .input(
        "subtotal",
        sql.Decimal(18, 2),
        data.subtotal
      )
      .query(`
        INSERT INTO CotizacionManoObra
        (
          id_Cotizacion,
          id_ManoObra,
          cantidad,
          nombre,
          unidad,
          costoUnitario,
          subtotal
        )
        VALUES
        (
          @idCotizacion,
          @idManoObra,
          @cantidad,
          @nombre,
          @unidad,
          @costoUnitario,
          @subtotal
        )
      `);
  }


  /**
   * Elimina todas las manos de obra adicionales
   * de una cotización.
   *
   * Se utilizará cuando la empresa vuelva a guardar
   * la gestión de una cotización.
   */
  public async eliminarPorCotizacion(
    idCotizacion: number
  ): Promise<void> {

    const pool = await connectDB();

    await pool
      .request()
      .input(
        "idCotizacion",
        sql.Int,
        idCotizacion
      )
      .query(`
        DELETE FROM CotizacionManoObra
        WHERE id_Cotizacion = @idCotizacion
      `);
  }
}