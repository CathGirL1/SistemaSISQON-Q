import "../../../styles/empresa/miPerfil/CuentaUsuario.css";

import type { ChangeEvent, FormEvent } from "react";
import type { Usuario } from "../../../types/Usuario";

interface Props {
  usuario: Usuario;

  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;

  handleCancelar: () => void;

  handleSubmit: (
    e: FormEvent<HTMLFormElement>
  ) => Promise<void>;
}

export default function CuentaUsuario({
  usuario,
  handleChange,
  handleCancelar,
  handleSubmit,
}: Props) {
  return (
    <div className="perfil-panel">
      <div className="perfil-panel-header">
        <h2>Información de la cuenta</h2>

        <p>
          Administrá la información personal asociada a tu cuenta de acceso.
        </p>
      </div>

      <form
        className="perfil-form"
        onSubmit={handleSubmit}
      >
        <div className="form-group">
          <label>Nombre de usuario</label>

          <input
            name="nombreUsuario"
            value={usuario.nombreUsuario}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Correo electrónico</label>

          <input
            type="email"
            name="gmail"
            value={usuario.gmail}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Nombre</label>

          <input
            name="nombre"
            value={usuario.nombre}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Apellido</label>

          <input
            name="apellido"
            value={usuario.apellido}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Teléfono</label>

          <input
            name="telefono"
            value={usuario.telefono}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Cargo</label>

          <input
            name="cargo"
            value={usuario.cargo}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Departamento</label>

          <input
            name="departamento"
            value={usuario.departamento}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Ciudad</label>

          <input
            name="ciudad"
            value={usuario.ciudad}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>País</label>

          <input
            name="pais"
            value={usuario.pais}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Fecha de registro</label>

          <input
            value={usuario.fechaRegistro}
            disabled
          />
        </div>

        <div className="form-group">
          <label>Último acceso</label>

          <input
            value={usuario.ultimoAcceso}
            disabled
          />
        </div>

        <div className="perfil-form-actions">
          <button
            type="button"
            className="btn-cancelar"
            onClick={handleCancelar}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="btn-guardar"
          >
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
}