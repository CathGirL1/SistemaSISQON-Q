import "../../../styles/DashboardEmpresa.css";

import EmpresaHeader from "../dashboard/EmpresaHeader";
import EmpresaPerfilCard from "../dashboard/EmpresaPerfilCard";
import EmpresaKPIs from "../dashboard/EmpresaKPIs";
import EmpresaGraficoIngresos from "../dashboard/EmpresaGraficoIngresos";
import EmpresaGraficoDistribucion from "../dashboard/EmpresaGraficoDistribucion";
import EmpresaCotizacionesRecientes from "../dashboard/EmpresaCotizacionesRecientes";
import EmpresaProyectosActivos from "../dashboard/EmpresaProyectosActivos";
import EmpresaClientesRecientes from "../dashboard/EmpresaClientesRecientes";

import useDashboard from "../../../hooks/useDashboard";

export default function DashboardEmpresaContenido() {
  const {
    dashboard,
    loading,
  } = useDashboard();

  if (loading) {
    return (
      <section className="dashboard-empresa">
        <div className="dashboard-estado">
          Cargando información del Dashboard...
        </div>
      </section>
    );
  }

  if (!dashboard) {
    return (
      <section className="dashboard-empresa">
        <div className="dashboard-estado dashboard-error">
          No fue posible cargar el Dashboard.
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard-empresa">
      <EmpresaHeader />

      <div className="dashboard-top-grid">
        <EmpresaPerfilCard
          empresa={dashboard.empresa}
        />

        <EmpresaKPIs
          kpis={dashboard.kpis}
        />
      </div>

      <div className="dashboard-grid">
        <EmpresaCotizacionesRecientes
          cotizaciones={dashboard.cotizaciones}
        />

        <EmpresaGraficoIngresos
          ingresos={dashboard.ingresos}
        />
      </div>

      <div className="dashboard-bottom">
        <EmpresaClientesRecientes
          clientes={dashboard.clientes}
        />

        <EmpresaGraficoDistribucion
          distribucion={dashboard.distribucion}
        />

        <EmpresaProyectosActivos
          proyectos={dashboard.proyectos}
        />
      </div>
    </section>
  );
}