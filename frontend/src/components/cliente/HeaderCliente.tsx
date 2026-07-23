import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderClienteProps {
  title?: string;
  subtitle?: string;
  menuOpen: boolean;
  onToggleMenu: () => void;
  showCreateButton?: boolean;
}

export default function HeaderCliente({
  title,
  subtitle,
  menuOpen,
  onToggleMenu,
  showCreateButton = false,
}: HeaderClienteProps) {
  const navigate = useNavigate();

  const irACrearProyecto = () => {
    navigate("/panel-cliente/proyectos/crear");
  };

  const mostrarTitulo = Boolean(title || subtitle);

  return (
    <header
      className={`cliente-header ${
        !mostrarTitulo ? "cliente-header-minimal" : ""
      }`}
    >
      <button
        type="button"
        className="menu-toggle"
        onClick={onToggleMenu}
        aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {mostrarTitulo && (
        <div className="header-title">
          {title && <h1>{title}</h1>}
          {subtitle && <p>{subtitle}</p>}
        </div>
      )}

      <div className="header-actions">
        {showCreateButton && (
          <button
            type="button"
            className="btn-create"
            onClick={irACrearProyecto}
          >
            <span className="btn-plus">+</span>
            Crear nuevo proyecto
          </button>
        )}

        <button
          type="button"
          className="icon-button notification-button"
          aria-label="Notificaciones"
        >
          🔔
          <span className="notification-badge">3</span>
        </button>

        <button
          type="button"
          className="icon-button"
          aria-label="Ayuda"
        >
          ?
        </button>
      </div>
    </header>
  );
}