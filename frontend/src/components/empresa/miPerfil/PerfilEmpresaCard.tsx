import "../../../styles/empresa/miPerfil/PerfilEmpresaCard.css";

import {
  FaBuilding,
  FaCheckCircle,
  FaCamera,
  FaMapMarkerAlt,
  FaIdCard,
} from "react-icons/fa";

import {
  useRef,
  useState,
} from "react";

import type { ChangeEvent } from "react";
import type { Empresa } from "../../../types/Empresa";

import { subirLogoEmpresa } from "../../../services/empresaService";
import useEmpresa from "../../../hooks/useEmpresa";

interface Props {
  empresa: Empresa;
}

export default function PerfilEmpresaCard({
  empresa,
}: Props) {
  const inputArchivoRef =
    useRef<HTMLInputElement>(null);

  const [subiendoLogo, setSubiendoLogo] =
    useState(false);

  const { setEmpresa } = useEmpresa();

  const abrirSelectorLogo = () => {
    inputArchivoRef.current?.click();
  };

  const seleccionarLogo = async (
    evento: ChangeEvent<HTMLInputElement>
  ) => {
    const archivo =
      evento.target.files?.[0];

    if (!archivo) {
      return;
    }

    const tiposPermitidos = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
    ];

    if (!tiposPermitidos.includes(archivo.type)) {
      alert(
        "Seleccioná una imagen JPG, PNG, WEBP o SVG."
      );

      evento.target.value = "";
      return;
    }

    if (archivo.size > 2 * 1024 * 1024) {
      alert(
        "El logo no puede superar los 2 MB."
      );

      evento.target.value = "";
      return;
    }

    if (!empresa.idEmpresa) {
      alert(
        "No se pudo identificar la empresa."
      );

      return;
    }

    try {
      setSubiendoLogo(true);

      const empresaActualizada =
        await subirLogoEmpresa(
          empresa.idEmpresa,
          archivo
        );

      setEmpresa(empresaActualizada);

      alert(
        "Logo actualizado correctamente."
      );
    } catch (error) {
      console.error(
        "Error al actualizar el logo:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el logo."
      );
    } finally {
      setSubiendoLogo(false);
      evento.target.value = "";
    }
  };

  return (
    <div className="perfil-card">
      <input
        ref={inputArchivoRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.svg"
        onChange={seleccionarLogo}
        className="perfil-logo-input"
      />

      <div className="perfil-avatar-empresa">
        {empresa.logo ? (
          <img
            src={empresa.logo}
            alt={`Logo de ${empresa.nombreComercial}`}
            className="perfil-logo"
          />
        ) : (
          <FaBuilding />
        )}
      </div>

      <h2>
        {empresa.nombreComercial ||
          empresa.razonSocial}
      </h2>

      <p className="perfil-rubro">
        {empresa.rubro ||
          "Sin rubro definido"}
      </p>

      <div className="perfil-estado">
        <FaCheckCircle />
        <span>Empresa activa</span>
      </div>

      <div className="perfil-divider" />

      <div className="perfil-resumen">
        <div className="perfil-info-card">
          <div className="perfil-info-icon">
            <FaIdCard />
          </div>

          <div className="perfil-info-content">
            <span className="perfil-info-title">
              RUT
            </span>

            <strong>
              {empresa.rut || "-"}
            </strong>
          </div>
        </div>

        <div className="perfil-info-card">
          <div className="perfil-info-icon">
            <FaMapMarkerAlt />
          </div>

          <div className="perfil-info-content">
            <span className="perfil-info-title">
              Dirección
            </span>

            <strong>
              {empresa.direccion ||
                "Sin dirección registrada"}
            </strong>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="perfil-upload"
        onClick={abrirSelectorLogo}
        disabled={subiendoLogo}
      >
        <div className="perfil-upload-icon">
          <FaCamera />
        </div>

        <div>
          <h4>
            {subiendoLogo
              ? "Subiendo logo..."
              : "Seleccionar logo"}
          </h4>

          <p>
            JPG, PNG, WEBP o SVG. Máx. 2 MB
          </p>
        </div>
      </button>

      <button
        type="button"
        className="perfil-card-btn"
        onClick={abrirSelectorLogo}
        disabled={subiendoLogo}
      >
        <FaCamera />

        {subiendoLogo
          ? "Guardando..."
          : "Cambiar logo"}
      </button>
    </div>
  );
}