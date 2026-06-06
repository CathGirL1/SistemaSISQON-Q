
import "../styles/NavbarDeHome.css"
import { useState } from "react";
import iconoHomeMenu from "../assets/iconoHomeMenu.png"
import iconoInicioSesion from "../assets/iconoInicioSesion.png"
export default function(){
    const [menuAbierto, setMenuAbierto] = useState(false);
    
    return(
      
        <>
           
            <nav className="navbar">
                <div className="navbar-logo">
                    <img src={iconoHomeMenu} alt="SISCON-Q" />
                        <div className="logo-texto">
                         <h1>SISCON-<span className="parteQ">Q</span></h1>
                            <span className="subtitulo-logo">
                                Cotiza, compara y construye
                            </span>
                        </div>
                </div>

                <button
                    className="menu-btn"
                    onClick={() => setMenuAbierto(!menuAbierto)}
                >
                    ☰
                </button>

                <ul className={`navbar-links ${menuAbierto ? "active" : ""}`}>
                    <li><a href="#">¿Cómo funciona?</a></li>
                    <li><a href="#">Beneficios</a></li>
                    <li><a href="#">Para empresas</a></li>
                    <li><a href="#">Ayuda</a></li>

                    <li>
                        <button className="login-btn">
                            <p>Iniciar sesión</p>
                            <img src={iconoInicioSesion} alt="IconoInicioSesion" />
                        </button>
                    </li>
                </ul>
            </nav>
                
        </>
    );


}