import { ClienteRepository } from "../repositories/ClienteRepository";

import type {
  ActualizarClienteDTO,
  Cliente,
  CrearClienteDTO,
  EstadoCliente,
} from "../models/Cliente";

export class ClienteService {
  private repository = new ClienteRepository();

  public async obtenerClientes(): Promise<Cliente[]> {
    return this.repository.obtenerClientes();
  }

  public async obtenerClientesPorEmpresa(idEmpresa: number): Promise<Cliente[]> {
    this.validarId(
      idEmpresa,
      "El identificador de la empresa no es válido"
    );

    return this.repository.obtenerClientesPorEmpresa(
      idEmpresa
    );
  }

  public async obtenerClientePorId(
    idCliente: number
  ): Promise<Cliente> {
    this.validarId(idCliente);

    const cliente =
      await this.repository.obtenerClientePorId(idCliente);

    if (!cliente) {
      throw new Error("Cliente no encontrado");
    }

    return cliente;
  }

  public async obtenerHistorialCotizaciones(
  idCliente: number,
  idEmpresa: number
  ) {
  this.validarId(
    idCliente,
    "El identificador del cliente no es válido"
  );

  this.validarId(
    idEmpresa,
    "El identificador de la empresa no es válido"
  );

  return this.repository.obtenerHistorialCotizaciones(
    idCliente,
    idEmpresa
  );
  }

  public async crearCliente(
    cliente: CrearClienteDTO
  ): Promise<Cliente> {
    this.validarCliente(cliente, true);

      const datosUnicos =
        await this.repository.validarDatosUnicos(
          null,
          cliente.gmail.trim().toLowerCase(),
          cliente.nombreUsuario.trim(),
          cliente.cedula.trim(),
          cliente.telefono?.trim() || null
        );

      if (datosUnicos.gmailExiste) {
        throw new Error(
          "El correo electrónico ya está registrado"
        );
      }

      if (datosUnicos.nombreUsuarioExiste) {
        throw new Error(
          "El nombre de usuario ya está registrado"
        );
      }

      if (datosUnicos.cedulaExiste) {
        throw new Error(
          "La cédula ya está registrada"
        );
      }

      if (datosUnicos.telefonoExiste) {
        throw new Error(
          "El teléfono ya está registrado"
        );
      }

    const clienteNormalizado: CrearClienteDTO = {
      nombreUsuario: cliente.nombreUsuario.trim(),
      gmail: cliente.gmail.trim().toLowerCase(),
      telefono: cliente.telefono?.trim() || null,
      password: cliente.password,
      direccion: cliente.direccion?.trim() || null,

      cedula: cliente.cedula.trim(),
      nombre: cliente.nombre.trim(),
      apellido: cliente.apellido.trim(),

      ciudad: cliente.ciudad?.trim() || null,
      estado: cliente.estado ?? "Nuevo",
      notas: cliente.notas?.trim() || null,
    };

    return this.repository.crearCliente(clienteNormalizado);
  }

  public async actualizarCliente(
    idCliente: number,
    cliente: ActualizarClienteDTO
  ): Promise<Cliente> {
    this.validarId(idCliente);
    this.validarCliente(cliente, false);

    const datosUnicos =
      await this.repository.validarDatosUnicos(
        idCliente,
        cliente.gmail.trim().toLowerCase(),
        cliente.nombreUsuario.trim(),
        cliente.cedula.trim(), 
        cliente.telefono?.trim() || null
      );

    if (datosUnicos.gmailExiste) {
      throw new Error(
        "El correo electrónico ya está registrado"
      );
    }

    if (datosUnicos.nombreUsuarioExiste) {
      throw new Error(
        "El nombre de usuario ya está registrado"
      );
    }

    if (datosUnicos.cedulaExiste) {
      throw new Error(
        "La cédula ya está registrada"
      );
    }

    if (datosUnicos.telefonoExiste) {
      throw new Error(
        "El teléfono ya está registrado"
      );
    }

    const clienteNormalizado: ActualizarClienteDTO = {
      nombreUsuario: cliente.nombreUsuario.trim(),
      gmail: cliente.gmail.trim().toLowerCase(),
      telefono: cliente.telefono?.trim() || null,
      direccion: cliente.direccion?.trim() || null,

      cedula: cliente.cedula.trim(),
      nombre: cliente.nombre.trim(),
      apellido: cliente.apellido.trim(),

      ciudad: cliente.ciudad?.trim() || null,
      estado: cliente.estado,
      notas: cliente.notas?.trim() || null,
    };

    const actualizado =
      await this.repository.actualizarCliente(
        idCliente,
        clienteNormalizado
      );

    if (!actualizado) {
      throw new Error("Cliente no encontrado");
    }

    return actualizado;
  }

