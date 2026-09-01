import "../styles/SidebarEmpresa.css";
import iconoHomeMenu from "../assets/iconoHomeMenu.png";

import { NavLink } from "react-router-dom";

import {
  FaHome,
  FaFileInvoiceDollar,
  FaUsers,
  FaFolderOpen,
  FaBoxes,
  FaHardHat,
  FaUserCog,
  FaChartBar,
  FaUserShield,
  FaCog,
  FaUserCircle,
  FaQuestionCircle,
  FaSignOutAlt,
} from "react-icons/fa";

import useEmpresa from "../hooks/useEmpresa";

export default function SidebarEmpresa() {
  const { empresa } = useEmpresa();

  const nombreEmpresa =
    empresa?.nombreComercial ||
    empresa?.razonSocial ||
    "Empresa";

  const inicial = nombreEmpresa.charAt(0).toUpperCase();

  return (
    <aside className="sidebar-empresa">
      <div className="sidebar-logo">
        <img src={iconoHomeMenu} alt="SISCON-Q" />

        <div>
          <h2>
            SISCON-<span>Q</span>
          </h2>
          <p>Cotiza, compara y construye</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="sidebar-section-title">General</p>

        <NavLink to="/empresa/dashboard" className="sidebar-link">
          <FaHome />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/empresa/cotizaciones" className="sidebar-link">
          <FaFileInvoiceDollar />
          <span>Cotizaciones</span>
        </NavLink>

        <NavLink to="/empresa/clientes" className="sidebar-link">
          <FaUsers />
          <span>Clientes</span>
        </NavLink>



        <p className="sidebar-section-title">Gestión</p>

        <NavLink to="/empresa/materiales" className="sidebar-link">
          <FaBoxes />
          <span>Materiales</span>
        </NavLink>

        <NavLink to="/empresa/tipos-obra" className="sidebar-link">
          <FaHardHat />
          <span>Tipos de obra</span>
        </NavLink>

        <NavLink to="/empresa/mano-obra" className="sidebar-link">
          <FaUserCog />
          <span>Mano de obra</span>
        </NavLink>

        <p className="sidebar-section-title">Administración</p>

        <NavLink to="/empresa/reportes" className="sidebar-link">
          <FaChartBar />
          <span>Reportes</span>
        </NavLink>

        <NavLink to="/empresa/perfil" className="sidebar-link">
          <FaUserCircle />
          <span>Mi perfil</span>
        </NavLink>
      </nav>

      <div className="sidebar-help">
        <div className="help-icon">
          <FaQuestionCircle />
        </div>

        <h4>¿Necesitás ayuda?</h4>
        <p>Contactá al soporte de SISCON-Q.</p>

        <button>Contactar</button>
      </div>

      <div className="sidebar-user">
        <div className="sidebar-avatar">
          {empresa?.logo ? (
            <img
              src={empresa.logo}
              alt={nombreEmpresa}
              className="sidebar-avatar-img"
            />
          ) : (
            inicial
          )}
        </div>

        <div className="sidebar-user-info">
          <h4>{nombreEmpresa}</h4>
          <p>Administrador</p>
        </div>

        <button className="sidebar-logout">
          <FaSignOutAlt />
        </button>
      </div>
    </aside>
  );
}

