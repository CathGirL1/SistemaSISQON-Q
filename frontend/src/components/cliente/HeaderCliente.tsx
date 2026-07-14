import { Menu, X } from "lucide-react";

interface HeaderClienteProps {
  title: string;
  subtitle?: string;
  menuOpen: boolean;
  onToggleMenu: () => void;
}

export default function HeaderCliente({
  title,
  subtitle,
  menuOpen,
  onToggleMenu,
}: HeaderClienteProps) {
  return (
    <header className="cliente-header">
      <button
        type="button"
        className="menu-toggle"
        onClick={onToggleMenu}
        aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      <div className="header-title">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>

      <div className="header-actions">
        <button type="button" className="btn-create">
          <span className="btn-plus">+</span>
          Crear nuevo proyecto
        </button>

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