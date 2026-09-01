import {
  CotizacionRepository,
  type ActualizarCotizacionData,
  type CrearCotizacionData,
} from "../repositories/CotizacionRepository";

const ESTADOS_VALIDOS = [
  "Borrador",
  "Enviada",
  "Revisada",
  "Aceptada",
  "Rechazada",
] as const;

export class CotizacionService {
  private repository = new CotizacionRepository();

  public async crearCotizacion(
    data: CrearCotizacionData
  ): Promise<number> {
    this.validarId(
      data.idProyecto,
      "El id del proyecto no es válido"
    );

    const proyectoExiste =
      await this.repository.existeProyecto(data.idProyecto);

    if (!proyectoExiste) {
      throw new Error("Proyecto no encontrado");
    }

    if (data.estado !== undefined) {
      this.validarEstado(data.estado);
    }

    if (data.precioEstimado !== undefined) {
      this.validarPrecio(data.precioEstimado);
    }

    if (data.observaciones !== undefined) {
      this.validarObservaciones(data.observaciones);
    }

    const estado =
      data.estado?.trim() || "Borrador";

    if(estado === "Borrador") {
      const borradorExistente =
        await this.repository.obtenerCotizacionBorradorPorProyecto(
          data.idProyecto
        );

        console.log(
          "BORRADOR ENCONTRADO:",
          borradorExistente
        );

      if(borradorExistente) {
        return borradorExistente.idCotizacion;
      }
    }

    return this.repository.crearCotizacion({
      idProyecto: data.idProyecto,
      estado,
      precioEstimado: data.precioEstimado ?? null,
      observaciones:
        data.observaciones !== undefined
          ? data.observaciones?.trim() || null
          : null,
    });
  }

  public async obtenerCotizacionesPorCliente(
    idCliente: number
  ) {
    this.validarId(
      idCliente,
      "El id del cliente no es válido"
    );

    return this.repository.obtenerCotizacionesPorCliente(
      idCliente
    );
  }

  public async obtenerCotizacionesPorProyecto(
    idProyecto: number
  ) {
    this.validarId(
      idProyecto,
      "El id del proyecto no es válido"
    );

    const proyectoExiste =
      await this.repository.existeProyecto(idProyecto);

    if (!proyectoExiste) {
      throw new Error("Proyecto no encontrado");
    }

    return this.repository.obtenerCotizacionesPorProyecto(
      idProyecto
    );
  }

  public async obtenerCotizacionPorId(
    idCotizacion: number
  ) {
    this.validarId(
      idCotizacion,
      "El id de la cotización no es válido"
    );

    const cotizacion =
      await this.repository.obtenerCotizacionPorId(
        idCotizacion
      );

    if (!cotizacion) {
      throw new Error("Cotización no encontrada");
    }

    return cotizacion;
  }

  public async actualizarCotizacion(
    idCotizacion: number,
    data: ActualizarCotizacionData
  ): Promise<void> {
    this.validarId(
      idCotizacion,
      "El id de la cotización no es válido"
    );

    const cotizacion =
      await this.repository.obtenerCotizacionPorId(
        idCotizacion
      );

    if (!cotizacion) {
      throw new Error("Cotización no encontrada");
    }

    this.validarActualizacion(data);

    const actualizado =
      await this.repository.actualizarCotizacion(
        idCotizacion,
        {
          estado: data.estado?.trim(),
          precioEstimado: data.precioEstimado,
          observaciones:
            data.observaciones !== undefined
              ? data.observaciones?.trim() || null
              : undefined,
        }
      );

    if (!actualizado) {
      throw new Error(
        "No se pudo actualizar la cotización"
      );
    }
  }

  public async eliminarCotizacion(
    idCotizacion: number
  ): Promise<void> {
    this.validarId(
      idCotizacion,
      "El id de la cotización no es válido"
    );

    const cotizacion =
      await this.repository.obtenerCotizacionPorId(
        idCotizacion
      );

    if (!cotizacion) {
      throw new Error("Cotización no encontrada");
    }

    const eliminado =
      await this.repository.eliminarCotizacion(
        idCotizacion
      );

    if (!eliminado) {
      throw new Error(
        "No se pudo eliminar la cotización"
      );
    }
  }

  private validarActualizacion(
    data: ActualizarCotizacionData
  ): void {
    if (Object.keys(data).length === 0) {
      throw new Error(
        "Debe enviar al menos un campo para actualizar"
      );
    }

    if (data.estado !== undefined) {
      this.validarEstado(data.estado);
    }

    if (data.precioEstimado !== undefined) {
      this.validarPrecio(data.precioEstimado);
    }

    if (data.observaciones !== undefined) {
      this.validarObservaciones(data.observaciones);
    }
  }

  private validarEstado(estado: string): void {
    const estadoNormalizado = estado.trim();

    if (!estadoNormalizado) {
      throw new Error(
        "El estado de la cotización no puede estar vacío"
      );
    }

    const esValido = ESTADOS_VALIDOS.includes(
      estadoNormalizado as
        (typeof ESTADOS_VALIDOS)[number]
    );

    if (!esValido) {
      throw new Error(
        `Estado inválido. Los estados permitidos son: ${ESTADOS_VALIDOS.join(
          ", "
        )}`
      );
    }
  }

  private validarPrecio(
    precio: number | null
  ): void {
    if (precio === null) {
      return;
    }

    if (
      typeof precio !== "number" ||
      !Number.isFinite(precio) ||
      precio < 0
    ) {
      throw new Error(
        "El precio estimado debe ser un número mayor o igual a cero"
      );
    }
  }

  private validarObservaciones(
    observaciones: string | null
  ): void {
    if (observaciones === null) {
      return;
    }

    if (
      observaciones.trim().length > 1000
    ) {
      throw new Error(
        "Las observaciones no pueden superar los 1000 caracteres"
      );
    }
  }

  private validarId(
    id: number,
    mensaje: string
  ): void {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error(mensaje);
    }
  }
}