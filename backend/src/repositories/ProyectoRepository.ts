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
  public async crearProyecto(data: CrearProyectoData): Promise<number> {
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
          largo
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
          @largo
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
    data: Partial<CrearProyectoData>
  ): Promise<boolean> {
    const pool = await connectDB();

    const result = await pool
      .request()
      .input("idProyecto", sql.Int, idProyecto)

      .input(
        "actualizarIdEmpresa",
        sql.Bit,
        data.idEmpresa !== undefined
      )
      .input(
        "idEmpresa",
        sql.Int,
        data.idEmpresa ?? null
      )

      .input(
        "actualizarIdTipoObra",
        sql.Bit,
        data.idTipoObra !== undefined
      )
      .input(
        "idTipoObra",
        sql.Int,
        data.idTipoObra ?? null
      )

      .input(
        "actualizarNombre",
        sql.Bit,
        data.nombre !== undefined
      )
      .input(
        "nombre",
        sql.VarChar(100),
        data.nombre ?? null
      )

      .input(
        "actualizarDescripcion",
        sql.Bit,
        data.descripcion !== undefined
      )
      .input(
        "descripcion",
        sql.VarChar(500),
        data.descripcion ?? null
      )

      .input(
        "actualizarUbicacion",
        sql.Bit,
        data.ubicacion !== undefined
      )
      .input(
        "ubicacion",
        sql.VarChar(200),
        data.ubicacion ?? null
      )

      .input(
        "actualizarEstado",
        sql.Bit,
        data.estado !== undefined
      )
      .input(
        "estado",
        sql.VarChar(20),
        data.estado ?? null
      )

      .input(
        "actualizarAlto",
        sql.Bit,
        data.alto !== undefined
      )
      .input(
        "alto",
        sql.Decimal(10, 2),
        data.alto ?? null
      )

      .input(
        "actualizarAncho",
        sql.Bit,
        data.ancho !== undefined
      )
      .input(
        "ancho",
        sql.Decimal(10, 2),
        data.ancho ?? null
      )

      .input(
        "actualizarLargo",
        sql.Bit,
        data.largo !== undefined
      )
      .input(
        "largo",
        sql.Decimal(10, 2),
        data.largo ?? null
      )
      .query(`
      UPDATE Proyecto
      SET
        id_Empresa =
          CASE
            WHEN @actualizarIdEmpresa = 1
            THEN @idEmpresa
            ELSE id_Empresa
          END,

        id_TipoObra =
          CASE
            WHEN @actualizarIdTipoObra = 1
            THEN @idTipoObra
            ELSE id_TipoObra
          END,

        nombre =
          CASE
            WHEN @actualizarNombre = 1
            THEN @nombre
            ELSE nombre
          END,

        descripcion =
          CASE
            WHEN @actualizarDescripcion = 1
            THEN @descripcion
            ELSE descripcion
          END,

        ubicacion =
          CASE
            WHEN @actualizarUbicacion = 1
            THEN @ubicacion
            ELSE ubicacion
          END,

        estado =
          CASE
            WHEN @actualizarEstado = 1
            THEN @estado
            ELSE estado
          END,

        alto =
          CASE
            WHEN @actualizarAlto = 1
            THEN @alto
            ELSE alto
          END,

        ancho =
          CASE
            WHEN @actualizarAncho = 1
            THEN @ancho
            ELSE ancho
          END,

        largo =
          CASE
            WHEN @actualizarLargo = 1
            THEN @largo
            ELSE largo
          END
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