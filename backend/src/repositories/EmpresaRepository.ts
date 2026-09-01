import sql from "mssql";

import { connectDB } from "../server/database";

import type {
  ActualizarPerfilEmpresaDTO,
  PerfilEmpresa,
} from "../models/PerfilEmpresa";

interface PerfilEmpresaDB {
  idEmpresa: number;
  idUsuario: number;

  razonSocial: string;
  nombreComercial: string;

  rut: string;
  rubro: string;

  email: string;
  telefono: string;
  direccion: string;

  paginaWeb: string;
  descripcion: string;

  logo: string;

  zonasTrabajo: string;
  condicionesComerciales: string;
  textoLegal: string;
  impuestos: string;

  validezCotizacion: number;

  diasLaborables: string;
  horarioInicio: string;
  horarioFin: string;

  idiomaDocumentos: string;

  fechaRegistro: Date | null;
}

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

  public async obtenerEmpresaPorId(
    idEmpresa: number
  ): Promise<PerfilEmpresa | null> {
    const pool = await connectDB();

    const resultado = await pool
      .request()
      .input("idEmpresa", sql.Int, idEmpresa)
      .query<PerfilEmpresaDB>(`
        SELECT
          e.id_Empresa AS idEmpresa,
          e.id_Usuario AS idUsuario,

          e.nombreEmpresa AS razonSocial,
          e.nombreEmpresa AS nombreComercial,

          e.rut,
          ISNULL(e.rubro, '') AS rubro,

          ISNULL(e.email, '') AS email,
          ISNULL(e.telefono, '') AS telefono,
          ISNULL(e.direccion, '') AS direccion,

          ISNULL(e.paginaWeb, '') AS paginaWeb,
          ISNULL(e.descripcion, '') AS descripcion,
          ISNULL(e.logo, '') AS logo,

          ISNULL(e.zonasTrabajo, '') AS zonasTrabajo,

          ISNULL(
            e.condicionesComerciales,
            ''
          ) AS condicionesComerciales,

          ISNULL(
            e.textoLegal,
            ''
          ) AS textoLegal,

          ISNULL(
            e.impuestos,
            ''
          ) AS impuestos,

          ISNULL(
            e.validezCotizacion,
            30
          ) AS validezCotizacion,

          ISNULL(
            e.diasLaborables,
            ''
          ) AS diasLaborables,

          ISNULL(
            CONVERT(VARCHAR(5), e.horarioInicio, 108),
            ''
          ) AS horarioInicio,

          ISNULL(
            CONVERT(VARCHAR(5), e.horarioFin, 108),
            ''
          ) AS horarioFin,

          ISNULL(
            e.idiomaDocumentos,
            ''
          ) AS idiomaDocumentos,

          e.fechaRegistro
        FROM Empresa e
        WHERE e.id_Empresa = @idEmpresa
      `);

    return resultado.recordset[0] ?? null;
  }

  public async obtenerEmpresaPorUsuario(
    idUsuario: number
  ): Promise<PerfilEmpresa | null> {
    const pool = await connectDB();

    const resultado = await pool
      .request()
      .input("idUsuario", sql.Int, idUsuario)
      .query<PerfilEmpresaDB>(`
        SELECT
          e.id_Empresa AS idEmpresa,
          e.id_Usuario AS idUsuario,

          e.nombreEmpresa AS razonSocial,
          e.nombreEmpresa AS nombreComercial,

          e.rut,
          ISNULL(e.rubro, '') AS rubro,

          ISNULL(e.email, '') AS email,
          ISNULL(e.telefono, '') AS telefono,
          ISNULL(e.direccion, '') AS direccion,

          ISNULL(e.paginaWeb, '') AS paginaWeb,
          ISNULL(e.descripcion, '') AS descripcion,
          ISNULL(e.logo, '') AS logo,

          e.fechaRegistro
        FROM Empresa e
        WHERE e.id_Usuario = @idUsuario
      `);

    return resultado.recordset[0] ?? null;
  }

  public async actualizarEmpresa(
    idEmpresa: number,
    empresa: ActualizarPerfilEmpresaDTO
  ): Promise<PerfilEmpresa | null> {
    const pool = await connectDB();

    const nombreEmpresa =
      empresa.nombreComercial ||
      empresa.razonSocial;

    const resultado = await pool
      .request()
      .input("idEmpresa", sql.Int, idEmpresa)
      .input(
        "nombreEmpresa",
        sql.VarChar(100),
        nombreEmpresa
      )
      .input("rut", sql.VarChar(20), empresa.rut)
      .input(
        "rubro",
        sql.VarChar(100),
        empresa.rubro || null
      )
      .input(
        "descripcion",
        sql.VarChar(255),
        empresa.descripcion || null
      )
      .input(
        "telefono",
        sql.VarChar(20),
        empresa.telefono || null
      )
      .input(
        "email",
        sql.VarChar(100),
        empresa.email || null
      )
      .input(
        "direccion",
        sql.VarChar(200),
        empresa.direccion || null
      )
      .input(
        "logo",
        sql.VarChar(255),
        empresa.logo || null
      )
      .input(
        "paginaWeb",
        sql.VarChar(150),
        empresa.paginaWeb || null
      )
      .query(`
        UPDATE Empresa
        SET
          nombreEmpresa = @nombreEmpresa,
          rut = @rut,
          rubro = @rubro,
          descripcion = @descripcion,
          telefono = @telefono,
          email = @email,
          direccion = @direccion,
          logo = @logo,
          paginaWeb = @paginaWeb
        WHERE id_Empresa = @idEmpresa
      `);

    if ((resultado.rowsAffected[0] ?? 0) === 0) {
      return null;
    }

    return this.obtenerEmpresaPorId(idEmpresa);
  }

  public async actualizarLogoEmpresa(
    idEmpresa: number,
    logo: string
  ): Promise<PerfilEmpresa | null> {
    const pool = await connectDB();

    const resultado = await pool
      .request()
      .input("idEmpresa", sql.Int, idEmpresa)
      .input("logo", sql.VarChar(255), logo)
      .query(`
        UPDATE Empresa
        SET logo = @logo
        WHERE id_Empresa = @idEmpresa
      `);

    if ((resultado.rowsAffected[0] ?? 0) === 0) {
      return null;
    }

    return this.obtenerEmpresaPorId(idEmpresa);
  }
}