import "../styles/DashboardEmpresa.css";

import EmpresaHeader from "./EmpresaHeader";
import EmpresaPerfilCard from "./EmpresaPerfilCard";
import EmpresaKPIs from "./EmpresaKPIs";
import EmpresaGraficoIngresos from "./EmpresaGraficoIngresos";
import EmpresaGraficoDistribucion from "./EmpresaGraficoDistribucion";
import EmpresaCotizacionesRecientes from "./EmpresaCotizacionesRecientes";
import EmpresaProyectosActivos from "./EmpresaProyectosActivos";
import EmpresaClientesRecientes from "./EmpresaClientesRecientes";

export default function DashboardEmpresaContenido() {
  return (
    <section className="dashboard-empresa">
      <EmpresaHeader />

      <div className="dashboard-top-grid">
        <EmpresaPerfilCard />
        <EmpresaKPIs />
      </div>

      <div className="dashboard-grid">
        <EmpresaCotizacionesRecientes />
        <EmpresaGraficoIngresos />
      </div>

      <div className="dashboard-bottom">
        <EmpresaClientesRecientes />
        <EmpresaGraficoDistribucion />
        <EmpresaProyectosActivos />
      </div>
    </section>
  );
}