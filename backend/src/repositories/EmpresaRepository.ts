import { connectDB } from "../server/database";

export interface Empresa {
  idEmpresa: number;
  nombreEmpresa: string;
}

export class EmpresaRepository {
  public async obtenerEmpresas(): Promise<Empresa[]> {
    const pool = await connectDB();

    const resultado = await pool.request().query<Empresa>(`
      SELECT
        id_Empresa AS idEmpresa,
        nombreEmpresa
      FROM Empresa
      ORDER BY nombreEmpresa ASC
    `);

    return resultado.recordset;
  }
}