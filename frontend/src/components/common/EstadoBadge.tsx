import "../../styles/CommonPanel.css";

type EstadoBadgeProps = {
  estado: "Nueva" | "En revisión" | "Contactado" | "Aprobada" | "Rechazada" | "Finalizada";
};

export default function EstadoBadge({ estado }: EstadoBadgeProps) {
  const clase = estado
    .toLowerCase()
    .replace(" ", "-")
    .replace("ó", "o");

  return (
    <span className={`estado-badge ${clase}`}>
      {estado}
    </span>
  );
}