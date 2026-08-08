import sql from "mssql";
import { connectDB } from "../server/database";

export interface AgregarProyectoMaterialData {
  idProyecto: number;
  idMaterial: number;
  cantidad: number;
  observaciones?: string | null;
}

export interface ActualizarProyectoMaterialData {
  cantidad?: number;
  observaciones?: string | null;
}

export class ProyectoMaterialRepository {
  public async obtenerMaterialesPorProyecto(
    idProyecto: number
  ) {
    const pool = await connectDB();

    const result = await pool
      .request()
      .input("idProyecto", sql.Int, idProyecto)
      .query(`
        SELECT
          pm.id_ProyectoMaterial AS idProyectoMaterial,
          pm.id_Proyecto AS idProyecto,
          pm.id_Material AS idMaterial,
          pm.cantidad,
          pm.observaciones,
          pm.fechaCreacion,

          m.nombre,
          m.categoria,
          m.descripcion,
          m.unidadMedida,
          m.precioReferencia,
          m.marca,
          m.imagen,
          m.activo,

          CAST(
            pm.cantidad * COALESCE(m.precioReferencia, 0)
            AS DECIMAL(18, 2)
          ) AS subtotalActual

        FROM ProyectoMaterial pm

        INNER JOIN Material m
          ON m.id_Material = pm.id_Material

        WHERE pm.id_Proyecto = @idProyecto

        ORDER BY
          m.categoria,
          m.nombre
      `);

    return result.recordset;
  }

  public async agregarMaterial(
    data: AgregarProyectoMaterialData
  ): Promise<number> {
    const pool = await connectDB();

    const result = await pool
      .request()
      .input("idProyecto", sql.Int, data.idProyecto)
      .input("idMaterial", sql.Int, data.idMaterial)
      .input(
        "cantidad",
        sql.Decimal(10, 2),
        data.cantidad
      )
      .input(
        "observaciones",
        sql.VarChar(300),
        data.observaciones ?? null
      )
      .query(`
        INSERT INTO ProyectoMaterial
        (
          id_Proyecto,
          id_Material,
          cantidad,
          observaciones
        )
        OUTPUT INSERTED.id_ProyectoMaterial
        VALUES
        (
          @idProyecto,
          @idMaterial,
          @cantidad,
          @observaciones
        )
      `);

    return result.recordset[0].id_ProyectoMaterial;
  }

  public async actualizarMaterial(
    idProyecto: number,
    idMaterial: number,
    data: ActualizarProyectoMaterialData
  ): Promise<boolean> {
    const pool = await connectDB();

    const result = await pool
      .request()
      .input("idProyecto", sql.Int, idProyecto)
      .input("idMaterial", sql.Int, idMaterial)

      .input(
        "actualizarCantidad",
        sql.Bit,
        data.cantidad !== undefined
      )
      .input(
        "cantidad",
        sql.Decimal(10, 2),
        data.cantidad ?? null
      )

      .input(
        "actualizarObservaciones",
        sql.Bit,
        data.observaciones !== undefined
      )
      .input(
        "observaciones",
        sql.VarChar(300),
        data.observaciones ?? null
      )
      .query(`
        UPDATE ProyectoMaterial
        SET
          cantidad =
            CASE
              WHEN @actualizarCantidad = 1
              THEN @cantidad
              ELSE cantidad
            END,

          observaciones =
            CASE
              WHEN @actualizarObservaciones = 1
              THEN @observaciones
              ELSE observaciones
            END

        WHERE id_Proyecto = @idProyecto
          AND id_Material = @idMaterial
      `);

    return result.rowsAffected[0] > 0;
  }

  public async eliminarMaterial(
    idProyecto: number,
    idMaterial: number
  ): Promise<boolean> {
    const pool = await connectDB();

    const result = await pool
      .request()
      .input("idProyecto", sql.Int, idProyecto)
      .input("idMaterial", sql.Int, idMaterial)
      .query(`
        DELETE FROM ProyectoMaterial
        WHERE id_Proyecto = @idProyecto
          AND id_Material = @idMaterial
      `);

    return result.rowsAffected[0] > 0;
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

  public async existeMaterial(
    idMaterial: number
  ): Promise<boolean> {
    const pool = await connectDB();

    const result = await pool
      .request()
      .input("idMaterial", sql.Int, idMaterial)
      .query(`
        SELECT TOP 1 id_Material
        FROM Material
        WHERE id_Material = @idMaterial
          AND activo = 1
      `);

    return result.recordset.length > 0;
  }

  public async proyectoYaTieneMaterial(
    idProyecto: number,
    idMaterial: number
  ): Promise<boolean> {
    const pool = await connectDB();

    const result = await pool
      .request()
      .input("idProyecto", sql.Int, idProyecto)
      .input("idMaterial", sql.Int, idMaterial)
      .query(`
        SELECT TOP 1 id_ProyectoMaterial
        FROM ProyectoMaterial
        WHERE id_Proyecto = @idProyecto
          AND id_Material = @idMaterial
      `);

    return result.recordset.length > 0;
  }
}