import sql from "mssql";
import { connectDB } from "../server/database";

export interface CrearCotizacionData {
  idProyecto: number;
  estado?: string;
  precioEstimado?: number | null;
  observaciones?: string | null;
}

export interface ActualizarCotizacionData {
  estado?: string;
  precioEstimado?: number | null;
  observaciones?: string | null;
}

export class CotizacionRepository {
  public async crearCotizacion(
    data: CrearCotizacionData
  ): Promise<number> {
    const pool = await connectDB();

    const result = await pool
      .request()
      .input("idProyecto", sql.Int, data.idProyecto)
      .input(
        "estado",
        sql.VarChar(30),
        data.estado ?? "Borrador"
      )
      .input(
        "precioEstimado",
        sql.Decimal(18, 2),
        data.precioEstimado ?? null
      )
      .input(
        "observaciones",
        sql.VarChar(1000),
        data.observaciones ?? null
      )
      .query(`
        INSERT INTO Cotizacion
        (
          id_Proyecto,
          estado,
          precioEstimado,
          observaciones
        )
        OUTPUT INSERTED.id_Cotizacion
        VALUES
        (
          @idProyecto,
          @estado,
          @precioEstimado,
          @observaciones
        )
      `);

    return result.recordset[0].id_Cotizacion;
  }

  public async obtenerCotizacionesPorCliente(
    idCliente: number
  ) {
    const pool = await connectDB();

    const result = await pool
      .request()
      .input("idCliente", sql.Int, idCliente)
      .query(`
        SELECT
          c.id_Cotizacion AS idCotizacion,
          c.id_Proyecto AS idProyecto,

          CONCAT(
            'COT-',
            YEAR(c.fechaCreacion),
            '-',
            RIGHT(
              '0000' + CAST(c.id_Cotizacion AS VARCHAR(10)),
              4
            )
          ) AS codigo,

          c.fechaCreacion,
          c.fechaActualizacion,
          c.estado,
          c.precioEstimado,
          c.observaciones,

          p.id_Cliente AS idCliente,
          p.id_TipoObra AS idTipoObra,
          t.nombre AS tipoObra,
          p.nombre AS nombreProyecto,
          p.descripcion AS descripcionProyecto,
          p.ubicacion,
          p.alto,
          p.ancho,
          p.largo,

          CAST(
            p.ancho * p.largo AS DECIMAL(18, 2)
          ) AS superficie

        FROM Cotizacion c

        INNER JOIN Proyecto p
          ON p.id_Proyecto = c.id_Proyecto
          
        INNER JOIN TipoObra t
          ON t.id_TipoObra = p.id_TipoObra

        WHERE p.id_Cliente = @idCliente

        ORDER BY
          c.fechaCreacion DESC,
          c.id_Cotizacion DESC
      `);

    return result.recordset;
  }

  public async obtenerCotizacionesPorProyecto(
    idProyecto: number
  ) {
    const pool = await connectDB();

    const result = await pool
      .request()
      .input("idProyecto", sql.Int, idProyecto)
      .query(`
        SELECT
          c.id_Cotizacion AS idCotizacion,
          c.id_Proyecto AS idProyecto,

          CONCAT(
            'COT-',
            YEAR(c.fechaCreacion),
            '-',
            RIGHT(
              '0000' + CAST(c.id_Cotizacion AS VARCHAR(10)),
              4
            )
          ) AS codigo,

          c.fechaCreacion,
          c.fechaActualizacion,
          c.estado,
          c.precioEstimado,
          c.observaciones,

          p.id_Cliente AS idCliente,
          p.id_TipoObra AS idTipoObra,
          t.nombre AS tipoObra,
          p.nombre AS nombreProyecto,
          p.descripcion AS descripcionProyecto,
          p.ubicacion,
          p.alto,
          p.ancho,
          p.largo,

          CAST(
            p.ancho * p.largo AS DECIMAL(18, 2)
          ) AS superficie

        FROM Cotizacion c

        INNER JOIN Proyecto p
          ON p.id_Proyecto = c.id_Proyecto
          
        INNER JOIN TipoObra t
          ON t.id_TipoObra = p.id_TipoObra

        WHERE c.id_Proyecto = @idProyecto

        ORDER BY
          c.fechaCreacion DESC,
          c.id_Cotizacion DESC
      `);

    return result.recordset;
  }

