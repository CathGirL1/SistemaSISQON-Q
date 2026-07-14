export default function AsistenteCliente() {
  return (
    <section className="assistant-card">
      <div>
        <h3>✨ Asistente IA</h3>
        <p>
          Tu asistente inteligente para tomar mejores decisiones en tus
          proyectos.
        </p>
      </div>

      <div className="assistant-questions">
        <button type="button">
          ¿Qué material me conviene para un quincho?
        </button>

        <button type="button">
          ¿Cuál es la diferencia entre materiales estándar y premium?
        </button>

        <button type="button">
          ¡Ayúdame a estimar el costo de mi proyecto!
        </button>
      </div>

      <div className="assistant-help">
        <button type="button">¿Necesitas ayuda?</button>

        <p>
          Pregúntale a nuestro asistente IA sobre materiales, costos, empresas
          y más.
        </p>

        <button type="button">
          Iniciar conversación →
        </button>
      </div>
    </section>
  );
}