import "../../../styles/empresa/materiales/MaterialesKPIs.css";

import { FaBoxOpen, FaDollarSign, FaClock, FaBan } from "react-icons/fa";
import KpiCard from "../../common/KpiCard";

export default function MaterialesKPIs() {
  return (
    <div className="materiales-kpis">
      <KpiCard title="Total materiales" value={87} icon={<FaBoxOpen />} variant="blue" />
      <KpiCard title="Precios actualizados" value={72} icon={<FaDollarSign />} variant="green" />
      <KpiCard title="Por actualizar" value={15} icon={<FaClock />} variant="yellow" />
      <KpiCard title="Desactivados" value={8} icon={<FaBan />} variant="red" />
    </div>
  );
}