import sql from "mssql";
import { connectDB } from "../server/database";

import type {
  CrearCotizacionDTO,
  ActualizarCotizacionDTO,
} from "../models/Cotizacion";

// ======================================================
// DATOS DEL PROYECTO PARA CALCULAR COTIZACIÓN
// ======================================================

export interface ProyectoCotizacionData {
  idProyecto: number;
  idTipoObra: number;

  nombre: string;

  alto: number;
  ancho: number;
  largo: number;

  codigoTipoObra: string;
  tipoObra: string;
}

// ======================================================
// DATOS DE LOS MATERIALES DEL PROYECTO
// ======================================================

export interface MaterialCotizacionData {
  idMaterialProyecto: number;
  idProyecto: number;
  idMaterial: number;

  cantidad: number;

  nombre: string;
  costoUnitario: number;
  unidad: string | null;
}

// ======================================================
// REPOSITORY
// ======================================================

export class CotizacionRepository {

  // ====================================================
  // CREAR COTIZACIÓN
  // ====================================================

  public async crearCotizacion(
    data: CrearCotizacionDTO
  ): Promise<number> {

    const pool = await connectDB();

    const result = await pool
      .request()

      .input(
        "idProyecto",
        sql.Int,
        data.idProyecto
      )

      .input(
        "estado",
        sql.VarChar(30),
        data.estado ?? "Borrador"
      )

      .input(
        "costoMateriales",
        sql.Decimal(18, 2),
        data.costoMateriales
      )

      .input(
        "costoManoObra",
        sql.Decimal(18, 2),
        data.costoManoObra
      )

      .input(
        "totalCotizacion",
        sql.Decimal(18, 2),
        data.totalCotizacion
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

      .input( "version", sql.Int, data.version )

      .query(`
        INSERT INTO Cotizacion
        (
          id_Proyecto,
          fechaRealizada,
          costoMateriales,
          costoManoObra,
          totalCotizacion,
          estado,
          precioEstimado,
          observaciones,
          fechaCreacion,
          fechaActualizacion, 
          version
        )

        OUTPUT INSERTED.id_Cotizacion

        VALUES
        (
          @idProyecto,
          GETDATE(),
          @costoMateriales,
          @costoManoObra,
          @totalCotizacion,
          @estado,
          @precioEstimado,
          @observaciones,
          GETDATE(),
          GETDATE(), 
          @version
        )
      `);

    return result.recordset[0].id_Cotizacion;
  }

  // ====================================================
  // OBTENER PRÓXIMA VERSIÓN DE COTIZACIÓN
  // ====================================================

  public async obtenerProximaVersion(
    idProyecto: number
  ): Promise<number> {

    const pool = await connectDB();

    const result = await pool
      .request()
      .input(
        "idProyecto",
        sql.Int,
        idProyecto
      )
      .query(`
        SELECT
          ISNULL(MAX(version), 0) + 1 AS proximaVersion

        FROM Cotizacion

        WHERE id_Proyecto = @idProyecto
      `);

    return result.recordset[0].proximaVersion;
  }

  // ====================================================
  // OBTENER PROYECTO PARA COTIZACIÓN
  // ====================================================

  public async obtenerProyectoParaCotizacion(
    idProyecto: number
  ): Promise<ProyectoCotizacionData | null> {

    const pool = await connectDB();

    const result = await pool
      .request()

      .input(
        "idProyecto",
        sql.Int,
        idProyecto
      )

      .query(`
        SELECT
          p.id_Proyecto AS idProyecto,
          p.id_TipoObra AS idTipoObra,

          p.nombre,

          p.alto,
          p.ancho,
          p.largo,

          t.codigo AS codigoTipoObra,
          t.nombre AS tipoObra

        FROM Proyecto p

        INNER JOIN TipoObra t
          ON p.id_TipoObra = t.id_TipoObra

        WHERE p.id_Proyecto = @idProyecto
      `);

    return result.recordset[0] ?? null;
  }

  // ====================================================
  // OBTENER MATERIALES DEL PROYECTO
  // ====================================================

  public async obtenerMaterialesDelProyecto(
    idProyecto: number
  ): Promise<MaterialCotizacionData[]> {

    const pool = await connectDB();

    const result = await pool
      .request()

      .input(
        "idProyecto",
        sql.Int,
        idProyecto
      )

      .query(`
        SELECT

          mp.idMaterialProyecto
          AS idMaterialProyecto,

          mp.id_Proyecto
            AS idProyecto,

          mp.id_Material
            AS idMaterial,

          mp.cantidad,

          m.nombre,

          m.costoUnitario,

          m.unidad

        FROM MaterialProyecto mp

        INNER JOIN Material m
          ON mp.id_Material = m.id_Material

        WHERE mp.id_Proyecto = @idProyecto

        ORDER BY
          m.nombre ASC
      `);

    return result.recordset;
  }

  // ====================================================
  // OBTENER ÚLTIMA COTIZACIÓN POR CLIENTE
  // ====================================================

  public async obtenerCotizacionesPorCliente(
    idCliente: number
  ) {

    const pool = await connectDB();

    const result = await pool
      .request()

      .input(
        "idCliente",
        sql.Int,
        idCliente
      )

      .query(`
        WITH CotizacionesVersionadas AS (
          SELECT

            c.id_Cotizacion AS idCotizacion,
            c.id_Proyecto AS idProyecto,

            CONCAT(
              'COT-',
              YEAR(c.fechaCreacion),
              '-',
              RIGHT(
                '0000' +
                CAST(
                  c.id_Cotizacion AS VARCHAR(10)
                ),
                4
              )
            ) AS codigo,

            c.fechaRealizada,
            c.fechaCreacion,
            c.fechaActualizacion,
            c.version,

            c.costoMateriales,
            c.costoManoObra,
            c.totalCotizacion,

            c.estado,
            c.precioEstimado,
            c.observaciones,

            p.id_Cliente AS idCliente,
            p.id_TipoObra AS idTipoObra,

            p.nombre AS nombreProyecto,
            p.descripcion AS descripcionProyecto,

            p.ubicacion,

            p.alto,
            p.ancho,
            p.largo,

            CAST(
              p.ancho * p.largo
              AS DECIMAL(18, 2)
            ) AS superficie,

            ROW_NUMBER() OVER (
              PARTITION BY c.id_Proyecto
              ORDER BY
                c.version DESC,
                c.fechaCreacion DESC,
                c.id_Cotizacion DESC
            ) AS numeroFila

          FROM Cotizacion c

          INNER JOIN Proyecto p
            ON p.id_Proyecto = c.id_Proyecto

          WHERE p.id_Cliente = @idCliente
        )

        SELECT
          idCotizacion,
          idProyecto,
          codigo,
          fechaRealizada,
          fechaCreacion,
          fechaActualizacion,
          version,

          costoMateriales,
          costoManoObra,
          totalCotizacion,

          estado,
          precioEstimado,
          observaciones,

          idCliente,
          idTipoObra,

          nombreProyecto,
          descripcionProyecto,

          ubicacion,

          alto,
          ancho,
          largo,
          superficie

        FROM CotizacionesVersionadas

        WHERE numeroFila = 1

        ORDER BY
          fechaCreacion DESC,
          idCotizacion DESC
      `);

    return result.recordset;
  }

  // ====================================================
  // OBTENER COTIZACIONES POR PROYECTO
  // ====================================================

  public async obtenerCotizacionesPorProyecto(
    idProyecto: number
  ) {

    const pool = await connectDB();

    const result = await pool
      .request()

      .input(
        "idProyecto",
        sql.Int,
        idProyecto
      )

      .query(`
        SELECT

          c.id_Cotizacion AS idCotizacion,
          c.id_Proyecto AS idProyecto,

          CONCAT(
            'COT-',
            YEAR(c.fechaCreacion),
            '-',
            RIGHT(
              '0000' +
              CAST(
                c.id_Cotizacion AS VARCHAR(10)
              ),
              4
            )
          ) AS codigo,

          c.fechaRealizada,
          c.fechaCreacion,
          c.fechaActualizacion,

          c.costoMateriales,
          c.costoManoObra,
          c.totalCotizacion,

          c.estado,
          c.precioEstimado,
          c.observaciones,

          p.id_Cliente AS idCliente,
          p.id_TipoObra AS idTipoObra,

          p.nombre AS nombreProyecto,
          p.descripcion AS descripcionProyecto,

          p.ubicacion,

          p.alto,
          p.ancho,
          p.largo,

          CAST(
            p.ancho * p.largo
            AS DECIMAL(18, 2)
          ) AS superficie

        FROM Cotizacion c

        INNER JOIN Proyecto p
          ON p.id_Proyecto = c.id_Proyecto

        WHERE c.id_Proyecto = @idProyecto

        ORDER BY
          c.fechaCreacion DESC,
          c.id_Cotizacion DESC
      `);

    return result.recordset;
  }

  // ====================================================
  // OBTENER COTIZACIÓN POR ID
  // ====================================================

  public async obtenerCotizacionPorId(
    idCotizacion: number
  ) {

    const pool = await connectDB();

    const result = await pool
      .request()

      .input(
        "idCotizacion",
        sql.Int,
        idCotizacion
      )

      .query(`
        SELECT

          c.id_Cotizacion AS idCotizacion,
          c.id_Proyecto AS idProyecto,

          CONCAT(
            'COT-',
            YEAR(c.fechaCreacion),
            '-',
            RIGHT(
              '0000' +
              CAST(
                c.id_Cotizacion AS VARCHAR(10)
              ),
              4
            )
          ) AS codigo,

          c.fechaRealizada,
          c.fechaCreacion,
          c.fechaActualizacion,
          c.version,

          c.costoMateriales,
          c.costoManoObra,
          c.totalCotizacion,

          c.estado,
          c.precioEstimado,
          c.observaciones,

          p.id_Cliente AS idCliente,
          p.id_TipoObra AS idTipoObra,

          p.nombre AS nombreProyecto,
          p.descripcion AS descripcionProyecto,

          p.ubicacion,

          p.alto,
          p.ancho,
          p.largo,

          CAST(
            p.ancho * p.largo
            AS DECIMAL(18, 2)
          ) AS superficie

        FROM Cotizacion c

        INNER JOIN Proyecto p
          ON p.id_Proyecto = c.id_Proyecto

        WHERE c.id_Cotizacion = @idCotizacion
      `);

    return result.recordset[0] ?? null;
  }

  // ====================================================
  // ACTUALIZAR COTIZACIÓN
  // ====================================================

  public async actualizarCotizacion(
    idCotizacion: number,
    data: ActualizarCotizacionDTO
  ): Promise<boolean> {

    const pool = await connectDB();

    const result = await pool
      .request()

      .input(
        "idCotizacion",
        sql.Int,
        idCotizacion
      )

      .input(
        "estado",
        sql.VarChar(30),
        data.estado ?? null
      )

      .input(
        "costoMateriales",
        sql.Decimal(18, 2),
        data.costoMateriales ?? null
      )

      .input(
        "costoManoObra",
        sql.Decimal(18, 2),
        data.costoManoObra ?? null
      )

      .input(
        "totalCotizacion",
        sql.Decimal(18, 2),
        data.totalCotizacion ?? null
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
        "actualizarCostoMateriales",
        sql.Bit,
        data.costoMateriales !== undefined
      )

      .input(
        "actualizarCostoManoObra",
        sql.Bit,
        data.costoManoObra !== undefined
      )

      .input(
        "actualizarTotalCotizacion",
        sql.Bit,
        data.totalCotizacion !== undefined
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

          costoMateriales =
            CASE
              WHEN @actualizarCostoMateriales = 1
                THEN @costoMateriales
              ELSE costoMateriales
            END,

          costoManoObra =
            CASE
              WHEN @actualizarCostoManoObra = 1
                THEN @costoManoObra
              ELSE costoManoObra
            END,

          totalCotizacion =
            CASE
              WHEN @actualizarTotalCotizacion = 1
                THEN @totalCotizacion
              ELSE totalCotizacion
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

  // ====================================================
  // ELIMINAR COTIZACIÓN
  // ====================================================

  public async eliminarCotizacion(
    idCotizacion: number
  ): Promise<boolean> {

    const pool = await connectDB();

    const result = await pool
      .request()

      .input(
        "idCotizacion",
        sql.Int,
        idCotizacion
      )

      .query(`
        DELETE FROM Cotizacion

        WHERE id_Cotizacion = @idCotizacion
      `);

    return result.rowsAffected[0] > 0;
  }

  // ====================================================
  // VERIFICAR SI EXISTE PROYECTO
  // ====================================================

  public async existeProyecto(
    idProyecto: number
  ): Promise<boolean> {

    const pool = await connectDB();

    const result = await pool
      .request()

      .input(
        "idProyecto",
        sql.Int,
        idProyecto
      )

      .query(`
        SELECT TOP 1
          id_Proyecto

        FROM Proyecto

        WHERE id_Proyecto = @idProyecto
      `);

    return result.recordset.length > 0;
  }
}