import { useState } from "react";
import {
  Sparkles,
  Send,
  Plus,
  MessageSquare,
  FolderOpen,
  FileText,
  Building2,
  Bot,
  User,
  Paperclip,
  Mic,
  MoreVertical,
} from "lucide-react";

import SidebarCliente from "../../components/cliente/SidebarCliente";
import HeaderCliente from "../../components/cliente/HeaderCliente";

import "../../styles/PanelClienteContenido.css";
import "../../styles/AsistenteIA.css";

interface Conversacion {
  id: number;
  titulo: string;
  fecha: string;
  activa?: boolean;
}

interface Mensaje {
  id: number;
  autor: "usuario" | "asistente";
  contenido: string;
  hora: string;
}

const conversaciones: Conversacion[] = [
  {
    id: 1,
    titulo: "Materiales para quincho",
    fecha: "Hoy",
    activa: true,
  },
  {
    id: 2,
    titulo: "Comparación de opciones",
    fecha: "Ayer",
  },
  {
    id: 3,
    titulo: "Empresas recomendadas",
    fecha: "20/05/2024",
  },
];

const mensajesIniciales: Mensaje[] = [
  {
    id: 1,
    autor: "asistente",
    contenido:
      "Hola Nicolás. Puedo ayudarte a comparar materiales, estimar costos, revisar tus proyectos y encontrar empresas adecuadas.",
    hora: "10:24",
  },
  {
    id: 2,
    autor: "usuario",
    contenido:
      "¿Qué material me conviene para un quincho de 30 metros cuadrados?",
    hora: "10:25",
  },
  {
    id: 3,
    autor: "asistente",
    contenido:
      "Para un quincho de 30 m², la mejor opción depende del presupuesto y el mantenimiento que quieras asumir. La madera de eucalipto tratada ofrece una muy buena relación entre precio, durabilidad y apariencia. Si priorizás menor mantenimiento, una estructura metálica con revestimiento puede ser más conveniente.",
    hora: "10:25",
  },
];

export default function AsistenteIA() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState(mensajesIniciales);

  const enviarMensaje = () => {
    const contenido = mensaje.trim();

    if (!contenido) {
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
  };

  return (
    <div className="cliente-panel">
      <SidebarCliente
        menuOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <main className="cliente-main">
        <HeaderCliente
          title="Asistente IA"
          subtitle="Consultá sobre materiales, costos, proyectos, cotizaciones y empresas."
          menuOpen={menuOpen}
          onToggleMenu={() => setMenuOpen((prev) => !prev)}
        />

        <section className="assistant-page">
          <aside className="assistant-history">
            <div className="assistant-history-header">
              <div>
                <span>CONVERSACIONES</span>
                <h2>Historial</h2>
              </div>

              <button type="button" aria-label="Nueva conversación">
                <Plus size={19} />
              </button>
            </div>

            <button type="button" className="new-chat-button">
              <Sparkles size={18} />
              Nueva conversación
            </button>

            <div className="conversation-list">
              {conversaciones.map((conversacion) => (
                <button
                  type="button"
                  key={conversacion.id}
                  className={`conversation-item ${
                    conversacion.activa ? "active" : ""
                  }`}
                >
                  <MessageSquare size={17} />

                  <div>
                    <strong>{conversacion.titulo}</strong>
                    <span>{conversacion.fecha}</span>
                  </div>

                  <MoreVertical size={17} />
                </button>
              ))}
            </div>

            <div className="assistant-history-tip">
              <Bot size={22} />
              <p>
                El asistente usa la información de tus proyectos para darte
                respuestas más útiles.
              </p>
            </div>
          </aside>

          <section className="assistant-chat">
            <header className="assistant-chat-header">
              <div className="assistant-avatar">
                <Sparkles size={22} />
              </div>

              <div>
                <h2>Asistente SISCON-Q</h2>
                <span>
                  <i />
                  Disponible
                </span>
              </div>
            </header>

            <div className="assistant-messages">
              <div className="assistant-welcome">
                <div className="assistant-welcome-icon">
                  <Sparkles size={28} />
                </div>

                <h3>¿En qué puedo ayudarte?</h3>

                <p>
                  Podés consultar sobre materiales, costos, cotizaciones,
                  empresas y decisiones de tu proyecto.
                </p>
              </div>

              {mensajes.map((item) => (
                <div
                  key={item.id}
                  className={`message-row message-${item.autor}`}
                >
                  <div className="message-avatar">
                    {item.autor === "asistente" ? (
                      <Bot size={18} />
                    ) : (
                      <User size={18} />
                    )}
                  </div>

                  <div className="message-content">
                    <div className="message-bubble">
                      {item.contenido}
                    </div>

                    <span>{item.hora}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="assistant-suggestions">
              <button
                type="button"
                onClick={() =>
                  setMensaje("¿Qué material me conviene para un quincho?")
                }
              >
                ¿Qué material me conviene?
              </button>

              <button
                type="button"
                onClick={() =>
                  setMensaje("Ayúdame a estimar el costo de mi proyecto")
                }
              >
                Estimar costo del proyecto
              </button>

              <button
                type="button"
                onClick={() =>
                  setMensaje("¿Qué empresa me recomendás para este proyecto?")
                }
              >
                Recomendar una empresa
              </button>
            </div>

            <footer className="assistant-input-area">
              <button
                type="button"
                className="assistant-attachment"
                aria-label="Adjuntar archivo"
              >
                <Paperclip size={20} />
              </button>

              <textarea
                placeholder="Escribí tu consulta..."
                value={mensaje}
                onChange={(event) => setMensaje(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    enviarMensaje();
                  }
                }}
              />

              <button
                type="button"
                className="assistant-microphone"
                aria-label="Usar micrófono"
              >
                <Mic size={20} />
              </button>

              <button
                type="button"
                className="assistant-send"
                onClick={enviarMensaje}
                aria-label="Enviar mensaje"
              >
                <Send size={19} />
              </button>
            </footer>
          </section>

          <aside className="assistant-context">
            <div className="assistant-context-header">
              <span>CONTEXTO ACTUAL</span>
              <h2>Tu proyecto</h2>
            </div>

            <article className="context-project-card">
              <div className="context-project-icon">
                <FolderOpen size={22} />
              </div>

              <div>
                <strong>Quincho familiar</strong>
                <span>La Serena · 30 m²</span>
              </div>
            </article>

            <div className="context-details">
              <div>
                <FileText size={17} />

                <div>
                  <span>Cotizaciones</span>
                  <strong>3 opciones</strong>
                </div>
              </div>

              <div>
                <Building2 size={17} />

                <div>
                  <span>Empresas seleccionadas</span>
                  <strong>2 empresas</strong>
                </div>
              </div>

              <div>
                <Sparkles size={17} />

                <div>
                  <span>Opción recomendada</span>
                  <strong>Estándar</strong>
                </div>
              </div>
            </div>

            <div className="context-summary">
              <h3>Resumen rápido</h3>

              <p>
                Proyecto activo con tres cotizaciones y una recomendación
                generada por el comparador.
              </p>

              <button type="button">
                Ver proyecto
              </button>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}