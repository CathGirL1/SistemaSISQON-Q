import type {
  ClienteEmpresa,
  EstadoCliente,
} from "../interfaces/ClienteEmpresa";

const API_URL = "http://localhost:3000/api/clientes";

type ClienteApi = {
  id_Cliente: number;
  id_Usuario: number;
  cedula: string;
  nombre: string;
  apellido: string;
  nombreUsuario: string;
  gmail: string;
  telefono: string | null;
  direccion: string | null;
  ciudad: string | null;
  estado: EstadoCliente;
  notas: string | null;
};

type HistorialCotizacionApi = {
  idCotizacion: number;
  fechaRealizada: string;
  totalCotizacion: number;
  estado: string;
  observaciones: string | null;
  idProyecto: number;
  nombreProyecto: string;
};

export const obtenerClientesPorEmpresa = async (
  idEmpresa: number
): Promise<ClienteEmpresa[]> => {
  const respuesta = await fetch(
    `${API_URL}/empresa/${idEmpresa}`
  );

  if (!respuesta.ok) {
    throw new Error(
      await obtenerMensajeError(
        respuesta,
        "No se pudieron obtener los clientes de la empresa."
      )
    );
  }

  const clientes: ClienteApi[] =
    await respuesta.json();

  return clientes.map(transformarCliente);
};

export type CrearClienteRequest = {
  nombreUsuario: string;
  gmail: string;
  telefono?: string | null;
  password: string;
  direccion?: string | null;
  cedula: string;
  nombre: string;
  apellido: string;
  ciudad?: string | null;
  estado?: EstadoCliente;
  notas?: string | null;
};

export type ActualizarClienteRequest = {
  nombreUsuario: string;
  gmail: string;
  telefono?: string | null;
  direccion?: string | null;
  cedula: string;
  nombre: string;
  apellido: string;
  ciudad?: string | null;
  estado: EstadoCliente;
  notas?: string | null;
};

const obtenerIniciales = (
  nombre: string,
  apellido: string
): string =>
  `${nombre.trim().charAt(0)}${apellido.trim().charAt(0)}`.toUpperCase();

const transformarCliente = (
  cliente: ClienteApi
): ClienteEmpresa => ({
  id: cliente.id_Cliente,
  idUsuario: cliente.id_Usuario,
  cedula: cliente.cedula,
  nombreUsuario: cliente.nombreUsuario,

  iniciales: obtenerIniciales(
    cliente.nombre,
    cliente.apellido
  ),

  nombre: `${cliente.nombre} ${cliente.apellido}`.trim(),
  nombreReal: cliente.nombre,
  apellido: cliente.apellido,

  telefono: cliente.telefono ?? "",
  email: cliente.gmail,
  direccion: cliente.direccion ?? "",
  ciudad: cliente.ciudad ?? "",

  historial: "Sin cotizaciones",
  ultimaCotizacion: "Sin registros",

  estado: cliente.estado,
  notas: cliente.notas ?? "",
  historialCotizaciones: [],
});

const obtenerMensajeError = async (
  respuesta: Response,
  mensajePredeterminado: string
): Promise<string> => {
  try {
    const cuerpo: unknown = await respuesta.json();

    if (
      cuerpo &&
      typeof cuerpo === "object" &&
      "mensaje" in cuerpo &&
      typeof cuerpo.mensaje === "string"
    ) {
      return cuerpo.mensaje;
    }
  } catch {
    // La respuesta puede no contener JSON.
  }

  return mensajePredeterminado;
};

export const obtenerClientes = async (): Promise<
  ClienteEmpresa[]
> => {
  const respuesta = await fetch(API_URL);

  if (!respuesta.ok) {
    throw new Error(
      await obtenerMensajeError(
        respuesta,
        "No se pudieron obtener los clientes."
      )
    );
  }

  const clientes: ClienteApi[] = await respuesta.json();

  return clientes.map(transformarCliente);
};

export const crearCliente = async (
  datos: CrearClienteRequest
): Promise<ClienteEmpresa> => {
  const respuesta = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });

  if (!respuesta.ok) {
    throw new Error(
      await obtenerMensajeError(
        respuesta,
        "No se pudo agregar el cliente."
      )
    );
  }

  const cliente: ClienteApi = await respuesta.json();

  return transformarCliente(cliente);
};

export const actualizarCliente = async (
  idCliente: number,
  datos: ActualizarClienteRequest
): Promise<ClienteEmpresa> => {
  const respuesta = await fetch(`${API_URL}/${idCliente}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });

  if (!respuesta.ok) {
    throw new Error(
      await obtenerMensajeError(
        respuesta,
        "No se pudo actualizar el cliente."
      )
    );
  }

  const cliente: ClienteApi = await respuesta.json();

  return transformarCliente(cliente);
};

export const eliminarCliente = async (
  idCliente: number
): Promise<void> => {
  const respuesta = await fetch(`${API_URL}/${idCliente}`, {
    method: "DELETE",
  });

  if (!respuesta.ok) {
    throw new Error(
      await obtenerMensajeError(
        respuesta,
        "No se pudo eliminar el cliente."
      )
    );
  }
};

export const obtenerHistorialCotizacionesCliente = async (
  idCliente: number,
  idEmpresa: number
) => {
  const respuesta = await fetch(
    `${API_URL}/${idCliente}/cotizaciones/empresa/${idEmpresa}`
  );

  if (!respuesta.ok) {
    throw new Error(
      await obtenerMensajeError(
        respuesta,
        "No se pudo obtener el historial de cotizaciones."
      )
    );
  }

  const historial: HistorialCotizacionApi[] =
    await respuesta.json();

  return historial.map((cotizacion) => ({
    id: `COT-${String(cotizacion.idCotizacion).padStart(
      3,
      "0"
    )}`,

    fecha: new Date(
      cotizacion.fechaRealizada
    ).toLocaleDateString("es-UY"),

    total: Number(
      cotizacion.totalCotizacion
    ).toLocaleString("es-UY", {
      style: "currency",
      currency: "UYU",
      maximumFractionDigits: 0,
    }),
  }));
};