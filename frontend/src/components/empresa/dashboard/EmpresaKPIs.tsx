import {
  FaFileInvoiceDollar,
  FaUsers,
  FaFolderOpen,
  FaDollarSign,
} from "react-icons/fa";

import type {
  KPIsDashboard,
} from "../../../interfaces/Dashboard";

type Props = {
  kpis: KPIsDashboard;
};

function formatearMoneda(valor: number): string {
  return `US$ ${Number(valor).toLocaleString(
    "es-UY",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;
}

export default function EmpresaKPIs({
  kpis,
}: Props) {
  return (
    <div className="dashboard-kpis">
      <div className="kpi-card">
        <div className="kpi-icon cotizaciones">
          <FaFileInvoiceDollar />
        </div>

        <div>
          <p>Cotizaciones</p>
          <h3>{kpis.cotizaciones}</h3>
          <span>Total registrado</span>
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-icon clientes">
          <FaUsers />
        </div>

        <div>
          <p>Clientes</p>
          <h3>{kpis.clientes}</h3>
          <span>Clientes registrados</span>
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-icon proyectos">
          <FaFolderOpen />
        </div>

        <div>
          <p>Proyectos activos</p>
          <h3>{kpis.proyectosActivos}</h3>
          <span>En curso actualmente</span>
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-icon ingresos">
          <FaDollarSign />
        </div>

        <div>
          <p>Ingresos</p>

          <h3>
            {formatearMoneda(
              kpis.ingresosEstimados
            )}
          </h3>

          <span>Cotizaciones finalizadas</span>
        </div>
      </div>
    </div>
  );
}