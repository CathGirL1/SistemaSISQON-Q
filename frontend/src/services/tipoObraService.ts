import type { TipoObraEmpresa } from "../interfaces/TipoObraEmpresa";

export type DificultadTipoObra =
  | "Baja"
  | "Media"
  | "Alta";

export type EstadoTipoObra =
  | "Activo"
  | "Inactivo";

type TipoObraApi = {
  idTipoObra: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;

  materialesAsociados: number;

  tiempoMinDias: number | null;
  tiempoMaxDias: number | null;

  dificultad: DificultadTipoObra;
  estado: EstadoTipoObra;

  formulaCalculo: string | null;
  manoObra: string | null;
  extras: string | null;
  observaciones: string | null;

  fechaCreacion: string;
  fechaActualizacion: string;
};

type GuardarTipoObraApi = {
  nombre: string;
  descripcion: string | null;

  tiempoMinDias: number | null;
  tiempoMaxDias: number | null;

  dificultad: DificultadTipoObra;
  estado: EstadoTipoObra;

  formulaCalculo: string | null;
  manoObra: string | null;
  extras: string | null;
  observaciones: string | null;
};

const API_URL =
  import.meta.env.VITE_API_URL ??
  "http://localhost:3000/api";

const obtenerMensajeError = async (
  response: Response
): Promise<string> => {
  try {
    const datos = await response.json();

    return (
      datos.mensaje ??
      datos.message ??
      "Ocurrió un error al procesar la solicitud."
    );
  } catch {
    return "Ocurrió un error al procesar la solicitud.";
  }
};

const formarTiempoAproximado = (
  tiempoMinDias: number | null,
  tiempoMaxDias: number | null
): string => {
  if (
    tiempoMinDias === null &&
    tiempoMaxDias === null
  ) {
    return "Sin definir";
  }

  if (
    tiempoMinDias !== null &&
    tiempoMaxDias !== null
  ) {
    if (tiempoMinDias === tiempoMaxDias) {
      return `${tiempoMinDias} días`;
    }

    return `${tiempoMinDias} a ${tiempoMaxDias} días`;
  }

  if (tiempoMinDias !== null) {
    return `Desde ${tiempoMinDias} días`;
  }

  return `Hasta ${tiempoMaxDias} días`;
};

const parsearTiempoAproximado = (
  tiempoAproximado: string
): {
  tiempoMinDias: number | null;
  tiempoMaxDias: number | null;
} => {
  const texto = tiempoAproximado.trim();

  if (
    !texto ||
    texto.toLowerCase() === "sin definir"
  ) {
    return {
      tiempoMinDias: null,
      tiempoMaxDias: null,
    };
  }

  const numeros = texto.match(/\d+/g)?.map(Number) ?? [];

  if (numeros.length >= 2) {
    return {
      tiempoMinDias: numeros[0],
      tiempoMaxDias: numeros[1],
    };
  }

  if (numeros.length === 1) {
    return {
      tiempoMinDias: numeros[0],
      tiempoMaxDias: numeros[0],
    };
  }

  return {
    tiempoMinDias: null,
    tiempoMaxDias: null,
  };
};

const mapearDesdeApi = (
  tipoObra: TipoObraApi
): TipoObraEmpresa => {
  return {
    id: tipoObra.idTipoObra,
    codigo: tipoObra.codigo,
    nombre: tipoObra.nombre,
    descripcion: tipoObra.descripcion ?? "",
    materialesAsociados:
      tipoObra.materialesAsociados,
    tiempoAproximado: formarTiempoAproximado(
      tipoObra.tiempoMinDias,
      tipoObra.tiempoMaxDias
    ),
    dificultad: tipoObra.dificultad,
    estado: tipoObra.estado,
    formulaCalculo:
      tipoObra.formulaCalculo ?? "",
    manoObra: tipoObra.manoObra ?? "",
    extras: tipoObra.extras ?? "",
    observaciones:
      tipoObra.observaciones ?? "",
  };
};

const mapearParaApi = (
  tipoObra: TipoObraEmpresa
): GuardarTipoObraApi => {
  const {
    tiempoMinDias,
    tiempoMaxDias,
  } = parsearTiempoAproximado(
    tipoObra.tiempoAproximado
  );

  return {
    nombre: tipoObra.nombre.trim(),
    descripcion:
      tipoObra.descripcion.trim() || null,

    tiempoMinDias,
    tiempoMaxDias,

    dificultad:
      tipoObra.dificultad as DificultadTipoObra,

    estado:
      tipoObra.estado as EstadoTipoObra,

    formulaCalculo:
      tipoObra.formulaCalculo.trim() || null,

    manoObra:
      tipoObra.manoObra.trim() || null,

    extras:
      tipoObra.extras.trim() || null,

    observaciones:
      tipoObra.observaciones.trim() || null,
  };
};

export const obtenerTiposObra =
  async (): Promise<TipoObraEmpresa[]> => {
    const response = await fetch(
      `${API_URL}/tipos-obra`
    );

    if (!response.ok) {
      throw new Error(
        await obtenerMensajeError(response)
      );
    }

    const datos: TipoObraApi[] =
      await response.json();

    return datos.map(mapearDesdeApi);
  };

export const obtenerTipoObraPorId = async (
  idTipoObra: number
): Promise<TipoObraEmpresa> => {
  const response = await fetch(
    `${API_URL}/tipos-obra/${idTipoObra}`
  );

  if (!response.ok) {
    throw new Error(
      await obtenerMensajeError(response)
    );
  }

  const datos: TipoObraApi =
    await response.json();

  return mapearDesdeApi(datos);
};

export const crearTipoObra = async (
  tipoObra: TipoObraEmpresa
): Promise<TipoObraEmpresa> => {
  const response = await fetch(
    `${API_URL}/tipos-obra`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        mapearParaApi(tipoObra)
      ),
    }
  );

  if (!response.ok) {
    throw new Error(
      await obtenerMensajeError(response)
    );
  }

  const datos: TipoObraApi =
    await response.json();

  return mapearDesdeApi(datos);
};

export const actualizarTipoObra = async (
  idTipoObra: number,
  tipoObra: TipoObraEmpresa
): Promise<TipoObraEmpresa> => {
  const response = await fetch(
    `${API_URL}/tipos-obra/${idTipoObra}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        mapearParaApi(tipoObra)
      ),
    }
  );

  if (!response.ok) {
    throw new Error(
      await obtenerMensajeError(response)
    );
  }

  const datos: TipoObraApi =
    await response.json();

  return mapearDesdeApi(datos);
};

export const eliminarTipoObra = async (
  idTipoObra: number
): Promise<void> => {
  const response = await fetch(
    `${API_URL}/tipos-obra/${idTipoObra}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(
      await obtenerMensajeError(response)
    );
  }
};