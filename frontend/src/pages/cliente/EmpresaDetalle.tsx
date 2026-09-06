import { obtenerEmpresaPorId } from "../../services/empresaService";
import type { EmpresaCliente } from "../../interfaces/EmpresaCliente";
import { useEffect, useState } from "react";

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

import "../../styles/EmpresaDetalle.css";



interface EmpresaDetalleProps {
  empresa: EmpresaCliente;
  onVolver: () => void;
}

export default function EmpresaDetalle({
  empresa,
  onVolver,
}: EmpresaDetalleProps) {
  const [empresaDetalle, setEmpresaDetalle] =
    useState<EmpresaCliente>(empresa);

  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarEmpresaDetalle = async () => {

      if (empresa.idEmpresa === undefined) {
        return;
      }
      try {
        setCargando(true);

        const datos = await obtenerEmpresaPorId(
          empresa.idEmpresa
        );

        console.log(
          "EMPRESA DETALLE RECIBIDA:",
          datos
        );

        setEmpresaDetalle(datos);
      } catch (error) {
        console.error(
          "Error al obtener detalle de empresa:",
          error
        );
      } finally {
        setCargando(false);
      }
    };

    cargarEmpresaDetalle();
  }, [empresa.idEmpresa]);

  if (cargando) {
    return (
      <section className="empresa-detalle">
        <p>Cargando información de la empresa...</p>
      </section>
    );
  }

  const nombreMostrar =
    empresaDetalle.nombreComercial ||
    empresaDetalle.razonSocial ||
    "Empresa";

  const iniciales = nombreMostrar
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
          {empresaDetalle.logo ? (
            <img
              src={
                empresaDetalle.logo
              }
              alt={`Logo de ${nombreMostrar}`}
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

          <h2>{nombreMostrar}</h2>

          <p>
            {empresaDetalle.rubro ||
              "Rubro no especificado"}
          </p>

        </div>
      </div>

      {/* DESCRIPCIÓN */}
      <div className="empresa-detalle-seccion">

        <h3>Sobre la empresa</h3>

        <p>
          {empresaDetalle.descripcion ||
            "La empresa aún no ha agregado una descripción."}
        </p>

      </div>

      {/* INFORMACIÓN */}
      <div className="empresa-detalle-seccion">

        <h3>Información de la empresa</h3>

        <div className="empresa-detalle-info-grid">

          <div className="empresa-detalle-info">
            <span>Razón social</span>
            <strong>
              {empresaDetalle.razonSocial ||
                "No registrada"}
            </strong>
          </div>

          <div className="empresa-detalle-info">
            <span>Nombre comercial</span>
            <strong>
              {empresaDetalle.nombreComercial ||
                "No registrado"}
            </strong>
          </div>

          <div className="empresa-detalle-info">
            <span>RUT</span>
            <strong>
              {empresaDetalle.rut ||
                "No registrado"}
            </strong>
          </div>

          <div className="empresa-detalle-info">
            <span>Rubro</span>
            <strong>
              {empresaDetalle.rubro ||
                "No especificado"}
            </strong>
          </div>

          <div className="empresa-detalle-info">
            <span>Teléfono</span>
            <strong>
              {empresaDetalle.telefono ||
                "No registrado"}
            </strong>
          </div>

          <div className="empresa-detalle-info">
            <span>Correo electrónico</span>
            <strong>
              {empresaDetalle.email ||
                "No registrado"}
            </strong>
          </div>

          <div className="empresa-detalle-info">
            <span>Dirección</span>
            <strong>
              {empresaDetalle.direccion ||
                "No registrada"}
            </strong>
          </div>

          <div className="empresa-detalle-info">
            <span>Página web</span>
            <strong>
              {empresaDetalle.paginaWeb ||
                "No registrada"}
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
              {empresaDetalle.email ||
                "Correo no registrado"}
            </span>
          </div>

          <div>
            <Phone size={18} />
            <span>
              {empresaDetalle.telefono ||
                "Teléfono no registrado"}
            </span>
          </div>

          <div>
            <MapPin size={18} />
            <span>
              {empresaDetalle.direccion ||
                "Dirección no registrada"}
            </span>
          </div>

          {empresaDetalle.paginaWeb && (
            <div>
              <Globe size={18} />
              <span>
                {empresaDetalle.paginaWeb}
              </span>
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
          {empresaDetalle.zonasTrabajo ||
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
          {empresaDetalle.condicionesComerciales ||
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
              {empresaDetalle.validezCotizacion
                ? `${empresaDetalle.validezCotizacion} días`
                : "No especificada"}
            </strong>
          </div>

          <div>
            <span>Días laborables</span>

            <strong>
              {empresaDetalle.diasLaborables ||
                "No especificados"}
            </strong>
          </div>

          <div>
            <span>Horario de atención</span>

            <strong>
              {empresaDetalle.horarioInicio &&
              empresaDetalle.horarioFin
                ? `${empresaDetalle.horarioInicio} - ${empresaDetalle.horarioFin}`
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