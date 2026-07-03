import sql from "mssql";
import { connectDB } from "../server/database";

export class RecuperacionAccesoRepository {
    
   public async buscarUsuarioPorGmail(
    gmail: string) {

    const pool = await connectDB();

    const resultado = await pool.request()
        .input("gmail", sql.VarChar, gmail)
        .query(`
            SELECT
                id_Usuario,
                nombreUsuario,
                gmail,
                rol
            FROM Usuario
            WHERE gmail = @gmail
        `);

    return resultado.recordset[0];}

    public async guardarCodigoVerificacion(
        idUsuario: number,
        codigoVerificacion: string,
        fechaExpiracionCodigo: Date
    ){
        const pool = await connectDB();

        await pool.request()
            .input("idUsuario", sql.Int, idUsuario)
            .input("codigoVerificacion", sql.VarChar, codigoVerificacion)
            .input("fechaExpiracionCodigo", sql.DateTime, fechaExpiracionCodigo)
            .query(`
                UPDATE Usuario
                SET
                    codigoVerificacion = @codigoVerificacion,
                    fechaExpiracionCodigo = @fechaExpiracionCodigo
                WHERE id_Usuario = @idUsuario
            `);
    }

    public async obtenerUsuarioPorCodigo(gmail: string) {

        const pool = await connectDB();

        const resultado = await pool.request()
            .input("gmail", sql.VarChar, gmail)
            .query(`
                SELECT
                    id_Usuario,
                    rol,
                    codigoVerificacion,
                    fechaExpiracionCodigo
                FROM Usuario
                WHERE gmail = @gmail
            `);

        return resultado.recordset[0];

    }
    
}