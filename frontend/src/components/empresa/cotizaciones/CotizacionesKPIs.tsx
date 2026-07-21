import "../../../styles/empresa/cotizaciones/CotizacionesKPIs.css";

import {
  FaFileInvoice,
  FaClipboardList,
  FaPhoneAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaFlag,
} from "react-icons/fa";

import KpiCard from "../../common/KpiCard";

export default function CotizacionesKPIs() {
  return (
    <div className="cotizaciones-kpis">
      <KpiCard title="Nueva" value={18} icon={<FaFileInvoice />} variant="blue" />
      <KpiCard title="En revisión" value={12} icon={<FaClipboardList />} variant="yellow" />
      <KpiCard title="Contactado" value={9} icon={<FaPhoneAlt />} variant="purple" />
      <KpiCard title="Aprobada" value={7} icon={<FaCheckCircle />} variant="green" />
      <KpiCard title="Rechazada" value={3} icon={<FaTimesCircle />} variant="red" />
      <KpiCard title="Finalizada" value={14} icon={<FaFlag />} variant="gray" />
    </div>
  );
}