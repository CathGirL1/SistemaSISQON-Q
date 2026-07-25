import sql from "mssql";
import { connectDB } from "../server/database";

export interface Material {
  idMaterial: number;
  nombre: string;
  categoria: string;
  descripcion: string | null;
  unidadMedida: string;
  precioReferencia: number | null;
  marca: string | null;
  imagen: string | null;
  activo: boolean;
}

export async function obtenerMateriales(): Promise<Material[]> {
  const pool = await connectDB();

  const result = await pool.request().query(`
    SELECT
      id_Material AS idMaterial,
      nombre,
      categoria,
      descripcion,
      unidadMedida,
      precioReferencia,
      marca,
      imagen,
      activo
    FROM Material
    WHERE activo = 1
    ORDER BY categoria, nombre;
  `);

  return result.recordset;
}

export async function obtenerMaterialPorId(
  idMaterial: number
): Promise<Material | null> {
  const pool = await connectDB();

  const result = await pool
    .request()
    .input("idMaterial", sql.Int, idMaterial)
    .query(`
      SELECT
        id_Material AS idMaterial,
        nombre,
        categoria,
        descripcion,
        unidadMedida,
        precioReferencia,
        marca,
        imagen,
        activo
      FROM Material
      WHERE id_Material = @idMaterial;
    `);

  return result.recordset[0] ?? null;
}