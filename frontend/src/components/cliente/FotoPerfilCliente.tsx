import { useRef, useState, } from "react";

import "../../styles/FotoPerfilCliente.css";

interface FotoPerfilClienteProps {
  cliente: {
    id_Cliente: number;
    nombre: string;
    apellido: string;
    logo: string | null;
  };
  onFotoActualizada: (logo: string | null) => void;
}

export default function FotoPerfilCliente({
  cliente,
  onFotoActualizada,
}: FotoPerfilClienteProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");

  const seleccionarArchivo = () => {
    inputRef.current?.click();
  };

  const manejarCambioFoto = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const archivo = e.target.files?.[0];

    if (!archivo) {
      return;
    }

    setError("");

    const tiposPermitidos = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
    ];

    if (!tiposPermitidos.includes(archivo.type)) {
      setError(
        "La foto debe ser JPG, PNG, WEBP o SVG."
      );

      e.target.value = "";
      return;
    }

    if (archivo.size > 2 * 1024 * 1024) {
      setError(
        "La imagen no puede superar los 2 MB."
      );

      e.target.value = "";
      return;
    }

    const formData = new FormData();

    formData.append("foto", archivo);

    try {
      setSubiendo(true);

      const respuesta = await fetch(
        `http://localhost:3000/api/clientes/${cliente.id_Cliente}/foto`,
        {
          method: "PUT",
          body: formData,
        }
      );

      console.log("STATUS:", respuesta.status);

      const datos = await respuesta.json();

      console.log("RESPUESTA FOTO:", datos)

   

      if (!respuesta.ok) {
        throw new Error(
          datos?.mensaje ||
            "No se pudo actualizar la foto."
        );
      }

      onFotoActualizada(datos.logo);

      console.log("LOGO DEVUELTO:", datos.logo);

      window.dispatchEvent(
        new Event("cliente-logo-actualizado")
      );

      e.target.value = "";
    } catch (error) {
      console.error(
        "Error al actualizar la foto:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar la foto."
      );
    } finally {
      setSubiendo(false);
    }
  };

  const urlFoto = cliente.logo
    ? `http://localhost:3000${cliente.logo}`
    : null;

  return (
    <div className="foto-perfil-container">
      <div className="foto-perfil">
        {urlFoto ? (
          <img
            src={urlFoto}
            alt={`Foto de ${cliente.nombre} ${cliente.apellido}`}
          />
        ) : (
          <>
            {cliente.nombre.charAt(0)}
            {cliente.apellido.charAt(0)}
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        onChange={manejarCambioFoto}
        hidden
      />

      <button
        type="button"
        className="foto-perfil-button"
        onClick={seleccionarArchivo}
        disabled={subiendo}
      >
        {subiendo
          ? "Subiendo..."
          : cliente.logo
          ? "Cambiar foto"
          : "Agregar foto"}
      </button>

      {error && (
        <p className="foto-perfil-error">
          {error}
        </p>
      )}
    </div>
  );
}