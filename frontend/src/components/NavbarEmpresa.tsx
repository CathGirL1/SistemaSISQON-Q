import "../styles/NavbarEmpresa.css";

import {
  FaChevronDown,
  FaBars,
} from "react-icons/fa";

import useEmpresa from "../hooks/useEmpresa";

type NavbarEmpresaProps = {
  onMenuClick?: () => void;
};

export default function NavbarEmpresa({
  onMenuClick,
}: NavbarEmpresaProps) {
  const { empresa } = useEmpresa();

  const nombreEmpresa =
    empresa?.nombreComercial ||
    empresa?.razonSocial ||
    "Empresa";

  return (
    <header className="navbar-empresa">
      <div className="navbar-left">
        <button
          className="navbar-menu-btn"
          onClick={onMenuClick}
        >
          <FaBars />
        </button>
      </div>

      <div className="navbar-right">
        

        <div className="navbar-user">
          <div className="navbar-avatar">
            {empresa?.logo ? (
              <img
                src={empresa.logo}
                alt={nombreEmpresa}
                className="navbar-avatar-img"
              />
            ) : (
              nombreEmpresa.charAt(0).toUpperCase()
            )}
          </div>

          <div className="navbar-user-info">
            <h4>{nombreEmpresa}</h4>

            <p>Administrador</p>
          </div>

         
        </div>
      </div>
    </header>
  );
}