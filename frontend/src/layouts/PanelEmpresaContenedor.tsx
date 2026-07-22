import "../styles/PanelEmpresaBackGround.css";

interface PanelEmpresaContenedorProps {
  children: React.ReactNode;
}

export default function PanelEmpresaContenedor({
  children,
}: PanelEmpresaContenedorProps) {
  return (
    <main className="fondo-panelEmpresa">
      {children}
    </main>
  );
}