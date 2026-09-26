import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface DashboardCardProps {
  title: string;
  linkText?: string;
  linkTo?: string;
  children: ReactNode;
  onViewAll?: () => void;
}

export default function DashboardCard({
  title,
  linkText,
  linkTo,
  children,
  onViewAll,
}: DashboardCardProps) {
  return (
    <article className="dashboard-card">
      <div className="card-header">
        <h3>{title}</h3>
      </div>

      <div className="card-body">
        {children}
      </div>

      {linkText && (
        <>
          {onViewAll ? (
            <button
              type="button"
              className="card-link"
              onClick={onViewAll}
            >
              {linkText} →
            </button>
          ) : linkTo ? (
            <Link
              to={linkTo}
              className="card-link"
            >
              {linkText} →
            </Link>
          ) : null}
        </>
      )}
    </article>
  );
}