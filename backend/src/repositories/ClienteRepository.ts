import sql from "mssql";

import { connectDB } from "../server/database";

import type {
  ActualizarClienteDTO,
  Cliente,
  CrearClienteDTO,
} from "../models/Cliente";

export class ClienteRepository {
  public async obtenerClientes(): Promise<Cliente[]> {
    const pool = await connectDB();

    const resultado = await pool.request().query<Cliente>(`
      SELECT
        c.id_Cliente,
        c.id_Usuario,
        c.cedula,
        c.nombre,
        c.apellido,
        c.ciudad,
        c.estado,
        c.notas,
        ISNULL(c.logo, '') AS logo,

        u.nombreUsuario,
        u.gmail,
        u.telefono,
        u.direccion

      FROM Cliente c

      INNER JOIN Usuario u
        ON u.id_Usuario = c.id_Usuario

      ORDER BY c.id_Cliente DESC
    `);

    return resultado.recordset;
  }

  public async obtenerClientesPorEmpresa(
    idEmpresa: number
  ) {
    const pool = await connectDB();

    const resultado = await pool
      .request()
      .input("idEmpresa", sql.Int, idEmpresa)
      .query(`
        SELECT
          c.id_Cliente,
          c.id_Usuario,
          c.cedula,
          c.nombre,
          c.apellido,
          c.ciudad,
          c.estado,
          c.notas,
          ISNULL(c.logo, '') AS logo,

          u.nombreUsuario,
          u.gmail,
          u.telefono,
          u.direccion,

          COUNT(DISTINCT co.id_Cotizacion) AS cantidadCotizaciones,
          MAX(co.fechaRealizada) AS ultimaCotizacion

        FROM Cliente c

        INNER JOIN Usuario u
          ON u.id_Usuario = c.id_Usuario

        INNER JOIN Proyecto p
          ON p.id_Cliente = c.id_Cliente

        INNER JOIN Cotizacion co
          ON co.id_Proyecto = p.id_Proyecto
          AND co.id_Empresa = @idEmpresa

        GROUP BY
          c.id_Cliente,
          c.id_Usuario,
          c.cedula,
          c.nombre,
          c.apellido,
          c.ciudad,
          c.estado,
          c.notas,
          c.logo,
          u.nombreUsuario,
          u.gmail,
          u.telefono,
          u.direccion

        ORDER BY c.id_Cliente DESC
      `);

    return resultado.recordset;
  }

  public async obtenerClientePorId(
    idCliente: number
  ): Promise<Cliente | null> {
    const pool = await connectDB();

    const resultado = await pool
      .request()
      .input("idCliente", sql.Int, idCliente)
      .query<Cliente>(`
        SELECT
          c.id_Cliente,
          c.id_Usuario,
          c.cedula,
          c.nombre,
          c.apellido,
          c.ciudad,
          c.estado,
          c.notas,
          ISNULL(c.logo, '') AS logo,

          u.nombreUsuario,
          u.gmail,
          u.telefono,
          u.direccion

        FROM Cliente c

        INNER JOIN Usuario u
          ON u.id_Usuario = c.id_Usuario

        WHERE c.id_Cliente = @idCliente
      `);

    return resultado.recordset[0] ?? null;
  }

