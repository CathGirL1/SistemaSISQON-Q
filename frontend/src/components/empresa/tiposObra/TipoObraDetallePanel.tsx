import "../../../styles/empresa/tiposObra/TipoObraDetallePanel.css";

import { FaTimes } from "react-icons/fa";

import type { TipoObraEmpresa } from "../../../interfaces/TipoObraEmpresa";
import TipoObraEstadoBadge from "./TipoObraEstadoBadge";
import TipoObraTabs from "./TipoObraTabs";
import IconoTipoObra from "./IconoTipoObra";

type Props = {
  tipoObra: TipoObraEmpresa;
  onCerrar: () => void;
};

export default function TipoObraDetallePanel({ tipoObra, onCerrar }: Props) {
  return (
    <aside className="tipo-obra-detalle-panel">
      <button className="tipo-obra-panel-close"
      onClick={onCerrar}
      >
        <FaTimes />
      </button>

      <div className="tipo-obra-panel-hero">
        <div className="tipo-obra-panel-icon">
        <IconoTipoObra nombre={tipoObra.nombre} />
        </div>

        <div>
          <h3>{tipoObra.nombre}</h3>
          <p>{tipoObra.codigo}</p>
        </div>
      </div>

      <div className="tipo-obra-panel-status">
        <TipoObraEstadoBadge estado={tipoObra.estado} />
      </div>

      <TipoObraTabs tipoObra={tipoObra} />

      
    </aside>
  );
}