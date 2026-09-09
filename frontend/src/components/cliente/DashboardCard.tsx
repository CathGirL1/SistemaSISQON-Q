import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface DashboardCardProps {
  title: string;
  linkText: string;
  linkTo: string;
  children: ReactNode;
}

export default function DashboardCard({
  title,
  linkText,
  linkTo,
  children,
}: DashboardCardProps) {
  return (
    <article className="dashboard-card">

      <div className="card-header">
        <h3>{title}</h3>
      </div>

      <div className="card-body">
        {children}
      </div>

      <Link
        to={linkTo}
        className="card-link"
      >
        {linkText} →
      </Link>

    </article>
  );
}