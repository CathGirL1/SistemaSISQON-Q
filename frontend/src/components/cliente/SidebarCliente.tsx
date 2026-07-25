import iconoHomeMenu from "../../assets/iconoHomeMenu.png";
import { NavLink } from "react-router-dom";

interface SidebarClienteProps {
  menuOpen: boolean;
  onClose: () => void;
}

export default function SidebarCliente({
  menuOpen,
  onClose,
}: SidebarClienteProps) {
  return (
    <>
      <aside className={`cliente-sidebar ${menuOpen ? "open" : ""}`}>
        <div className="cliente-logo">
          <img
            src={iconoHomeMenu}
            alt="SISCON-Q"
            className="logo-sisconq"
          />

          <div className="logo-info">
            <h2>SISCON-Q</h2>
            <p>Sistema de Cotizaciones Inteligentes</p>
          </div>
        </div>

        
          <nav className="cliente-menu">
  <NavLink
    to="/panel-cliente"
    end
    className={({ isActive }) => (isActive ? "active" : "")}
    onClick={onClose}
  >
    ⌂ Dashboard / Inicio
  </NavLink>

  <NavLink
    to="/panel-cliente/proyectos"
    className={({ isActive }) => (isActive ? "active" : "")}
    onClick={onClose}
  >
    ▣ Mis Proyectos
  </NavLink>

  <NavLink
    to="/panel-cliente/cotizaciones"
    className={({ isActive }) => (isActive ? "active" : "")}
    onClick={onClose}
  >
    ▤ Mis Cotizaciones
  </NavLink>

  <NavLink
    to="/panel-cliente/materiales"
    className={({ isActive }) => (isActive ? "active" : "")}
    onClick={onClose}
  >
    ▦ Catálogo de Materiales
  </NavLink>

  <NavLink
    to="/panel-cliente/comparador"
    className={({ isActive }) => (isActive ? "active" : "")}
    onClick={onClose}
  >
    ⚖ Comparador
  </NavLink>

  <NavLink
    to="/panel-cliente/empresas"
    className={({ isActive }) => (isActive ? "active" : "")}
    onClick={onClose}
  >
    ▥ Empresas
  </NavLink>



  <NavLink

    to="/panel-cliente/asistente"
    className={({ isActive }) => (isActive ? "active" : "")}
    onClick={onClose}
  >
    ✦ Asistente IA
  </NavLink>

        </nav>

        <div className="cliente-user">
          <div className="avatar">NM</div>

          <div>
            <strong>Nicolás Martinez</strong>
            <span>Cliente</span>
          </div>
        </div>
      </aside>

      {menuOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          onClick={onClose}
          aria-label="Cerrar menú"
        />
      )}
    </>
  );
}