import "../styles/HomeBackground.css";

interface HomeContenedorProps {
  children: React.ReactNode;
}

export default function HomeContenedor({
  children,
}: HomeContenedorProps) {
  return (
    <main className="fondo-home">
      {children}
    </main>
  );
}