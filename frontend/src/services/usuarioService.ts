import type { Usuario } from "../types/Usuario";

const API_URL = "http://localhost:3000/api/usuario";

interface PerfilUsuarioApi {
  idUsuario: number;
  nombreUsuario: string;
  gmail: string;
  telefono: string;
  direccion: string;
  rol: string;

  nombre: string;
  apellido: string;
  ciudad: string;
  pais: string;
  cargo: string;
  departamento: string;
  zonaTrabajo: string;

  idioma: string;
  moneda: string;
  zonaHoraria: string;
  fotoPerfil: string | null;

  fechaRegistro: string | null;
  ultimoAcceso: string | null;
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
      "Ocurrió un error al comunicarse con el servidor"
    );
  } catch {
    return "Ocurrió un error al comunicarse con el servidor";
  }
}

function validarIdUsuario(idUsuario: number): void {
  if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
    throw new Error(
      "No se pudo identificar al usuario autenticado"
    );
  }
}

function formatearFecha(
  fecha: string | null,
  incluirHora = false
): string {
  if (!fecha) {
    return "";
  }

  const fechaConvertida = new Date(fecha);

  if (Number.isNaN(fechaConvertida.getTime())) {
    return fecha;
  }

  if (incluirHora) {
    return fechaConvertida.toLocaleString("es-UY", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return fechaConvertida.toLocaleDateString("es-UY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function convertirAUsuario(
  usuarioApi: PerfilUsuarioApi
): Usuario {
  return {
    idUsuario: usuarioApi.idUsuario,

    nombreUsuario: usuarioApi.nombreUsuario || "",

    nombre: usuarioApi.nombre || "",
    apellido: usuarioApi.apellido || "",

    gmail: usuarioApi.gmail || "",
    telefono: usuarioApi.telefono || "",

    cargo: usuarioApi.cargo || "",
    departamento: usuarioApi.departamento || "",

    ciudad: usuarioApi.ciudad || "",
    pais: usuarioApi.pais || "",

    fechaRegistro: formatearFecha(
      usuarioApi.fechaRegistro
    ),

    ultimoAcceso: formatearFecha(
      usuarioApi.ultimoAcceso,
      true
    ),
  };
}

async function obtenerPerfilApi(
  idUsuario: number
): Promise<PerfilUsuarioApi> {
  validarIdUsuario(idUsuario);

  const respuesta = await fetch(
    `${API_URL}/${idUsuario}`
  );

  if (!respuesta.ok) {
    const mensaje = await obtenerMensajeError(respuesta);
    throw new Error(mensaje);
  }

  return (await respuesta.json()) as PerfilUsuarioApi;
}

export async function obtenerUsuarioPorId(
  idUsuario: number
): Promise<Usuario> {
  const usuarioApi = await obtenerPerfilApi(idUsuario);

  return convertirAUsuario(usuarioApi);
}

export async function actualizarUsuario(
  idUsuario: number,
  usuario: Usuario
): Promise<Usuario> {
  validarIdUsuario(idUsuario);

  /*
   * Primero recuperamos el perfil completo.
   * Esto permite conservar campos que existen en la BDD,
   * pero que todavía no aparecen en el formulario.
   */
  const perfilActual = await obtenerPerfilApi(idUsuario);

  const respuesta = await fetch(
    `${API_URL}/${idUsuario}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        nombreUsuario: usuario.nombreUsuario,
        gmail: usuario.gmail,
        telefono: usuario.telefono,

        nombre: usuario.nombre,
        apellido: usuario.apellido,
        ciudad: usuario.ciudad,
        pais: usuario.pais,
        cargo: usuario.cargo,
        departamento: usuario.departamento,

        /*
         * Estos campos no están actualmente en la interfaz
         * del formulario, por eso se conservan con sus
         * valores existentes.
         */
        direccion: perfilActual.direccion,
        zonaTrabajo: perfilActual.zonaTrabajo,
        idioma: perfilActual.idioma,
        moneda: perfilActual.moneda,
        zonaHoraria: perfilActual.zonaHoraria,
        fotoPerfil: perfilActual.fotoPerfil,
      }),
    }
  );

  if (!respuesta.ok) {
    const mensaje = await obtenerMensajeError(respuesta);
    throw new Error(mensaje);
  }

  const usuarioActualizado =
    (await respuesta.json()) as PerfilUsuarioApi;

  return convertirAUsuario(usuarioActualizado);
}