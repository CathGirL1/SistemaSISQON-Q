import "../../../styles/empresa/tiposObra/TipoObraDetallePanel.css";

import { FaTimes, FaEdit, FaHardHat } from "react-icons/fa";

import type { TipoObraEmpresa } from "../../../interfaces/TipoObraEmpresa";
import TipoObraEstadoBadge from "./TipoObraEstadoBadge";
import TipoObraTabs from "./TipoObraTabs";

type Props = {
  tipoObra: TipoObraEmpresa;
};

export default function TipoObraDetallePanel({ tipoObra }: Props) {
  return (
    <aside className="tipo-obra-detalle-panel">
      <button className="tipo-obra-panel-close">
        <FaTimes />
      </button>

      <div className="tipo-obra-panel-hero">
        <div className="tipo-obra-panel-icon">
          <FaHardHat />
        </div>

        <div>
          <h3>{tipoObra.nombre}</h3>
          <p>{tipoObra.codigo}</p>
        </div>
      </div>

      <div className="tipo-obra-panel-status">
        <TipoObraEstadoBadge estado={tipoObra.estado} />
        <span>{tipoObra.materialesAsociados} materiales asociados</span>
      </div>

      <TipoObraTabs tipoObra={tipoObra} />

      <div className="tipo-obra-panel-actions">
        <button className="desactivar-btn">
          {tipoObra.estado === "Activo" ? "Desactivar" : "Activar"}
        </button>

        <button className="editar-config-btn">
          <FaEdit />
          Editar configuración
        </button>
      </div>
    </aside>
  );
}