import { useState } from "react";

interface ProjectItemProps {
  image: string;
  name: string;
  location: string;
  status: string;
  date: string;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ProjectItem({
  image,
  name,
  location,
  status,
  date,
  onView,
  onEdit,
  onDelete,
}: ProjectItemProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const badgeClass =
    status === "Borrador"
      ? "badge-borrador"
      : "badge-activo";

  return (
    <div className="list-row project-row">
      <img
        className="thumb"
        src={image}
        alt={name}
      />

      <div className="project-info">
        <strong>{name}</strong>
        <span>{location}</span>
      </div>

      <div className="row-actions">
        <em className={badgeClass}>
          {status}
        </em>

        <span className="project-date">
          {date}
        </span>

        <div
          className="project-menu-wrapper"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            className="dots-button"
            aria-label={`Opciones de ${name}`}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            ⋮
          </button>

          {menuOpen && (
            <div className="project-actions-menu">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onView?.();
                }}
              >
                Ver detalle
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onEdit?.();
                }}
              >
                Editar
              </button>

              <button
                type="button"
                className="project-action-delete"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete?.();
                }}
              >
                Eliminar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}