import { FaClipboardList, FaTools, FaCalculator, FaRobot, FaPaperPlane } from "react-icons/fa";
import "../styles/Informacion.css";

export default function ComoFunciona() {
    return (
        <section id="como-funciona" className="info-section">

            <h2>
                ¿Cómo funciona <span>SISCON-Q</span>?
            </h2>

            <p className="info-subtitle">
                Cotizar tu proyecto nunca fue tan simple.
            </p>

            <div className="info-grid">

                <div className="info-card">
                    <FaClipboardList />
                    <h3>Describe tu proyecto</h3>
                    <p>
                        Ingresa las dimensiones y características principales de tu obra o quincho.
                    </p>
                </div>

                <div className="info-card">
                    <FaTools />
                    <h3>Selecciona materiales</h3>
                    <p>
                        Personaliza materiales, terminaciones y opciones constructivas según tus preferencias.
                    </p>
                </div>

                <div className="info-card">
                    <FaCalculator />
                    <h3>Obtén una cotización</h3>
                    <p>
                        El sistema calcula automáticamente materiales, mano de obra y costos estimados.
                    </p>
                </div>

                <div className="info-card">
                    <FaRobot />
                    <h3>Consulta a la IA</h3>
                    <p>
                        Recibe recomendaciones y respuestas inteligentes relacionadas con tu proyecto.
                    </p>
                </div>

                <div className="info-card">
                    <FaPaperPlane />
                    <h3>Envía tu solicitud</h3>
                    <p>
                        Comparte tu cotización con empresas registradas para continuar el proceso.
                    </p>
                </div>

            </div>

        </section>
    );
}