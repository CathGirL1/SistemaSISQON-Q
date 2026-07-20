import "../../../styles/empresa/manoObra/ManoObraKPIs.css";

import {
  FaUsers,
  FaDollarSign,
  FaTags,
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
            (total, trabajo) => total + trabajo.costoUnitario,
            0
          ) / trabajos.length
        );

  const categorias = new Set(
    trabajos.map((trabajo) => trabajo.categoria)
  ).size;

  const ultimaActualizacion =
    trabajos.length === 0
      ? "-"
      : trabajos.reduce((ultima, actual) =>
          new Date(actual.ultimaActualizacion) >
          new Date(ultima.ultimaActualizacion)
            ? actual
            : ultima
        ).ultimaActualizacion;

  const formatoMoneda = new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: "UYU",
    maximumFractionDigits: 0,
  });

  return (
    <div className="mano-obra-kpis">
      <KpiCard
        title="Trabajos activos"
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
        title="Categorías"
        value={categorias}
        icon={<FaTags />}
        variant="yellow"
      />

      <KpiCard
        title="Última actualización"
        value={ultimaActualizacion}
        icon={<FaChartLine />}
        variant="purple"
      />
    </div>
  );
}