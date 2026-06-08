import { useEffect, useState } from "react";
import "../styles/ContenidoHomeCarousel.css"

import construccion1 from "../assets/construccion1.png";
import construccion2 from "../assets/construccion2.png";
import construccion3 from "../assets/construccion3.png";

const imagenes = [
  construccion1,
  construccion2,
  construccion3,

];

export default function ContenidoHomeCarousel() {

  const [imagenActual, setImagenActual] = useState(0);

  useEffect(() => {

    const intervalo = setInterval(() => {

      setImagenActual((prev) =>
        (prev + 1) % imagenes.length
      );

    }, 5000);

    return () => clearInterval(intervalo);

  }, []);

  return (
    <section className="contenidoHome-carousel">
       
            <div className="contenidoHome-text">
                <h2>Bienvenido a</h2>

                <h1>
                    SISCON-<span className="parteQ">Q</span>
                </h1>
                <div className="linea-verde"></div>
                <p className="descripcion-principal">
                    El sistema inteligente para cotizaciones
                    de<span className="destacado"> construcción y quinchos.</span>
                </p>
                <p className="descripcion-secundaria">
                    Conecta con empresas verificadas, compara opciones
                    y recibe tu presupuesto estimado de forma rápida,
                    clara y segura.
                </p>

            </div>
        
    

         
        <div className="contenidoHome-imagen">
            <img
            src={imagenes[imagenActual]}
            alt="Proyecto"
            />
        </div>

    </section>
  );
}