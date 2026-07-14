interface QuoteItemProps {
  code: string;
  project: string;
  amount: string;
  date: string;
  tag: "Premium" | "Económica" | "Estándar";
}

export default function QuoteItem({
  code,
  project,
  amount,
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
        <span>{date}</span>
      </div>
    </div>
  );
}