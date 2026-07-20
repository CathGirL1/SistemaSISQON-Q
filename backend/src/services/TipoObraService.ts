import { TipoObraRepository } from "../repositories/TipoObraRepository";

import type {
  ActualizarTipoObraDTO,
  CrearTipoObraDTO,
  DificultadTipoObra,
  EstadoTipoObra,
  TipoObra,
} from "../models/TipoObra";

export class TipoObraService {
  private readonly tipoObraRepository: TipoObraRepository;

  constructor() {
    this.tipoObraRepository =
      new TipoObraRepository();
  }

  async obtenerTiposObra(): Promise<TipoObra[]> {
    return this.tipoObraRepository.obtenerTiposObra();
  }

  async obtenerTipoObraPorId(
    idTipoObra: number
  ): Promise<TipoObra> {
    this.validarId(idTipoObra);

    const tipoObra =
      await this.tipoObraRepository.obtenerTipoObraPorId(
        idTipoObra
      );

    if (!tipoObra) {
      throw new Error(
        "El tipo de obra no existe."
      );
    }

    return tipoObra;
  }

  async crearTipoObra(
    datos: CrearTipoObraDTO
  ): Promise<TipoObra> {
    const datosNormalizados =
      this.normalizarDatos(datos);

    await this.validarNombreDuplicado(
      datosNormalizados.nombre
    );

    return this.tipoObraRepository.crearTipoObra(
      datosNormalizados
    );
  }

  async actualizarTipoObra(
    idTipoObra: number,
    datos: ActualizarTipoObraDTO
  ): Promise<TipoObra> {
    this.validarId(idTipoObra);

    await this.obtenerTipoObraPorId(
      idTipoObra
    );

    const datosNormalizados =
      this.normalizarDatos(datos);

    await this.validarNombreDuplicado(
      datosNormalizados.nombre,
      idTipoObra
    );

    const tipoObraActualizado =
      await this.tipoObraRepository.actualizarTipoObra(
        idTipoObra,
        datosNormalizados
      );

    if (!tipoObraActualizado) {
      throw new Error(
        "No se pudo actualizar el tipo de obra."
      );
    }

    return tipoObraActualizado;
  }

  async eliminarTipoObra(
    idTipoObra: number
  ): Promise<void> {
    this.validarId(idTipoObra);

    await this.obtenerTipoObraPorId(
      idTipoObra
    );

    const estaEnUso =
      await this.tipoObraRepository.estaEnUso(
        idTipoObra
      );

    if (estaEnUso) {
      throw new Error(
        "No se puede eliminar el tipo de obra porque está asociado a uno o más proyectos."
      );
    }

    const eliminado =
      await this.tipoObraRepository.eliminarTipoObra(
        idTipoObra
      );

    if (!eliminado) {
      throw new Error(
        "No se pudo eliminar el tipo de obra."
      );
    }
  }

  private normalizarDatos(
  datos: CrearTipoObraDTO | ActualizarTipoObraDTO
): ActualizarTipoObraDTO {
  const nombre = datos.nombre.trim();
  const descripcion = datos.descripcion?.trim() || null;

  if (!nombre) {
    throw new Error(
      "El nombre del tipo de obra es obligatorio."
    );
  }

  if (nombre.length > 50) {
    throw new Error(
      "El nombre no puede superar los 50 caracteres."
    );
  }

  if (descripcion && descripcion.length > 255) {
    throw new Error(
      "La descripción no puede superar los 255 caracteres."
    );
  }

  const tiempoMinDias =
    datos.tiempoMinDias ?? null;

  const tiempoMaxDias =
    datos.tiempoMaxDias ?? null;

  if (
    tiempoMinDias !== null &&
    tiempoMinDias < 0
  ) {
    throw new Error(
      "El tiempo mínimo no puede ser negativo."
    );
  }

  if (
    tiempoMaxDias !== null &&
    tiempoMaxDias < 0
  ) {
    throw new Error(
      "El tiempo máximo no puede ser negativo."
    );
  }

  if (
    tiempoMinDias !== null &&
    tiempoMaxDias !== null &&
    tiempoMaxDias < tiempoMinDias
  ) {
    throw new Error(
      "El tiempo máximo no puede ser menor al tiempo mínimo."
    );
  }

  const dificultad: DificultadTipoObra =
    datos.dificultad;

  const estado: EstadoTipoObra =
    datos.estado ?? "Activo";

  return {
    nombre,
    descripcion,

    tiempoMinDias,
    tiempoMaxDias,

    dificultad,
    estado,

    formulaCalculo:
      datos.formulaCalculo?.trim() || null,

    manoObra:
      datos.manoObra?.trim() || null,

    extras:
      datos.extras?.trim() || null,

    observaciones:
      datos.observaciones?.trim() || null,
  };
}

  private async validarNombreDuplicado(
    nombre: string,
    idExcluir?: number
  ): Promise<void> {
    const existe =
      await this.tipoObraRepository.existeNombre(
        nombre,
        idExcluir
      );

    if (existe) {
      throw new Error(
        "Ya existe un tipo de obra con ese nombre."
      );
    }
  }

  private validarId(idTipoObra: number): void {
    if (
      !Number.isInteger(idTipoObra) ||
      idTipoObra <= 0
    ) {
      throw new Error(
        "El identificador del tipo de obra no es válido."
      );
    }
  }
}