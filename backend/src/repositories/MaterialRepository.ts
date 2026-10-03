import sql from "mssql";

import { connectDB } from "../server/database";

import type {
  ActualizarMaterialDTO,
  CrearMaterialDTO,
  Material,
} from "../models/Material";

export class MaterialRepository {
  public async obtenerMateriales(): Promise<Material[]> {
    const pool = await connectDB();

    const resultado = await pool.request().query<Material>(`
      SELECT
          m.id_Material,
          m.id_Empresa AS idEmpresa,
          e.nombreEmpresa AS nombreEmpresa,
          m.nombre,
          m.descripcion,
          m.stock,
          m.costoUnitario,
          m.categoria,
          m.unidad,
          m.ultimaActualizacion,
          m.disponibilidad,
          m.estado,
          m.imagenUrl
      FROM Material m
      INNER JOIN Empresa e
          ON m.id_Empresa = e.id_Empresa
      ORDER BY m.id_Material DESC
    `);

    return resultado.recordset;
  }

  public async obtenerMaterialPorId(
    idMaterial: number
  ): Promise<Material | null> {
    const pool = await connectDB();

    const resultado = await pool
      .request()
      .input("idMaterial", sql.Int, idMaterial)
      .query<Material>(`
        SELECT
            m.id_Material,
            m.id_Empresa AS idEmpresa,
            e.nombreEmpresa AS nombreEmpresa,
            m.nombre,
            m.descripcion,
            m.stock,
            m.costoUnitario,
            m.categoria,
            m.unidad,
            m.ultimaActualizacion,
            m.disponibilidad,
            m.estado,
            m.imagenUrl
        FROM Material m
        INNER JOIN Empresa e
            ON m.id_Empresa = e.id_Empresa
        WHERE m.id_Material = @idMaterial
      `);

    return resultado.recordset[0] ?? null;
  }

  public async obtenerAlternativasMaterial(
    idMaterial: number
  ): Promise<Material[]> {
    const pool = await connectDB();

    const resultado = await pool
      .request()
      .input("idMaterial", sql.Int, idMaterial)
      .query<Material>(`
      SELECT
          alternativa.id_Material,
          alternativa.id_Empresa AS idEmpresa,
          e.nombreEmpresa AS nombreEmpresa,
          alternativa.nombre,
          alternativa.descripcion,
          alternativa.stock,
          alternativa.costoUnitario,
          alternativa.categoria,
          alternativa.unidad,
          alternativa.ultimaActualizacion,
          alternativa.disponibilidad,
          alternativa.estado,
          alternativa.imagenUrl

      FROM Material actual

      INNER JOIN Material alternativa
          ON LOWER(LTRIM(RTRIM(alternativa.nombre))) =
             LOWER(LTRIM(RTRIM(actual.nombre)))
         AND ISNULL(
               LOWER(LTRIM(RTRIM(alternativa.unidad))),
               ''
             ) =
             ISNULL(
               LOWER(LTRIM(RTRIM(actual.unidad))),
               ''
             )

      INNER JOIN Empresa e
          ON alternativa.id_Empresa = e.id_Empresa

      WHERE actual.id_Material = @idMaterial

        AND alternativa.id_Material <> actual.id_Material

        AND alternativa.estado = 'Activo'

        AND alternativa.disponibilidad <> 'Sin stock'

      ORDER BY alternativa.costoUnitario ASC
    `);

    return resultado.recordset;
  }

  public async obtenerMaterialesPorEmpresa(
    idEmpresa: number
  ): Promise<Material[]> {
    const pool = await connectDB();

    const resultado = await pool
      .request()
      .input("idEmpresa", sql.Int, idEmpresa)
      .query<Material>(`
        SELECT
            m.id_Material,
            m.id_Empresa AS idEmpresa,
            e.nombreEmpresa AS nombreEmpresa,
            m.nombre,
            m.descripcion,
            m.stock,
            m.costoUnitario,
            m.categoria,
            m.unidad,
            m.ultimaActualizacion,
            m.disponibilidad,
            m.estado,
            m.imagenUrl
        FROM Material m
        INNER JOIN Empresa e
            ON m.id_Empresa = e.id_Empresa
        WHERE m.id_Empresa = @idEmpresa
        ORDER BY m.id_Material DESC
      `);

    return resultado.recordset;
  }

  public async crearMaterial(material: CrearMaterialDTO): Promise<Material> {
    const pool = await connectDB();

    const resultado = await pool
      .request()
      .input("nombre", sql.VarChar(100), material.nombre)
      .input(
        "descripcion",
        sql.VarChar(255),
        material.descripcion ?? null
      )
      .input("stock", sql.Int, material.stock)
      .input(
        "costoUnitario",
        sql.Decimal(12, 2),
        material.costoUnitario
      )
      .input(
        "categoria",
        sql.VarChar(100),
        material.categoria ?? null
      )
      .input(
        "unidad",
        sql.VarChar(50),
        material.unidad ?? null
      )
      .input(
        "disponibilidad",
        sql.VarChar(20),
        material.disponibilidad ?? "Disponible"
      )
      .input(
        "estado",
        sql.VarChar(20),
        material.estado ?? "Activo"
      )
      .input(
        "idEmpresa",
        sql.Int,
        material.idEmpresa
      )
      .input(
        "imagenUrl",
        sql.NVarChar(500),
        material.imagenUrl ?? null
      )
      .query(`
          INSERT INTO Material (
            nombre,
            descripcion,
            stock,
            costoUnitario,
            categoria,
            unidad,
            ultimaActualizacion,
            disponibilidad,
            estado,
            id_Empresa,
            imagenUrl
          )
          OUTPUT INSERTED.id_Material
          VALUES (
            @nombre,
            @descripcion,
            @stock,
            @costoUnitario,
            @categoria,
            @unidad,
            GETDATE(),
            @disponibilidad,
            @estado,
            @idEmpresa,
            @imagenUrl
          )
        `);

    const idMaterial = resultado.recordset[0].id_Material;

    return (await this.obtenerMaterialPorId(idMaterial))!;
  }

