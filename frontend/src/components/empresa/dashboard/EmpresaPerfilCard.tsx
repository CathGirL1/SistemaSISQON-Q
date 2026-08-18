import {
  FaBuilding,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

import type {
  EmpresaDashboard,
} from "../../../interfaces/Dashboard";

import { useNavigate } from "react-router-dom";

type Props = {
  empresa: EmpresaDashboard;
};


export default function EmpresaPerfilCard({
  empresa,
}: Props) {

  const navigate = useNavigate();
  return (
    <div className="dashboard-card empresa-perfil-card">
      <div className="empresa-perfil-avatar">
        {empresa.logo ? (
          <img
            src={empresa.logo}
            alt={empresa.nombreEmpresa}
            className="empresa-logo-dashboard"
          />
        ) : (
          <FaBuilding />
        )}
      </div>

      <h2>
        {empresa.nombreEmpresa || "Empresa"}
      </h2>

      <p className="empresa-rubro">
        {empresa.rubro || "Sin rubro definido"}
      </p>

      <div className="empresa-info-list">
        <span>
          <FaEnvelope />
          {empresa.email || "Sin email registrado"}
        </span>

        <span>
          <FaPhoneAlt />
          {empresa.telefono || "Sin teléfono registrado"}
        </span>

        <span>
          <FaMapMarkerAlt />
          {empresa.ubicacion || "Sin ubicación registrada"}
        </span>
      </div>

      <button
        type="button"
        className="perfil-btn"
        onClick={() => navigate("/empresa/perfil")}
      >
        Ver perfil
      </button>
    </div>
  );
}