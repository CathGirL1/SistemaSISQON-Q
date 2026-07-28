import "../../../styles/empresa/tiposObra/TiposObraKPIs.css";

import {
  FaFileAlt,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import KpiCard from "../../common/KpiCard";

import type { TipoObraEmpresa } from "../../../interfaces/TipoObraEmpresa";

type Props = {
  tiposObra: TipoObraEmpresa[];
};

export default function TiposObraKPIs({
  tiposObra,
}: Props) {
  const total = tiposObra.length;

  const activos = tiposObra.filter(
    (tipo) => tipo.estado === "Activo"
  ).length;

  const inactivos = tiposObra.filter(
    (tipo) => tipo.estado === "Inactivo"
  ).length;

  return (
    <div className="tipos-obra-kpis">
      <KpiCard
        title="Total tipos de obra"
        value={total}
        icon={<FaFileAlt />}
        variant="blue"
      />

      <KpiCard
        title="Activos"
        value={activos}
        icon={<FaCheckCircle />}
        variant="green"
      />

      <KpiCard
        title="Inactivos"
        value={inactivos}
        icon={<FaTimesCircle />}
        variant="yellow"
      />
    </div>
  );
}