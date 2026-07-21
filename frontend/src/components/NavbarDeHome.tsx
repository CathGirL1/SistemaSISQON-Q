
import "../styles/NavbarDeHome.css"
import { useState } from "react";
import iconoHomeMenu from "../assets/iconoHomeMenu.png"
import iconoInicioSesion from "../assets/iconoInicioSesion.png"

import { useNavigate } from "react-router-dom";
export default function NavbarDeHome(){
    const [menuAbierto, setMenuAbierto] = useState(false);
    
    const navegar = useNavigate();

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
                    <li><a href="/informacion#como-funciona">¿Cómo funciona?</a></li>
                    <li><a href="/informacion#beneficios">Beneficios</a></li>
                    <li><a href="/informacion#empresas">Para empresas</a></li>
                    <li><a href="/informacion#ayuda">Ayuda</a></li>

                    <li>
                        <button className="login-btn" onClick={() => navegar("/login")}>
                            <p>Iniciar sesión</p>
                            <img src={iconoInicioSesion} alt="IconoInicioSesion" />
                        </button>
                    </li>
                </ul>
            </nav>
                
        </>
    );


}