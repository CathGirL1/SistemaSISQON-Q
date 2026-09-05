import { MapPin, ShieldCheck, Eye } from "lucide-react";
import type { EmpresaCliente } from "../../interfaces/EmpresaCliente";
import "../../styles/EmpresaCard.css";

const API_URL = import.meta.env.VITE_API_URL;

interface EmpresaCardProps {
  empresa: EmpresaCliente;
  onVerDetalles: (empresa: EmpresaCliente) => void;
}

export default function EmpresaCard({ empresa, onVerDetalles }: EmpresaCardProps) {
  const iniciales = empresa.nombreEmpresa
    .trim()
    .substring(0, 2)
    .toUpperCase();

  return (
    <article className="empresa-card">
      {/* Imagen / Logo */}
      <div className="empresa-cover">
        {empresa.logo ? (
          <img
            src={`${API_URL}${empresa.logo}`}
            alt={`Logo de ${empresa.nombreEmpresa}`}
          />
        ) : (
          <div className="empresa-cover-placeholder">
            {iniciales}
          </div>
        )}

        <span className="empresa-verified">
          <ShieldCheck size={14} />
          Verificada
        </span>
      </div>

      {/* Información */}
      <div className="empresa-card-body">
        <div className="empresa-identity">
          <div className="empresa-logo">
            {iniciales}
          </div>

          <div>
            <h3>{empresa.nombreEmpresa}</h3>

            <span>
              {empresa.rubro || "Sin rubro definido"}
            </span>
          </div>
        </div>

        {/* Ubicación */}
        <div className="empresa-location">
          <MapPin size={15} />

          <span>
            {empresa.direccion || "Sin dirección registrada"}
          </span>
        </div>

        {/* Descripción */}
        <p className="empresa-description">
          {empresa.descripcion ||
            "La empresa aún no ha agregado una descripción."}
        </p>

        {/* Acción */}
        <div className="empresa-actions">
          <button type="button" onClick={() => onVerDetalles(empresa)}>
            <Eye size={16} />
            Ver detalles
          </button>
        </div>
      </div>
    </article>
  );
}