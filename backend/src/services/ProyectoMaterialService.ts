import {
  ProyectoMaterialRepository,
  type AgregarProyectoMaterialData,
  type ActualizarProyectoMaterialData,
} from "../repositories/ProyectoMaterialRepository";

export class ProyectoMaterialService {
  private repository = new ProyectoMaterialRepository();

  public async obtenerMaterialesPorProyecto(
    idProyecto: number
  ) {
    this.validarId(
      idProyecto,
      "El id del proyecto no es válido"
    );

    const existeProyecto =
      await this.repository.existeProyecto(idProyecto);

    if (!existeProyecto) {
      throw new Error("Proyecto no encontrado");
    }

    return this.repository.obtenerMaterialesPorProyecto(
      idProyecto
    );
  }

  public async agregarMaterial(
    data: AgregarProyectoMaterialData
  ): Promise<number> {
    this.validarId(
      data.idProyecto,
      "El id del proyecto no es válido"
    );

    this.validarId(
      data.idMaterial,
      "El id del material no es válido"
    );

    this.validarCantidad(data.cantidad);
    this.validarObservaciones(data.observaciones);

    const existeProyecto =
      await this.repository.existeProyecto(
        data.idProyecto
      );

    if (!existeProyecto) {
      throw new Error("Proyecto no encontrado");
    }

    const existeMaterial =
      await this.repository.existeMaterial(
        data.idMaterial
      );

    if (!existeMaterial) {
      throw new Error(
        "Material no encontrado o inactivo"
      );
    }

    const yaExiste =
      await this.repository.proyectoYaTieneMaterial(
        data.idProyecto,
        data.idMaterial
      );

    if (yaExiste) {
      throw new Error(
        "El material ya fue agregado al proyecto"
      );
    }

    return this.repository.agregarMaterial({
      idProyecto: data.idProyecto,
      idMaterial: data.idMaterial,
      cantidad: data.cantidad,
      observaciones:
        data.observaciones?.trim() || null,
    });
  }

  public async actualizarMaterial(
    idProyecto: number,
    idMaterial: number,
    data: ActualizarProyectoMaterialData
  ): Promise<void> {
    this.validarId(
      idProyecto,
      "El id del proyecto no es válido"
    );

    this.validarId(
      idMaterial,
      "El id del material no es válido"
    );

    if (Object.keys(data).length === 0) {
      throw new Error(
        "Debe enviar al menos un campo para actualizar"
      );
    }

    if (data.cantidad !== undefined) {
      this.validarCantidad(data.cantidad);
    }

    if (data.observaciones !== undefined) {
      this.validarObservaciones(data.observaciones);
    }

    const existeRelacion =
      await this.repository.proyectoYaTieneMaterial(
        idProyecto,
        idMaterial
      );

    if (!existeRelacion) {
      throw new Error(
        "El material no está asociado al proyecto"
      );
    }

    const actualizado =
      await this.repository.actualizarMaterial(
        idProyecto,
        idMaterial,
        {
          cantidad: data.cantidad,
          observaciones:
            data.observaciones !== undefined
              ? data.observaciones?.trim() || null
              : undefined,
        }
      );

    if (!actualizado) {
      throw new Error(
        "No se pudo actualizar el material del proyecto"
      );
    }
  }

  public async eliminarMaterial(
    idProyecto: number,
    idMaterial: number
  ): Promise<void> {
    this.validarId(
      idProyecto,
      "El id del proyecto no es válido"
    );

    this.validarId(
      idMaterial,
      "El id del material no es válido"
    );

    const existeRelacion =
      await this.repository.proyectoYaTieneMaterial(
        idProyecto,
        idMaterial
      );

    if (!existeRelacion) {
      throw new Error(
        "El material no está asociado al proyecto"
      );
    }

    const eliminado =
      await this.repository.eliminarMaterial(
        idProyecto,
        idMaterial
      );

    if (!eliminado) {
      throw new Error(
        "No se pudo eliminar el material del proyecto"
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

  private validarCantidad(cantidad: number): void {
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

  private validarObservaciones(
    observaciones?: string | null
  ): void {
    if (
      observaciones !== undefined &&
      observaciones !== null &&
      observaciones.trim().length > 300
    ) {
      throw new Error(
        "Las observaciones no pueden superar los 300 caracteres"
      );
    }
  }
}