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

import type {
  Cotizacion,
} from "../../../interfaces/Cotizacion";

type Props = {
  cotizaciones: Cotizacion[];
};

export default function CotizacionesKPIs({
  cotizaciones,
}: Props) {

  // =====================================================
  // ESTADÍSTICAS
  // =====================================================

  const nuevas =
    cotizaciones.filter(
      (cotizacion) =>
        cotizacion.estado === "Nueva"
    ).length;

  const enRevision =
    cotizaciones.filter(
      (cotizacion) =>
        cotizacion.estado === "En revisión"
    ).length;

  const contactadas =
    cotizaciones.filter(
      (cotizacion) =>
        cotizacion.estado === "Contactado"
    ).length;

  const aprobadas =
    cotizaciones.filter(
      (cotizacion) =>
        cotizacion.estado === "Aprobada"
    ).length;

  const rechazadas =
    cotizaciones.filter(
      (cotizacion) =>
        cotizacion.estado === "Rechazada"
    ).length;

  const finalizadas =
    cotizaciones.filter(
      (cotizacion) =>
        cotizacion.estado === "Finalizada"
    ).length;

  return (
    <div className="cotizaciones-kpis">

      <KpiCard
        title="Nueva"
        value={nuevas}
        icon={<FaFileInvoice />}
        variant="blue"
      />

      <KpiCard
        title="En revisión"
        value={enRevision}
        icon={<FaClipboardList />}
        variant="yellow"
      />

      <KpiCard
        title="Contactado"
        value={contactadas}
        icon={<FaPhoneAlt />}
        variant="purple"
      />

      <KpiCard
        title="Aprobada"
        value={aprobadas}
        icon={<FaCheckCircle />}
        variant="green"
      />

      <KpiCard
        title="Rechazada"
        value={rechazadas}
        icon={<FaTimesCircle />}
        variant="red"
      />

      <KpiCard
        title="Finalizada"
        value={finalizadas}
        icon={<FaFlag />}
        variant="gray"
      />

    </div>
  );
}