  public async crearCliente(
    cliente: CrearClienteDTO
  ): Promise<Cliente> {
    const pool = await connectDB();
    const transaccion = new sql.Transaction(pool);

    try {
      await transaccion.begin();

      const usuarioResultado = await new sql.Request(transaccion)
        .input(
          "nombreUsuario",
          sql.VarChar(100),
          cliente.nombreUsuario
        )
        .input(
          "gmail",
          sql.VarChar(150),
          cliente.gmail
        )
        .input(
          "telefono",
          sql.VarChar(30),
          cliente.telefono ?? null
        )
        .input(
          "password",
          sql.VarChar(255),
          cliente.password
        )
        .input(
          "direccion",
          sql.VarChar(255),
          cliente.direccion ?? null
        )
        .input(
          "rol",
          sql.VarChar(30),
          "cliente"
        )
        .query<{ id_Usuario: number }>(`
          INSERT INTO Usuario (
            nombreUsuario,
            gmail,
            telefono,
            password,
            direccion,
            rol
          )
          OUTPUT INSERTED.id_Usuario
          VALUES (
            @nombreUsuario,
            @gmail,
            @telefono,
            @password,
            @direccion,
            @rol
          )
        `);

      const idUsuario =
        usuarioResultado.recordset[0].id_Usuario;

      const clienteResultado = await new sql.Request(transaccion)
        .input(
          "idUsuario",
          sql.Int,
          idUsuario
        )
        .input(
          "cedula",
          sql.VarChar(30),
          cliente.cedula
        )
        .input(
          "nombre",
          sql.VarChar(100),
          cliente.nombre
        )
        .input(
          "apellido",
          sql.VarChar(100),
          cliente.apellido
        )
        .input(
          "ciudad",
          sql.VarChar(100),
          cliente.ciudad ?? null
        )
        .input(
          "estado",
          sql.VarChar(30),
          cliente.estado ?? "Nuevo"
        )
        .input(
          "notas",
          sql.VarChar(1000),
          cliente.notas ?? null
        )
        .query<{ id_Cliente: number }>(`
          INSERT INTO Cliente (
            id_Usuario,
            cedula,
            nombre,
            apellido,
            ciudad,
            estado,
            notas
          )
          OUTPUT INSERTED.id_Cliente
          VALUES (
            @idUsuario,
            @cedula,
            @nombre,
            @apellido,
            @ciudad,
            @estado,
            @notas
          )
        `);

      const idCliente =
        clienteResultado.recordset[0].id_Cliente;

      await transaccion.commit();

      const clienteCreado =
        await this.obtenerClientePorId(idCliente);

      if (!clienteCreado) {
        throw new Error(
          "No se pudo recuperar el cliente creado"
        );
      }

      return clienteCreado;
    } catch (error) {
      try {
        await transaccion.rollback();
      } catch {
        // La transacción puede haber finalizado previamente.
      }

      throw error;
    }
  }

  public async actualizarCliente(
    idCliente: number,
    cliente: ActualizarClienteDTO
  ): Promise<Cliente | null> {
    const pool = await connectDB();
    const transaccion = new sql.Transaction(pool);

    try {
      await transaccion.begin();

      const clienteExistente = await new sql.Request(
        transaccion
      )
        .input(
          "idCliente",
          sql.Int,
          idCliente
        )
        .query<{ id_Usuario: number }>(`
          SELECT id_Usuario
          FROM Cliente
          WHERE id_Cliente = @idCliente
        `);

      const registro =
        clienteExistente.recordset[0];

      if (!registro) {
        await transaccion.rollback();
        return null;
      }

      await new sql.Request(transaccion)
        .input(
          "idUsuario",
          sql.Int,
          registro.id_Usuario
        )
        .input(
          "nombreUsuario",
          sql.VarChar(100),
          cliente.nombreUsuario
        )
        .input(
          "gmail",
          sql.VarChar(150),
          cliente.gmail
        )
        .input(
          "telefono",
          sql.VarChar(30),
          cliente.telefono ?? null
        )
        .input(
          "direccion",
          sql.VarChar(255),
          cliente.direccion ?? null
        )
        .query(`
          UPDATE Usuario
          SET
            nombreUsuario = @nombreUsuario,
            gmail = @gmail,
            telefono = @telefono,
            direccion = @direccion
          WHERE id_Usuario = @idUsuario
        `);

      await new sql.Request(transaccion)
        .input(
          "idCliente",
          sql.Int,
          idCliente
        )
        .input(
          "cedula",
          sql.VarChar(30),
          cliente.cedula
        )
        .input(
          "nombre",
          sql.VarChar(100),
          cliente.nombre
        )
        .input(
          "apellido",
          sql.VarChar(100),
          cliente.apellido
        )
        .input(
          "ciudad",
          sql.VarChar(100),
          cliente.ciudad ?? null
        )
        .input(
          "estado",
          sql.VarChar(30),
          cliente.estado
        )
        .input(
          "notas",
          sql.VarChar(1000),
          cliente.notas ?? null
        )
        .query(`
          UPDATE Cliente
          SET
            cedula = @cedula,
            nombre = @nombre,
            apellido = @apellido,
            ciudad = @ciudad,
            estado = @estado,
            notas = @notas
          WHERE id_Cliente = @idCliente
        `);

      await transaccion.commit();

      return this.obtenerClientePorId(idCliente);
    } catch (error) {
      try {
        await transaccion.rollback();
      } catch {
        // La transacción puede haber finalizado previamente.
      }

      throw error;
    }
  }

