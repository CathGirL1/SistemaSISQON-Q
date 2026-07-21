import "../styles/NavbarEmpresa.css";

import {
    FaBell,
    FaSearch,
    FaChevronDown,
    FaBars
} from "react-icons/fa";

type NavbarEmpresaProps = {
    empresa?: string;
    usuario?: string;
    onMenuClick?: () => void;
}

export default function NavbarEmpresa({

    empresa = "Constructora XYZ",
    usuario = "Administrador",
    onMenuClick

}: NavbarEmpresaProps){

    return(

        <header className="navbar-empresa">

            <div className="navbar-left">

                <button
                    className="navbar-menu-btn"
                    onClick={onMenuClick}
                >
                    <FaBars/>
                </button>

                <div className="navbar-search">

                    <FaSearch/>

                    <input
                        type="text"
                        placeholder="Buscar..."
                    />

                </div>

            </div>

            <div className="navbar-right">

                <button className="navbar-notificacion">

                    <FaBell/>

                    <span className="notificacion-badge">
                        3
                    </span>

                </button>

                <div className="navbar-user">

                    <div className="navbar-avatar">

                        {empresa.charAt(0)}

                    </div>

                    <div className="navbar-user-info">

                        <h4>{empresa}</h4>

                        <p>{usuario}</p>

                    </div>

                    <FaChevronDown/>

                </div>

            </div>

        </header>

    );

}