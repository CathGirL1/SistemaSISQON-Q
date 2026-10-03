import sql from "mssql";
import { connectDB } from "../server/database";

import type {
    AgregarMaterialProyectoDTO,
} from "../models/MaterialProyecto";


export class MaterialProyectoRepository {

    // AGREGAR MATERIAL AL PROYECTO
    public async agregarMaterial(
        data: AgregarMaterialProyectoDTO
    ): Promise<number> {



        const pool = await connectDB();

        const result = await pool
            .request()
            .input("idProyecto", sql.Int, data.idProyecto)
            .input("idMaterial", sql.Int, data.idMaterial)
            .input("cantidad", sql.Int, data.cantidad)
            .query(`
                INSERT INTO MaterialProyecto
                (
                    id_Proyecto,
                    id_Material,
                    cantidad
                )
                OUTPUT INSERTED.idMaterialProyecto
                VALUES
                (
                    @idProyecto,
                    @idMaterial,
                    @cantidad
                )
            `);

        return result.recordset[0].idMaterialProyecto;
    }


    // OBTENER MATERIALES DE UN PROYECTO
    public async obtenerMaterialesPorProyecto(
        idProyecto: number
    ) {

        const pool = await connectDB();

        const result = await pool
            .request()
            .input("idProyecto", sql.Int, idProyecto)
            .query(`
              SELECT
                mp.idMaterialProyecto AS idMaterialProyecto,
                mp.id_Proyecto AS idProyecto,
                mp.id_Material AS idMaterial,
                mp.cantidad,

                m.nombre,
                m.descripcion,
                m.stock,
                m.costoUnitario,
                m.categoria,
                m.unidad,
                m.ultimaActualizacion,
                m.disponibilidad,
                m.estado,
                m.imagenUrl,

                e.id_Empresa AS idEmpresa,
                e.nombreEmpresa AS nombreEmpresa

            FROM MaterialProyecto mp

            INNER JOIN Material m
                ON mp.id_Material = m.id_Material

            INNER JOIN Empresa e
                ON m.id_Empresa = e.id_Empresa

            WHERE mp.id_Proyecto = @idProyecto

            ORDER BY m.nombre ASC;
            `);



        return result.recordset;
    }

    public async obtenerComparacionMateriales(
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
                mp.idMaterialProyecto,
                mp.id_Proyecto AS idProyecto,

                actual.id_Material AS idMaterialActual,
                actual.nombre AS material,
                actual.unidad,
                mp.cantidad,

                actual.id_Empresa AS idEmpresaActual,
                empresaActual.nombreEmpresa AS empresaActual,
                actual.costoUnitario AS precioUnitarioActual,

                mp.cantidad * actual.costoUnitario
                    AS subtotalActual,

                alternativa.id_Material
                    AS idMaterialAlternativa,

                alternativa.id_Empresa
                    AS idEmpresaAlternativa,

                empresaAlternativa.nombreEmpresa
                    AS empresaAlternativa,

                alternativa.costoUnitario
                    AS precioUnitarioAlternativa,

                mp.cantidad * alternativa.costoUnitario
                    AS subtotalAlternativa,

                (mp.cantidad * actual.costoUnitario)
                -
                (mp.cantidad * alternativa.costoUnitario)
                    AS diferencia

            FROM MaterialProyecto mp

            INNER JOIN Material actual
                ON actual.id_Material = mp.id_Material

            INNER JOIN Empresa empresaActual
                ON empresaActual.id_Empresa =
                   actual.id_Empresa

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

                AND alternativa.id_Material <>
                    actual.id_Material

            INNER JOIN Empresa empresaAlternativa
                ON empresaAlternativa.id_Empresa =
                   alternativa.id_Empresa

            WHERE mp.id_Proyecto = @idProyecto

                AND alternativa.estado = 'Activo'

                AND alternativa.disponibilidad <>
                    'Sin stock'

                AND alternativa.costoUnitario <
                    actual.costoUnitario

            ORDER BY
                actual.nombre ASC,
                alternativa.costoUnitario ASC;
        `);

        return result.recordset;
    }

    public async obtenerMaterialProyectoPorId(
        idMaterialProyecto: number
    ) {
        const pool = await connectDB();

        const result = await pool
            .request()
            .input(
                "idMaterialProyecto",
                sql.Int,
                idMaterialProyecto
            )
            .query(`
            SELECT
                mp.idMaterialProyecto,
                mp.id_Proyecto AS idProyecto,
                mp.id_Material AS idMaterial,
                mp.cantidad,

                m.nombre,
                m.unidad,
                m.costoUnitario,
                m.estado,
                m.disponibilidad

            FROM MaterialProyecto mp

            INNER JOIN Material m
                ON m.id_Material = mp.id_Material

            WHERE mp.idMaterialProyecto =
                @idMaterialProyecto
        `);

        return result.recordset[0] ?? null;
    }

    public async usarMaterialAlternativo(
        idMaterialProyecto: number,
        idMaterialAlternativo: number
    ): Promise<boolean> {

        const pool = await connectDB();

        const result = await pool
            .request()

            .input(
                "idMaterialProyecto",
                sql.Int,
                idMaterialProyecto
            )

            .input(
                "idMaterialAlternativo",
                sql.Int,
                idMaterialAlternativo
            )

            .query(`
            UPDATE MaterialProyecto

            SET id_Material = @idMaterialAlternativo

            WHERE idMaterialProyecto = @idMaterialProyecto
        `);

        return result.rowsAffected[0] > 0;
    }

    // ACTUALIZAR CANTIDAD DEL MATERIAL EN EL PROYECTO
    public async actualizarCantidad(
        idMaterialProyecto: number,
        cantidad: number
    ): Promise<boolean> {

        const pool = await connectDB();

        const result = await pool
            .request()
            .input(
                "idMaterialProyecto",
                sql.Int,
                idMaterialProyecto
            )
            .input(
                "cantidad",
                sql.Int,
                cantidad
            )
            .query(`
                UPDATE MaterialProyecto

                SET cantidad = @cantidad

                WHERE idMaterialProyecto = @idMaterialProyecto
            `);

        return result.rowsAffected[0] > 0;
    }


    // ELIMINAR MATERIAL DEL PROYECTO
    public async eliminarMaterial(
        idMaterialProyecto: number
    ): Promise<boolean> {

        const pool = await connectDB();

        const result = await pool
            .request()
            .input(
                "idMaterialProyecto",
                sql.Int,
                idMaterialProyecto
            )
            .query(`
                DELETE FROM MaterialProyecto

                WHERE idMaterialProyecto = @idMaterialProyecto
            `);

        return result.rowsAffected[0] > 0;
    }
}