import "../../styles/CommonPanel.css";
import { FaSearch } from "react-icons/fa";

type PanelSearchBarProps = {
  placeholder: string;
};

export default function PanelSearchBar({ placeholder }: PanelSearchBarProps) {
  return (
    <div className="panel-search">
      <FaSearch />
      <input type="text" placeholder={placeholder} />
    </div>
  );
}