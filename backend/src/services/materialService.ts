import * as materialRepository from "../repositories/materialRepository";

export async function obtenerMateriales() {
  return await materialRepository.obtenerMateriales();
}

export async function obtenerMaterialPorId(idMaterial: number) {
  if (!Number.isInteger(idMaterial) || idMaterial <= 0) {
    throw new Error("El ID del material no es válido");
  }

  const material =
    await materialRepository.obtenerMaterialPorId(idMaterial);

  if (!material) {
    throw new Error("Material no encontrado");
  }

  return material;
}