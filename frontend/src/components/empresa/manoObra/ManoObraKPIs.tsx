import "../../../styles/empresa/manoObra/ManoObraKPIs.css";

import {
  FaUsers,
  FaDollarSign,
  FaMapMarkerAlt,
  FaChartLine,
} from "react-icons/fa";

import KpiCard from "../../common/KpiCard";
import type { ManoObraEmpresa } from "../../../interfaces/ManoObraEmpresa";

type Props = {
  trabajos: ManoObraEmpresa[];
};

export default function ManoObraKPIs({ trabajos }: Props) {
  const trabajosActivos = trabajos.filter(
    (trabajo) => trabajo.estado === "Activo"
  );

  const costoPromedio =
    trabajos.length === 0
      ? 0
      : Math.round(
          trabajos.reduce(
            (total, trabajo) => total + trabajo.costoMedia,
            0
          ) / trabajos.length
        );

  const zonas = new Set(
    trabajos.map((trabajo) => trabajo.zona)
  ).size;

  const formatoMoneda = new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: "UYU",
    maximumFractionDigits: 0,
  });

  return (
    <div className="mano-obra-kpis">
      <KpiCard
        title="Tipos de trabajo"
        value={trabajosActivos.length}
        icon={<FaUsers />}
        variant="blue"
      />

      <KpiCard
        title="Costo promedio"
        value={formatoMoneda.format(costoPromedio)}
        icon={<FaDollarSign />}
        variant="green"
      />

      <KpiCard
        title="Zonas configuradas"
        value={zonas}
        icon={<FaMapMarkerAlt />}
        variant="yellow"
      />

      <KpiCard
        title="Última actualización"
        value="28/05/2024"
        icon={<FaChartLine />}
        variant="purple"
      />
    </div>
  );
}