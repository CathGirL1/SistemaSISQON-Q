import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  children: ReactNode;
  rolPermitido?: "cliente" | "empresa";
};

export default function ProtectedRoutes({
  children,
  rolPermitido,
}: Props) {
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");

    // No hay sesión iniciada
    if (!usuarioGuardado) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const usuario = JSON.parse(usuarioGuardado);

      // El usuario no tiene el rol permitido
      if (
        rolPermitido &&
        usuario.rol !== rolPermitido
      ) {
        if (usuario.rol === "cliente") {
          navigate("/panel-cliente", { replace: true });
          return;
        }

        if (usuario.rol === "empresa") {
          navigate("/panel-empresa", { replace: true });
          return;
        }

        localStorage.removeItem("usuario");
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.error("Sesión inválida:", error);

      localStorage.removeItem("usuario");
      navigate("/login", { replace: true });
    }
  }, [navigate, rolPermitido]);

  return <>{children}</>;
}