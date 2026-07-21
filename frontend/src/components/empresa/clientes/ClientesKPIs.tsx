import "../../../styles/empresa/clientes/ClientesKPIs.css";

import { FaUsers, FaUserClock, FaPhoneAlt, FaCheckCircle } from "react-icons/fa";
import KpiCard from "../../common/KpiCard";

export default function ClientesKPIs() {
  return (
    <div className="clientes-kpis">
      <KpiCard title="Total clientes" value={156} icon={<FaUsers />} variant="blue" />
      <KpiCard title="Interesados" value={48} icon={<FaUserClock />} variant="yellow" />
      <KpiCard title="Contactados" value={67} icon={<FaPhoneAlt />} variant="purple" />
      <KpiCard title="Confirmados" value={41} icon={<FaCheckCircle />} variant="green" />
    </div>
  );
}