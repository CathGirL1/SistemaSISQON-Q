import "../../styles/CommonPanel.css";

export type EstadoCotizacion =
  | "Borrador"
  | "Enviada"
  | "Revisada"
  | "Aceptada"
  | "Rechazada"
  | "Finalizada";

type EstadoBadgeProps = {
  estado: EstadoCotizacion;
};

export default function EstadoBadge({
  estado,
}: EstadoBadgeProps) {
  const clase = estado
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");

  return (
    <span className={`estado-badge ${clase}`}>
      {estado}
    </span>
  );
}