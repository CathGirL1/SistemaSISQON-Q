import { ManoObraRepository } from "../repositories/ManoObraRepository";
import { MonedaService } from "./MonedaService";

import type {
  ActualizarManoObraDTO,
  CrearManoObraDTO,
  ManoObra,
} from "../models/ManoObra";

export class ManoObraService {
  private repository = new ManoObraRepository();
  private monedaService = new MonedaService();

  public async obtenerManoObraPorEmpresa(
    idEmpresa: number
  ): Promise<ManoObra[]> {
    this.validarIdEmpresa(idEmpresa);

    const manoObra =
      await this.repository.obtenerManoObraPorEmpresa(
        idEmpresa
      );

    const tipoCambio =
      await this.monedaService.obtenerDolarAPesoUruguayo();

    return manoObra.map((trabajo) => ({
      ...trabajo,
      tipoCambio,
      costoUnitarioUSD:
        Number(trabajo.costoUnitario) / tipoCambio,
    }));
  }

  public async obtenerManoObraPorId(
    idManoObra: number,
    idEmpresa: number
  ): Promise<ManoObra> {
    this.validarId(idManoObra);
    this.validarIdEmpresa(idEmpresa);

    const manoObra =
      await this.repository.obtenerManoObraPorId(
        idManoObra,
        idEmpresa
      );

    if (!manoObra) {
      throw new Error("Mano de obra no encontrada");
    }

    return manoObra;
  }

  public async crearManoObra(
    manoObra: CrearManoObraDTO
  ): Promise<ManoObra> {
    this.validarIdEmpresa(manoObra.idEmpresa);
    this.validarManoObra(manoObra);

    const manoObraNormalizada: CrearManoObraDTO = {
      ...manoObra,
      nombre: manoObra.nombre.trim(),
      descripcion:
        manoObra.descripcion?.trim() || null,
      categoria:
        manoObra.categoria?.trim() || null,
      unidad:
        manoObra.unidad?.trim() || null,
      observaciones:
        manoObra.observaciones?.trim() || null,
      estado: manoObra.estado ?? "Activo",
    };

    return this.repository.crearManoObra(
      manoObraNormalizada
    );
  }

  public async actualizarManoObra(
    idManoObra: number,
    idEmpresa: number,
    manoObra: ActualizarManoObraDTO
  ): Promise<ManoObra> {
    this.validarId(idManoObra);
    this.validarIdEmpresa(idEmpresa);
    this.validarManoObra(manoObra);

    const manoObraNormalizada: ActualizarManoObraDTO = {
      ...manoObra,
      nombre: manoObra.nombre.trim(),
      descripcion:
        manoObra.descripcion?.trim() || null,
      categoria:
        manoObra.categoria?.trim() || null,
      unidad:
        manoObra.unidad?.trim() || null,
      observaciones:
        manoObra.observaciones?.trim() || null,
      estado: manoObra.estado ?? "Activo",
    };

    const manoObraActualizada =
      await this.repository.actualizarManoObra(
        idManoObra,
        idEmpresa,
        manoObraNormalizada
      );

    if (!manoObraActualizada) {
      throw new Error("Mano de obra no encontrada");
    }

    return manoObraActualizada;
  }

  public async eliminarManoObra(
    idManoObra: number,
    idEmpresa: number
  ): Promise<void> {
    this.validarId(idManoObra);
    this.validarIdEmpresa(idEmpresa);

    const eliminada =
      await this.repository.eliminarManoObra(
        idManoObra,
        idEmpresa
      );

    if (!eliminada) {
      throw new Error("Mano de obra no encontrada");
    }
  }

  private validarManoObra(
    manoObra:
      | CrearManoObraDTO
      | ActualizarManoObraDTO
  ): void {
    if (
      !manoObra.nombre ||
      !manoObra.nombre.trim()
    ) {
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

    const estadosValidos = [
      "Activo",
      "Inactivo",
    ];

    if (
      manoObra.estado &&
      !estadosValidos.includes(manoObra.estado)
    ) {
      throw new Error("El estado no es válido");
    }
  }

  private validarId(idManoObra: number): void {
    if (
      !Number.isInteger(idManoObra) ||
      idManoObra <= 0
    ) {
      throw new Error(
        "El identificador de la mano de obra no es válido"
      );
    }
  }

  private validarIdEmpresa(idEmpresa: number): void {
    if (
      !Number.isInteger(idEmpresa) ||
      idEmpresa <= 0
    ) {
      throw new Error(
        "El identificador de la empresa no es válido"
      );
    }
  }
}