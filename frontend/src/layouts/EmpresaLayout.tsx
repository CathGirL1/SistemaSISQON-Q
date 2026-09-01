import "../styles/EmpresaLayout.css";

import type { ReactNode } from "react";

import SidebarEmpresa from "../components/SidebarEmpresa";
import NavbarEmpresa from "../components/NavbarEmpresa";

import { EmpresaProvider } from "../context/EmpresaContext";

type EmpresaLayoutProps = {
  children: ReactNode;
};

export default function EmpresaLayout({
  children,
}: EmpresaLayoutProps) {
  return (
    <EmpresaProvider>
      <div className="empresa-layout">
        <SidebarEmpresa />

        <div className="empresa-main">
          <NavbarEmpresa />

          <main className="empresa-content">
            {children}
          </main>
        </div>
      </div>
    </EmpresaProvider>
  );
}