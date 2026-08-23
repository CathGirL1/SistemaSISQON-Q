import {
  type AgregarMaterialProyectoDTO,
} from "../models/MaterialProyecto";

import {MaterialProyectoRepository} from "../repositories/MaterialProyectoRepository"

export class MaterialProyectoService {
  private repository = new MaterialProyectoRepository();

  
  public async agregarMaterial(
    data: AgregarMaterialProyectoDTO
  ) {
    this.validarId(
      data.idProyecto,
      "El id del proyecto no es válido"
    );

    this.validarId(
      data.idMaterial,
      "El id del material no es válido"
    );

    this.validarCantidad(data.cantidad);

    return this.repository.agregarMaterial({
      idProyecto: data.idProyecto,
      idMaterial: data.idMaterial,
      cantidad: data.cantidad,
    });
  }

  
  public async obtenerMaterialesPorProyecto(
    idProyecto: number
  ) {
    this.validarId(
      idProyecto,
      "El id del proyecto no es válido"
    );

    return this.repository.obtenerMaterialesPorProyecto(
      idProyecto
    );
  }

  
  public async actualizarCantidad(
    idMaterialProyecto: number,
    cantidad: number
  ) {
    this.validarId(
      idMaterialProyecto,
      "El id del material del proyecto no es válido"
    );

    this.validarCantidad(cantidad);

    const actualizado =
      await this.repository.actualizarCantidad(
        idMaterialProyecto,
        cantidad
      );

    if (!actualizado) {
      throw new Error(
        "No se pudo actualizar la cantidad del material"
      );
    }

    return actualizado;
  }

  
  public async eliminarMaterial(
    idMaterialProyecto: number
  ) {
    this.validarId(
      idMaterialProyecto,
      "El id del material del proyecto no es válido"
    );

    const eliminado =
      await this.repository.eliminarMaterial(
        idMaterialProyecto
      );

    if (!eliminado) {
      throw new Error(
        "No se pudo eliminar el material del proyecto"
      );
    }

    return eliminado;
  }

  private validarId(
    id: number,
    mensaje: string
  ): void {
    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {
      throw new Error(mensaje);
    }
  }

  private validarCantidad(
    cantidad: number
  ): void {
    if (
      typeof cantidad !== "number" ||
      !Number.isFinite(cantidad) ||
      cantidad <= 0
    ) {
      throw new Error(
        "La cantidad debe ser un número mayor que cero"
      );
    }
  }
}