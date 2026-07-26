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
                    u.id_Usuario,
                    c.id_Cliente,
                    u.nombreUsuario,
                    u.rol
                FROM Usuario u
                LEFT JOIN Cliente c
                    ON c.id_Usuario = u.id_Usuario
                WHERE u.gmail = @gmail
                AND u.password = @password
            `);
        
        console.log(result.recordset);
        return result.recordset[0];
    }

}