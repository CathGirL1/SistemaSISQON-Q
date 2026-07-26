import "../../styles/CommonPanel.css";
import { FaSearch } from "react-icons/fa";

type PanelSearchBarProps = {
  placeholder: string;
  value?: string;
  onChange?: (valor: string) => void;
};

export default function PanelSearchBar({
  placeholder,
  value = "",
  onChange,
}: PanelSearchBarProps) {
  return (
    <div className="panel-search">
      <FaSearch />

      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}