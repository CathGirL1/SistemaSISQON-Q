import {
  type AgregarMaterialProyectoDTO,
} from "../models/MaterialProyecto";

import { MaterialRepository } from "../repositories/MaterialRepository";
import { CotizacionRepository } from "../repositories/CotizacionRepository";
import { CotizacionService } from "./CotizacionService";
import { MaterialProyectoRepository } from "../repositories/MaterialProyectoRepository"

export class MaterialProyectoService {
  private repository = new MaterialProyectoRepository();
  private materialRepository = new MaterialRepository();
  private cotizacionRepository = new CotizacionRepository();
  private cotizacionService = new CotizacionService();

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

  public async obtenerComparacionMateriales(
    idProyecto: number
  ) {
    this.validarId(
      idProyecto,
      "El id del proyecto no es válido"
    );

    return this.repository.obtenerComparacionMateriales(
      idProyecto
    );
  }

  public async usarMaterialAlternativo(
    idMaterialProyecto: number,
    idMaterialAlternativo: number
  ) {
    this.validarId(
      idMaterialProyecto,
      "El id del material del proyecto no es válido"
    );

    this.validarId(
      idMaterialAlternativo,
      "El id del material alternativo no es válido"
    );

    // 1. Obtener el material actualmente utilizado
    const materialProyecto =
      await this.repository.obtenerMaterialProyectoPorId(
        idMaterialProyecto
      );

    if (!materialProyecto) {
      throw new Error(
        "No se encontró el material dentro del proyecto"
      );
    }

    // 2. La cotización debe continuar en Borrador
    const borrador =
      await this.cotizacionRepository
        .obtenerCotizacionBorradorPorProyecto(
          materialProyecto.idProyecto
        );

    if (!borrador) {
      throw new Error(
        "La cotización ya fue enviada o no existe un borrador modificable"
      );
    }

    // 3. Obtener alternativas válidas del material actual
    const alternativas =
      await this.materialRepository
        .obtenerAlternativasMaterial(
          materialProyecto.idMaterial
        );

    const alternativaValida =
      alternativas.find(
        (material: any) =>
          Number(material.id_Material) ===
          idMaterialAlternativo
      );

    if (!alternativaValida) {
      throw new Error(
        "El material seleccionado no es una alternativa válida"
      );
    }

    // 4. Aplicar alternativa al proyecto
    const actualizado =
      await this.repository.usarMaterialAlternativo(
        idMaterialProyecto,
        idMaterialAlternativo
      );

    if (!actualizado) {
      throw new Error(
        "No se pudo aplicar el material alternativo"
      );
    }

    // 5. Recalcular el mismo borrador con la Strategy correspondiente
    await this.cotizacionService.generarCotizacion(
      materialProyecto.idProyecto
    );

    return {
      actualizado: true,
      idProyecto: materialProyecto.idProyecto,
      idCotizacion: borrador.idCotizacion,
      materialAnterior: {
        idMaterial: materialProyecto.idMaterial,
        nombre: materialProyecto.nombre,
        costoUnitario: materialProyecto.costoUnitario
      },
      materialNuevo: {
        idMaterial: alternativaValida.id_Material,
        nombre: alternativaValida.nombre,
        costoUnitario: alternativaValida.costoUnitario
      }
    };
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