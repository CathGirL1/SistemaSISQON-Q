import "../styles/PanelEmpresaBackGround.css";

interface PanelEmpresaContenedorProps {
  children: React.ReactNode;
}

export default function PanelClienteContenedor({
  children,
}: PanelEmpresaContenedorProps) {
  return (
    <main className="fondo-panelEmpresa">
      {children}
    </main>
  );
}