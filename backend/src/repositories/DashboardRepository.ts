import sql from "mssql";
import { connectDB } from "../server/database";

import type {
  Dashboard,
  EmpresaDashboard,
} from "../models/Dashboard";

export class DashboardRepository {

  public async obtenerDashboard(
    idEmpresa: number
  ): Promise<Dashboard> {

    const empresa = await this.obtenerEmpresa(idEmpresa);

    const kpis = await this.obtenerKPIs(idEmpresa);

    const cotizaciones =
        await this.obtenerCotizacionesRecientes(idEmpresa);

    const clientes =
        await this.obtenerClientesRecientes(idEmpresa);

    const proyectos =
        await this.obtenerProyectosActivos(idEmpresa);

    const distribucion =
        await this.obtenerDistribucionTiposObra(idEmpresa);

    const ingresos =
        await this.obtenerIngresosMensuales(idEmpresa);

    return {

        empresa,

        kpis,

        cotizaciones,

        clientes,

        proyectos,

        distribucion,

        ingresos

    };
  }

  private async obtenerEmpresa(
    idEmpresa: number
  ): Promise<EmpresaDashboard> {

    const pool = await connectDB();

    const resultado = await pool
      .request()
      .input(
        "idEmpresa",
        sql.Int,
        idEmpresa
      )
      .query(`
        SELECT
            nombreEmpresa,
            rubro,
            email,
            telefono,
            direccion,
            logo
        FROM Empresa
        WHERE id_Empresa = @idEmpresa
      `);

    if (resultado.recordset.length === 0) {
      throw new Error("Empresa no encontrada");
    }

    const empresa = resultado.recordset[0];

    return {
      nombreEmpresa: empresa.nombreEmpresa,
      rubro: empresa.rubro,
      email: empresa.email,
      telefono: empresa.telefono,
      ubicacion: empresa.direccion,
      logo: empresa.logo
    };
  }

  private async obtenerKPIs(
  idEmpresa: number
    ) {
    const pool = await connectDB();

    const resultado = await pool
        .request()
        .input("idEmpresa", sql.Int, idEmpresa)
        .query(`
        SELECT

        (
            SELECT COUNT(*)
            FROM Proyecto
            WHERE id_Empresa = @idEmpresa
        ) AS proyectosActivos,

        (
            SELECT COUNT(*)
            FROM Cliente
        ) AS clientes,

        (
            SELECT COUNT(*)
            FROM Cotizacion c
            INNER JOIN Proyecto p
            ON p.id_Proyecto = c.id_Proyecto
            WHERE p.id_Empresa = @idEmpresa
        ) AS cotizaciones,

        (
            SELECT
            ISNULL(SUM(c.totalCotizacion),0)
            FROM Cotizacion c
            INNER JOIN Proyecto p
            ON p.id_Proyecto = c.id_Proyecto
            WHERE p.id_Empresa = @idEmpresa
        ) AS ingresosEstimados
        `);

    return resultado.recordset[0];
    }

    private async obtenerCotizacionesRecientes(
    idEmpresa: number
    ) {

    const pool = await connectDB();

    const resultado = await pool.request()
        .input(
            "idEmpresa",
            sql.Int,
            idEmpresa
        )
        .query(`
            SELECT TOP 5

                c.id_Cotizacion,

                c.fechaRealizada,

                c.totalCotizacion,

                c.estado,

                p.nombre AS proyecto,

                cl.nombre + ' ' + cl.apellido AS cliente

            FROM Cotizacion c

            INNER JOIN Proyecto p

                ON p.id_Proyecto = c.id_Proyecto

            INNER JOIN Cliente cl

                ON cl.id_Cliente = p.id_Cliente

            WHERE p.id_Empresa = @idEmpresa

            ORDER BY c.fechaRealizada DESC
        `);

    return resultado.recordset;

    }

    private async obtenerClientesRecientes(
    idEmpresa: number
    ) {

    const pool = await connectDB();

    const resultado = await pool.request()
        .input(
            "idEmpresa",
            sql.Int,
            idEmpresa
        )
        .query(`
            SELECT TOP 5

                c.id_Cliente,

                c.nombre,

                c.apellido,

                p.nombre AS proyecto

            FROM Cliente c

            INNER JOIN Proyecto p

                ON p.id_Cliente = c.id_Cliente

            WHERE p.id_Empresa=@idEmpresa

            ORDER BY p.fechaCreacion DESC
        `);

    return resultado.recordset;

    }

    private async obtenerProyectosActivos(
    idEmpresa:number
    ){

    const pool = await connectDB();

    const resultado = await pool.request()
        .input(
            "idEmpresa",
            sql.Int,
            idEmpresa
        )
        .query(`
            SELECT TOP 5

                nombre,

                estado

            FROM Proyecto

            WHERE id_Empresa=@idEmpresa

            ORDER BY fechaCreacion DESC
        `);

    return resultado.recordset;

    }

    private async obtenerDistribucionTiposObra(
    idEmpresa:number
    ){

    const pool = await connectDB();

    const resultado = await pool.request()
        .input(
            "idEmpresa",
            sql.Int,
            idEmpresa
        )
        .query(`
            SELECT

                t.nombre,

                COUNT(*) cantidad

            FROM Proyecto p

            INNER JOIN TipoObra t

                ON t.id_TipoObra=p.id_TipoObra

            WHERE p.id_Empresa=@idEmpresa

            GROUP BY t.nombre
        `);

    return resultado.recordset;

    }

    private async obtenerIngresosMensuales(
    idEmpresa:number
    ){

    const pool = await connectDB();

    const resultado = await pool.request()
        .input(
            "idEmpresa",
            sql.Int,
            idEmpresa
        )
        .query(`
            SELECT

                MONTH(c.fechaRealizada) mes,

                SUM(c.totalCotizacion) total

            FROM Cotizacion c

            INNER JOIN Proyecto p

                ON p.id_Proyecto=c.id_Proyecto

            WHERE p.id_Empresa=@idEmpresa

            GROUP BY MONTH(c.fechaRealizada)

            ORDER BY MONTH(c.fechaRealizada)
        `);

    return resultado.recordset;

    }
}