import "../styles/RegistroProyectoBackground.css";

interface RegistroProyectoContenedorProps {
  children: React.ReactNode;
}

export default function RegistroProyectoContenedor({
  children,
}: RegistroProyectoContenedorProps) {
  return (
    <main className="fondo-registro">
      {children}
    </main>
  );
}