import "../styles/RegistroBackground.css";

interface RegistroContenedorProps {
  children: React.ReactNode;
}

export default function RegistroContenedor({
  children,
}: RegistroContenedorProps) {
  return (
    <main className="fondo-registro">
      {children}
    </main>
  );
}