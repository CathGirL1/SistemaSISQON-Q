import {
  type CrearProyectoDTO,
} from "../models/Proyecto";

import {ProyectoRepository} from "../repositories/ProyectoRepository"

export class ProyectoService {
  private repository = new ProyectoRepository();

  public async crearProyecto(data: CrearProyectoDTO): Promise<number> {
    this.validarProyecto(data);

    return this.repository.crearProyecto({
      ...data,
      nombre: data.nombre.trim(),
      descripcion: data.descripcion?.trim() || null,
      imagenUrl: data.imagenUrl?.trim() || null,
      ubicacion: data.ubicacion?.trim() || null,
      estado: data.estado?.trim() || "Borrador",
      idEmpresa: data.idEmpresa ?? 1,
    });
  }

  public async obtenerProyectosPorCliente(idCliente: number) {
    this.validarId(idCliente, "El id del cliente no es válido");

    return this.repository.obtenerProyectosPorCliente(idCliente);
  }

  public async obtenerProyectoPorId(idProyecto: number) {
    this.validarId(idProyecto, "El id del proyecto no es válido");

    const proyecto =
      await this.repository.obtenerProyectoPorId(idProyecto);

    if (!proyecto) {
      throw new Error("Proyecto no encontrado");
    }

    return proyecto;
  }

  public async actualizarProyecto(
    idProyecto: number,
    data: Partial<CrearProyectoDTO>
  ): Promise<void> {
    this.validarId(idProyecto, "El id del proyecto no es válido");

    const proyectoActual =
      await this.repository.obtenerProyectoPorId(idProyecto);

    if (!proyectoActual) {
      throw new Error("Proyecto no encontrado");
    }

    this.validarActualizacion(data);

    const actualizado =
      await this.repository.actualizarProyecto(idProyecto, {
        ...data,
        nombre: data.nombre?.trim(),
        descripcion:
          data.descripcion !== undefined
            ? data.descripcion?.trim() || null
            : undefined,
        imagenUrl:
          data.imagenUrl !== undefined
            ? data.imagenUrl?.trim() || null
            : undefined,
        ubicacion:
          data.ubicacion !== undefined
            ? data.ubicacion?.trim() || null
            : undefined,
        estado: data.estado?.trim(),
      });

    if (!actualizado) {
      throw new Error("No se pudo actualizar el proyecto");
    }
  }

  public async eliminarProyecto(idProyecto: number): Promise<void> {
    this.validarId(idProyecto, "El id del proyecto no es válido");

    const proyecto =
      await this.repository.obtenerProyectoPorId(idProyecto);

    if (!proyecto) {
      throw new Error("Proyecto no encontrado");
    }

    const eliminado =
      await this.repository.eliminarProyecto(idProyecto);

    if (!eliminado) {
      throw new Error("No se pudo eliminar el proyecto");
    }
  }

  private validarProyecto(data: CrearProyectoDTO): void {
    this.validarId(
      data.idCliente,
      "El id del cliente no es válido"
    );

    this.validarId(
      data.idTipoObra,
      "El id del tipo de obra no es válido"
    );

    if (
      data.idEmpresa !== undefined &&
      data.idEmpresa !== null
    ) {
      this.validarId(
        data.idEmpresa,
        "El id de la empresa no es válido"
      );
    }

    if (!data.nombre?.trim()) {
      throw new Error("El nombre del proyecto es obligatorio");
    }

    if (data.nombre.trim().length > 100) {
      throw new Error(
        "El nombre del proyecto no puede superar los 100 caracteres"
      );
    }

    if (
      data.descripcion &&
      data.descripcion.trim().length > 500
    ) {
      throw new Error(
        "La descripción no puede superar los 500 caracteres"
      );
    }

    if (
      data.ubicacion &&
      data.ubicacion.trim().length > 200
    ) {
      throw new Error(
        "La ubicación no puede superar los 200 caracteres"
      );
    }

    if (
      data.imagenUrl &&
      data.imagenUrl.trim().length > 500
    ) {
      throw new Error(
        "La URL de la imagen no puede superar los 500 caracteres"
      );
    }

    this.validarMedida(data.alto, "alto");
    this.validarMedida(data.ancho, "ancho");
    this.validarMedida(data.largo, "largo");
  }

  private validarActualizacion(
    data: Partial<CrearProyectoDTO>
  ): void {
    if (Object.keys(data).length === 0) {
      throw new Error(
        "Debe enviar al menos un campo para actualizar"
      );
    }

    if (data.idCliente !== undefined) {
      this.validarId(
        data.idCliente,
        "El id del cliente no es válido"
      );
    }

    if (data.idTipoObra !== undefined) {
      this.validarId(
        data.idTipoObra,
        "El id del tipo de obra no es válido"
      );
    }

    if (
      data.idEmpresa !== undefined &&
      data.idEmpresa !== null
    ) {
      this.validarId(
        data.idEmpresa,
        "El id de la empresa no es válido"
      );
    }

    if (
      data.nombre !== undefined &&
      !data.nombre.trim()
    ) {
      throw new Error(
        "El nombre del proyecto no puede estar vacío"
      );
    }

    if (
      data.nombre !== undefined &&
      data.nombre.trim().length > 100
    ) {
      throw new Error(
        "El nombre del proyecto no puede superar los 100 caracteres"
      );
    }

    if (
      data.descripcion !== undefined &&
      data.descripcion !== null &&
      data.descripcion.trim().length > 500
    ) {
      throw new Error(
        "La descripción no puede superar los 500 caracteres"
      );
    }

    if (data.imagenUrl !== undefined) {
      if (
        data.imagenUrl !== null &&
        data.imagenUrl.trim().length > 500
      ) {
        throw new Error(
          "La URL de la imagen no puede superar los 500 caracteres"
        );
      }
    }

    if (
      data.ubicacion !== undefined &&
      data.ubicacion !== null &&
      data.ubicacion.trim().length > 200
    ) {
      throw new Error(
        "La ubicación no puede superar los 200 caracteres"
      );
    }

    if (data.alto !== undefined) {
      this.validarMedida(data.alto, "alto");
    }

    if (data.ancho !== undefined) {
      this.validarMedida(data.ancho, "ancho");
    }

    if (data.largo !== undefined) {
      this.validarMedida(data.largo, "largo");
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

  private validarMedida(
    valor: number,
    nombre: string
  ): void {
    if (
      typeof valor !== "number" ||
      !Number.isFinite(valor) ||
      valor <= 0
    ) {
      throw new Error(
        `La medida ${nombre} debe ser un número mayor que cero`
      );
    }
  }
}