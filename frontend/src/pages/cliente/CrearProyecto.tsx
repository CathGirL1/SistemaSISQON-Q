import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Ruler,
  MapPin,
  FileText,
  Hammer,
} from "lucide-react";

import SidebarCliente from "../../components/cliente/SidebarCliente";
import HeaderCliente from "../../components/cliente/HeaderCliente";

import "../../styles/PanelClienteContenido.css";
import "../../styles/CrearProyecto.css";

interface FormularioProyecto {
  nombre: string;
  descripcion: string;
  ubicacion: string;
  idTipoObra: string;
  alto: string;
  ancho: string;
  largo: string;
}

interface RespuestaError {
  mensaje?: string;
}

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

const ID_CLIENTE_TEMPORAL = 1;

const formularioInicial: FormularioProyecto = {
  nombre: "",
  descripcion: "",
  ubicacion: "",
  idTipoObra: "",
  alto: "",
  ancho: "",
  largo: "",
};

export default function CrearProyecto() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [formulario, setFormulario] =
    useState<FormularioProyecto>(formularioInicial);

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const actualizarCampo = (
    campo: keyof FormularioProyecto,
    valor: string
  ) => {
    setFormulario((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const enviarFormulario = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setGuardando(true);
      setError("");

      const proyecto = {
        idCliente: ID_CLIENTE_TEMPORAL,
        idTipoObra: Number(formulario.idTipoObra),
        nombre: formulario.nombre.trim(),
        descripcion: formulario.descripcion.trim() || null,
        ubicacion: formulario.ubicacion.trim() || null,
        alto: Number(formulario.alto),
        ancho: Number(formulario.ancho),
        largo: Number(formulario.largo),
      };

      const response = await fetch(
        `${API_URL}/api/proyectos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(proyecto),
        }
      );

      const data: RespuestaError = await response.json();

      if (!response.ok) {
        throw new Error(
          data.mensaje || "No se pudo crear el proyecto"
        );
      }

      navigate("/panel-cliente/proyectos");
    } catch (error) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al crear el proyecto";

      setError(mensaje);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="cliente-panel">
      <SidebarCliente
        menuOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <main className="cliente-main">
        <HeaderCliente
          title="Crear proyecto"
          subtitle="Ingresá los datos principales de tu obra."
          menuOpen={menuOpen}
          onToggleMenu={() => setMenuOpen((prev) => !prev)}
        />

        <section className="crear-proyecto-heading">
          <div>
            <button
              type="button"
              className="crear-proyecto-back"
              onClick={() =>
                navigate("/panel-cliente/proyectos")
              }
            >
              <ArrowLeft size={18} />
              Volver a Mis proyectos
            </button>

            <h2>Nuevo proyecto</h2>

            <p>
              Completá la información básica para comenzar a
              configurar la obra.
            </p>
          </div>
        </section>

        <form
          className="crear-proyecto-form"
          onSubmit={enviarFormulario}
        >
          <section className="crear-proyecto-card">
            <div className="crear-proyecto-card-title">
              <div className="crear-proyecto-icon">
                <FileText size={21} />
              </div>

              <div>
                <h3>Información general</h3>
                <p>
                  Identificá el proyecto y agregá una breve
                  descripción.
                </p>
              </div>
            </div>

            <div className="crear-proyecto-grid">
              <label className="crear-proyecto-field">
                <span>Nombre del proyecto</span>

                <input
                  type="text"
                  value={formulario.nombre}
                  onChange={(event) =>
                    actualizarCampo(
                      "nombre",
                      event.target.value
                    )
                  }
                  placeholder="Ej.: Quincho familiar"
                  maxLength={100}
                  required
                />
              </label>

              <label className="crear-proyecto-field">
                <span>Ubicación</span>

                <div className="crear-proyecto-input-icon">
                  <MapPin size={18} />

                  <input
                    type="text"
                    value={formulario.ubicacion}
                    onChange={(event) =>
                      actualizarCampo(
                        "ubicacion",
                        event.target.value
                      )
                    }
                    placeholder="Ej.: Maldonado, Uruguay"
                    maxLength={200}
                  />
                </div>
              </label>

              <label className="crear-proyecto-field crear-proyecto-field-full">
                <span>Descripción</span>

                <textarea
                  value={formulario.descripcion}
                  onChange={(event) =>
                    actualizarCampo(
                      "descripcion",
                      event.target.value
                    )
                  }
                  placeholder="Describí brevemente el proyecto..."
                  maxLength={500}
                  rows={5}
                />
              </label>
            </div>
          </section>

          <section className="crear-proyecto-card">
            <div className="crear-proyecto-card-title">
              <div className="crear-proyecto-icon">
                <Hammer size={21} />
              </div>

              <div>
                <h3>Tipo de obra</h3>
                <p>
                  Seleccioná el tipo de construcción que querés
                  realizar.
                </p>
              </div>
            </div>

            <label className="crear-proyecto-field">
              <span>ID del tipo de obra</span>

              <input
                type="number"
                min="1"
                step="1"
                value={formulario.idTipoObra}
                onChange={(event) =>
                  actualizarCampo(
                    "idTipoObra",
                    event.target.value
                  )
                }
                placeholder="Ej.: 2"
                required
              />

              <small>
                Por ahora usamos el ID existente en la tabla
                TipoObra. Luego lo cambiaremos por un selector con
                nombres reales.
              </small>
            </label>
          </section>

          <section className="crear-proyecto-card">
            <div className="crear-proyecto-card-title">
              <div className="crear-proyecto-icon">
                <Ruler size={21} />
              </div>

              <div>
                <h3>Medidas</h3>
                <p>
                  Ingresá las dimensiones principales en metros.
                </p>
              </div>
            </div>

            <div className="crear-proyecto-measures">
              <label className="crear-proyecto-field">
                <span>Alto</span>

                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={formulario.alto}
                  onChange={(event) =>
                    actualizarCampo(
                      "alto",
                      event.target.value
                    )
                  }
                  placeholder="2.50"
                  required
                />
              </label>

              <label className="crear-proyecto-field">
                <span>Ancho</span>

                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={formulario.ancho}
                  onChange={(event) =>
                    actualizarCampo(
                      "ancho",
                      event.target.value
                    )
                  }
                  placeholder="5.00"
                  required
                />
              </label>

              <label className="crear-proyecto-field">
                <span>Largo</span>

                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={formulario.largo}
                  onChange={(event) =>
                    actualizarCampo(
                      "largo",
                      event.target.value
                    )
                  }
                  placeholder="7.00"
                  required
                />
              </label>
            </div>
          </section>

          {error && (
            <div className="crear-proyecto-error">
              {error}
            </div>
          )}

          <div className="crear-proyecto-actions">
            <button
              type="button"
              className="crear-proyecto-cancel"
              onClick={() =>
                navigate("/panel-cliente/proyectos")
              }
              disabled={guardando}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="crear-proyecto-save"
              disabled={guardando}
            >
              <Save size={18} />

              {guardando
                ? "Guardando..."
                : "Guardar proyecto"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}