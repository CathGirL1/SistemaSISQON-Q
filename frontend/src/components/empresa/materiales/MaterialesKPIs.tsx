import "../../../styles/empresa/materiales/MaterialesKPIs.css";

import {
  FaBoxOpen,
  FaCheckCircle,
  FaExclamationTriangle,
  FaBan,
} from "react-icons/fa";

import KpiCard from "../../common/KpiCard";
import type { MaterialEmpresa } from "../../../interfaces/MaterialEmpresa";

type Props = {
  materiales: MaterialEmpresa[];
};

export default function MaterialesKPIs({
  materiales,
}: Props) {
  const totalMateriales = materiales.length;

  const disponibles = materiales.filter(
    (material) =>
      material.disponibilidad === "Disponible"
  ).length;

  const stockBajo = materiales.filter(
    (material) =>
      material.disponibilidad === "Stock bajo"
  ).length;

  const desactivados = materiales.filter(
    (material) =>
      material.estado === "Inactivo"
  ).length;

  return (
    <div className="materiales-kpis">
      <KpiCard
        title="Total materiales"
        value={totalMateriales}
        icon={<FaBoxOpen />}
        variant="blue"
      />

      <KpiCard
        title="Disponibles"
        value={disponibles}
        icon={<FaCheckCircle />}
        variant="green"
      />

      <KpiCard
        title="Stock bajo"
        value={stockBajo}
        icon={<FaExclamationTriangle />}
        variant="yellow"
      />

      <KpiCard
        title="Desactivados"
        value={desactivados}
        icon={<FaBan />}
        variant="red"
      />
    </div>
  );
}