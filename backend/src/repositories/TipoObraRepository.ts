import sql from "mssql";

import { connectDB } from "../server/database";

import type {
  ActualizarTipoObraDTO,
  CrearTipoObraDTO,
  DificultadTipoObra,
  EstadoTipoObra,
  TipoObra,
} from "../models/TipoObra";

type TipoObraRegistro = {
  id_TipoObra: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;

  materialesAsociados: number;

  tiempoMinDias: number | null;
  tiempoMaxDias: number | null;

  dificultad: DificultadTipoObra;
  estado: EstadoTipoObra;

  formulaCalculo: string | null;
  manoObra: string | null;
  extras: string | null;
  observaciones: string | null;

  fechaCreacion: Date;
  fechaActualizacion: Date;
};

export class TipoObraRepository {
  private mapearTipoObra(
    registro: TipoObraRegistro
  ): TipoObra {
    return {
      idTipoObra: registro.id_TipoObra,
      codigo: registro.codigo,
      nombre: registro.nombre,
      descripcion: registro.descripcion,

      materialesAsociados:
        Number(registro.materialesAsociados) || 0,

      tiempoMinDias: registro.tiempoMinDias,
      tiempoMaxDias: registro.tiempoMaxDias,

      dificultad: registro.dificultad,
      estado: registro.estado,

      formulaCalculo: registro.formulaCalculo,
      manoObra: registro.manoObra,
      extras: registro.extras,
      observaciones: registro.observaciones,

      fechaCreacion: registro.fechaCreacion,
      fechaActualizacion:
        registro.fechaActualizacion,
    };
  }

  private obtenerConsultaBase(): string {
    return `
      SELECT
        t.id_TipoObra,
        t.codigo,
        t.nombre,
        t.descripcion,

        (
          SELECT COUNT(*)
          FROM TipoObraMaterial tm
          WHERE tm.id_TipoObra = t.id_TipoObra
        ) AS materialesAsociados,

        t.tiempoMinDias,
        t.tiempoMaxDias,
        t.dificultad,
        t.estado,
        t.formulaCalculo,
        t.manoObra,
        t.extras,
        t.observaciones,
        t.fechaCreacion,
        t.fechaActualizacion

      FROM TipoObra t
    `;
  }

  async obtenerTiposObra(): Promise<TipoObra[]> {
    const pool = await connectDB();

    const resultado = await pool
      .request()
      .query<TipoObraRegistro>(`
        ${this.obtenerConsultaBase()}
        ORDER BY t.nombre ASC;
      `);

    return resultado.recordset.map((registro) =>
      this.mapearTipoObra(registro)
    );
  }

  async obtenerTipoObraPorId(
    idTipoObra: number
  ): Promise<TipoObra | null> {
    const pool = await connectDB();

    const resultado = await pool
      .request()
      .input(
        "idTipoObra",
        sql.Int,
        idTipoObra
      )
      .query<TipoObraRegistro>(`
        ${this.obtenerConsultaBase()}
        WHERE t.id_TipoObra = @idTipoObra;
      `);

    const registro = resultado.recordset[0];

    return registro
      ? this.mapearTipoObra(registro)
      : null;
  }

  async existeNombre(
    nombre: string,
    idExcluir?: number
  ): Promise<boolean> {
    const pool = await connectDB();

    const request = pool
      .request()
      .input(
        "nombre",
        sql.VarChar(50),
        nombre
      );

    let consulta = `
      SELECT COUNT(*) AS cantidad
      FROM TipoObra
      WHERE LOWER(LTRIM(RTRIM(nombre))) =
            LOWER(LTRIM(RTRIM(@nombre)))
    `;

    if (idExcluir !== undefined) {
      request.input(
        "idExcluir",
        sql.Int,
        idExcluir
      );

      consulta += `
        AND id_TipoObra <> @idExcluir
      `;
    }

    const resultado = await request.query<{
      cantidad: number;
    }>(consulta);

    return resultado.recordset[0].cantidad > 0;
  }

