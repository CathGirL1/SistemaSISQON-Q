import type { ReactNode } from "react";

interface EmpresaStatCardProps {
  icon: ReactNode;
  valor: number;
  titulo: string;
  descripcion?: string;
  variante: "blue" | "green" | "purple" | "orange";
}

export default function EmpresaStatCard({
  icon,
  valor,
  titulo,
  variante,
}: EmpresaStatCardProps) {
  return (
    <article className={`empresa-stat-card empresa-stat-${variante}`}>
      <div className="empresa-stat-icon">
        {icon}
      </div>

      <div className="empresa-stat-content">
        <strong>{valor}</strong>

        <span>{titulo}</span>

      </div>
    </article>
  );
}