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
import CrearConversacion from "../../components/cliente/CrearConversacion";
import HistorialConversaciones from "../../components/cliente/HistorialConversaciones";

import logoIA from "../../assets/logoIASisconQ.png";

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

  const [actualizarHistorial, setActualizarHistorial] =
    useState(0);

  const [proyectos, setProyectos] =
    useState<Proyecto[]>([]);

  const [idProyecto, setIdProyecto] =
    useState<number | null>(null);
  
  const [idConversacion, setIdConversacion] = 
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

  const seleccionarConversacion = async (
      idConversacion: number,
      idProyecto: number | null
  ) => {
      setIdConversacion(idConversacion);

      setIdProyecto(idProyecto);

      setMensajes([]);

      try {
          const respuesta = await fetch(
              `http://localhost:3000/api/conversacion-ia/${idConversacion}/mensajes`
          );

          if (!respuesta.ok) {
              throw new Error(
                  "No se pudieron obtener los mensajes de la conversación"
              );
          }

          const datos = await respuesta.json();

          const ultimosMensajes = datos.slice(-10);

          const mensajesCargados: Mensaje[] =
              ultimosMensajes.map(
                  (item: any) => ({
                      id: item.idMensaje,
                      autor:
                          item.tipo === "usuario"
                              ? "usuario"
                              : "asistente",
                      contenido: item.contenido,
                      hora: new Date(
                          item.fecha
                      ).toLocaleTimeString(
                          "es-UY",
                          {
                              hour: "2-digit",
                              minute: "2-digit",
                          }
                      ),
                  })
              );

          setMensajes(mensajesCargados);

      } catch (error) {
          console.error(
              "Error al cargar la conversación:",
              error
          );
      }
  };


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

  const actualizarTituloConversacion = async (
      pregunta: string
  ) => {
      if (!idConversacion) {
          return;
      }

      const titulo = pregunta
          .replace(/[¿?¡!]/g, "")
          .trim()
          .slice(0, 60);

      if (!titulo) {
          return;
      }

      try {
          const respuesta = await fetch(
              `http://localhost:3000/api/conversacion-ia/${idConversacion}/titulo`,
              {
                  method: "PUT",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                      titulo,
                  }),
              }
          );

          if (!respuesta.ok) {
              throw new Error(
                  "No se pudo actualizar el título"
              );
          }

          setActualizarHistorial(
              (actual) => actual + 1
          );

      } catch (error) {
          console.error(
              "Error al actualizar título:",
              error
          );
      }
  };


  // =====================================================
  // ENVIAR MENSAJE
  // =====================================================

  const enviarMensaje = async (
      recomendacionMateriales = false,
      preguntaFija?: string
  ) => {
      const contenido = (
          preguntaFija ?? mensaje
      ).trim();
    
    const esPrimerMensaje = mensajes.length === 0;

      console.log("Pregunta:", contenido);
    console.log("ID conversación:", idConversacion);

      if (!contenido) {
          return;
      }

      if (!idConversacion) {
          setMensajes((actuales) => [
              ...actuales,
              {
                  id: Date.now(),
                  autor: "asistente",
                  contenido:
                      "Primero tenés que iniciar una nueva conversación.",
                  hora: "Ahora",
              },
          ]);

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
              idConversacion: number;
          } = {
              pregunta: contenido,
              idConversacion,
          };

          if (idProyecto) {
              cuerpo.idProyecto = idProyecto;
          }

          const respuesta = await fetch(
              "http://localhost:3000/api/asistente-ia/preguntar",
              {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify(cuerpo),
              }
          );

          const datos = await respuesta.json();

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
                  contenido: datos.respuesta,
                  hora: "Ahora",
              },
          ]);

          if (esPrimerMensaje) {
              await actualizarTituloConversacion(
                  contenido
              );
          }

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
              <div className="assistant-chat-title">
                  <div className="assistant-avatar">
                    <img src={logoIA} alt="IA SISCON-Q" />
                  </div>

                  <div>
                      <h2>
                          Asistente SISCON-Q
                      </h2>

                      <span>
                          <i />
                          <h2>Disponible</h2>
                      </span>
                  </div>
              </div>

              {usuario?.id_Cliente && (
                  <div className="assistant-new-conversation">
                      <CrearConversacion
                          idCliente={usuario.id_Cliente}
                          idProyecto={idProyecto}
                          onConversacionCreada={(id) => {
                              setIdConversacion(id);
                              setMensajes([]);
                               setActualizarHistorial(
                                  (actual) => actual + 1
                              );
                          }}
                      />
                  </div>
              )}
          </header>


            <div className="assistant-messages">

              {mensajes.length === 0 && (

                <div className="assistant-welcome">

                  <div className="assistant-welcome-icon">
                       <img src={logoIA} alt="IA SISCON-Q" />
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

                      <img src={logoIA} alt="IA SISCON-Q" />
                      

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
                  onClick={() =>
                      enviarMensaje(
                          true,
                          "¿Qué materiales me recomendás para este proyecto?"
                      )
                  }
                  disabled={
                      !idProyecto ||
                      cargandoRespuesta
                  }
              >
                  ¿Qué materiales me recomendás para este proyecto?
              </button>

             <button
                  type="button"
                  onClick={() =>
                      enviarMensaje(
                          false,
                          "¿Qué debo tener en cuenta al elegir materiales para una obra?"
                      )
                  }
                  disabled={cargandoRespuesta}
              >
                  ¿Qué debo tener en cuenta al elegir materiales para una obra?
              </button>

            <button
                type="button"
                onClick={() =>
                    enviarMensaje(
                        false,
                        "¿Qué es un jornal?"
                    )
                }
                disabled={cargandoRespuesta}
            >
                ¿Qué es un jornal?
            </button>

            <button
                type="button"
                onClick={() =>
                    enviarMensaje(
                        false,
                        "¿Me explicás de forma clara los costos estimados de mi proyecto?"
                    )
                }
                disabled={
                    !idProyecto ||
                    cargandoRespuesta
                }
            >
                ¿Cuáles son los costos estimados de mi proyecto?
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
             <HistorialConversaciones
                idCliente={usuario.id_Cliente}
                idConversacion={idConversacion}
                actualizarHistorial={actualizarHistorial}
                onSeleccionarConversacion={
                    seleccionarConversacion
                }
                onConversacionEliminada={(idEliminada) => {
                    if (idConversacion === idEliminada) {
                        setIdConversacion(null);
                        setIdProyecto(null);
                        setMensajes([]);
                    }
                }}
              />

          </aside>


        </section>

      </main>

    </div>
  );
}