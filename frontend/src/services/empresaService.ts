import type { Empresa } from "../types/Empresa";

const API_URL = "http://localhost:3000/api/empresa";

interface EmpresaApi {
  idEmpresa: number;

  razonSocial: string;
  nombreComercial: string;

  rut: string;
  rubro: string;

  email: string;
  telefono: string;

  direccion: string;
  paginaWeb: string;

  descripcion: string;

  logo: string | null;

  fechaRegistro: string | null;
}

interface ErrorApi {
  mensaje?: string;
  message?: string;
}

async function obtenerMensajeError(
  respuesta: Response
): Promise<string> {
  try {
    const error = (await respuesta.json()) as ErrorApi;

    return (
      error.mensaje ||
      error.message ||
      "Ocurrió un error al comunicarse con el servidor."
    );
  } catch {
    return "Ocurrió un error al comunicarse con el servidor.";
  }
}

function validarIdUsuario(idUsuario: number): void {
  if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
    throw new Error("Usuario inválido.");
  }
}

function validarIdEmpresa(idEmpresa: number): void {
  if (!Number.isInteger(idEmpresa) || idEmpresa <= 0) {
    throw new Error("Empresa inválida.");
  }
}

function formatearFecha(fecha: string | null): string {
  if (!fecha) {
    return "";
  }

  const fechaConvertida = new Date(fecha);

  if (Number.isNaN(fechaConvertida.getTime())) {
    return "";
  }

  return fechaConvertida.toLocaleDateString("es-UY");
}

function convertirEmpresa(api: EmpresaApi): Empresa {
  const logo =
    api.logo && api.logo.startsWith("/")
      ? `http://localhost:3000${api.logo}`
      : api.logo ?? "";

  return {
    idEmpresa: api.idEmpresa,

    razonSocial: api.razonSocial ?? "",
    nombreComercial:
      api.nombreComercial ?? "",

    rut: api.rut ?? "",
    rubro: api.rubro ?? "",

    email: api.email ?? "",
    telefono: api.telefono ?? "",

    direccion: api.direccion ?? "",
    paginaWeb: api.paginaWeb ?? "",

    descripcion: api.descripcion ?? "",

    logo,

    fechaRegistro: formatearFecha(
      api.fechaRegistro
    ),
  };
}

export async function obtenerEmpresaPorUsuario(
  idUsuario: number
): Promise<Empresa> {
  validarIdUsuario(idUsuario);

  const respuesta = await fetch(
    `${API_URL}/usuario/${idUsuario}`
  );

  if (!respuesta.ok) {
    throw new Error(
      await obtenerMensajeError(respuesta)
    );
  }

  const empresaApi =
    (await respuesta.json()) as EmpresaApi;

  return convertirEmpresa(empresaApi);
}

export async function actualizarEmpresa(
  empresa: Empresa
): Promise<Empresa> {

  validarIdEmpresa(empresa.idEmpresa!);

  const respuesta = await fetch(
    `${API_URL}/${empresa.idEmpresa}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({

        razonSocial: empresa.razonSocial,
        nombreComercial: empresa.nombreComercial,

        rut: empresa.rut,
        rubro: empresa.rubro,

        email: empresa.email,
        telefono: empresa.telefono,

        direccion: empresa.direccion,
        paginaWeb: empresa.paginaWeb,

        descripcion: empresa.descripcion,

        logo: empresa.logo,
      }),
    }
  );

  if (!respuesta.ok) {
    throw new Error(
      await obtenerMensajeError(respuesta)
    );
  }

  const empresaApi =
    (await respuesta.json()) as EmpresaApi;

  return convertirEmpresa(empresaApi);
}

export async function subirLogoEmpresa(
  idEmpresa: number,
  archivo: File
): Promise<Empresa> {
  validarIdEmpresa(idEmpresa);

  const formulario = new FormData();

  formulario.append("logo", archivo);

  const respuesta = await fetch(
    `${API_URL}/${idEmpresa}/logo`,
    {
      method: "POST",
      body: formulario,
    }
  );

  if (!respuesta.ok) {
    throw new Error(
      await obtenerMensajeError(respuesta)
    );
  }

  const empresaApi =
    (await respuesta.json()) as EmpresaApi;

  return convertirEmpresa(empresaApi);
}