import sql from "mssql";
import { connectDB } from "../server/database";

export class LoginRepository {

    public async loginUsuario(
        gmail: string,
        password: string
    ) {

        
        const pool = await connectDB();

        const result = await pool.request()
            .input("gmail", sql.VarChar, gmail)
            .input("password", sql.VarChar, password)
            .query(`
                SELECT
                    id_Usuario,
                    nombreUsuario,
                    rol
                FROM Usuario
                WHERE gmail = @gmail
                AND password = @password
            `);
        
        console.log(result.recordset);
        return result.recordset[0];
    }

}