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