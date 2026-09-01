import sql from "mssql";

import { connectDB } from "../server/database";

import type {
  ActualizarPerfilUsuarioDTO,
  PerfilUsuario,
} from "../models/PerfilUsuario";

export class UsuarioRepository {
  public async obtenerUsuarioPorId(
    idUsuario: number
  ): Promise<PerfilUsuario | null> {
    const pool = await connectDB();

    const resultado = await pool
      .request()
      .input("idUsuario", sql.Int, idUsuario)
      .query<PerfilUsuario>(`
        SELECT
          id_Usuario AS idUsuario,
          nombreUsuario,
          gmail,
          ISNULL(telefono, '') AS telefono,
          ISNULL(direccion, '') AS direccion,
          rol,

          ISNULL(nombre, '') AS nombre,
          ISNULL(apellido, '') AS apellido,
          ISNULL(ciudad, '') AS ciudad,
          ISNULL(pais, '') AS pais,
          ISNULL(cargo, '') AS cargo,
          ISNULL(departamento, '') AS departamento,
          ISNULL(zonaTrabajo, '') AS zonaTrabajo,

          ISNULL(idioma, 'Español') AS idioma,
          ISNULL(moneda, 'Peso Uruguayo (UYU)') AS moneda,
          ISNULL(
            zonaHoraria,
            '(UTC-03:00) Montevideo'
          ) AS zonaHoraria,

          fotoPerfil,
          fechaRegistro,
          ultimoAcceso
        FROM Usuario
        WHERE id_Usuario = @idUsuario
      `);

    return resultado.recordset[0] ?? null;
  }

  public async actualizarUsuario(
    idUsuario: number,
    usuario: ActualizarPerfilUsuarioDTO
  ): Promise<PerfilUsuario | null> {
    const pool = await connectDB();

    const resultado = await pool
      .request()
      .input("idUsuario", sql.Int, idUsuario)
      .input(
        "nombreUsuario",
        sql.VarChar(50),
        usuario.nombreUsuario
      )
      .input(
        "gmail",
        sql.VarChar(100),
        usuario.gmail
      )
      .input(
        "telefono",
        sql.VarChar(20),
        usuario.telefono || null
      )
      .input(
        "direccion",
        sql.VarChar(200),
        usuario.direccion || null
      )
      .input(
        "nombre",
        sql.VarChar(50),
        usuario.nombre || null
      )
      .input(
        "apellido",
        sql.VarChar(50),
        usuario.apellido || null
      )
      .input(
        "ciudad",
        sql.VarChar(100),
        usuario.ciudad || null
      )
      .input(
        "pais",
        sql.VarChar(100),
        usuario.pais || null
      )
      .input(
        "cargo",
        sql.VarChar(100),
        usuario.cargo || null
      )
      .input(
        "departamento",
        sql.VarChar(100),
        usuario.departamento || null
      )
      .input(
        "zonaTrabajo",
        sql.VarChar(150),
        usuario.zonaTrabajo || null
      )
      .input(
        "idioma",
        sql.VarChar(50),
        usuario.idioma || "Español"
      )
      .input(
        "moneda",
        sql.VarChar(50),
        usuario.moneda || "Peso Uruguayo (UYU)"
      )
      .input(
        "zonaHoraria",
        sql.VarChar(100),
        usuario.zonaHoraria ||
          "(UTC-03:00) Montevideo"
      )
      .input(
        "fotoPerfil",
        sql.VarChar(255),
        usuario.fotoPerfil || null
      )
      .query(`
        UPDATE Usuario
        SET
          nombreUsuario = @nombreUsuario,
          gmail = @gmail,
          telefono = @telefono,
          direccion = @direccion,

          nombre = @nombre,
          apellido = @apellido,
          ciudad = @ciudad,
          pais = @pais,
          cargo = @cargo,
          departamento = @departamento,
          zonaTrabajo = @zonaTrabajo,

          idioma = @idioma,
          moneda = @moneda,
          zonaHoraria = @zonaHoraria,
          fotoPerfil = @fotoPerfil
        WHERE id_Usuario = @idUsuario
      `);

    const filasAfectadas =
      resultado.rowsAffected[0] ?? 0;

    if (filasAfectadas === 0) {
      return null;
    }

    return this.obtenerUsuarioPorId(idUsuario);
  }
}