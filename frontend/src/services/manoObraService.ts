import type {
  EstadoManoObra,
  ManoObraEmpresa,
} from "../interfaces/ManoObraEmpresa";

const API_URL = "http://localhost:3000/api/mano-obra";

export type ManoObraApi = {
  id_ManoObra: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  categoria: string | null;
  unidad: string | null;
  costoUnitario: number;
  observaciones: string | null;
  ultimaActualizacion: string;
  estado: EstadoManoObra;
};

export type GuardarManoObraRequest = {
  nombre: string;
  descripcion?: string | null;
  categoria?: string | null;
  unidad?: string | null;
  costoUnitario: number;
  observaciones?: string | null;
  estado?: EstadoManoObra;
};

export type CrearManoObraRequest = GuardarManoObraRequest;
export type ActualizarManoObraRequest =
  GuardarManoObraRequest;

const formatearFecha = (fecha: string): string => {
  const fechaConvertida = new Date(fecha);

  if (Number.isNaN(fechaConvertida.getTime())) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-UY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(fechaConvertida);
};

const transformarManoObra = (
  trabajo: ManoObraApi
): ManoObraEmpresa => {
  return {
    id: String(trabajo.id_ManoObra),
    codigo: trabajo.codigo,

    nombre: trabajo.nombre,
    descripcion: trabajo.descripcion ?? "",

    categoria: trabajo.categoria ?? "Sin categoría",
    unidad: trabajo.unidad ?? "",

    costoUnitario: Number(trabajo.costoUnitario),

    observaciones: trabajo.observaciones ?? "",

    ultimaActualizacion: formatearFecha(
      trabajo.ultimaActualizacion
    ),

    estado: trabajo.estado,
  };
};

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
    // Puede venir sin JSON.
  }

  return mensajePredeterminado;
};

export const obtenerManoObra = async (): Promise<
  ManoObraEmpresa[]
> => {
  const respuesta = await fetch(API_URL);

  if (!respuesta.ok) {
    throw new Error(
      await obtenerMensajeError(
        respuesta,
        "No se pudo obtener la mano de obra."
      )
    );
  }

  const trabajosApi: ManoObraApi[] =
    await respuesta.json();

  return trabajosApi.map(transformarManoObra);
};

export const crearManoObra = async (
  datos: CrearManoObraRequest
): Promise<ManoObraEmpresa> => {
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
        "No se pudo crear la mano de obra."
      )
    );
  }

  const trabajoCreado: ManoObraApi =
    await respuesta.json();

  return transformarManoObra(trabajoCreado);
};

export const actualizarManoObra = async (
  id: string,
  datos: ActualizarManoObraRequest
): Promise<ManoObraEmpresa> => {
  const respuesta = await fetch(`${API_URL}/${id}`, {
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
        "No se pudo actualizar la mano de obra."
      )
    );
  }

  const trabajoActualizado: ManoObraApi =
    await respuesta.json();

  return transformarManoObra(trabajoActualizado);
};

export const eliminarManoObra = async (
  id: string
): Promise<void> => {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!respuesta.ok) {
    throw new Error(
      await obtenerMensajeError(
        respuesta,
        "No se pudo eliminar la mano de obra."
      )
    );
  }
};