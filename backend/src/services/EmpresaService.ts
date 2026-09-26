
import {
  EmpresaRepository,
  type Empresa,
} from "../repositories/EmpresaRepository";

import type {
  ActualizarPerfilEmpresaDTO,
  PerfilEmpresa,
} from "../models/PerfilEmpresa";


export class EmpresaService {
  private repository = new EmpresaRepository();


  public async obtenerEmpresaPorId(
    idEmpresa: number
  ): Promise<PerfilEmpresa> {
    this.validarId(
      idEmpresa,
      "El identificador de la empresa no es válido"
    );

    const empresa =
      await this.repository.obtenerEmpresaPorId(idEmpresa);

    if (!empresa) {
      throw new Error("Empresa no encontrada");
    }

    return empresa;
  }

  public async obtenerEmpresaPorUsuario(
    idUsuario: number
  ): Promise<PerfilEmpresa> {
    this.validarId(
      idUsuario,
      "El identificador del usuario no es válido"
    );

    const empresa =
      await this.repository.obtenerEmpresaPorUsuario(
        idUsuario
      );

    if (!empresa) {
      throw new Error(
        "No se encontró una empresa asociada al usuario"
      );
    }

    return empresa;
  }

  public async actualizarEmpresa(
    idEmpresa: number,
    empresa: ActualizarPerfilEmpresaDTO
  ): Promise<PerfilEmpresa> {
    this.validarId(
      idEmpresa,
      "El identificador de la empresa no es válido"
    );

    this.validarEmpresa(empresa);

  const empresaNormalizada: ActualizarPerfilEmpresaDTO = {
    razonSocial: empresa.razonSocial.trim(),
    nombreComercial: empresa.nombreComercial.trim(),

    rut: empresa.rut.trim(),
    rubro: empresa.rubro?.trim() || "",

    email: empresa.email?.trim().toLowerCase() || "",
    telefono: empresa.telefono?.trim() || "",
    direccion: empresa.direccion?.trim() || "",

    paginaWeb: empresa.paginaWeb?.trim() || "",
    descripcion: empresa.descripcion?.trim() || "",

    zonasTrabajo:
      empresa.zonasTrabajo?.trim() || "",

    condicionesComerciales:
      empresa.condicionesComerciales?.trim() || "",

    textoLegal:
      empresa.textoLegal?.trim() || "",

    impuestos:
      empresa.impuestos ?? null,

    validezCotizacion:
      empresa.validezCotizacion,

    diasLaborables:
      empresa.diasLaborables?.trim() || "",

    horarioInicio:
      empresa.horarioInicio?.trim() || "",

    horarioFin:
      empresa.horarioFin?.trim() || "",

    idiomaDocumentos:
      empresa.idiomaDocumentos?.trim() || "",

    logo:
      empresa.logo?.trim() || "",
  };

    try {
      const empresaActualizada =
        await this.repository.actualizarEmpresa(
          idEmpresa,
          empresaNormalizada
        );

      if (!empresaActualizada) {
        throw new Error("Empresa no encontrada");
      }

      return empresaActualizada;
    } catch (error) {
      if (this.esErrorRutDuplicado(error)) {
        throw new Error(
          "Ya existe una empresa registrada con ese RUT"
        );
      }

      throw error;
    }
  }

  private validarEmpresa(
    empresa: ActualizarPerfilEmpresaDTO
  ): void {
    if (!empresa) {
      throw new Error(
        "Los datos de la empresa son obligatorios"
      );
    }

    if (
      !empresa.nombreComercial?.trim() &&
      !empresa.razonSocial?.trim()
    ) {
      throw new Error(
        "El nombre de la empresa es obligatorio"
      );
    }

    if (!empresa.rut?.trim()) {
      throw new Error("El RUT es obligatorio");
    }

    if (empresa.rut.trim().length > 20) {
      throw new Error(
        "El RUT no puede superar los 20 caracteres"
      );
    }

    if (
      empresa.email?.trim() &&
      !this.esEmailValido(empresa.email.trim())
    ) {
      throw new Error(
        "El correo electrónico no es válido"
      );
    }

    if (
      empresa.telefono?.trim() &&
      empresa.telefono.trim().length > 20
    ) {
      throw new Error(
        "El teléfono no puede superar los 20 caracteres"
      );
    }

    if (
      empresa.descripcion?.trim() &&
      empresa.descripcion.trim().length > 255
    ) {
      throw new Error(
        "La descripción no puede superar los 255 caracteres"
      );
    }

    if (
      empresa.direccion?.trim() &&
      empresa.direccion.trim().length > 200
    ) {
      throw new Error(
        "La dirección no puede superar los 200 caracteres"
      );
    }

    if (
      empresa.paginaWeb?.trim() &&
      empresa.paginaWeb.trim().length > 150
    ) {
      throw new Error(
        "La página web no puede superar los 150 caracteres"
      );
    }

    if (
      empresa.logo?.trim() &&
      empresa.logo.trim().length > 255
    ) {
      throw new Error(
        "La dirección del logo no puede superar los 255 caracteres"
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

  private esEmailValido(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private esErrorRutDuplicado(error: unknown): boolean {
    if (!(error instanceof Error)) {
      return false;
    }

    const mensaje = error.message.toLowerCase();

    return (
      mensaje.includes("unique") ||
      mensaje.includes("duplicate") ||
      mensaje.includes("duplicada") ||
      mensaje.includes("rut")
    );
  }

  public async actualizarLogoEmpresa(
  idEmpresa: number,
  logo: string
): Promise<PerfilEmpresa> {
  this.validarId(
    idEmpresa,
    "El identificador de la empresa no es válido"
  );

  if (!logo.trim()) {
    throw new Error(
      "No se recibió un logo válido"
    );
  }

  const empresa =
    await this.repository.actualizarLogoEmpresa(
      idEmpresa,
      logo.trim()
    );

  if (!empresa) {
    throw new Error("Empresa no encontrada");
  }

  return empresa;
}

  public async obtenerEmpresas(): Promise<Empresa[]> {
    return this.repository.obtenerEmpresas();
  }

}