  public async obtenerCotizacionPorId(
    idCotizacion: number
  ) {
    const pool = await connectDB();

    const result = await pool
      .request()
      .input("idCotizacion", sql.Int, idCotizacion)
      .query(`
        SELECT
          c.id_Cotizacion AS idCotizacion,
          c.id_Proyecto AS idProyecto,

          CONCAT(
            'COT-',
            YEAR(c.fechaCreacion),
            '-',
            RIGHT(
              '0000' + CAST(c.id_Cotizacion AS VARCHAR(10)),
              4
            )
          ) AS codigo,

          c.fechaCreacion,
          c.fechaActualizacion,
          c.estado,
          c.precioEstimado,
          c.observaciones,

          p.id_Cliente AS idCliente,
          p.id_TipoObra AS idTipoObra,
          t.nombre AS tipoObra,
          p.nombre AS nombreProyecto,
          p.descripcion AS descripcionProyecto,
          p.ubicacion,
          p.alto,
          p.ancho,
          p.largo,

          CAST(
            p.ancho * p.largo AS DECIMAL(18, 2)
          ) AS superficie

        FROM Cotizacion c

        INNER JOIN Proyecto p
          ON p.id_Proyecto = c.id_Proyecto
          
        INNER JOIN TipoObra t
          ON t.id_TipoObra = p.id_TipoObra

        WHERE c.id_Cotizacion = @idCotizacion
      `);

    return result.recordset[0] ?? null;
  }

  public async actualizarCotizacion(
    idCotizacion: number,
    data: ActualizarCotizacionData
  ): Promise<boolean> {
    const pool = await connectDB();

    const result = await pool
      .request()
      .input("idCotizacion", sql.Int, idCotizacion)
      .input(
        "estado",
        sql.VarChar(30),
        data.estado ?? null
      )
      .input(
        "precioEstimado",
        sql.Decimal(18, 2),
        data.precioEstimado ?? null
      )
      .input(
        "observaciones",
        sql.VarChar(1000),
        data.observaciones ?? null
      )
      .input(
        "actualizarEstado",
        sql.Bit,
        data.estado !== undefined
      )
      .input(
        "actualizarPrecio",
        sql.Bit,
        data.precioEstimado !== undefined
      )
      .input(
        "actualizarObservaciones",
        sql.Bit,
        data.observaciones !== undefined
      )
      .query(`
        UPDATE Cotizacion
        SET
          estado =
            CASE
              WHEN @actualizarEstado = 1
                THEN @estado
              ELSE estado
            END,

          precioEstimado =
            CASE
              WHEN @actualizarPrecio = 1
                THEN @precioEstimado
              ELSE precioEstimado
            END,

          observaciones =
            CASE
              WHEN @actualizarObservaciones = 1
                THEN @observaciones
              ELSE observaciones
            END,

          fechaActualizacion = GETDATE()

        WHERE id_Cotizacion = @idCotizacion
      `);

    return result.rowsAffected[0] > 0;
  }

  public async eliminarCotizacion(
    idCotizacion: number
  ): Promise<boolean> {
    const pool = await connectDB();

    const result = await pool
      .request()
      .input("idCotizacion", sql.Int, idCotizacion)
      .query(`
        DELETE FROM Cotizacion
        WHERE id_Cotizacion = @idCotizacion
      `);

    return result.rowsAffected[0] > 0;
  }

  public async obtenerCotizacionBorradorPorProyecto(
    idProyecto: number
  ) {
    const pool = await connectDB();

    const result = await pool
      .request()
      .input("idProyecto", sql.Int, idProyecto)
      .query(`
      SELECT TOP 1
        c.id_Cotizacion AS idCotizacion,
        c.id_Proyecto AS idProyecto,
        c.fechaCreacion,
        c.fechaActualizacion,
        c.estado,
        c.precioEstimado,
        c.observaciones
      FROM Cotizacion c
      WHERE c.id_Proyecto = @idProyecto
      AND c.estado = 'Borrador'
      ORDER BY 
          c.fechaCreacion DESC,
          c.id_Cotizacion DESC
      `);

    return result.recordset[0] ?? null;
  }

  public async existeProyecto(
    idProyecto: number
  ): Promise<boolean> {
    const pool = await connectDB();

    const result = await pool
      .request()
      .input("idProyecto", sql.Int, idProyecto)
      .query(`
        SELECT TOP 1 id_Proyecto
        FROM Proyecto
        WHERE id_Proyecto = @idProyecto
      `);

    return result.recordset.length > 0;
  }
}
