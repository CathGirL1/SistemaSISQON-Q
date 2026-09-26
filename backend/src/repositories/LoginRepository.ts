import sql from "mssql";
import { connectDB } from "../server/database";

export class LoginRepository {

    public async loginUsuario(
        gmail: string,
        password: string
    ) {
        const pool = await connectDB();

        // -----------------------------------------
        // 1. BUSCAR SI EXISTE EL USUARIO
        // -----------------------------------------
        const usuarioExiste = await pool
            .request()
            .input("gmail", sql.VarChar, gmail)
            .query(`
                SELECT
                    id_Usuario,
                    password
                FROM Usuario
                WHERE gmail = @gmail
            `);

        if (usuarioExiste.recordset.length === 0) {
            return {
                existe: false,
                usuario: null
            };
        }

        // -----------------------------------------
        // 2. COMPROBAR CONTRASEÑA
        // -----------------------------------------
        const usuario = usuarioExiste.recordset[0];

        if (usuario.password !== password) {
            return {
                existe: true,
                usuario: null
            };
        }

        // -----------------------------------------
        // 3. OBTENER DATOS DEL USUARIO
        // -----------------------------------------
        const result = await pool
            .request()
            .input(
                "idUsuario",
                sql.Int,
                usuario.id_Usuario
            )
            .query(`
                SELECT
                    u.id_Usuario,
                    c.id_Cliente,
                    e.id_Empresa AS idEmpresa,
                    u.nombreUsuario,
                    u.rol
                FROM Usuario u
                LEFT JOIN Cliente c
                    ON c.id_Usuario = u.id_Usuario
                LEFT JOIN Empresa e
                    ON e.id_Usuario = u.id_Usuario
                WHERE u.id_Usuario = @idUsuario
            `);

        return {
            existe: true,
            usuario: result.recordset[0]
        };
    }

}