  public async actualizarLogoCliente(
    idCliente: number,
    logo: string
  ): Promise<Cliente> {
    this.validarId(
      idCliente,
      "El identificador del cliente no es válido"
    );

    if (!logo?.trim()) {
      throw new Error("No se recibió una imagen válida");
    }

    const cliente =
      await this.repository.actualizarLogoCliente(
        idCliente,
        logo.trim()
      );

    if (!cliente) {
      throw new Error("Cliente no encontrado");
    }

    return cliente;
  }

  public async eliminarCliente(
    idCliente: number
  ): Promise<void> {
    this.validarId(
      idCliente,
      "El identificador del cliente no es válido"
    );

    const cliente =
      await this.repository.obtenerClientePorId(
        idCliente
      );

    if (!cliente) {
      throw new Error("Cliente no encontrado");
    }

    const tieneProyectos =
      await this.repository.clienteTieneProyectos(
        idCliente
      );

    if (tieneProyectos) {
      throw new Error(
        "No se puede eliminar el cliente porque tiene proyectos asociados."
      );
    }

    const eliminado =
      await this.repository.eliminarCliente(
        idCliente
      );

    if (!eliminado) {
      throw new Error("Cliente no encontrado");
    }
  }

  private validarCliente(
    cliente: CrearClienteDTO | ActualizarClienteDTO,
    requierePassword: boolean
  ): void {
    if (!cliente.nombre?.trim()) {
      throw new Error("El nombre es obligatorio");
    }

    if (!this.esNombreValido(cliente.nombre)) {
      throw new Error(
        "El nombre solo puede contener letras y espacios"
      );
    }

    if (!cliente.apellido?.trim()) {
      throw new Error("El apellido es obligatorio");
    }

    if (!this.esNombreValido(cliente.apellido)) {
      throw new Error(
        "El apellido solo puede contener letras y espacios"
      );
    }

    if (!cliente.cedula?.trim()) {
      throw new Error("La cédula es obligatoria");
    }

    if (!this.esCedulaValida(cliente.cedula)) {
      throw new Error(
        "La cédula solo puede contener números"
      );
    }

    if (!cliente.gmail?.trim()) {
      throw new Error("El correo es obligatorio");
    }

    if (!this.esCorreoValido(cliente.gmail)) {
      throw new Error("El correo no es válido");
    }

    if (!cliente.nombreUsuario?.trim()) {
      throw new Error(
        "El nombre de usuario es obligatorio"
      );
    }

    if (/\s/.test(cliente.nombreUsuario)) {
      throw new Error(
        "El nombre de usuario no puede contener espacios"
      );
    }

    if (
      cliente.telefono &&
      !this.esTelefonoValido(cliente.telefono)
    ) {
      throw new Error(
        "El teléfono contiene caracteres no válidos"
      );
    }

    if (
      cliente.ciudad &&
      !this.esNombreValido(cliente.ciudad)
    ) {
      throw new Error(
        "La ciudad solo puede contener letras y espacios"
      );
    }

    if (
      requierePassword &&
      "password" in cliente &&
      !cliente.password?.trim()
    ) {
      throw new Error("La contraseña es obligatoria");
    }

    const estadosValidos: EstadoCliente[] = [
      "Nuevo",
      "Interesado",
      "Contactado",
      "Cliente confirmado",
    ];

    if (
      cliente.estado &&
      !estadosValidos.includes(cliente.estado)
    ) {
      throw new Error(
        "El estado del cliente no es válido"
      );
    }
  }

  private esNombreValido(valor: string): boolean {
    return /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(
      valor.trim()
    );
  }

  private esCedulaValida(valor: string): boolean {
    return /^\d+$/.test(valor.trim());
  }

  private esTelefonoValido(valor: string): boolean {
    return /^[0-9+\-()\s]+$/.test(valor.trim());
  }

  private validarId(id: number,mensaje = "El identificador no es válido"): void {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error(mensaje);
    }
  }

  private esCorreoValido(correo: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
  }
}