  public async clienteTieneProyectos(
    idCliente: number
  ): Promise<boolean> {
    const pool = await connectDB();

    const resultado = await pool
      .request()
      .input(
        "idCliente",
        sql.Int,
        idCliente
      )
      .query<{ cantidad: number }>(`
        SELECT COUNT(*) AS cantidad
        FROM Proyecto
        WHERE id_Cliente = @idCliente
      `);

    const cantidad =
      resultado.recordset[0]?.cantidad ?? 0;

    return cantidad > 0;
  }

  public async eliminarCliente(
    idCliente: number,
    idEmpresa: number
  ): Promise<boolean> {
    const pool = await connectDB();

    const transaccion = new sql.Transaction(pool);

    try {
      await transaccion.begin();

      // Verificar que el cliente exista
      const resultado = await new sql.Request(transaccion)
        .input(
          "idCliente",
          sql.Int,
          idCliente
        )
        .query<{ id_Cliente: number }>(`
          SELECT id_Cliente
          FROM Cliente
          WHERE id_Cliente = @idCliente
        `);

      const cliente = resultado.recordset[0];

      if (!cliente) {
        await transaccion.rollback();
        return false;
      }

      // Eliminar únicamente las cotizaciones
      // de este cliente correspondientes a esta empresa.
      const resultadoEliminacion =
      await new sql.Request(transaccion)
        .input(
          "idCliente",
          sql.Int,
          idCliente
        )
        .input(
          "idEmpresa",
          sql.Int,
          idEmpresa
        )
        .query(`
          DELETE FROM Cotizacion
          WHERE id_Empresa = @idEmpresa
            AND id_Proyecto IN (
              SELECT id_Proyecto
              FROM Proyecto
              WHERE id_Cliente = @idCliente
            )
        `);

    if ((resultadoEliminacion.rowsAffected[0] ?? 0) === 0) {
      await transaccion.rollback();
      return false;
    }

    await transaccion.commit();

    return true;

    } catch (error) {

      try {
        await transaccion.rollback();
      } catch {
        // La transacción puede haber finalizado previamente.
      }

      throw error;
    }
  }

  public async darDeBajaCliente(
    idCliente: number
  ): Promise<boolean> {
    const pool = await connectDB();
    const transaccion = new sql.Transaction(pool);

    try {
      await transaccion.begin();

      // Obtener el usuario asociado al cliente
      const resultadoCliente =
        await new sql.Request(transaccion)
          .input("idCliente", sql.Int, idCliente)
          .query<{ id_Usuario: number }>(`
            SELECT id_Usuario
            FROM Cliente
            WHERE id_Cliente = @idCliente
          `);

      const cliente =
        resultadoCliente.recordset[0];

      if (!cliente) {
        await transaccion.rollback();
        return false;
      }

      // 1. Eliminar cotizaciones de los proyectos del cliente
      await new sql.Request(transaccion)
        .input("idCliente", sql.Int, idCliente)
        .query(`
          DELETE FROM Cotizacion
          WHERE id_Proyecto IN (
            SELECT id_Proyecto
            FROM Proyecto
            WHERE id_Cliente = @idCliente
          )
        `);

      // 2. Eliminar materiales asociados a los proyectos
      await new sql.Request(transaccion)
        .input("idCliente", sql.Int, idCliente)
        .query(`
          DELETE FROM MaterialProyecto
          WHERE id_Proyecto IN (
            SELECT id_Proyecto
            FROM Proyecto
            WHERE id_Cliente = @idCliente
          )
        `);

      // 3. Eliminar los proyectos del cliente
      await new sql.Request(transaccion)
        .input("idCliente", sql.Int, idCliente)
        .query(`
          DELETE FROM Proyecto
          WHERE id_Cliente = @idCliente
        `);

      // 4. Eliminar el cliente
      await new sql.Request(transaccion)
        .input("idCliente", sql.Int, idCliente)
        .query(`
          DELETE FROM Cliente
          WHERE id_Cliente = @idCliente
        `);

      // 5. Eliminar el usuario asociado
      await new sql.Request(transaccion)
        .input(
          "idUsuario",
          sql.Int,
          cliente.id_Usuario
        )
        .query(`
          DELETE FROM Usuario
          WHERE id_Usuario = @idUsuario
        `);

      await transaccion.commit();

      return true;

    } catch (error) {

      try {
        await transaccion.rollback();
      } catch {
        // La transacción puede haber finalizado previamente.
      }

      throw error;
    }
  }

