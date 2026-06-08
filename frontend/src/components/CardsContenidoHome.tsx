import "../styles/CardsContenidoHome.css"

import { FaBolt, FaFileAlt, FaBalanceScale, FaDollarSign } from "react-icons/fa";



export default function CardsContneidoHome() {
  return (

    <>
        <section className="beneficios-home">

            <h2>
                ¿Por qué usar <span>SISCON-Q</span>?
            </h2>

            <div className="beneficios-grid">

                <div className="beneficio-card">
                <div className="icono rapidez">
                    <FaBolt />
                </div>

                <div>
                    <h3 className="rapidez">Rapidez</h3>
                    <p>
                    Obtén cotizaciones en minutos y avanza más rápido con tu proyecto.
                    </p>
                </div>
                </div>

                <div className="beneficio-card">
                <div className="icono claridad">
                    <FaFileAlt />
                </div>

                <div>
                    <h3 className="claridad">Claridad</h3>
                    <p>
                    Información transparente y detallada para que tomes la mejor decisión.
                    </p>
                </div>
                </div>

                <div className="beneficio-card">
                <div className="icono comparacion">
                    <FaBalanceScale />
                </div>

                <div>
                    <h3 className="comparacion">Compara opciones</h3>
                    <p>
                    Compara varias empresas, servicios y precios en un solo lugar.
                    </p>
                </div>
                </div>

                <div className="beneficio-card">
                <div className="icono presupuesto">
                    <FaDollarSign />
                </div>

                <div>
                    <h3 className="presupuesto">Presupuesto estimado</h3>
                    <p>
                    Recibe un estimado inteligente según los detalles de tu proyecto.
                    </p>
                </div>
                </div>

            </div>

        </section>
    </>
    
  );
}