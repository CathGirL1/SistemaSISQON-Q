import "../styles/LoginBackground.css";

interface LoginContenedorProps {
  children: React.ReactNode;
}

export default function LoginContenedor({
  children,
}: LoginContenedorProps) {
  return (
    <main className="fondo-login">
      {children}
    </main>
  );
}