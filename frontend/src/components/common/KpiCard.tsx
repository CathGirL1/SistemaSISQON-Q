import "../../styles/CommonPanel.css";
import type { ReactNode } from "react";

type KpiCardProps = {
  title: string;
  value: string | number;
  icon: ReactNode;
  variant?: "blue" | "green" | "yellow" | "purple" | "red" | "gray";
};

export default function KpiCard({
  title,
  value,
  icon,
  variant = "blue",
}: KpiCardProps) {
  return (
    <div className="panel-kpi-card">
      <div className={`panel-kpi-icon ${variant}`}>
        {icon}
      </div>

      <div>
        <p>{title}</p>
        <h3>{value}</h3>
      </div>
    </div>
  );
}