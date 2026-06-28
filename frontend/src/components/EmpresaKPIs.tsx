import {
  FaFileInvoiceDollar,
  FaUsers,
  FaFolderOpen,
  FaDollarSign,
  FaArrowUp,
} from "react-icons/fa";

export default function EmpresaKPIs() {
  return (
    <div className="dashboard-kpis">
      <div className="kpi-card">
        <div className="kpi-icon cotizaciones">
          <FaFileInvoiceDollar />
        </div>

        <div>
          <p>Cotizaciones</p>
          <h3>128</h3>
          <span><FaArrowUp /> 12% este mes</span>
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-icon clientes">
          <FaUsers />
        </div>

        <div>
          <p>Clientes</p>
          <h3>64</h3>
          <span><FaArrowUp /> 8% este mes</span>
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-icon proyectos">
          <FaFolderOpen />
        </div>

        <div>
          <p>Proyectos activos</p>
          <h3>21</h3>
          <span><FaArrowUp /> 5 nuevos</span>
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-icon ingresos">
          <FaDollarSign />
        </div>

        <div>
          <p>Ingresos estimados</p>
          <h3>$ 842.500</h3>
          <span><FaArrowUp /> 18% este mes</span>
        </div>
      </div>
    </div>
  );
}