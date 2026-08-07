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
        id_Material,
        id_Empresa AS idEmpresa,
        nombre,
        descripcion,
        stock,
        costoUnitario,
        categoria,
        unidad,
        ultimaActualizacion,
        disponibilidad,
        estado,
        imagenUrl
      FROM Material
      ORDER BY id_Material DESC
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
          id_Material,
          id_Empresa AS idEmpresa,
          nombre,
          descripcion,
          stock,
          costoUnitario,
          categoria,
          unidad,
          ultimaActualizacion,
          disponibilidad,
          estado,
          imagenUrl
        FROM Material
        WHERE id_Material = @idMaterial
      `);

    return resultado.recordset[0] ?? null;
  }

  public async crearMaterial(
    material: CrearMaterialDTO
  ): Promise<Material> {
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
      .query<Material>(`
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
        OUTPUT
          INSERTED.id_Material,
          INSERTED.id_Empresa AS idEmpresa,
          INSERTED.nombre,
          INSERTED.descripcion,
          INSERTED.stock,
          INSERTED.costoUnitario,
          INSERTED.categoria,
          INSERTED.unidad,
          INSERTED.ultimaActualizacion,
          INSERTED.disponibilidad,
          INSERTED.estado,
          INSERTED.imagenUrl
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

    return resultado.recordset[0];
  }

  public async actualizarMaterial(
    idMaterial: number,
    material: ActualizarMaterialDTO
  ): Promise<Material | null> {
    const pool = await connectDB();

    const resultado = await pool
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
      .query<Material>(`
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
        OUTPUT
          INSERTED.id_Material,
          INSERTED.id_Empresa AS idEmpresa,
          INSERTED.nombre,
          INSERTED.descripcion,
          INSERTED.stock,
          INSERTED.costoUnitario,
          INSERTED.categoria,
          INSERTED.unidad,
          INSERTED.ultimaActualizacion,
          INSERTED.disponibilidad,
          INSERTED.estado,
          INSERTED.imagenUrl
        WHERE id_Material = @idMaterial
      `);

    return resultado.recordset[0] ?? null;
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