import type { EmpresaCliente } from "../interfaces/EmpresaCliente";
import type { Empresa } from "../types/Empresa";

const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/empresa`
  : "http://localhost:3000/api/empresa";

/* =========================================================
   RESPUESTA DEL BACKEND
========================================================= */

interface EmpresaApi {
  idEmpresa: number;
  razonSocial: string | null;
  nombreComercial: string | null;
  rut: string | null;
  rubro: string | null;
  email: string | null;
  telefono: string | null;
  direccion: string | null;
  paginaWeb: string | null;
  descripcion: string | null;
  logo: string | null;

  zonasTrabajo: string | null;
  condicionesComerciales: string | null;
  textoLegal: string | null;
  impuestos: string | null;
  validezCotizacion: number | null;
  diasLaborables: string | null;
  horarioInicio: string | null;
  horarioFin: string | null;
  idiomaDocumentos: string | null;

  fechaRegistro: string | null;
}

/* =========================================================
   ERRORES DEL BACKEND
========================================================= */

interface ErrorApi {
  mensaje?: string;
  message?: string;
}

/* =========================================================
   MANEJO DE ERRORES
========================================================= */

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

/* =========================================================
   VALIDACIONES
========================================================= */

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

/* =========================================================
   FORMATEAR FECHA
========================================================= */

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

/* =========================================================
   CONVERTIR EMPRESA DEL BACKEND
   EmpresaApi → EmpresaCliente
========================================================= */

function convertirEmpresa(
  api: EmpresaApi
): EmpresaCliente {
  const logo =
    api.logo && api.logo.startsWith("/")
      ? `http://localhost:3000${api.logo}`
      : api.logo ?? "";

  return {
    idEmpresa: api.idEmpresa,

    /*
      EmpresaCliente utiliza nombreEmpresa para
      mostrar el nombre principal de la empresa.
    */
    nombreEmpresa:
      api.nombreComercial ||
      api.razonSocial ||
      "Empresa",

    razonSocial: api.razonSocial ?? "",
    nombreComercial: api.nombreComercial ?? "",

    rut: api.rut ?? "",
    rubro: api.rubro ?? "",
    descripcion: api.descripcion ?? "",

    telefono: api.telefono ?? "",
    email: api.email ?? "",
    direccion: api.direccion ?? "",
    paginaWeb: api.paginaWeb ?? "",

    logo,

    fechaRegistro: formatearFecha(
      api.fechaRegistro
    ),

    /*
      Información adicional del perfil
    */
    zonasTrabajo: api.zonasTrabajo ?? "",

    condicionesComerciales:
      api.condicionesComerciales ?? "",

    textoLegal: api.textoLegal ?? "",

    impuestos: api.impuestos ?? "",

    validezCotizacion:
      api.validezCotizacion ?? 30,

    diasLaborables:
      api.diasLaborables ?? "",

    horarioInicio:
      api.horarioInicio ?? "",

    horarioFin:
      api.horarioFin ?? "",

    idiomaDocumentos:
      api.idiomaDocumentos ?? "",
  };
}

/* =========================================================
   OBTENER EMPRESA POR USUARIO
   Usado principalmente por el panel de empresa
========================================================= */

export async function obtenerEmpresaPorUsuario(
  idUsuario: number
): Promise<EmpresaCliente> {
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

/* =========================================================
   OBTENER EMPRESA POR ID
   Usado por EmpresaDetalle
========================================================= */

export async function obtenerEmpresaPorId(
  idEmpresa: number
): Promise<EmpresaCliente> {
  validarIdEmpresa(idEmpresa);

  const respuesta = await fetch(
    `${API_URL}/${idEmpresa}`
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

/* =========================================================
   ACTUALIZAR EMPRESA
========================================================= */

export async function actualizarEmpresa(
  empresa: Empresa
): Promise<EmpresaCliente> {

  if (empresa.idEmpresa === undefined) {
    throw new Error("La empresa no tiene un ID válido.");
  }
  validarIdEmpresa(empresa.idEmpresa);

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

        zonasTrabajo:
          empresa.zonasTrabajo,

        condicionesComerciales:
          empresa.condicionesComerciales,

        textoLegal:
          empresa.textoLegal,

        impuestos:
          empresa.impuestos,

        validezCotizacion:
          empresa.validezCotizacion,

        diasLaborables:
          empresa.diasLaborables,

        horarioInicio:
          empresa.horarioInicio,

        horarioFin:
          empresa.horarioFin,

        idiomaDocumentos:
          empresa.idiomaDocumentos,
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

/* =========================================================
   SUBIR LOGO
========================================================= */

export async function subirLogoEmpresa(
  idEmpresa: number,
  archivo: File
): Promise<EmpresaCliente> {
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