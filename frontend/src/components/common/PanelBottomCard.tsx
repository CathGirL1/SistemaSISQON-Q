import "../../styles/CommonPanel.css";
import { FaLightbulb } from "react-icons/fa";

type Props = {
  title: string;
  description: string;
};

export default function PanelBottomCard({
  title,
  description,
}: Props) {
  return (
    <div className="panel-bottom-card">

      <div className="panel-bottom-icon">
        <FaLightbulb />
      </div>

      <div>

        <h3>{title}</h3>

        <p>{description}</p>

      </div>

    </div>
  );
}