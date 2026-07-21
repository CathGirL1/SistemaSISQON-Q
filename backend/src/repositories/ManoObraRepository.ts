import sql from "mssql";

import { connectDB } from "../server/database";

import type {
  ActualizarManoObraDTO,
  CrearManoObraDTO,
  ManoObra,
} from "../models/ManoObra";

export class ManoObraRepository {
  public async obtenerManoObra(): Promise<ManoObra[]> {
    const pool = await connectDB();

    const resultado = await pool.request().query<ManoObra>(`
      SELECT
        id_ManoObra,
        codigo,
        nombre,
        descripcion,
        categoria,
        unidad,
        costoUnitario,
        observaciones,
        ultimaActualizacion,
        estado
      FROM ManoObra
      ORDER BY id_ManoObra DESC
    `);

    return resultado.recordset;
  }

  public async obtenerManoObraPorId(
    idManoObra: number
  ): Promise<ManoObra | null> {
    const pool = await connectDB();

    const resultado = await pool
      .request()
      .input("idManoObra", sql.Int, idManoObra)
      .query<ManoObra>(`
        SELECT
          id_ManoObra,
          codigo,
          nombre,
          descripcion,
          categoria,
          unidad,
          costoUnitario,
          observaciones,
          ultimaActualizacion,
          estado
        FROM ManoObra
        WHERE id_ManoObra = @idManoObra
      `);

    return resultado.recordset[0] ?? null;
  }

  public async crearManoObra(
    manoObra: CrearManoObraDTO
  ): Promise<ManoObra> {
    const pool = await connectDB();

    const resultado = await pool
      .request()
      .input("nombre", sql.VarChar(100), manoObra.nombre)
      .input(
        "descripcion",
        sql.VarChar(255),
        manoObra.descripcion ?? null
      )
      .input(
        "categoria",
        sql.VarChar(100),
        manoObra.categoria ?? null
      )
      .input(
        "unidad",
        sql.VarChar(50),
        manoObra.unidad ?? null
      )
      .input(
        "costoUnitario",
        sql.Decimal(12, 2),
        manoObra.costoUnitario
      )
      .input(
        "observaciones",
        sql.VarChar(1000),
        manoObra.observaciones ?? null
      )
      .input(
        "estado",
        sql.VarChar(20),
        manoObra.estado ?? "Activo"
      )
      .query<ManoObra>(`
        INSERT INTO ManoObra (
          nombre,
          descripcion,
          categoria,
          unidad,
          costoUnitario,
          observaciones,
          ultimaActualizacion,
          estado
        )
        OUTPUT
          INSERTED.id_ManoObra,
          INSERTED.codigo,
          INSERTED.nombre,
          INSERTED.descripcion,
          INSERTED.categoria,
          INSERTED.unidad,
          INSERTED.costoUnitario,
          INSERTED.observaciones,
          INSERTED.ultimaActualizacion,
          INSERTED.estado
        VALUES (
          @nombre,
          @descripcion,
          @categoria,
          @unidad,
          @costoUnitario,
          @observaciones,
          GETDATE(),
          @estado
        )
      `);

    return resultado.recordset[0];
  }

  public async actualizarManoObra(
    idManoObra: number,
    manoObra: ActualizarManoObraDTO
  ): Promise<ManoObra | null> {
    const pool = await connectDB();

    const resultado = await pool
      .request()
      .input("idManoObra", sql.Int, idManoObra)
      .input("nombre", sql.VarChar(100), manoObra.nombre)
      .input(
        "descripcion",
        sql.VarChar(255),
        manoObra.descripcion ?? null
      )
      .input(
        "categoria",
        sql.VarChar(100),
        manoObra.categoria ?? null
      )
      .input(
        "unidad",
        sql.VarChar(50),
        manoObra.unidad ?? null
      )
      .input(
        "costoUnitario",
        sql.Decimal(12, 2),
        manoObra.costoUnitario
      )
      .input(
        "observaciones",
        sql.VarChar(1000),
        manoObra.observaciones ?? null
      )
      .input(
        "estado",
        sql.VarChar(20),
        manoObra.estado ?? "Activo"
      )
      .query<ManoObra>(`
        UPDATE ManoObra
        SET
          nombre = @nombre,
          descripcion = @descripcion,
          categoria = @categoria,
          unidad = @unidad,
          costoUnitario = @costoUnitario,
          observaciones = @observaciones,
          ultimaActualizacion = GETDATE(),
          estado = @estado
        OUTPUT
          INSERTED.id_ManoObra,
          INSERTED.codigo,
          INSERTED.nombre,
          INSERTED.descripcion,
          INSERTED.categoria,
          INSERTED.unidad,
          INSERTED.costoUnitario,
          INSERTED.observaciones,
          INSERTED.ultimaActualizacion,
          INSERTED.estado
        WHERE id_ManoObra = @idManoObra
      `);

    return resultado.recordset[0] ?? null;
  }

  public async eliminarManoObra(
    idManoObra: number
  ): Promise<boolean> {
    const pool = await connectDB();

    const resultado = await pool
      .request()
      .input("idManoObra", sql.Int, idManoObra)
      .query(`
        DELETE FROM ManoObra
        WHERE id_ManoObra = @idManoObra
      `);

    return (resultado.rowsAffected[0] ?? 0) > 0;
  }
}