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
                AND estado = 'Activo'
            ) AS proyectosActivos,

            (
            SELECT COUNT(DISTINCT p.id_Cliente)
            FROM Proyecto p
            WHERE p.id_Empresa = @idEmpresa
            ) AS clientes,

            (
            SELECT COUNT(*)
            FROM Cotizacion c
            WHERE c.id_Empresa = @idEmpresa
            ) AS cotizaciones,

            (
            SELECT ISNULL(
                SUM(c.totalCotizacion),
                0
            )
            FROM Cotizacion c
            WHERE c.id_Empresa = @idEmpresa
                AND c.estado = 'Finalizada'
            ) AS ingresosEstimados
        `);

    return resultado.recordset[0];
    }

    private async obtenerCotizacionesRecientes(
    idEmpresa: number
    ) {
    const pool = await connectDB();

    const resultado = await pool
        .request()
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

        WHERE c.id_Empresa = @idEmpresa

        ORDER BY c.fechaRealizada DESC
        `);

    return resultado.recordset;
    }

    private async obtenerClientesRecientes(
        idEmpresa: number
    ) {
    const pool = await connectDB();

    const resultado = await pool
        .request()
        .input(
        "idEmpresa",
        sql.Int,
        idEmpresa
        )
        .query(`
        WITH ClientesEmpresa AS (
            SELECT
            c.id_Cliente,
            c.nombre,
            c.apellido,
            p.nombre AS proyecto,
            p.fechaCreacion,

            ROW_NUMBER() OVER (
                PARTITION BY c.id_Cliente
                ORDER BY p.fechaCreacion DESC
            ) AS fila

            FROM Cliente c

            INNER JOIN Proyecto p
            ON p.id_Cliente = c.id_Cliente

            WHERE p.id_Empresa = @idEmpresa
        )

        SELECT TOP 5
            id_Cliente,
            nombre,
            apellido,
            proyecto

        FROM ClientesEmpresa

        WHERE fila = 1

        ORDER BY fechaCreacion DESC
        `);

    return resultado.recordset;

    }

    private async obtenerProyectosActivos(
    idEmpresa: number
    ) {
    const pool = await connectDB();

    const resultado = await pool
        .request()
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

        WHERE id_Empresa = @idEmpresa
            AND estado = 'Activo'

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
    idEmpresa: number
    ) {
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
            MONTH(c.fechaActualizacion) AS mes,
            SUM(c.totalCotizacion) AS total

        FROM Cotizacion c

        WHERE c.id_Empresa = @idEmpresa
            AND c.estado = 'Finalizada'
            AND c.fechaActualizacion IS NOT NULL

        GROUP BY
            MONTH(c.fechaActualizacion)

        ORDER BY
            MONTH(c.fechaActualizacion)
        `);

    return resultado.recordset;
    }
}