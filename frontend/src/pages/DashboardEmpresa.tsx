import EmpresaLayout from "../layouts/EmpresaLayout";
import DashboardEmpresaContenido from "../components/empresa/dashboard/DashboardEmpresaContenido";

export default function DashboardEmpresa() {
  return (
    <EmpresaLayout>
      <DashboardEmpresaContenido />
    </EmpresaLayout>
  );
}