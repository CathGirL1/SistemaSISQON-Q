import "../../../styles/empresa/tiposObra/TiposObraKPIs.css";

import { FaFileAlt, FaLightbulb, FaUserCog, FaPuzzlePiece } from "react-icons/fa";
import KpiCard from "../../common/KpiCard";

export default function TiposObraKPIs() {
  return (
    <div className="tipos-obra-kpis">
      <KpiCard title="Total tipos de obra" value={6} icon={<FaFileAlt />} variant="blue" />
      <KpiCard title="Con cálculo automático" value={6} icon={<FaLightbulb />} variant="green" />
      <KpiCard title="Mano de obra configurada" value={6} icon={<FaUserCog />} variant="yellow" />
      <KpiCard title="Extras configurados" value={6} icon={<FaPuzzlePiece />} variant="purple" />
    </div>
  );
}