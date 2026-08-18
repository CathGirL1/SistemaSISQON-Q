import "../../../styles/empresa/miPerfil/DatosEmpresaPerfil.css";

import type { ChangeEvent, FormEvent } from "react";
import type { Empresa } from "../../../types/Empresa";

interface Props {
  empresa: Empresa;

  handleChange: (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
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
          Administrá la información principal de tu empresa
          utilizada dentro del sistema.
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

        <div className="perfil-seccion">
          <h3>Zonas de trabajo</h3>
        </div>

        <div className="form-group full">
          <label>Zonas de trabajo</label>

          <textarea
            name="zonasTrabajo"
            value={empresa.zonasTrabajo}
            onChange={handleChange}
            rows={3}
            placeholder="Ej.: Maldonado, Punta del Este, San Carlos"
          />
        </div>

        <div className="perfil-seccion">
          <h3>Condiciones comerciales</h3>
        </div>

        <div className="form-group full">
          <label>Condiciones comerciales</label>

          <textarea
            name="condicionesComerciales"
            value={empresa.condicionesComerciales}
            onChange={handleChange}
            rows={4}
            placeholder="Condiciones comerciales de la empresa"
          />
        </div>

        <div className="perfil-seccion">
          <h3>
            Texto legal o aclaraciones del presupuesto
          </h3>
        </div>

        <div className="form-group full">
          <label>Texto legal</label>

          <textarea
            name="textoLegal"
            value={empresa.textoLegal}
            onChange={handleChange}
            rows={4}
            placeholder="Aclaraciones legales del presupuesto"
          />
        </div>

        <div className="perfil-seccion">
          <h3>Configuración adicional</h3>
        </div>

        <div className="form-group">
          <label>Impuestos</label>

          <input
            type="text"
            name="impuestos"
            value={empresa.impuestos}
            onChange={handleChange}
            placeholder="IVA incluido"
          />
        </div>

        <div className="form-group">
          <label>Validez de la cotización (días)</label>

          <input
            type="number"
            name="validezCotizacion"
            value={empresa.validezCotizacion}
            onChange={handleChange}
            placeholder="30"
          />
        </div>

        <div className="form-group">
          <label>Días laborables</label>

          <input
            type="text"
            name="diasLaborables"
            value={empresa.diasLaborables}
            onChange={handleChange}
            placeholder="Lunes a viernes"
          />
        </div>

        <div className="form-group">
          <label>Horario de inicio</label>

          <input
            type="time"
            name="horarioInicio"
            value={empresa.horarioInicio}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Horario de finalización</label>

          <input
            type="time"
            name="horarioFin"
            value={empresa.horarioFin}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Idioma</label>

          <input
            type="text"
            name="idiomaDocumentos"
            value={empresa.idiomaDocumentos}
            onChange={handleChange}
            placeholder="Español"
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