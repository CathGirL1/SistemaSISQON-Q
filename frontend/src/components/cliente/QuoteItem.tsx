interface QuoteItemProps {
  code: string;
  project: string;
  amount: string;
  amountUYU: string;
  date: string;
  tag: string;
}

export default function QuoteItem({
  code,
  project,
  amount,
  amountUYU,
  date,
  tag,
}: QuoteItemProps) {
  const badgeClass =
    tag === "Premium"
      ? "badge-premium"
      : tag === "Económica"
      ? "badge-economica"
      : "badge-estandar";

  return (
    <div className="list-row quote-row no-thumb">
      <div>
        <strong>{code}</strong>
        <span>{project}</span>
      </div>

      <em className={badgeClass}>{tag}</em>

      <div className="amount-box">
        <b>{amount}</b>

        <span className="amount-uyu">
          ({amountUYU})
        </span>

        <span>{date}</span>
      </div>
    </div>
  );
}