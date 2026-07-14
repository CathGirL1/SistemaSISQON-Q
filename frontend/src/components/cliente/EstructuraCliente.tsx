import { useState } from "react";
import type { ReactNode } from "react";

import SidebarCliente from "./SidebarCliente";
import HeaderCliente from "./HeaderCliente";

interface EstructuraClienteProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function EstructuraCliente({
  title,
  subtitle,
  children,
}: EstructuraClienteProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="cliente-panel">
      <SidebarCliente
        menuOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <main className="cliente-main">
        <HeaderCliente
          title={title}
          subtitle={subtitle}
          menuOpen={menuOpen}
          onToggleMenu={() => setMenuOpen((prev) => !prev)}
        />

        {children}
      </main>
    </div>
  );
}