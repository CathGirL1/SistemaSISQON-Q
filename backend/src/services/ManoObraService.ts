import { ManoObraRepository } from "../repositories/ManoObraRepository";

import type {
  ActualizarManoObraDTO,
  CrearManoObraDTO,
  ManoObra,
} from "../models/ManoObra";

export class ManoObraService {
  private repository = new ManoObraRepository();

  public async obtenerManoObra(): Promise<ManoObra[]> {
    return this.repository.obtenerManoObra();
  }

  public async obtenerManoObraPorId(
    idManoObra: number
  ): Promise<ManoObra> {
    this.validarId(idManoObra);

    const manoObra =
      await this.repository.obtenerManoObraPorId(idManoObra);

    if (!manoObra) {
      throw new Error("Mano de obra no encontrada");
    }

    return manoObra;
  }

  public async crearManoObra(
    manoObra: CrearManoObraDTO
  ): Promise<ManoObra> {
    this.validarManoObra(manoObra);

    const manoObraNormalizada: CrearManoObraDTO = {
      ...manoObra,
      nombre: manoObra.nombre.trim(),
      descripcion: manoObra.descripcion?.trim() || null,
      categoria: manoObra.categoria?.trim() || null,
      unidad: manoObra.unidad?.trim() || null,
      observaciones: manoObra.observaciones?.trim() || null,
      estado: manoObra.estado ?? "Activo",
    };

    return this.repository.crearManoObra(manoObraNormalizada);
  }

  public async actualizarManoObra(
    idManoObra: number,
    manoObra: ActualizarManoObraDTO
  ): Promise<ManoObra> {
    this.validarId(idManoObra);
    this.validarManoObra(manoObra);

    const manoObraNormalizada: ActualizarManoObraDTO = {
      ...manoObra,
      nombre: manoObra.nombre.trim(),
      descripcion: manoObra.descripcion?.trim() || null,
      categoria: manoObra.categoria?.trim() || null,
      unidad: manoObra.unidad?.trim() || null,
      observaciones: manoObra.observaciones?.trim() || null,
      estado: manoObra.estado ?? "Activo",
    };

    const manoObraActualizada =
      await this.repository.actualizarManoObra(
        idManoObra,
        manoObraNormalizada
      );

    if (!manoObraActualizada) {
      throw new Error("Mano de obra no encontrada");
    }

    return manoObraActualizada;
  }

  public async eliminarManoObra(
    idManoObra: number
  ): Promise<void> {
    this.validarId(idManoObra);

    const eliminada =
      await this.repository.eliminarManoObra(idManoObra);

    if (!eliminada) {
      throw new Error("Mano de obra no encontrada");
    }
  }

  private validarManoObra(
    manoObra: CrearManoObraDTO | ActualizarManoObraDTO
  ): void {
    if (!manoObra.nombre || !manoObra.nombre.trim()) {
      throw new Error("El nombre es obligatorio");
    }

    if (
      typeof manoObra.costoUnitario !== "number" ||
      !Number.isFinite(manoObra.costoUnitario) ||
      manoObra.costoUnitario < 0
    ) {
      throw new Error(
        "El costo unitario debe ser mayor o igual a cero"
      );
    }

    const estadosValidos = ["Activo", "Inactivo"];

    if (
      manoObra.estado &&
      !estadosValidos.includes(manoObra.estado)
    ) {
      throw new Error("El estado no es válido");
    }
  }

  private validarId(idManoObra: number): void {
    if (!Number.isInteger(idManoObra) || idManoObra <= 0) {
      throw new Error(
        "El identificador de la mano de obra no es válido"
      );
    }
  }
}