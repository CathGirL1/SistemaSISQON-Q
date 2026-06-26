import "../styles/EmpresaLayout.css";

import SidebarEmpresa from "../components/SidebarEmpresa";
import NavbarEmpresa from "../components/NavbarEmpresa";

type EmpresaLayoutProps = {
  children: React.ReactNode;
};

export default function EmpresaLayout({ children }: EmpresaLayoutProps) {
  return (
    <div className="empresa-layout">
      <SidebarEmpresa />

      <div className="empresa-main">
        <NavbarEmpresa />

        <main className="empresa-content">
          {children}
        </main>
      </div>
    </div>
  );
}