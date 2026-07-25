import sql from "mssql";
import { connectDB } from "../server/database";

export interface CrearProyectoData {
  idCliente: number;
  idEmpresa?: number | null;
  idTipoObra: number;
  nombre: string;
  descripcion?: string | null;
  ubicacion?: string | null;
  estado?: string;
  alto: number;
  ancho: number;
  largo: number;
}

export class ProyectoRepository {
  public async crearProyecto(
    data: CrearProyectoData
  ): Promise<number> {
    const pool = await connectDB();

    const result = await pool
      .request()
      .input("idCliente", sql.Int, data.idCliente)
      .input("idEmpresa", sql.Int, data.idEmpresa ?? null)
      .input("idTipoObra", sql.Int, data.idTipoObra)
      .input("nombre", sql.VarChar(100), data.nombre)
      .input("descripcion", sql.VarChar(500), data.descripcion ?? null)
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
          id_Proyecto AS idProyecto,
          id_Cliente AS idCliente,
          id_Empresa AS idEmpresa,
          id_TipoObra AS idTipoObra,
          nombre,
          descripcion,
          ubicacion,
          estado,
          alto,
          ancho,
          largo,
          fechaCreacion
        FROM Proyecto
        WHERE id_Cliente = @idCliente
        ORDER BY fechaCreacion DESC, id_Proyecto DESC
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
          id_Proyecto AS idProyecto,
          id_Cliente AS idCliente,
          id_Empresa AS idEmpresa,
          id_TipoObra AS idTipoObra,
          nombre,
          descripcion,
          ubicacion,
          estado,
          alto,
          ancho,
          largo,
          fechaCreacion
        FROM Proyecto
        WHERE id_Proyecto = @idProyecto
      `);

    return result.recordset[0] ?? null;
  }

  public async actualizarProyecto(
    idProyecto: number,
    data: Partial<CrearProyectoData>
  ): Promise<boolean> {
    const pool = await connectDB();

    const result = await pool
      .request()
      .input("idProyecto", sql.Int, idProyecto)
      .input("idEmpresa", sql.Int, data.idEmpresa ?? null)
      .input("idTipoObra", sql.Int, data.idTipoObra ?? null)
      .input("nombre", sql.VarChar(100), data.nombre ?? null)
      .input("descripcion", sql.VarChar(500), data.descripcion ?? null)
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