    public async obtenerHistorialCotizaciones(
      idCliente: number,
      idEmpresa: number
    ) {
      const pool = await connectDB();

      const resultado = await pool
        .request()
        .input("idCliente", sql.Int, idCliente)
        .input("idEmpresa", sql.Int, idEmpresa)
        .query(`
          SELECT
            co.id_Cotizacion AS idCotizacion,
            co.fechaRealizada,
            co.totalCotizacion,
            co.estado,
            co.observaciones,
            co.version,
            p.id_Proyecto AS idProyecto,
            p.nombre AS nombreProyecto
          FROM Cotizacion co
          INNER JOIN Proyecto p
            ON p.id_Proyecto = co.id_Proyecto
          WHERE p.id_Cliente = @idCliente
            AND co.id_Empresa = @idEmpresa
            AND co.estado = 'Enviada'
          ORDER BY
            co.fechaRealizada DESC,
            co.version DESC,
            co.id_Cotizacion DESC
        `);

      return resultado.recordset;
    }

    // =========================================================
// ACTUALIZAR LOGO DEL CLIENTE
// =========================================================

  public async actualizarLogoCliente(
    idCliente: number,
    logo: string
  ): Promise<Cliente | null> {
    const pool = await connectDB();

    const resultado = await pool
      .request()
      .input(
        "idCliente",
        sql.Int,
        idCliente
      )
      .input(
        "logo",
        sql.VarChar(255),
        logo
      )
      .query(`
        UPDATE Cliente
        SET logo = @logo
        WHERE id_Cliente = @idCliente
      `);

    if ((resultado.rowsAffected[0] ?? 0) === 0) {
      return null;
    }

    return this.obtenerClientePorId(idCliente);
  }

  public async validarDatosUnicos(
    idCliente: number | null,
    gmail: string,
    nombreUsuario: string,
    cedula: string,
    telefono: string | null
  ): Promise<{
    gmailExiste: boolean;
    nombreUsuarioExiste: boolean;
    cedulaExiste: boolean;
    telefonoExiste: boolean;
  }> {
    const pool = await connectDB();

    const request = pool
      .request()
      .input(
        "gmail",
        sql.VarChar(150),
        gmail
      )
      .input(
        "nombreUsuario",
        sql.VarChar(100),
        nombreUsuario
      )
      .input(
        "cedula",
        sql.VarChar(30),
        cedula
      )
      .input(
        "telefono",
        sql.VarChar(30),
        telefono
      );

    let condicionCliente = "";

    if (idCliente !== null) {
      request.input(
        "idCliente",
        sql.Int,
        idCliente
      );

      condicionCliente = `
        AND c.id_Cliente <> @idCliente
      `;
    }

    const resultado = await request.query<{
      gmailExiste: number;
      nombreUsuarioExiste: number;
      cedulaExiste: number;
      telefonoExiste: number;
    }>(`
      SELECT

        CASE
          WHEN EXISTS (
            SELECT 1
            FROM Usuario u
            INNER JOIN Cliente c
              ON c.id_Usuario = u.id_Usuario
            WHERE u.gmail = @gmail
            ${condicionCliente}
          )
          THEN 1
          ELSE 0
        END AS gmailExiste,

        CASE
          WHEN EXISTS (
            SELECT 1
            FROM Usuario u
            INNER JOIN Cliente c
              ON c.id_Usuario = u.id_Usuario
            WHERE u.nombreUsuario = @nombreUsuario
            ${condicionCliente}
          )
          THEN 1
          ELSE 0
        END AS nombreUsuarioExiste,

        CASE
          WHEN EXISTS (
            SELECT 1
            FROM Cliente c
            WHERE c.cedula = @cedula
            ${condicionCliente}
          )
          THEN 1
          ELSE 0
        END AS cedulaExiste,

        CASE
          WHEN @telefono IS NOT NULL
            AND EXISTS (
              SELECT 1
              FROM Usuario u
              INNER JOIN Cliente c
                ON c.id_Usuario = u.id_Usuario
              WHERE u.telefono = @telefono
              ${condicionCliente}
            )
          THEN 1
          ELSE 0
        END AS telefonoExiste

    `);

    const datos = resultado.recordset[0];

    return {
      gmailExiste:
        datos?.gmailExiste === 1,

      nombreUsuarioExiste:
        datos?.nombreUsuarioExiste === 1,

      cedulaExiste:
        datos?.cedulaExiste === 1,

      telefonoExiste:
        datos?.telefonoExiste === 1,
    };
  }
}