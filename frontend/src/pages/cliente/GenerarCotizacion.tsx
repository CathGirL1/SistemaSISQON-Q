

import { FileText, Hammer, Package, Ruler, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "../../styles/GenerarCotizacion.css";

export default function GenerarCotizacion() {

    const navigate = useNavigate();

    return (

        <section className="generar-cotizacion">

            <button
                className="gc-back"
                onClick={() => navigate(-1)}
            >
               
            </button>

            <header className="gc-header">

                <h2>Generar cotización</h2>

                <p>
                    Generá una cotización para el proyecto seleccionado.
                </p>

            </header>

            <article className="gc-card">

                <div className="gc-icon">
                    <FileText size={45}/>
                </div>

                <h3>Funcionalidad en desarrollo</h3>

                <p>
                    La generación automática de cotizaciones
                    todavía se encuentra en implementación.
                </p>

                <div className="gc-list">

                    <div>
                        <Hammer size={18}/>
                        Tipo de obra
                    </div>

                    <div>
                        <Package size={18}/>
                        Materiales
                    </div>

                    <div>
                        <Wrench size={18}/>
                        Mano de obra
                    </div>

                    <div>
                        <Ruler size={18}/>
                        Dimensiones del proyecto
                    </div>

                </div>

                <div className="gc-info">

                    Cuando el módulo esté finalizado, el
                    sistema calculará automáticamente el
                    costo total del proyecto y la
                    cotización aparecerá en
                    <strong> Mis cotizaciones</strong>.

                </div>

                <button
                    className="gc-button"
                    onClick={() => navigate(-1)}
                >
                    Volver a proyectos
                </button>

            </article>

        </section>

    );

}