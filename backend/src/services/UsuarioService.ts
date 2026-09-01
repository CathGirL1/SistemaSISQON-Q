import { UsuarioRepository } from "../repositories/UsuarioRepository";

import type {
  ActualizarPerfilUsuarioDTO,
  PerfilUsuario,
} from "../models/PerfilUsuario";

export class UsuarioService {
  private repository = new UsuarioRepository();

  public async obtenerUsuarioPorId(
    idUsuario: number
  ): Promise<PerfilUsuario> {
    this.validarId(idUsuario);

    const usuario =
      await this.repository.obtenerUsuarioPorId(idUsuario);

    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

    return usuario;
  }

  public async actualizarUsuario(
    idUsuario: number,
    usuario: ActualizarPerfilUsuarioDTO
  ): Promise<PerfilUsuario> {
    this.validarId(idUsuario);
    this.validarUsuario(usuario);

    const usuarioNormalizado: ActualizarPerfilUsuarioDTO = {
      nombreUsuario: usuario.nombreUsuario.trim(),
      gmail: usuario.gmail.trim().toLowerCase(),
      telefono: usuario.telefono?.trim() || "",
      direccion: usuario.direccion?.trim() || "",

      nombre: usuario.nombre?.trim() || "",
      apellido: usuario.apellido?.trim() || "",
      ciudad: usuario.ciudad?.trim() || "",
      pais: usuario.pais?.trim() || "",
      cargo: usuario.cargo?.trim() || "",
      departamento:
        usuario.departamento?.trim() || "",
      zonaTrabajo:
        usuario.zonaTrabajo?.trim() || "",

      idioma:
        usuario.idioma?.trim() || "Español",

      moneda:
        usuario.moneda?.trim() ||
        "Peso Uruguayo (UYU)",

      zonaHoraria:
        usuario.zonaHoraria?.trim() ||
        "(UTC-03:00) Montevideo",

      fotoPerfil:
        usuario.fotoPerfil?.trim() || null,
    };

    try {
      const usuarioActualizado =
        await this.repository.actualizarUsuario(
          idUsuario,
          usuarioNormalizado
        );

      if (!usuarioActualizado) {
        throw new Error("Usuario no encontrado");
      }

      return usuarioActualizado;
    } catch (error) {
      if (this.esErrorCorreoDuplicado(error)) {
        throw new Error(
          "Ya existe un usuario registrado con ese correo"
        );
      }

      throw error;
    }
  }

  private validarUsuario(
    usuario: ActualizarPerfilUsuarioDTO
  ): void {
    if (!usuario) {
      throw new Error(
        "Los datos del usuario son obligatorios"
      );
    }

    if (!usuario.nombreUsuario?.trim()) {
      throw new Error(
        "El nombre de usuario es obligatorio"
      );
    }

    if (usuario.nombreUsuario.trim().length > 50) {
      throw new Error(
        "El nombre de usuario no puede superar los 50 caracteres"
      );
    }

    if (!usuario.gmail?.trim()) {
      throw new Error(
        "El correo electrónico es obligatorio"
      );
    }

    if (!this.esCorreoValido(usuario.gmail.trim())) {
      throw new Error(
        "El correo electrónico no es válido"
      );
    }

    if (usuario.gmail.trim().length > 100) {
      throw new Error(
        "El correo electrónico no puede superar los 100 caracteres"
      );
    }

    if (
      usuario.telefono?.trim() &&
      usuario.telefono.trim().length > 20
    ) {
      throw new Error(
        "El teléfono no puede superar los 20 caracteres"
      );
    }

    if (
      usuario.direccion?.trim() &&
      usuario.direccion.trim().length > 200
    ) {
      throw new Error(
        "La dirección no puede superar los 200 caracteres"
      );
    }

    if (
      usuario.nombre?.trim() &&
      usuario.nombre.trim().length > 50
    ) {
      throw new Error(
        "El nombre no puede superar los 50 caracteres"
      );
    }

    if (
      usuario.apellido?.trim() &&
      usuario.apellido.trim().length > 50
    ) {
      throw new Error(
        "El apellido no puede superar los 50 caracteres"
      );
    }

    if (
      usuario.ciudad?.trim() &&
      usuario.ciudad.trim().length > 100
    ) {
      throw new Error(
        "La ciudad no puede superar los 100 caracteres"
      );
    }

    if (
      usuario.pais?.trim() &&
      usuario.pais.trim().length > 100
    ) {
      throw new Error(
        "El país no puede superar los 100 caracteres"
      );
    }

    if (
      usuario.cargo?.trim() &&
      usuario.cargo.trim().length > 100
    ) {
      throw new Error(
        "El cargo no puede superar los 100 caracteres"
      );
    }

    if (
      usuario.departamento?.trim() &&
      usuario.departamento.trim().length > 100
    ) {
      throw new Error(
        "El departamento no puede superar los 100 caracteres"
      );
    }

    if (
      usuario.zonaTrabajo?.trim() &&
      usuario.zonaTrabajo.trim().length > 150
    ) {
      throw new Error(
        "La zona de trabajo no puede superar los 150 caracteres"
      );
    }

    if (
      usuario.fotoPerfil?.trim() &&
      usuario.fotoPerfil.trim().length > 255
    ) {
      throw new Error(
        "La dirección de la foto no puede superar los 255 caracteres"
      );
    }
  }

  private validarId(idUsuario: number): void {
    if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
      throw new Error(
        "El identificador del usuario no es válido"
      );
    }
  }

  private esCorreoValido(correo: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
  }

  private esErrorCorreoDuplicado(
    error: unknown
  ): boolean {
    if (
      typeof error === "object" &&
      error !== null &&
      "number" in error
    ) {
      const numero = Number(
        (error as { number?: unknown }).number
      );

      if (numero === 2601 || numero === 2627) {
        return true;
      }
    }

    if (error instanceof Error) {
      const mensaje = error.message.toLowerCase();

      return (
        mensaje.includes("unique") ||
        mensaje.includes("duplicate") ||
        mensaje.includes("duplicada")
      );
    }

    return false;
  }
}