import "../../styles/CommonPanel.css";

type PageHeaderProps = {
  title: string;
  subtitle: string;
  buttonText?: string;
  onButtonClick?: () => void;
};

export default function PageHeader({
  title,
  subtitle,
  buttonText,
  onButtonClick,
}: PageHeaderProps) {
  return (
    <div className="page-header-panel">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      {buttonText && (
        <button className="page-header-btn" onClick={onButtonClick}>
          {buttonText}
        </button>
      )}
    </div>
  );
}