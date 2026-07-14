interface CompanyItemProps {
  logo: string;
  name: string;
  category: string;
  rating: string;
}

export default function CompanyItem({
  logo,
  name,
  category,
  rating,
}: CompanyItemProps) {
  return (
    <div className="list-row company-row">
      <div className="company-logo">{logo}</div>

      <div>
        <strong>{name}</strong>
        <span>{category}</span>
      </div>

      <b className="rating">{rating} ⭐</b>
    </div>
  );
}