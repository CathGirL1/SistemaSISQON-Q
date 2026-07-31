import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { Usuario } from "../types/Usuario";

const usuarioInicial: Usuario = {
  idUsuario: 1,

  nombreUsuario: "constructora.demo",
  nombre: "Juan",
  apellido: "Pérez",

  gmail: "constructora@email.com",
  telefono: "099123456",

  cargo: "Administrador",
  departamento: "Administración",

  ciudad: "Maldonado",
  pais: "Uruguay",

  fechaRegistro: "15/06/2026",
  ultimoAcceso: "27/07/2026 20:13",
};

export default function useCuentaUsuario() {
  const [usuario, setUsuario] = useState<Usuario>(usuarioInicial);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setUsuario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancelar = () => {
    setUsuario(usuarioInicial);
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      console.log("Guardar usuario:", usuario);

      // TODO:
      // await UsuarioService.actualizar(usuario);

      alert("Datos actualizados correctamente.");
    } catch (error) {
      console.error(error);

      alert("Ocurrió un error al guardar los cambios.");
    }
  };

  return {
    usuario,
    handleChange,
    handleCancelar,
    handleSubmit,
  };
}