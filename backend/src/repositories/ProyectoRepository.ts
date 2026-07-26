import sql from "mssql";
import { connectDB } from "../server/database";
import { Proyecto } from "../models/Proyecto";

export class ProyectoRepository {

    public async crearProyecto(proyecto: Proyecto): Promise<boolean> {

        try {

            const pool = await connectDB();
            console.log("Repository idCliente:", proyecto.idCliente);
            await pool.request()
                .input("idCliente", sql.Int, proyecto.idCliente)
                .input("idEmpresa", sql.Int, proyecto.idEmpresa)
                .input("idTipoObra", sql.Int, proyecto.tipoObraID)
                .input("nombre", sql.VarChar(100), proyecto.nombre)
                .input("estado", sql.VarChar(20), proyecto.estado)
                .input("alto", sql.Decimal(10, 2), proyecto.alto)
                .input("ancho", sql.Decimal(10, 2), proyecto.ancho)
                .input("largo", sql.Decimal(10, 2), proyecto.largo)
                .input("fechaCreacion", sql.Date, new Date())
                .query(`
                    INSERT INTO Proyecto
                    (   
                        id_Cliente,
                        id_Empresa,
                        id_TipoObra,
                        nombre,
                        estado,
                        alto,
                        ancho,
                        largo,
                        fechaCreacion
                    )
                    VALUES
                    (
                        @idCliente,
                        @idEmpresa,
                        @idTipoObra,
                        @nombre,
                        @estado,
                        @alto,
                        @ancho,
                        @largo,
                        GETDATE()
                    )
                `);

            return true;

        } catch (error: any) {

            console.error("=========================");
            console.error("ERROR SQL:");
            console.error(error);
            console.error("=========================");

            throw error;

        }

    }

}