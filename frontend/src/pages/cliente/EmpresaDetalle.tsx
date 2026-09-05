import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Globe,
  ShieldCheck,
  Clock,
  FileText,
  BriefcaseBusiness,
} from "lucide-react";

import type { EmpresaCliente } from "../../interfaces/EmpresaCliente";

import "../../styles/EmpresaDetalle.css";

const API_URL = import.meta.env.VITE_API_URL;

interface EmpresaDetalleProps {
  empresa: EmpresaCliente;
  onVolver: () => void;
}

export default function EmpresaDetalle({
  empresa,
  onVolver,
}: EmpresaDetalleProps) {
  const iniciales = empresa.nombreEmpresa
    .substring(0, 2)
    .toUpperCase();

  return (
    <section className="empresa-detalle">

      {/* VOLVER */}
      <button
        type="button"
        className="empresa-detalle-volver"
        onClick={onVolver}
      >
        <ArrowLeft size={18} />
        Volver a empresas
      </button>

      {/* ENCABEZADO */}
      <div className="empresa-detalle-header">

        <div className="empresa-detalle-logo">
          {empresa.logo ? (
            <img
              src={`${API_URL}${empresa.logo}`}
              alt={`Logo de ${empresa.nombreEmpresa}`}
            />
          ) : (
            <span>{iniciales}</span>
          )}
        </div>

        <div className="empresa-detalle-titulo">
          <div className="empresa-detalle-verificada">
            <ShieldCheck size={16} />
            Empresa verificada
          </div>

          <h2>{empresa.nombreEmpresa}</h2>

          <p>
            {empresa.rubro || "Rubro no especificado"}
          </p>
        </div>

      </div>

      {/* DESCRIPCIÓN */}
      <div className="empresa-detalle-seccion">

        <h3>Sobre la empresa</h3>

        <p>
          {empresa.descripcion ||
            "La empresa aún no ha agregado una descripción."}
        </p>

      </div>

      {/* INFORMACIÓN */}
      <div className="empresa-detalle-seccion">

        <h3>Información de la empresa</h3>

        <div className="empresa-detalle-info-grid">

          <div className="empresa-detalle-info">
            <span>Razón social</span>
            <strong>{empresa.nombreEmpresa}</strong>
          </div>

          <div className="empresa-detalle-info">
            <span>RUT</span>
            <strong>{empresa.rut || "No registrado"}</strong>
          </div>

          <div className="empresa-detalle-info">
            <span>Rubro</span>
            <strong>{empresa.rubro || "No especificado"}</strong>
          </div>

          <div className="empresa-detalle-info">
            <span>Teléfono</span>

            <strong>
              {empresa.telefono || "No registrado"}
            </strong>
          </div>

          <div className="empresa-detalle-info">
            <span>Correo electrónico</span>

            <strong>
              {empresa.email || "No registrado"}
            </strong>
          </div>

          <div className="empresa-detalle-info">
            <span>Dirección</span>

            <strong>
              {empresa.direccion || "No registrada"}
            </strong>
          </div>

          <div className="empresa-detalle-info">
            <span>Página web</span>

            <strong>
              {empresa.paginaWeb || "No registrada"}
            </strong>
          </div>

        </div>

      </div>

      {/* DATOS DE CONTACTO */}
      <div className="empresa-detalle-seccion">

        <h3>Contacto</h3>

        <div className="empresa-detalle-contacto">

          <div>
            <Mail size={18} />
            <span>
              {empresa.email || "Correo no registrado"}
            </span>
          </div>

          <div>
            <Phone size={18} />
            <span>
              {empresa.telefono || "Teléfono no registrado"}
            </span>
          </div>

          <div>
            <MapPin size={18} />
            <span>
              {empresa.direccion || "Dirección no registrada"}
            </span>
          </div>

          {empresa.paginaWeb && (
            <div>
              <Globe size={18} />
              <span>{empresa.paginaWeb}</span>
            </div>
          )}

        </div>

      </div>

      {/* ZONAS DE TRABAJO */}
      <div className="empresa-detalle-seccion">

        <h3>
          <BriefcaseBusiness size={19} />
          Zonas de trabajo
        </h3>

        <p>
          {empresa.zonasTrabajo ||
            "La empresa no ha especificado sus zonas de trabajo."}
        </p>

      </div>

      {/* CONDICIONES COMERCIALES */}
      <div className="empresa-detalle-seccion">

        <h3>
          <FileText size={19} />
          Condiciones comerciales
        </h3>

        <p>
          {empresa.condicionesComerciales ||
            "La empresa no ha especificado sus condiciones comerciales."}
        </p>

      </div>

      {/* COTIZACIONES */}
      <div className="empresa-detalle-seccion">

        <h3>
          <Clock size={19} />
          Información sobre cotizaciones
        </h3>

        <div className="empresa-detalle-cotizacion">

          <div>
            <span>Validez de la cotización</span>
            <strong>
              {empresa.validezCotizacion} días
            </strong>
          </div>

          <div>
            <span>Días laborables</span>
            <strong>
              {empresa.diasLaborables || "No especificados"}
            </strong>
          </div>

          <div>
            <span>Horario de atención</span>
            <strong>
              {empresa.horarioInicio &&
              empresa.horarioFin
                ? `${empresa.horarioInicio} - ${empresa.horarioFin}`
                : "No especificado"}
            </strong>
          </div>

        </div>

      </div>

      {/* VOLVER */}
      <div className="empresa-detalle-footer">

        <button
          type="button"
          onClick={onVolver}
        >
          <ArrowLeft size={17} />
          Volver a empresas
        </button>

      </div>

    </section>
  );
}