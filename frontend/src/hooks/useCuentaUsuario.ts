import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import type { Usuario } from "../types/Usuario";

import {
  obtenerUsuarioPorId,
  actualizarUsuario,
} from "../services/usuarioService";

const usuarioVacio: Usuario = {
  idUsuario: 0,

  nombreUsuario: "",

  nombre: "",
  apellido: "",

  gmail: "",
  telefono: "",

  cargo: "",
  departamento: "",

  ciudad: "",
  pais: "",

  fechaRegistro: "",
  ultimoAcceso: "",
};

export default function useCuentaUsuario() {
  const [usuario, setUsuario] =
    useState<Usuario>(usuarioVacio);

  const [usuarioOriginal, setUsuarioOriginal] =
    useState<Usuario>(usuarioVacio);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    cargarUsuario();
  }, []);

  const cargarUsuario = async () => {
    try {
      const usuarioSesion = JSON.parse(
        localStorage.getItem("usuario") || "{}"
      );

      const idUsuario = usuarioSesion.id_Usuario;

      if (!idUsuario) {
        throw new Error(
          "No existe una sesión iniciada."
        );
      }

      const datos =
        await obtenerUsuarioPorId(idUsuario);

      setUsuario(datos);
      setUsuarioOriginal(datos);
    } catch (error) {
      console.error(error);

      alert(
        "No fue posible cargar la información del usuario."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setUsuario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancelar = () => {
    setUsuario(usuarioOriginal);
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      const usuarioSesion = JSON.parse(
        localStorage.getItem("usuario") || "{}"
      );

      const idUsuario =
        usuarioSesion.id_Usuario;

      const actualizado =
        await actualizarUsuario(
          idUsuario,
          usuario
        );

      setUsuario(actualizado);
      setUsuarioOriginal(actualizado);

      alert(
        "Datos actualizados correctamente."
      );
    } catch (error) {
      console.error(error);

      alert(
        "Ocurrió un error al guardar los cambios."
      );
    }
  };

  return {
    usuario,
    loading,

    handleChange,
    handleCancelar,
    handleSubmit,
  };
}