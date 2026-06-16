import sql from "mssql";
import { connectDB } from "../server/database";

export class AuthRepository {

    public async crearUsuario(
    nombreUsuario: string,
    gmail: string,
    telefono: string,
    password: string,
    direccion: string,
    rol: string,

    cedula?: string,
    nombre?: string,
    apellido?: string,

    nombreEmpresa?: string,
    rut?: string) 
    {

        const pool = await connectDB();

        const result = await pool.request()
            .input("nombreUsuario", sql.VarChar, nombreUsuario)
            .input("gmail", sql.VarChar, gmail)
            .input("telefono", sql.VarChar, telefono)
            .input("password", sql.VarChar, password)
            .input("direccion", sql.VarChar, direccion)
            .input("rol", sql.VarChar, rol)
            .query(`
                INSERT INTO Usuario
                (
                    nombreUsuario,
                    gmail,
                    telefono,
                    password,
                    direccion,
                    rol
                )
                OUTPUT INSERTED.id_Usuario
                VALUES
                (
                    @nombreUsuario,
                    @gmail,
                    @telefono,
                    @password,
                    @direccion, 
                    @rol
                )
            `);
        const idUsuario = result.recordset[0].id_Usuario;

        if (rol === "cliente") {

            await pool.request()
                .input("idUsuario", sql.Int, idUsuario)
                .input("cedula", sql.VarChar, cedula)
                .input("nombre", sql.VarChar, nombre)
                .input("apellido", sql.VarChar, apellido)
                .query(`
                    INSERT INTO Cliente
                    (
                        id_Usuario,
                        cedula,
                        nombre,
                        apellido
                    )
                    VALUES
                    (
                        @idUsuario,
                        @cedula,
                        @nombre,
                        @apellido
                    )
                `);

        }


        if (rol === "empresa") {

            await pool.request()
                .input("idUsuario", sql.Int, idUsuario)
                .input("nombreEmpresa", sql.VarChar, nombreEmpresa)
                .input("rut", sql.VarChar, rut)
                .query(`
                    INSERT INTO Empresa
                    (
                        id_Usuario,
                        nombreEmpresa,
                        rut
                    )
                    VALUES
                    (
                        @idUsuario,
                        @nombreEmpresa,
                        @rut
                    )
                `);

        }

        return idUsuario;

        
    }
}