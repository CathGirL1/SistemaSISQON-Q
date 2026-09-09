interface ProjectItemProps {
  image: string;
  name: string;
  location: string;
  status: string;
  date: string;
}

export default function ProjectItem({
  image,
  name,
  location,
  status,
  date,
}: ProjectItemProps) {
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
      </div>
    </div>
  );
}