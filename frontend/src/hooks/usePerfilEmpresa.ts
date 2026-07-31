import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { Empresa } from "../types/Empresa";

const empresaInicial: Empresa = {
  razonSocial: "Constructora Demo S.A.",
  nombreComercial: "Constructora Demo",
  rut: "213123120001",
  rubro: "Construcción",

  email: "empresa@demo.com",
  telefono: "099 123 456",
  direccion: "Av. Principal 123, Maldonado",

  paginaWeb: "",
  descripcion: "",
  logo: "",
};

export default function usePerfilEmpresa() {
  const [empresa, setEmpresa] = useState<Empresa>(empresaInicial);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setEmpresa((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancelar = () => {
    setEmpresa(empresaInicial);
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      console.log("Empresa:", empresa);

      // TODO:
      // await EmpresaService.actualizar(empresa);

      alert("Datos actualizados correctamente.");
    } catch (error) {
      console.error(error);

      alert("Ocurrió un error al guardar los cambios.");
    }
  };

  return {
    empresa,
    handleChange,
    handleCancelar,
    handleSubmit,
  };
}