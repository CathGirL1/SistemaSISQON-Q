import type { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  linkText: string;
  children: ReactNode;
}

export default function DashboardCard({
  title,
  linkText,
  children,
}: DashboardCardProps) {
  return (
    <article className="dashboard-card">
      <div className="card-header">
        <h3>{title}</h3>
        <a>Ver todas</a>
      </div>

      <div className="card-body">
        {children}
      </div>

      <button type="button" className="card-link">
        {linkText} →
      </button>
    </article>
  );
}