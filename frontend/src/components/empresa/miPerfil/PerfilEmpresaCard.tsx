import "../../../styles/empresa/miPerfil/PerfilEmpresaCard.css";

import {
  FaBuilding,
  FaCheckCircle,
  FaCamera,
  FaMapMarkerAlt,
  FaIdCard,
} from "react-icons/fa";

import type { Empresa } from "../../../types/Empresa";

interface Props {
  empresa: Empresa;
}

export default function PerfilEmpresaCard({ empresa }: Props) {
  return (
    <div className="perfil-card">
      <div className="perfil-avatar-empresa">
        {empresa.logo ? (
          <img
            src={empresa.logo}
            alt={empresa.nombreComercial}
            className="perfil-logo"
          />
        ) : (
          <FaBuilding />
        )}
      </div>

      <h2>{empresa.nombreComercial}</h2>

      <p className="perfil-rubro">
        {empresa.rubro || "Sin rubro definido"}
      </p>

      <div className="perfil-estado">
        <FaCheckCircle />
        <span>Empresa activa</span>
      </div>

      <div className="perfil-divider" />

      <div className="perfil-resumen">
        <div className="perfil-item">
          <span className="perfil-label">
            <FaIdCard />
            RUT
          </span>

          <strong>{empresa.rut}</strong>
        </div>

        <div className="perfil-item">
          <span className="perfil-label">
            <FaMapMarkerAlt />
            Dirección
          </span>

          <strong>{empresa.direccion}</strong>
        </div>
      </div>

      <button className="perfil-card-btn">
        <FaCamera />
        Cambiar logo
      </button>
    </div>
  );
}