interface QuoteItemProps {
  code: string;
  project: string;
  amount: string;
  amountUYU?: string;
  date: string;
  tag: string;
  onClick?: () => void;
}

export default function QuoteItem({
  code,
  project,
  amount,
  amountUYU,
  date,
  tag,
  onClick,
}: QuoteItemProps) {
  const badgeClass =
    tag === "Aceptada"
      ? "badge-premium"
      : tag === "Enviada" || tag === "Revisada"
        ? "badge-economica"
        : "badge-estandar";

  return (
    <div
      className="list-row quote-row no-thumb"
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(event) => {
        if (
          onClick &&
          (event.key === "Enter" || event.key === " ")
        ) {
          event.preventDefault();
          onClick();
        }
      }}
    >
      <div>
        <strong>{code}</strong>
        <span>{project}</span>
      </div>

      <em className={badgeClass}>{tag}</em>

      <div className="amount-box">
        <b>{amount}</b>

        {amountUYU && (
          <span className="amount-uyu">
            ({amountUYU})
          </span>
        )}

        <span>{date}</span>
      </div>
    </div>
  );
}