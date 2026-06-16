import "../styles/PanelClienteBackGround.css";

interface PanelClienteContenedorProps {
  children: React.ReactNode;
}

export default function PanelClienteContenedor({
  children,
}: PanelClienteContenedorProps) {
  return (
    <main className="fondo-panelCliente">
      {children}
    </main>
  );
}