interface ProjectItemProps {
  image: string;
  name: string;
  location: string;
  status: string;
}

export default function ProjectItem({
  image,
  name,
  location,
  status,
}: ProjectItemProps) {
  const badgeClass =
    status === "Borrador" ? "badge-borrador" : "badge-activo";

  return (
    <div className="list-row project-row">
      <img className="thumb" src={image} alt={name} />

      <div>
        <strong>{name}</strong>
        <span>{location}</span>
      </div>

      <div className="row-actions">
        <em className={badgeClass}>{status}</em>

        <button
          type="button"
          className="dots-button"
          aria-label={`Opciones de ${name}`}
        >
          ⋮
        </button>
      </div>
    </div>
  );
}