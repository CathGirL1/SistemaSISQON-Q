import "../styles/RecuperarContraseniaContenedor.css";

interface RecuperarContraseniaContenedorProps {
  children: React.ReactNode;
}

export default function RecuperarContraseniaContenedor({
  children,
}: RecuperarContraseniaContenedorProps) {
  return (
    <main className="fondo-RecuperarContrasenia">
      {children}
    </main>
  );
}