  async crearTipoObra(
    datos: CrearTipoObraDTO
  ): Promise<TipoObra> {
    const pool = await connectDB();

    const resultado = await pool
      .request()
      .input(
        "nombre",
        sql.VarChar(50),
        datos.nombre
      )
      .input(
        "descripcion",
        sql.VarChar(255),
        datos.descripcion ?? null
      )
      .input(
        "tiempoMinDias",
        sql.Int,
        datos.tiempoMinDias ?? null
      )
      .input(
        "tiempoMaxDias",
        sql.Int,
        datos.tiempoMaxDias ?? null
      )
      .input(
        "dificultad",
        sql.VarChar(20),
        datos.dificultad
      )
      .input(
        "estado",
        sql.VarChar(20),
        datos.estado ?? "Activo"
      )
      .input(
        "formulaCalculo",
        sql.VarChar(1000),
        datos.formulaCalculo ?? null
      )
      .input(
        "manoObra",
        sql.VarChar(500),
        datos.manoObra ?? null
      )
      .input(
        "extras",
        sql.VarChar(1000),
        datos.extras ?? null
      )
      .input(
        "observaciones",
        sql.VarChar(1000),
        datos.observaciones ?? null
      )
      .query<{ idTipoObra: number }>(`
        INSERT INTO TipoObra
        (
          nombre,
          descripcion,
          tiempoMinDias,
          tiempoMaxDias,
          dificultad,
          estado,
          formulaCalculo,
          manoObra,
          extras,
          observaciones,
          fechaCreacion,
          fechaActualizacion
        )
        OUTPUT
          INSERTED.id_TipoObra AS idTipoObra
        VALUES
        (
          @nombre,
          @descripcion,
          @tiempoMinDias,
          @tiempoMaxDias,
          @dificultad,
          @estado,
          @formulaCalculo,
          @manoObra,
          @extras,
          @observaciones,
          GETDATE(),
          GETDATE()
        );
      `);

    const idTipoObra =
      resultado.recordset[0]?.idTipoObra;

    if (!idTipoObra) {
      throw new Error(
        "No se pudo obtener el tipo de obra creado."
      );
    }

    const tipoObraCreado =
      await this.obtenerTipoObraPorId(
        idTipoObra
      );

    if (!tipoObraCreado) {
      throw new Error(
        "El tipo de obra fue creado, pero no pudo recuperarse."
      );
    }

    return tipoObraCreado;
  }

  async actualizarTipoObra(
    idTipoObra: number,
    datos: ActualizarTipoObraDTO
  ): Promise<TipoObra | null> {
    const pool = await connectDB();

    const resultado = await pool
      .request()
      .input(
        "idTipoObra",
        sql.Int,
        idTipoObra
      )
      .input(
        "nombre",
        sql.VarChar(50),
        datos.nombre
      )
      .input(
        "descripcion",
        sql.VarChar(255),
        datos.descripcion ?? null
      )
      .input(
        "tiempoMinDias",
        sql.Int,
        datos.tiempoMinDias ?? null
      )
      .input(
        "tiempoMaxDias",
        sql.Int,
        datos.tiempoMaxDias ?? null
      )
      .input(
        "dificultad",
        sql.VarChar(20),
        datos.dificultad
      )
      .input(
        "estado",
        sql.VarChar(20),
        datos.estado
      )
      .input(
        "formulaCalculo",
        sql.VarChar(1000),
        datos.formulaCalculo ?? null
      )
      .input(
        "manoObra",
        sql.VarChar(500),
        datos.manoObra ?? null
      )
      .input(
        "extras",
        sql.VarChar(1000),
        datos.extras ?? null
      )
      .input(
        "observaciones",
        sql.VarChar(1000),
        datos.observaciones ?? null
      )
      .query(`
        UPDATE TipoObra
        SET
          nombre = @nombre,
          descripcion = @descripcion,
          tiempoMinDias = @tiempoMinDias,
          tiempoMaxDias = @tiempoMaxDias,
          dificultad = @dificultad,
          estado = @estado,
          formulaCalculo = @formulaCalculo,
          manoObra = @manoObra,
          extras = @extras,
          observaciones = @observaciones,
          fechaActualizacion = GETDATE()
        WHERE id_TipoObra = @idTipoObra;
      `);

    if (resultado.rowsAffected[0] === 0) {
      return null;
    }

    return this.obtenerTipoObraPorId(
      idTipoObra
    );
  }

  async estaEnUso(
    idTipoObra: number
  ): Promise<boolean> {
    const pool = await connectDB();

    const resultado = await pool
      .request()
      .input(
        "idTipoObra",
        sql.Int,
        idTipoObra
      )
      .query<{ cantidad: number }>(`
        SELECT COUNT(*) AS cantidad
        FROM Proyecto
        WHERE id_TipoObra = @idTipoObra;
      `);

    return resultado.recordset[0].cantidad > 0;
  }

  async eliminarTipoObra(
    idTipoObra: number
  ): Promise<boolean> {
    const pool = await connectDB();

    const resultado = await pool
      .request()
      .input(
        "idTipoObra",
        sql.Int,
        idTipoObra
      )
      .query(`
        DELETE FROM TipoObra
        WHERE id_TipoObra = @idTipoObra;
      `);

    return resultado.rowsAffected[0] > 0;
  }
}