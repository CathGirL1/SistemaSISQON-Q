import "../../../styles/empresa/clientes/ClientesModales.css";

import { useEffect, useState } from "react";

import ModalBase from "../../common/ModalBase";

import type {
  ClienteEmpresa,
  EstadoCliente,
} from "../../../interfaces/ClienteEmpresa";

import type {
  ActualizarClienteRequest,
  CrearClienteRequest,
} from "../../../services/clienteService";

type DatosCliente =
  | CrearClienteRequest
  | ActualizarClienteRequest;

type Props = {
  abierto: boolean;
  modo: "crear" | "editar";
  cliente: ClienteEmpresa | null;
  onCerrar: () => void;
  onGuardar: (
    datos: DatosCliente
  ) => Promise<void> | void;
};

type FormularioCliente = {
  nombre: string;
  apellido: string;
  cedula: string;
  nombreUsuario: string;
  email: string;
  telefono: string;
  password: string;
  direccion: string;
  ciudad: string;
  estado: EstadoCliente;
  notas: string;
};

const formularioInicial: FormularioCliente = {
  nombre: "",
  apellido: "",
  cedula: "",
  nombreUsuario: "",
  email: "",
  telefono: "",
  password: "",
  direccion: "",
  ciudad: "",
  estado: "Nuevo",
  notas: "",
};

export default function ClienteModal({
  abierto,
  modo,
  cliente,
  onCerrar,
  onGuardar,
}: Props) {
  const [formulario, setFormulario] =
    useState<FormularioCliente>(formularioInicial);

  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!abierto) return;

    if (modo === "editar" && cliente) {
      setFormulario({
        nombre: cliente.nombreReal,
        apellido: cliente.apellido,
        cedula: cliente.cedula,
        nombreUsuario: cliente.nombreUsuario,
        email: cliente.email,
        telefono: cliente.telefono,
        password: "",
        direccion: cliente.direccion,
        ciudad: cliente.ciudad,
        estado: cliente.estado,
        notas: cliente.notas,
      });
    } else {
      setFormulario(formularioInicial);
    }

    setError("");
    setGuardando(false);
  }, [abierto, modo, cliente]);

  const actualizarCampo = (
    campo: keyof FormularioCliente,
    valor: string
  ) => {
    setFormulario((actual) => ({
      ...actual,
      [campo]: valor,
    }));
  };

  const guardar = async () => {
    setError("");

    if (
      !formulario.nombre.trim() ||
      !formulario.apellido.trim()
    ) {
      setError("El nombre y el apellido son obligatorios.");
      return;
    }

    if (!formulario.cedula.trim()) {
      setError("La cédula es obligatoria.");
      return;
    }

    if (!formulario.nombreUsuario.trim()) {
      setError("El nombre de usuario es obligatorio.");
      return;
    }

    if (!formulario.email.trim()) {
      setError("El correo es obligatorio.");
      return;
    }

    if (
      modo === "crear" &&
      !formulario.password.trim()
    ) {
      setError("La contraseña es obligatoria.");
      return;
    }

    const datosBase: ActualizarClienteRequest = {
      nombreUsuario: formulario.nombreUsuario.trim(),
      gmail: formulario.email.trim(),
      telefono: formulario.telefono.trim() || null,
      direccion: formulario.direccion.trim() || null,
      cedula: formulario.cedula.trim(),
      nombre: formulario.nombre.trim(),
      apellido: formulario.apellido.trim(),
      ciudad: formulario.ciudad.trim() || null,
      estado: formulario.estado,
      notas: formulario.notas.trim() || null,
    };

    const datos: DatosCliente =
      modo === "crear"
        ? {
            ...datosBase,
            password: formulario.password,
          }
        : datosBase;

    try {
      setGuardando(true);
      await onGuardar(datos);
    } catch (errorDesconocido) {
      setError(
        errorDesconocido instanceof Error
          ? errorDesconocido.message
          : "No se pudo guardar el cliente."
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <ModalBase
      abierto={abierto}
      titulo={
        modo === "crear"
          ? "Agregar cliente"
          : `Editar cliente - ${cliente?.nombre ?? ""}`
      }
      onCerrar={onCerrar}
    >
      <form
        className="cliente-modal-form"
        onSubmit={(evento) => {
          evento.preventDefault();
          guardar();
        }}
      >
        <div>
          <label>Nombre</label>
          <input
            value={formulario.nombre}
            onChange={(evento) =>
              actualizarCampo("nombre", evento.target.value)
            }
          />
        </div>

        <div>
          <label>Apellido</label>
          <input
            value={formulario.apellido}
            onChange={(evento) =>
              actualizarCampo("apellido", evento.target.value)
            }
          />
        </div>

        <div>
          <label>Cédula</label>
          <input
            value={formulario.cedula}
            onChange={(evento) =>
              actualizarCampo("cedula", evento.target.value)
            }
          />
        </div>

        <div>
          <label>Nombre de usuario</label>
          <input
            value={formulario.nombreUsuario}
            onChange={(evento) =>
              actualizarCampo(
                "nombreUsuario",
                evento.target.value
              )
            }
          />
        </div>

        <div>
          <label>Teléfono</label>
          <input
            value={formulario.telefono}
            onChange={(evento) =>
              actualizarCampo(
                "telefono",
                evento.target.value
              )
            }
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            value={formulario.email}
            onChange={(evento) =>
              actualizarCampo("email", evento.target.value)
            }
          />
        </div>

        {modo === "crear" && (
          <div className="full">
            <label>Contraseña temporal</label>
            <input
              type="password"
              value={formulario.password}
              onChange={(evento) =>
                actualizarCampo(
                  "password",
                  evento.target.value
                )
              }
            />
          </div>
        )}

        <div className="full">
          <label>Dirección</label>
          <input
            value={formulario.direccion}
            onChange={(evento) =>
              actualizarCampo(
                "direccion",
                evento.target.value
              )
            }
          />
        </div>

        <div>
          <label>Ciudad</label>
          <input
            value={formulario.ciudad}
            onChange={(evento) =>
              actualizarCampo("ciudad", evento.target.value)
            }
          />
        </div>

        <div>
          <label>Estado</label>
          <select
            value={formulario.estado}
            onChange={(evento) =>
              actualizarCampo(
                "estado",
                evento.target.value
              )
            }
          >
            <option value="Nuevo">Nuevo</option>
            <option value="Interesado">Interesado</option>
            <option value="Contactado">Contactado</option>
            <option value="Cliente confirmado">
              Cliente confirmado
            </option>
          </select>
        </div>

        <div className="full">
          <label>Notas</label>
          <textarea
            value={formulario.notas}
            onChange={(evento) =>
              actualizarCampo("notas", evento.target.value)
            }
          />
        </div>

        {error && (
          <p className="cliente-form-error">{error}</p>
        )}

        <div className="cliente-modal-actions">
          <button
            type="button"
            className="btn-cancelar"
            onClick={onCerrar}
            disabled={guardando}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="btn-guardar"
            disabled={guardando}
          >
            {guardando
              ? "Guardando..."
              : modo === "crear"
                ? "Agregar cliente"
                : "Guardar cambios"}
          </button>
        </div>
      </form>
    </ModalBase>
  );
}