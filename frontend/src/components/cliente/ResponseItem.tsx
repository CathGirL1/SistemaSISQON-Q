interface ResponseItemProps {
  logo?: string;
  company: string;
  code: string;
  status:  | "Propuesta recibida"
        | "En revisión"
        | "Rechazada"
        | "Cotización finalizada";
  time: string;
}

export default function ResponseItem({
  logo,
  company,
  code,
  status,
  time,
}: ResponseItemProps) {
  const badgeClass =
    status === "Rechazada"
      ? "badge-danger"
      : status === "En revisión"
      ? "badge-warning"
      : "badge-success";

      const obtenerIniciales = (nombre: string) => {
      return nombre
        .trim()
        .substring(0, 2)
        .toUpperCase();
    };


  return (
    <div className="list-row response-row">
        <div className="company-logo">
        {logo ? (
          <img
            src={logo}
            alt={`Logo de ${company}`}
          />
        ) : (
          obtenerIniciales(company)
        )}
      </div>

      <div>
        <strong>{company}</strong>
        <span>{code}</span>
      </div>

      <div className="response-status">
        <em className={badgeClass}>{status}</em>
        <span>{time}</span>
      </div>
    </div>
  );
}