import {
  useEffect,
  useState,
  type FormEvent,
} from "react";
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
  imagenUrl: string;
}

interface TipoObra {
  idTipoObra: number;
  nombre: string;
  descripcion: string | null;
  estado: string;
}

interface RespuestaError {
  mensaje?: string;
}

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

const formularioInicial: FormularioProyecto = {
  nombre: "",
  descripcion: "",
  ubicacion: "",
  idTipoObra: "",
  alto: "",
  ancho: "",
  largo: "",
  imagenUrl: "",
};

export default function CrearProyecto() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [formulario, setFormulario] =
    useState<FormularioProyecto>(formularioInicial);

  const [tiposObra, setTiposObra] = useState<TipoObra[]>([]);
  const [cargandoTiposObra, setCargandoTiposObra] =
    useState(true);

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

      const usuarioGuardado = localStorage.getItem("usuario");

      if (!usuarioGuardado) {
        throw new Error("No hay una sesión iniciada");
      }

      const usuario = JSON.parse(usuarioGuardado);
      const idCliente = usuario.id_Cliente;

      if (!idCliente) {
        throw new Error(
          "El usuario autenticado no tiene un cliente asociado"
        );
      }
      

      const proyecto = {
        idCliente,
        idTipoObra: Number(formulario.idTipoObra),
        nombre: formulario.nombre.trim(),
        descripcion: formulario.descripcion.trim() || null,
        imagenUrl: formulario.imagenUrl.trim() || null,
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

  useEffect(() => {
    const cargarTiposObra = async () => {
      try {
        setCargandoTiposObra(true);

        const response = await fetch(
          "http://localhost:3000/api/tipos-obra"
        );

        if (!response.ok) {
          throw new Error(
            "No se pudieron cargar los tipos de obra."
          );
        }

        const data: TipoObra[] = await response.json();

        setTiposObra(
          data.filter((tipo) => tipo.estado === "Activo")
        );
      } catch (error) {
        console.error(
          "Error al cargar tipos de obra:",
          error
        );
      } finally {
        setCargandoTiposObra(false);
      }
    };

    cargarTiposObra();
  }, []);

  return (
    <div className="cliente-panel">
      <SidebarCliente
        menuOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <main className="cliente-main">
        <HeaderCliente
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
              <span>Tipo de obra</span>

              <select
                value={formulario.idTipoObra}
                onChange={(event) =>
                  actualizarCampo(
                    "idTipoObra",
                    event.target.value
                  )
                }
                disabled={cargandoTiposObra}
                required
              >
                <option value="">
                  {cargandoTiposObra
                    ? "Cargando tipos de obra..."
                    : "Seleccioná un tipo de obra"}
                </option>

                {tiposObra.map((tipo) => (
                  <option
                    key={tipo.idTipoObra}
                    value={tipo.idTipoObra}
                  >
                    {tipo.nombre}
                  </option>
                ))}
              </select>

              {formulario.idTipoObra && (
                <small>
                  {
                    tiposObra.find(
                      (tipo) =>
                        tipo.idTipoObra ===
                        Number(formulario.idTipoObra)
                    )?.descripcion
                  }
                </small>
              )}
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