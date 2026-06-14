import "../styles/Informacion.css";

export default function AyudaInformacion() {
    return (
        <section id="ayuda" className="info-section">

            <h2>
                Preguntas <span>Frecuentes</span>
            </h2>

            <div className="faq-container">

                <div className="faq-item">
                    <h3>¿La cotización es definitiva?</h3>
                    <p>
                        No. La cotización generada es una estimación inicial que deberá ser validada por la empresa correspondiente.
                    </p>
                </div>

                <div className="faq-item">
                    <h3>¿Necesito registrarme?</h3>
                    <p>
                        Sí. El registro permite guardar cotizaciones, administrar proyectos y realizar seguimiento de solicitudes.
                    </p>
                </div>

                <div className="faq-item">
                    <h3>¿Cómo funciona la inteligencia artificial?</h3>
                    <p>
                        El asistente analiza la información proporcionada y genera recomendaciones relacionadas con el proyecto que deseas construir.
                    </p>
                </div>

                <div className="faq-item">
                    <h3>¿Puedo modificar una cotización?</h3>
                    <p>
                        Sí. Antes de enviarla podrás modificar medidas, materiales y configuraciones tantas veces como sea necesario.
                    </p>
                </div>

                <div className="faq-item">
                    <h3>¿Qué tipo de proyectos puedo cotizar?</h3>
                    <p>
                        Actualmente SISCON-Q está orientado a proyectos de construcción y fabricación de quinchos.
                    </p>
                </div>

            </div>

        </section>
    );
}