  // OBTENER COMPARACIÓN DE PRECIOS DE LOS MATERIALES DEL PROYECTO
  public async obtenerComparacionMateriales(
    idProyecto: number
  ) {
    const pool = await connectDB();

    const result = await pool
      .request()
      .input("idProyecto", sql.Int, idProyecto)
      .query(`
            SELECT
                mp.idMaterialProyecto,
                mp.id_Proyecto AS idProyecto,
                actual.id_Material AS idMaterialActual,
                actual.nombre AS material,
                actual.unidad,
                mp.cantidad,

                actual.id_Empresa AS idEmpresaActual,
                empresaActual.nombreEmpresa AS empresaActual,
                actual.costoUnitario AS precioUnitarioActual,
                mp.cantidad * actual.costoUnitario AS subtotalActual,

                alternativa.id_Material AS idMaterialAlternativa,
                alternativa.id_Empresa AS idEmpresaAlternativa,
                empresaAlternativa.nombreEmpresa AS empresaAlternativa,
                alternativa.costoUnitario AS precioUnitarioAlternativa,
                mp.cantidad * alternativa.costoUnitario AS subtotalAlternativa,

                (
                    mp.cantidad * actual.costoUnitario
                    -
                    mp.cantidad * alternativa.costoUnitario
                ) AS diferencia

            FROM MaterialProyecto mp

            INNER JOIN Material actual
                ON actual.id_Material = mp.id_Material

            INNER JOIN Empresa empresaActual
                ON empresaActual.id_Empresa = actual.id_Empresa

            INNER JOIN Material alternativa
                ON LOWER(LTRIM(RTRIM(alternativa.nombre))) =
                   LOWER(LTRIM(RTRIM(actual.nombre)))

               AND ISNULL(
                    LOWER(LTRIM(RTRIM(alternativa.unidad))),
                    ''
               ) =
               ISNULL(
                    LOWER(LTRIM(RTRIM(actual.unidad))),
                    ''
               )

               AND alternativa.id_Material <> actual.id_Material

            INNER JOIN Empresa empresaAlternativa
                ON empresaAlternativa.id_Empresa =
                   alternativa.id_Empresa

            WHERE mp.id_Proyecto = @idProyecto

              AND alternativa.estado = 'Activo'

              AND alternativa.disponibilidad <> 'Sin stock'

            ORDER BY
                actual.nombre ASC,
                alternativa.costoUnitario ASC;
        `);

    return result.recordset;
  }

  public async actualizarMaterial(idMaterial: number, material: ActualizarMaterialDTO): Promise<Material | null> {
    const pool = await connectDB();

    await pool
      .request()
      .input("idMaterial", sql.Int, idMaterial)
      .input("nombre", sql.VarChar(100), material.nombre)
      .input(
        "descripcion",
        sql.VarChar(255),
        material.descripcion ?? null
      )
      .input("stock", sql.Int, material.stock)
      .input(
        "costoUnitario",
        sql.Decimal(12, 2),
        material.costoUnitario
      )
      .input(
        "categoria",
        sql.VarChar(100),
        material.categoria ?? null
      )
      .input(
        "unidad",
        sql.VarChar(50),
        material.unidad ?? null
      )
      .input(
        "disponibilidad",
        sql.VarChar(20),
        material.disponibilidad ?? "Disponible"
      )
      .input(
        "estado",
        sql.VarChar(20),
        material.estado ?? "Activo"
      )
      .input(
        "imagenUrl",
        sql.NVarChar(500),
        material.imagenUrl ?? null
      )
      .query(`
          UPDATE Material
          SET
            nombre = @nombre,
            descripcion = @descripcion,
            stock = @stock,
            costoUnitario = @costoUnitario,
            categoria = @categoria,
            unidad = @unidad,
            ultimaActualizacion = GETDATE(),
            disponibilidad = @disponibilidad,
            estado = @estado,
            imagenUrl = @imagenUrl
          WHERE id_Material = @idMaterial
        `);

    return await this.obtenerMaterialPorId(idMaterial);
  }

  public async eliminarMaterial(
    idMaterial: number
  ): Promise<boolean> {
    const pool = await connectDB();

    const resultado = await pool
      .request()
      .input("idMaterial", sql.Int, idMaterial)
      .query(`
        DELETE FROM Material
        WHERE id_Material = @idMaterial
      `);

    return (resultado.rowsAffected[0] ?? 0) > 0;
  }
}
