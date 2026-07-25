import sql from "mssql";
import { connectDB } from "../server/database";

export interface Material {
  idMaterial: number;
  nombre: string;
  descripcion: string | null;
  stock: number;
  costoUnitario: number;
  categoria: string;
  unidad: string;
  ultimaActualizacion: Date;
  disponibilidad: string;
  estado: string;
}

export async function obtenerMateriales(): Promise<Material[]> {
  const pool = await connectDB();

  const result = await pool.request().query(`
    SELECT
      id_Material AS idMaterial,
      nombre,
      descripcion,
      stock,
      costoUnitario,
      categoria,
      unidad,
      ultimaActualizacion,
      disponibilidad,
      estado
    FROM Material
    WHERE estado = 'Activo'
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
        descripcion,
        stock,
        costoUnitario,
        categoria,
        unidad,
        ultimaActualizacion,
        disponibilidad,
        estado
      FROM Material
      WHERE id_Material = @idMaterial;
    `);

  return result.recordset[0] ?? null;
}