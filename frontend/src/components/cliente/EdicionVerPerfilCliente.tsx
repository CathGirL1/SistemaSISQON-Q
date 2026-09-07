import { useState } from "react";

import "../../styles/EdicionVerPerfilCliente.css";

interface Cliente {
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
  estado: string;
  notas: string | null;
}

interface EdicionPerfilClienteProps {
  cliente: Cliente;
  onGuardar: (clienteActualizado: Cliente) => Promise<void>;
  onCancelar: () => void;
}

export default function EdicionPerfilCliente({
  cliente,
  onGuardar,
  onCancelar,
}: EdicionPerfilClienteProps) {
  const [datos, setDatos] = useState<Cliente>(cliente);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const manejarCambio = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setDatos((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const manejarGuardar = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setGuardando(true);
    setError("");

    try {
      await onGuardar(datos);
    } catch (error) {
      console.error(
        "Error al guardar los cambios:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "No se pudieron guardar los cambios."
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form
      className="editar-perfil-card"
      onSubmit={manejarGuardar}
    >
      {/* =========================================
          ENCABEZADO
          ========================================= */}

      <div className="editar-perfil-header">
        <div className="editar-perfil-avatar">
          {datos.nombre.charAt(0)}
          {datos.apellido.charAt(0)}
        </div>

        <div className="editar-perfil-header-info">
          <span className="editar-perfil-label">
            CONFIGURACIÓN DE CUENTA
          </span>

          <h2>
            Editar información personal
          </h2>

          <p>
            Actualizá los datos asociados a tu cuenta.
          </p>
        </div>
      </div>

      {/* =========================================
          CONTENIDO
          ========================================= */}

      <div className="editar-perfil-content">

        {/* SUBTÍTULO */}

        <div className="editar-perfil-subtitle">
          <h3>
            Información personal
          </h3>

          <p>
            Modificá los datos que aparecen asociados a tu perfil.
          </p>
        </div>

        {/* GRID */}

        <div className="editar-perfil-grid">

          {/* NOMBRE */}

          <div className="form-group">
            <label htmlFor="nombre">
              Nombre
            </label>

            <input
              id="nombre"
              name="nombre"
              type="text"
              value={datos.nombre}
              onChange={manejarCambio}
              placeholder="Ingresá tu nombre"
              required
            />
          </div>

          {/* APELLIDO */}

          <div className="form-group">
            <label htmlFor="apellido">
              Apellido
            </label>

            <input
              id="apellido"
              name="apellido"
              type="text"
              value={datos.apellido}
              onChange={manejarCambio}
              placeholder="Ingresá tu apellido"
              required
            />
          </div>

          {/* CÉDULA */}

          <div className="form-group">
            <label htmlFor="cedula">
              Cédula
            </label>

            <input
              id="cedula"
              name="cedula"
              type="text"
              value={datos.cedula}
              onChange={manejarCambio}
              placeholder="Ingresá tu cédula"
              required
            />
          </div>

          {/* CORREO */}

          <div className="form-group">
            <label htmlFor="gmail">
              Correo electrónico
            </label>

            <input
              id="gmail"
              name="gmail"
              type="email"
              value={datos.gmail}
              onChange={manejarCambio}
              placeholder="Ingresá tu correo electrónico"
              required
            />
          </div>

          {/* TELÉFONO */}

          <div className="form-group">
            <label htmlFor="telefono">
              Teléfono
            </label>

            <input
              id="telefono"
              name="telefono"
              type="text"
              value={datos.telefono || ""}
              onChange={manejarCambio}
              placeholder="Ej. 099 123 456"
            />
          </div>

          {/* CIUDAD */}

          <div className="form-group">
            <label htmlFor="ciudad">
              Ciudad
            </label>

            <input
              id="ciudad"
              name="ciudad"
              type="text"
              value={datos.ciudad || ""}
              onChange={manejarCambio}
              placeholder="Ej. Maldonado"
            />
          </div>

          {/* DIRECCIÓN */}

          <div className="form-group form-group-full">
            <label htmlFor="direccion">
              Dirección
            </label>

            <input
              id="direccion"
              name="direccion"
              type="text"
              value={datos.direccion || ""}
              onChange={manejarCambio}
              placeholder="Ej. Calle 123"
            />
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mensaje-error">
            {error}
          </div>
        )}
      </div>

      {/* =========================================
          BOTONES
          ========================================= */}

      <div className="editar-perfil-actions">

        <button
          type="button"
          className="btn-cancelar"
          onClick={onCancelar}
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
            : "Guardar cambios"}
        </button>

      </div>
    </form>
  );
}