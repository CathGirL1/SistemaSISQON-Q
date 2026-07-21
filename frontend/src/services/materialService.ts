import type {
  DisponibilidadMaterial,
  EstadoMaterial,
  MaterialEmpresa,
} from "../interfaces/MaterialEmpresa";

const API_URL = "http://localhost:3000/api/materiales";

export type MaterialApi = {
  id_Material: number;
  nombre: string;
  descripcion: string | null;
  stock: number;
  costoUnitario: number;
  categoria: string | null;
  unidad: string | null;
  ultimaActualizacion: string;
  disponibilidad: DisponibilidadMaterial;
  estado: EstadoMaterial;
};

export type GuardarMaterialRequest = {
  nombre: string;
  descripcion?: string | null;
  stock: number;
  costoUnitario: number;
  categoria?: string | null;
  unidad?: string | null;
  estado?: EstadoMaterial;
};

export type CrearMaterialRequest = GuardarMaterialRequest;
export type ActualizarMaterialRequest = GuardarMaterialRequest;

const formatearPrecio = (precio: number): string => {
  return new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: "UYU",
    maximumFractionDigits: 0,
  }).format(precio);
};

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

const transformarMaterial = (
  material: MaterialApi
): MaterialEmpresa => {
  const unidad = material.unidad ?? "Unidad";

  return {
    id: String(material.id_Material),
    nombre: material.nombre,
    descripcion: material.descripcion ?? "",

    categoria: material.categoria ?? "Sin categoría",
    unidad,

    costoUnitario: Number(material.costoUnitario),
    stockCantidad: Number(material.stock),

    precioActual: formatearPrecio(
      Number(material.costoUnitario)
    ),
    precioDetalle: `por ${unidad.toLowerCase()}`,
    ultimaActualizacion: formatearFecha(
      material.ultimaActualizacion
    ),

    disponibilidad: material.disponibilidad,
    stock: `${material.stock} ${unidad}`,
    estado: material.estado,
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
    // La respuesta puede venir sin JSON.
  }

  return mensajePredeterminado;
};

export const obtenerMateriales = async (): Promise<
  MaterialEmpresa[]
> => {
  const respuesta = await fetch(API_URL);

  if (!respuesta.ok) {
    throw new Error(
      await obtenerMensajeError(
        respuesta,
        "No se pudieron obtener los materiales."
      )
    );
  }

  const materialesApi: MaterialApi[] =
    await respuesta.json();

  return materialesApi.map(transformarMaterial);
};

export const crearMaterial = async (
  datos: CrearMaterialRequest
): Promise<MaterialEmpresa> => {
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
        "No se pudo agregar el material."
      )
    );
  }

  const materialCreado: MaterialApi =
    await respuesta.json();

  return transformarMaterial(materialCreado);
};

export const actualizarMaterial = async (
  idMaterial: string,
  datos: ActualizarMaterialRequest
): Promise<MaterialEmpresa> => {
  const respuesta = await fetch(
    `${API_URL}/${idMaterial}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    }
  );

  if (!respuesta.ok) {
    throw new Error(
      await obtenerMensajeError(
        respuesta,
        "No se pudo actualizar el material."
      )
    );
  }

  const materialActualizado: MaterialApi =
    await respuesta.json();

  return transformarMaterial(materialActualizado);
};

export const eliminarMaterial = async (
  idMaterial: string
): Promise<void> => {
  const respuesta = await fetch(
    `${API_URL}/${idMaterial}`,
    {
      method: "DELETE",
    }
  );

  if (!respuesta.ok) {
    throw new Error(
      await obtenerMensajeError(
        respuesta,
        "No se pudo eliminar el material."
      )
    );
  }
};