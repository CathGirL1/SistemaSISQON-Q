import { useNavigate } from "react-router-dom";

import "../styles/BotonesContenidoHome.css"
import { FaClipboardList, FaBuilding, FaUser } from "react-icons/fa";

export default function BotonesContenidoHome(){

    const navegar = useNavigate();

    return(

        <>

            <div className="contenedor-botones">

                <div className="boton-solicitarCotizacion">
                    <FaClipboardList className="icono-cotizacion" />
                    <div>
                        <h3>Solicitar cotización</h3>
                        <p>Cuéntanos tu proyecto</p>
                    </div>
                    
                </div>
                <div className="boton-ingresarComoEmpresa" onClick={() => navegar("/login")}>
                   <FaBuilding className="icono-ingresarEmpresa" />
                    <div>
                        <h3>Ingresar como empresa</h3>
                        <p>Ofrece tus servicios</p>
                    </div>
                  
                </div>
                <div className="boton-ingresarComoCliente" onClick={() => navegar("/login")}>
                    <FaUser className="icono-ingresarComoCliente" />
                    
                    <div>
                        <h3>Ingresar como cliente</h3>
                        <p>Resuelve tus dudas</p>
                    </div>
                    
                </div>
            </div>

        
        </>
    )


}