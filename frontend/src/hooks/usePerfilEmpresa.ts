import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import type { Empresa } from "../types/Empresa";

import {
  obtenerEmpresaPorUsuario,
  actualizarEmpresa,
} from "../services/empresaService";

import useEmpresa from "./useEmpresa";

const empresaVacia: Empresa = {
  idEmpresa: 0,

  razonSocial: "",
  nombreComercial: "",

  rut: "",
  rubro: "",

  email: "",
  telefono: "",

  direccion: "",
  paginaWeb: "",

  descripcion: "",

  logo: "",

  fechaRegistro: "",

  zonasTrabajo: "",

  condicionesComerciales: "",

  textoLegal: "",

  impuestos: "",

  validezCotizacion: 30,

  diasLaborables: "",

  horarioInicio: "",

  horarioFin: "",

  idiomaDocumentos: "",
};

export default function usePerfilEmpresa() {

  const {
    empresa: empresaContexto,
    setEmpresa,
  } = useEmpresa();

  const [empresa, setEmpresaLocal] =
    useState<Empresa>(empresaVacia);

  const [empresaOriginal, setEmpresaOriginal] =
    useState<Empresa>(empresaVacia);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    if (empresaContexto) {

      setEmpresaLocal(empresaContexto);
      setEmpresaOriginal(empresaContexto);

      setLoading(false);

      return;
    }

    cargarEmpresa();

  }, [empresaContexto]);

  const cargarEmpresa = async () => {

    try {

      const usuarioSesion = JSON.parse(
        localStorage.getItem("usuario") || "{}"
      );

      const idUsuario = usuarioSesion.id_Usuario;

      if (!idUsuario) {
        throw new Error("No existe una sesión iniciada.");
      }

      const datos =
        await obtenerEmpresaPorUsuario(idUsuario);

      setEmpresaLocal(datos);
      setEmpresaOriginal(datos);

      setEmpresa(datos);

    } catch (error) {

      console.error(error);

      alert(
        "No fue posible cargar la información de la empresa."
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

    setEmpresaLocal((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancelar = () => {

    setEmpresaLocal(empresaOriginal);

  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    try {

      const empresaActualizada =
        await actualizarEmpresa(empresa);

      setEmpresaLocal(empresaActualizada);
      setEmpresaOriginal(empresaActualizada);

      // ESTA ES LA LÍNEA IMPORTANTE
      setEmpresa(empresaActualizada);

      alert(
        "Empresa actualizada correctamente."
      );

    } catch (error) {

      console.error(error);

      alert(
        "Ocurrió un error al guardar los cambios."
      );

    }
  };

  return {

    empresa,

    loading,

    handleChange,

    handleCancelar,

    handleSubmit,

  };

}