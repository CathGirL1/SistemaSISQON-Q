import sql from "mssql";
import { connectDB } from "../server/database";



import type {
  CrearProyectoDTO,
} from "../models/Proyecto";



export class ProyectoRepository {
  public async crearProyecto(
    data: CrearProyectoDTO
  ): Promise<number> {
    const pool = await connectDB();

    const result = await pool
      .request()
      .input("idCliente", sql.Int, data.idCliente)
      .input("idEmpresa", sql.Int, data.idEmpresa ?? null)
      .input("idTipoObra", sql.Int, data.idTipoObra)
      .input("nombre", sql.VarChar(100), data.nombre)
      .input("descripcion", sql.VarChar(500), data.descripcion ?? null)
      .input("imagenUrl", sql.VarChar(500), data.imagenUrl ?? null)
      .input("ubicacion", sql.VarChar(200), data.ubicacion ?? null)
      .input("estado", sql.VarChar(20), data.estado ?? "Borrador")
      .input("alto", sql.Decimal(10, 2), data.alto)
      .input("ancho", sql.Decimal(10, 2), data.ancho)
      .input("largo", sql.Decimal(10, 2), data.largo)
      .query(`
        INSERT INTO Proyecto
        (
          id_Cliente,
          id_Empresa,
          id_TipoObra,
          nombre,
          descripcion,
          ubicacion,
          estado,
          alto,
          ancho,
          largo,
          fechaCreacion, 
          imagenUrl
        )
        OUTPUT INSERTED.id_Proyecto
        VALUES
        (
          @idCliente,
          @idEmpresa,
          @idTipoObra,
          @nombre,
          @descripcion,
          @ubicacion,
          @estado,
          @alto,
          @ancho,
          @largo,
          GETDATE(), 
          @imagenUrl
        )
      `);

    return result.recordset[0].id_Proyecto;
  }

  public async obtenerProyectosPorCliente(idCliente: number) {
    const pool = await connectDB();

    const result = await pool
      .request()
      .input("idCliente", sql.Int, idCliente)
      .query(`
      SELECT
        p.id_Proyecto AS idProyecto,
        p.id_Cliente AS idCliente,
        p.id_Empresa AS idEmpresa,
        p.id_TipoObra AS idTipoObra,

        t.nombre AS tipoObra,

        p.nombre,
        p.descripcion,
        p.ubicacion,
        p.estado,

        p.alto,
        p.ancho,
        p.largo,

        p.fechaCreacion,
        p.imagenUrl,

        CAST(
          p.ancho * p.largo AS DECIMAL(18, 2)
        ) AS superficie

      FROM Proyecto p

      INNER JOIN TipoObra t
        ON t.id_TipoObra = p.id_TipoObra

      WHERE p.id_Cliente = @idCliente

      ORDER BY
        p.fechaCreacion DESC,
        p.id_Proyecto DESC
    `);

    return result.recordset;
  }

  public async obtenerProyectoPorId(idProyecto: number) {
    const pool = await connectDB();

    const result = await pool
      .request()
      .input("idProyecto", sql.Int, idProyecto)
      .query(`
      SELECT
        p.id_Proyecto AS idProyecto,
        p.id_Cliente AS idCliente,
        p.id_Empresa AS idEmpresa,
        p.id_TipoObra AS idTipoObra,

        t.nombre AS tipoObra,

        p.nombre,
        p.descripcion,
        p.ubicacion,
        p.estado,

        p.alto,
        p.ancho,
        p.largo,

        p.fechaCreacion,
        p.imagenUrl,

        CAST(
          p.ancho * p.largo AS DECIMAL(18, 2)
        ) AS superficie

      FROM Proyecto p

      INNER JOIN TipoObra t
        ON t.id_TipoObra = p.id_TipoObra

      WHERE p.id_Proyecto = @idProyecto
    `);

    return result.recordset[0] ?? null;
  }

  public async actualizarProyecto(
    idProyecto: number,
    data: Partial<CrearProyectoDTO>
  ): Promise<boolean> {
    const pool = await connectDB();

    const result = await pool
      .request()
      .input("idProyecto", sql.Int, idProyecto)
      .input("idEmpresa", sql.Int, data.idEmpresa ?? null)
      .input("idTipoObra", sql.Int, data.idTipoObra ?? null)
      .input("nombre", sql.VarChar(100), data.nombre ?? null)
      .input("descripcion", sql.VarChar(500), data.descripcion ?? null)
      .input("imagenUrl", sql.VarChar(500), data.imagenUrl ?? null)
      .input("ubicacion", sql.VarChar(200), data.ubicacion ?? null)
      .input("estado", sql.VarChar(20), data.estado ?? null)
      .input("alto", sql.Decimal(10, 2), data.alto ?? null)
      .input("ancho", sql.Decimal(10, 2), data.ancho ?? null)
      .input("largo", sql.Decimal(10, 2), data.largo ?? null)
      .query(`
        UPDATE Proyecto
        SET
          id_Empresa = COALESCE(@idEmpresa, id_Empresa),
          id_TipoObra = COALESCE(@idTipoObra, id_TipoObra),
          nombre = COALESCE(@nombre, nombre),
          descripcion = COALESCE(@descripcion, descripcion),
          imagenUrl = @imagenUrl,
          ubicacion = COALESCE(@ubicacion, ubicacion),
          estado = COALESCE(@estado, estado),
          alto = COALESCE(@alto, alto),
          ancho = COALESCE(@ancho, ancho),
          largo = COALESCE(@largo, largo)
        WHERE id_Proyecto = @idProyecto
      `);

    return result.rowsAffected[0] > 0;
  }

  public async eliminarProyecto(
    idProyecto: number
  ): Promise<boolean> {
    const pool = await connectDB();

    const transaction = pool.transaction();

    try {
      await transaction.begin();

      // ==========================================
      // ELIMINAR COTIZACIONES DEL PROYECTO
      // ==========================================

      await transaction
        .request()
        .input(
          "idProyecto",
          sql.Int,
          idProyecto
        )
        .query(`
        DELETE FROM Cotizacion
        WHERE id_Proyecto = @idProyecto
      `);

      // ==========================================
      // ELIMINAR MATERIALES DEL PROYECTO
      // ==========================================

      await transaction
        .request()
        .input(
          "idProyecto",
          sql.Int,
          idProyecto
        )
        .query(`
        DELETE FROM MaterialProyecto
        WHERE id_Proyecto = @idProyecto
      `);

      // ==========================================
      // ELIMINAR PROYECTO
      // ==========================================

      const result = await transaction
        .request()
        .input(
          "idProyecto",
          sql.Int,
          idProyecto
        )
        .query(`
        DELETE FROM Proyecto
        WHERE id_Proyecto = @idProyecto
      `);

      await transaction.commit();

      return result.rowsAffected[0] > 0;
    } catch (error) {
      await transaction.rollback();

      console.error(
        "Error al eliminar proyecto:",
        error
      );

      throw error;
    }
  }
}