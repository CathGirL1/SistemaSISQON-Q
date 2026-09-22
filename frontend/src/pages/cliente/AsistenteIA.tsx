import { useEffect, useState } from "react";

import {
  Sparkles,
  Send,
  FolderOpen,
  Bot,
  User,
} from "lucide-react";

import SidebarCliente from "../../components/cliente/SidebarCliente";
import HeaderCliente from "../../components/cliente/HeaderCliente";

import "../../styles/PanelClienteContenido.css";
import "../../styles/AsistenteIA.css";

interface Proyecto {
  idProyecto: number;
  nombre: string;
  tipoObra: string;
  descripcion: string | null;
  ubicacion: string | null;
  alto: number;
  ancho: number;
  largo: number;
  superficie: number;
}

interface Mensaje {
  id: number;
  autor: "usuario" | "asistente";
  contenido: string;
  hora: string;
}

export default function AsistenteIA() {

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [mensaje, setMensaje] =
    useState("");

  const [mensajes, setMensajes] =
    useState<Mensaje[]>([]);

  const [proyectos, setProyectos] =
    useState<Proyecto[]>([]);

  const [idProyecto, setIdProyecto] =
    useState<number | null>(null);

  const [cargandoProyectos, setCargandoProyectos] =
    useState(true);

  const [cargandoRespuesta, setCargandoRespuesta] =
    useState(false);

  const [usuario] = useState(() => {

    const usuarioGuardado =
      localStorage.getItem("usuario");

    return usuarioGuardado
      ? JSON.parse(usuarioGuardado)
      : null;
  });


  // =====================================================
  // OBTENER PROYECTOS DEL CLIENTE
  // =====================================================

  useEffect(() => {

    const obtenerProyectos = async () => {

      if (!usuario?.id_Cliente) {
        setCargandoProyectos(false);
        return;
      }

      try {

        const respuesta = await fetch(
          `http://localhost:3000/api/proyectos/cliente/${usuario.id_Cliente}`
        );

        if (!respuesta.ok) {
          throw new Error(
            "No se pudieron obtener los proyectos"
          );
        }

        const datos = await respuesta.json();

        setProyectos(datos);

        if (datos.length > 0) {
          setIdProyecto(datos[0].idProyecto);
        }

      } catch (error) {

        console.error(
          "Error al obtener proyectos:",
          error
        );

      } finally {

        setCargandoProyectos(false);
      }
    };

    obtenerProyectos();

  }, [usuario]);


  // =====================================================
  // PROYECTO SELECCIONADO
  // =====================================================

  const proyectoSeleccionado =
    proyectos.find(
      (proyecto) =>
        proyecto.idProyecto === idProyecto
    );


  // =====================================================
  // ENVIAR MENSAJE
  // =====================================================

  const enviarMensaje = async (
    recomendacionMateriales = false
  ) => {

    const contenido =
      mensaje.trim();

    if (!contenido) {
      return;
    }

    if (
      recomendacionMateriales &&
      !idProyecto
    ) {

      setMensajes((actuales) => [
        ...actuales,
        {
          id: Date.now(),
          autor: "asistente",
          contenido:
            "Para recomendarte materiales necesito que selecciones un proyecto.",
          hora: "Ahora",
        },
      ]);

      return;
    }

    setMensajes((actuales) => [
      ...actuales,
      {
        id: Date.now(),
        autor: "usuario",
        contenido,
        hora: "Ahora",
      },
    ]);

    setMensaje("");
    setCargandoRespuesta(true);

    try {

      const cuerpo: {
        pregunta: string;
        idProyecto?: number;
      } = {
        pregunta: contenido,
      };

      if (idProyecto) {
        cuerpo.idProyecto = idProyecto;
      }

      const respuesta =
        await fetch(
          "http://localhost:3000/api/asistente-ia/preguntar",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(cuerpo),
          }
        );

      const datos =
        await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje ||
          "No se pudo obtener una respuesta"
        );
      }

      setMensajes((actuales) => [
        ...actuales,
        {
          id: Date.now() + 1,
          autor: "asistente",
          contenido:
            datos.respuesta,
          hora: "Ahora",
        },
      ]);

    } catch (error) {

      console.error(
        "Error al consultar al asistente:",
        error
      );

      setMensajes((actuales) => [
        ...actuales,
        {
          id: Date.now() + 1,
          autor: "asistente",
          contenido:
            "No pude procesar tu consulta en este momento. Intentá nuevamente.",
          hora: "Ahora",
        },
      ]);

    } finally {

      setCargandoRespuesta(false);
    }
  };


  // =====================================================
  // PREGUNTAS RÁPIDAS
  // =====================================================

  const preguntarMateriales = () => {

    setMensaje(
      "¿Qué materiales me recomendás para este proyecto?"
    );
  };


  const preguntarConcepto = () => {

    setMensaje(
      "¿Qué debo tener en cuenta al elegir materiales para una obra?"
    );
  };


  const preguntarJornal = () => {

    setMensaje(
      "¿Qué es un jornal?"
    );
  };


  return (

    <div className="cliente-panel">

      <SidebarCliente
        menuOpen={menuOpen}
        onClose={() =>
          setMenuOpen(false)
        }
      />

      <main className="cliente-main">

        <HeaderCliente
          title="Asistente IA"
          subtitle="Consultá sobre materiales y aspectos relacionados con tu proyecto."
          menuOpen={menuOpen}
          onToggleMenu={() =>
            setMenuOpen(
              (prev) => !prev
            )
          }
        />

        <section className="assistant-page">


          {/* =====================================================
              CHAT
          ===================================================== */}

          <section className="assistant-chat">

            <header className="assistant-chat-header">

              <div className="assistant-avatar">
                <Sparkles size={22} />
              </div>

              <div>

                <h2>
                  Asistente SISCON-Q
                </h2>

                <span>
                  <i />
                  Disponible
                </span>

              </div>

            </header>


            <div className="assistant-messages">

              {mensajes.length === 0 && (

                <div className="assistant-welcome">

                  <div className="assistant-welcome-icon">
                    <Sparkles size={28} />
                  </div>

                  <h3>
                    ¿En qué puedo ayudarte?
                  </h3>

                  <p>
                    Podés consultar sobre materiales,
                    proyectos y aspectos generales
                    relacionados con la construcción.
                  </p>

                </div>

              )}


              {mensajes.map((item) => (

                <div
                  key={item.id}
                  className={`message-row message-${item.autor}`}
                >

                  <div className="message-avatar">

                    {item.autor ===
                    "asistente" ? (

                      <Bot size={18} />

                    ) : (

                      <User size={18} />

                    )}

                  </div>


                  <div className="message-content">

                    <div className="message-bubble">
                      {item.contenido}
                    </div>

                    <span>
                      {item.hora}
                    </span>

                  </div>

                </div>

              ))}


              {cargandoRespuesta && (

                <div className="message-row message-asistente">

                  <div className="message-avatar">
                    <Bot size={18} />
                  </div>

                  <div className="message-content">

                    <div className="message-bubble">
                      Pensando...
                    </div>

                  </div>

                </div>

              )}

            </div>


            {/* =====================================================
                PREGUNTAS RÁPIDAS
            ===================================================== */}

            <div className="assistant-suggestions">

              <button
                type="button"
                onClick={preguntarMateriales}
                disabled={
                  !idProyecto ||
                  cargandoRespuesta
                }
              >
                ¿Qué materiales me recomendás?
              </button>

              <button
                type="button"
                onClick={preguntarConcepto}
                disabled={
                  cargandoRespuesta
                }
              >
                ¿Qué debo tener en cuenta?
              </button>

              <button
                type="button"
                onClick={preguntarJornal}
                disabled={
                  cargandoRespuesta
                }
              >
                ¿Qué es un jornal?
              </button>

            </div>


            {/* =====================================================
                INPUT
            ===================================================== */}

            <footer className="assistant-input-area">

              <textarea
                placeholder="Escribí tu consulta..."
                value={mensaje}
                disabled={cargandoRespuesta}
                onChange={(event) =>
                  setMensaje(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {

                  if (
                    event.key === "Enter" &&
                    !event.shiftKey
                  ) {

                    event.preventDefault();

                    enviarMensaje();
                  }

                }}
              />

              <button
                type="button"
                className="assistant-send"
                onClick={() =>
                  enviarMensaje()
                }
                disabled={
                  cargandoRespuesta ||
                  !mensaje.trim()
                }
                aria-label="Enviar mensaje"
              >

                <Send size={19} />

              </button>

            </footer>

          </section>


          {/* =====================================================
              CONTEXTO DEL PROYECTO
          ===================================================== */}

          <aside className="assistant-context">

            <div className="assistant-context-header">

              <span>
                CONTEXTO ACTUAL
              </span>

              <h2>
                Tu proyecto
              </h2>

            </div>


            {cargandoProyectos ? (

              <article className="context-project-card">

                <div className="context-project-icon">
                  <FolderOpen size={22} />
                </div>

                <div>

                  <strong>
                    Cargando proyectos...
                  </strong>

                </div>

              </article>

            ) : proyectos.length === 0 ? (

              <article className="context-project-card">

                <div className="context-project-icon">
                  <FolderOpen size={22} />
                </div>

                <div>

                  <strong>
                    Sin proyectos
                  </strong>

                  <span>
                    Creá un proyecto para utilizar recomendaciones.
                  </span>

                </div>

              </article>

            ) : (

              <>

                <select
                  value={
                    idProyecto ?? ""
                  }
                  onChange={(event) =>
                    setIdProyecto(
                      Number(
                        event.target.value
                      )
                    )
                  }
                  className="assistant-project-select"
                >

                  {proyectos.map(
                    (proyecto) => (

                      <option
                        key={
                          proyecto.idProyecto
                        }
                        value={
                          proyecto.idProyecto
                        }
                      >
                        {proyecto.nombre}
                      </option>

                    )
                  )}

                </select>


                {proyectoSeleccionado && (

                  <article className="context-project-card">

                    <div className="context-project-icon">
                      <FolderOpen size={22} />
                    </div>

                    <div>

                      <strong>
                        {
                          proyectoSeleccionado.nombre
                        }
                      </strong>

                      <span>
                        {
                          proyectoSeleccionado.ubicacion ||
                          "Sin ubicación"
                        }
                        {" · "}
                        {
                          proyectoSeleccionado.superficie
                        } m²
                      </span>

                    </div>

                  </article>

                )}

              </>

            )}


            {proyectoSeleccionado && (

              <div className="context-summary">

                <h3>
                  Información del proyecto
                </h3>

                <p>

                  <strong>
                    Tipo de obra:
                  </strong>{" "}

                  {
                    proyectoSeleccionado.tipoObra
                  }

                </p>

                <p>

                  <strong>
                    Dimensiones:
                  </strong>{" "}

                  {
                    proyectoSeleccionado.ancho
                  } × {
                    proyectoSeleccionado.largo
                  } × {
                    proyectoSeleccionado.alto
                  } m

                </p>

                {proyectoSeleccionado.descripcion && (

                  <p>

                    <strong>
                      Descripción:
                    </strong>{" "}

                    {
                      proyectoSeleccionado.descripcion
                    }

                  </p>

                )}

              </div>

            )}

          </aside>

        </section>

      </main>

    </div>
  );
}