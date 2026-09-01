import { MaterialRepository } from "../repositories/MaterialRepository";
import { MonedaService } from "./MonedaService";

import type {
  ActualizarMaterialDTO,
  CrearMaterialDTO,
  Material,
} from "../models/Material";


export class MaterialService {
  private repository = new MaterialRepository();
  private monedaService = new MonedaService();

  public async obtenerMateriales() {
    const materiales =
      await this.repository.obtenerMateriales();

    const tipoCambio =
      await this.monedaService.obtenerDolarAPesoUruguayo();

    return materiales.map((material) => ({
      ...material,
      moneda: "USD",
      tipoCambio,
      costoUnitarioUYU:
        Number(material.costoUnitario) * tipoCambio,
    }));
  }

  public async obtenerMaterialPorId(
    idMaterial: number
  ): Promise<Material> {
    const material =
      await this.repository.obtenerMaterialPorId(idMaterial);

    if (!material) {
      throw new Error("Material no encontrado");
    }

    return material;
  }

  public async crearMaterial(
    material: CrearMaterialDTO
  ): Promise<Material> {
    this.validarMaterial(material);

    const materialNormalizado: CrearMaterialDTO = {
      ...material,
      nombre: material.nombre.trim(),
      descripcion: material.descripcion?.trim() || null,
      categoria: material.categoria?.trim() || null,
      unidad: material.unidad?.trim() || null,
      imagenUrl: material.imagenUrl?.trim() || null,
      disponibilidad:
        material.disponibilidad ?? this.calcularDisponibilidad(material.stock),
      estado: material.estado ?? "Activo",
    };

    return this.repository.crearMaterial(materialNormalizado);
  }

  public async actualizarMaterial(
    idMaterial: number,
    material: ActualizarMaterialDTO
  ): Promise<Material> {
    this.validarId(idMaterial);
    this.validarMaterial(material);

    const materialNormalizado: ActualizarMaterialDTO = {
      ...material,
      nombre: material.nombre.trim(),
      descripcion: material.descripcion?.trim() || null,
      categoria: material.categoria?.trim() || null,
      unidad: material.unidad?.trim() || null,
      imagenUrl: material.imagenUrl?.trim() || null,
      disponibilidad:
        material.disponibilidad ?? this.calcularDisponibilidad(material.stock),
      estado: material.estado ?? "Activo",
    };

    const materialActualizado =
      await this.repository.actualizarMaterial(
        idMaterial,
        materialNormalizado
      );

    if (!materialActualizado) {
      throw new Error("Material no encontrado");
    }

    return materialActualizado;
  }

  public async eliminarMaterial(
    idMaterial: number
  ): Promise<void> {
    this.validarId(idMaterial);

    const eliminado =
      await this.repository.eliminarMaterial(idMaterial);

    if (!eliminado) {
      throw new Error("Material no encontrado");
    }
  }

  private validarMaterial(
    material: CrearMaterialDTO | ActualizarMaterialDTO
  ): void {
    if (!material.nombre || !material.nombre.trim()) {
      throw new Error("El nombre del material es obligatorio");
    }

    if (
      typeof material.stock !== "number" ||
      !Number.isFinite(material.stock) ||
      material.stock < 0
    ) {
      throw new Error(
        "El stock debe ser un número mayor o igual a cero"
      );
    }

    if (
      typeof material.costoUnitario !== "number" ||
      !Number.isFinite(material.costoUnitario) ||
      material.costoUnitario < 0
    ) {
      throw new Error(
        "El costo unitario debe ser un número mayor o igual a cero"
      );
    }

    if (material.imagenUrl) {
      try {
        new URL(material.imagenUrl);
      } catch {
        throw new Error("La URL de la imagen no es válida");
      }
    }

    if (
      !Number.isInteger(material.idEmpresa) ||
      material.idEmpresa <= 0
    ) {
      throw new Error(
        "La empresa propietaria del material es obligatoria"
      );
    }

    const disponibilidadesValidas = [
      "Disponible",
      "Stock bajo",
      "Sin stock",
    ];

    if (
      material.disponibilidad &&
      !disponibilidadesValidas.includes(material.disponibilidad)
    ) {
      throw new Error("La disponibilidad no es válida");
    }

    const estadosValidos = ["Activo", "Inactivo"];

    if (
      material.estado &&
      !estadosValidos.includes(material.estado)
    ) {
      throw new Error("El estado no es válido");
    }
  }

  private validarId(idMaterial: number): void {
    if (!Number.isInteger(idMaterial) || idMaterial <= 0) {
      throw new Error(
        "El identificador del material no es válido"
      );
    }
  }

  private calcularDisponibilidad(
    stock: number
  ): "Disponible" | "Stock bajo" | "Sin stock" {
    if (stock === 0) {
      return "Sin stock";
    }

    if (stock <= 25) {
      return "Stock bajo";
    }

    return "Disponible";
  }
}