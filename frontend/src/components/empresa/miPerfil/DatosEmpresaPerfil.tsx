import "../../../styles/empresa/miPerfil/DatosEmpresaPerfil.css";

import type { ChangeEvent, FormEvent } from "react";
import type { Empresa } from "../../../types/Empresa";

interface Props {
  empresa: Empresa;

  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;

  handleCancelar: () => void;

  handleSubmit: (
    e: FormEvent<HTMLFormElement>
  ) => Promise<void>;
}

export default function DatosEmpresaPerfil({
  empresa,
  handleChange,
  handleCancelar,
  handleSubmit,
}: Props) {
  return (
    <div className="perfil-panel">
      <div className="perfil-panel-header">
        <h2>Datos de la empresa</h2>

        <p>
          Administrá la información principal de tu empresa utilizada dentro del
          sistema.
        </p>
      </div>

      <form
        className="perfil-form"
        onSubmit={handleSubmit}
      >
        <div className="form-group">
          <label>Razón social</label>

          <input
            type="text"
            name="razonSocial"
            value={empresa.razonSocial}
            onChange={handleChange}
            placeholder="Razón social"
          />
        </div>

        <div className="form-group">
          <label>Nombre comercial</label>

          <input
            type="text"
            name="nombreComercial"
            value={empresa.nombreComercial}
            onChange={handleChange}
            placeholder="Nombre comercial"
          />
        </div>

        <div className="form-group">
          <label>RUT</label>

          <input
            type="text"
            name="rut"
            value={empresa.rut}
            onChange={handleChange}
            placeholder="RUT"
          />
        </div>

        <div className="form-group">
          <label>Rubro</label>

          <input
            type="text"
            name="rubro"
            value={empresa.rubro}
            onChange={handleChange}
            placeholder="Rubro"
          />
        </div>

        <div className="form-group">
          <label>Correo electrónico</label>

          <input
            type="email"
            name="email"
            value={empresa.email}
            onChange={handleChange}
            placeholder="Correo electrónico"
          />
        </div>

        <div className="form-group">
          <label>Teléfono</label>

          <input
            type="text"
            name="telefono"
            value={empresa.telefono}
            onChange={handleChange}
            placeholder="Teléfono"
          />
        </div>

        <div className="form-group full">
          <label>Dirección</label>

          <textarea
            name="direccion"
            value={empresa.direccion}
            onChange={handleChange}
            rows={2}
            placeholder="Dirección de la empresa"
          />
        </div>

        <div className="form-group full">
          <label>Página web</label>

          <input
            type="url"
            name="paginaWeb"
            value={empresa.paginaWeb}
            onChange={handleChange}
            placeholder="https://www.miempresa.com"
          />
        </div>

        <div className="form-group full">
          <label>Descripción</label>

          <textarea
            name="descripcion"
            value={empresa.descripcion}
            onChange={handleChange}
            rows={4}
            placeholder="Descripción de la empresa"
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