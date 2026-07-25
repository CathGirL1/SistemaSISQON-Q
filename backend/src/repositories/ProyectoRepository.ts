import sql from "mssql";
import { connectDB } from "../server/database";
import { Proyecto } from "../models/Proyecto";

export class ProyectoRepository {

  public async crearProyecto(proyecto: Proyecto): Promise<number> {
    const pool = await connectDB();

    const result = await pool
      .request()
      .input("idCliente", sql.Int, proyecto.idCliente)
      .input("idEmpresa", sql.Int, proyecto.idEmpresa ?? null)
      .input("idTipoObra", sql.Int, proyecto.tipoObraID)
      .input("nombre", sql.VarChar(100), proyecto.nombre)
      .input("estado", sql.VarChar(20), proyecto.estado ?? "Borrador")
      .input("alto", sql.Decimal(10, 2), proyecto.alto)
      .input("ancho", sql.Decimal(10, 2), proyecto.ancho)
      .input("largo", sql.Decimal(10, 2), proyecto.largo)
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
          fechaCreacion
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
          GETDATE()
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
          p.nombre,
          p.descripcion,
          p.ubicacion,
          p.estado,
          p.alto,
          p.ancho,
          p.largo,
          p.fechaCreacion
        FROM Proyecto p
        WHERE p.id_Cliente = @idCliente
        ORDER BY p.fechaCreacion DESC, p.id_Proyecto DESC
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
          p.nombre,
          p.descripcion,
          p.ubicacion,
          p.estado,
          p.alto,
          p.ancho,
          p.largo,
          p.fechaCreacion
        FROM Proyecto p
        WHERE p.id_Proyecto = @idProyecto
      `);

    return result.recordset[0] ?? null;
  }

  public async actualizarProyecto(
    idProyecto: number,
    data: Partial<Proyecto>
  ): Promise<boolean> {
    const pool = await connectDB();

    const result = await pool
      .request()
      .input("idProyecto", sql.Int, idProyecto)
      .input("idEmpresa", sql.Int, data.idEmpresa ?? null)
      .input("idTipoObra", sql.Int, data.tipoObraID ?? null)
      .input("nombre", sql.VarChar(100), data.nombre ?? null)
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
          ubicacion = COALESCE(@ubicacion, ubicacion),
          estado = COALESCE(@estado, estado),
          alto = COALESCE(@alto, alto),
          ancho = COALESCE(@ancho, ancho),
          largo = COALESCE(@largo, largo)
        WHERE id_Proyecto = @idProyecto
      `);

    return result.rowsAffected[0] > 0;
  }

  public async eliminarProyecto(idProyecto: number): Promise<boolean> {
    const pool = await connectDB();

    const result = await pool
      .request()
      .input("idProyecto", sql.Int, idProyecto)
      .query(`
        DELETE FROM Proyecto
        WHERE id_Proyecto = @idProyecto
      `);

    return result.rowsAffected[0] > 0;
  }
}