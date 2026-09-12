import { useEffect, useState, type FormEvent } from "react";
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
import MaterialesProyectoDropList, {
  type Material,
} from "../../components/cliente/MaterialesProyectoDropList";

import ModalDatosMaterial from "../../components/cliente/ModalDatosMaterial";
import "../../styles/PanelClienteContenido.css";
import "../../styles/CrearProyecto.css";

interface TipoObra {
  idTipoObra: number;
  nombre: string;
}

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
  imagenUrl: ""
};

export default function CrearProyecto() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const [formulario, setFormulario] =
    useState<FormularioProyecto>(formularioInicial);

  const [tiposObra, setTiposObra] = useState<TipoObra[]>([]);
 

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const [materialesSeleccionados, setMaterialesSeleccionados] = useState<Material[]>([]);
  const [materialModal, setMaterialModal] =
  useState<Material | null>(null);

  const [modalMaterialAbierto, setModalMaterialAbierto] =
  useState(false);

  const abrirModalMaterial = (material: Material) => {
    setMaterialModal(material);
    setModalMaterialAbierto(true);
  };

  const cerrarModalMaterial = () => {
    setModalMaterialAbierto(false);
    setMaterialModal(null);
  };

  // ==========================================
  // OBTENER TIPOS DE OBRA
  // ==========================================

  useEffect(() => {
    obtenerTiposObra();
  }, []);

  const obtenerTiposObra = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/tipos-obra`
      );

      if (!response.ok) {
        throw new Error(
          "No se pudieron obtener los tipos de obra."
        );
      }

      const data: TipoObra[] = await response.json();

      setTiposObra(data);
    } catch (error) {
      console.error(error);

      setError(
        "No se pudieron cargar los tipos de obra."
      );
    }
  };

  // ==========================================
  // ACTUALIZAR CAMPOS
  // ==========================================

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
    event: FormEvent
    ) => {
    event.preventDefault();

    try {
      setGuardando(true);
      setError("");

      // ==========================================
      // 1. CREAR PROYECTO
      // ==========================================

        const usuarioGuardado =
          localStorage.getItem("usuario");

          if (!usuarioGuardado) {
            throw new Error(
              "No se encontró una sesión activa."
            );
          }

          const usuario = JSON.parse(usuarioGuardado);

          if (!usuario.id_Cliente) {
            throw new Error(
              "No se encontró el identificador del cliente."
            );
          }

      const proyecto = {
        idCliente: usuario.id_Cliente,

        idTipoObra: Number(
          formulario.idTipoObra
        ),

        nombre:
          formulario.nombre.trim(),

        descripcion:
          formulario.descripcion.trim() || null,

        imagenUrl:
          formulario.imagenUrl.trim() || null,

        ubicacion:
          formulario.ubicacion.trim() || null,

        alto: Number(formulario.alto),

        ancho: Number(formulario.ancho),

        largo: Number(formulario.largo),
      };

      console.log(
        "Proyecto a enviar:",
        proyecto
      );

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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.mensaje ||
            "No se pudo crear el proyecto"
        );
      }

      // ==========================================
      // 2. OBTENER ID DEL PROYECTO CREADO
      // ==========================================

      const idProyecto =
        data.idProyecto;

      console.log(
        "Proyecto creado con ID:",
        idProyecto
      );

      if (!idProyecto) {
        throw new Error(
          "El backend no devolvió el ID del proyecto creado."
        );
      }

      // ==========================================
      // 3. GUARDAR MATERIALES DEL PROYECTO
      // ==========================================

      for (
        const material
        of materialesSeleccionados
      ) {

        const materialProyecto = {
          idProyecto:
            idProyecto,

          idMaterial:
            material.idMaterial,

          cantidad:
            material.cantidad ?? 1,
        };

        console.log(
          "Material a guardar:",
          materialProyecto
        );

        const respuestaMaterial =
          await fetch(
            `${API_URL}/api/materiales-proyecto/agregarMaterialAProyecto`,
            {
              method: "POST",

              headers: {
                "Content-Type": "application/json",
              },

              body: JSON.stringify(
                materialProyecto
              ),
            }
          );

        const datosMaterial =
          await respuestaMaterial.json();

        if (!respuestaMaterial.ok) {
          throw new Error(
            datosMaterial.mensaje ||
              `No se pudo guardar el material ${material.nombre}`
          );
        }
      }

      // ==========================================
      // 4. TODO CORRECTO
      // ==========================================

      console.log(
        "Proyecto y materiales guardados correctamente."
      );

      navigate(
        "/panel-cliente/proyectos"
      );

    } catch (error) {

      console.error(error);

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

     

        <section className="crear-proyecto-heading">

          <div>

            <button
              type="button"
              className="crear-proyecto-back"
              onClick={() =>
                navigate(
                  "/panel-cliente/proyectos"
                )
              }
            >
              <ArrowLeft size={18} />

              Volver a Mis proyectos
            </button>

            <h2>Nuevo proyecto</h2>

            <p>
              Completá la información básica para
              comenzar a configurar la obra.
            </p>

          </div>

        </section>

        <form
          className="crear-proyecto-form"
          onSubmit={enviarFormulario}
        >

          {/* ==========================================
              INFORMACIÓN GENERAL
          ========================================== */}

          <section className="crear-proyecto-card">

            <div className="crear-proyecto-card-title">

              <div className="crear-proyecto-icon">
                <FileText size={21} />
              </div>

              <div>

                <h3>Información general</h3>

                <p>
                  Identificá el proyecto y agregá una
                  breve descripción.
                </p>

              </div>

            </div>

            <div className="crear-proyecto-grid">

              <label className="crear-proyecto-field">

                <span>
                  Nombre del proyecto
                </span>

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

                <span>
                  Ubicación
                </span>

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

                <span>
                  Descripción
                </span>

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

              <label className="crear-proyecto-field">

                <span>
                  Imagen de proyecto
                </span>

               <input
                  type="text"
                  value={formulario.imagenUrl}
                  onChange={(event) =>
                    actualizarCampo(
                      "imagenUrl",
                      event.target.value
                    )
                  }
                  placeholder="Ingrese un enlace de imagen"
                  maxLength={100}
                  required
                />

              </label>

            </div>

          </section>

          {/* ==========================================
              TIPO DE OBRA
          ========================================== */}

          <section className="crear-proyecto-card">

            <div className="crear-proyecto-card-title">

              <div className="crear-proyecto-icon">
                <Hammer size={21} />
              </div>

              <div>

                <h3>Tipo de obra</h3>

                <p>
                  Seleccioná el tipo de construcción
                  que querés realizar.
                </p>

              </div>

            </div>

            <label className="crear-proyecto-field">

              <span>
                Tipo de obra
              </span>

              <select
                value={formulario.idTipoObra}
                onChange={(event) =>
                  actualizarCampo(
                    "idTipoObra",
                    event.target.value
                  )
                }
                required
              >

                <option value="">
                  Seleccioná un tipo de obra
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

            </label>

          </section>

          {/* ==========================================
              MEDIDAS
          ========================================== */}

          <section className="crear-proyecto-card">

            <div className="crear-proyecto-card-title">

              <div className="crear-proyecto-icon">
                <Ruler size={21} />
              </div>

              <div>

                <h3>Medidas</h3>

                <p>
                  Ingresá las dimensiones principales
                  en metros.
                </p>

              </div>

            </div>

            <div className="crear-proyecto-measures">

              <label className="crear-proyecto-field">

                <span>
                  Alto
                </span>

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

                <span>
                  Ancho
                </span>

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

                <span>
                  Largo
                </span>

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

            {/* ==========================================
                MATERIALES DEL PROYECTO
            ========================================== */}

        <MaterialesProyectoDropList
           materialesSeleccionados={materialesSeleccionados}
           onMaterialesChange={setMaterialesSeleccionados}
           onVerDatosMaterial={abrirModalMaterial}
        />

          {/* ERROR */}

          {error && (
            <div className="crear-proyecto-error">
              {error}
            </div>
          )}

          {/* BOTONES */}

          <div className="crear-proyecto-actions">

            <button
              type="button"
              className="crear-proyecto-cancel"
              onClick={() =>
                navigate(
                  "/panel-cliente/proyectos"
                )
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
      <ModalDatosMaterial
        material={materialModal}
        abierto={modalMaterialAbierto}
        onCerrar={cerrarModalMaterial}
      />

    </div>
  );
}