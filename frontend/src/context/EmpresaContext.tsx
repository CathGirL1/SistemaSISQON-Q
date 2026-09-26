import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { Empresa } from "../types/Empresa";
import { obtenerEmpresaPorUsuario } from "../services/empresaService";

interface EmpresaContextType {
  empresa: Empresa | null;
  loading: boolean;
  recargarEmpresa: () => Promise<void>;
  setEmpresa: React.Dispatch<React.SetStateAction<Empresa | null>>;
}

const EmpresaContext = createContext<EmpresaContextType | undefined>(
  undefined
);

interface Props {
  children: ReactNode;
}

export function EmpresaProvider({ children }: Props) {
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState(true);

  const recargarEmpresa = useCallback(async () => {
    try {
      setLoading(true);

      const usuarioSesion = JSON.parse(
        localStorage.getItem("usuario") || "{}"
      );

      console.log("USUARIO SESION:", usuarioSesion);

      const idUsuario = Number(usuarioSesion.id_Usuario);

      console.log("ID USUARIO EMPRESA:", idUsuario);

      if (!idUsuario) {
        setEmpresa(null);
        return;
      }

      const datos = await obtenerEmpresaPorUsuario(idUsuario);

      console.log("EMPRESA OBTENIDA:", datos);

      setEmpresa(datos);
    } catch (error) {
      console.error("Error al obtener empresa:", error);
      setEmpresa(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    recargarEmpresa();
  }, [recargarEmpresa]);

  return (
    <EmpresaContext.Provider
      value={{
        empresa,
        loading,
        recargarEmpresa,
        setEmpresa,
      }}
    >
      {children}
    </EmpresaContext.Provider>
  );
}

export function useEmpresaContext() {
  const context = useContext(EmpresaContext);

  if (!context) {
    throw new Error(
      "useEmpresaContext debe utilizarse dentro de EmpresaProvider."
    );
  }

  return context;
}