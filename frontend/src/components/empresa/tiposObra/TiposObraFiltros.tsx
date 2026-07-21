import "../../../styles/empresa/tiposObra/TiposObraFiltros.css";

import { FaFilter } from "react-icons/fa";
import PanelSearchBar from "../../common/PanelSearchBar";

export default function TiposObraFiltros() {
  return (
    <div className="tipos-obra-filtros">
      <PanelSearchBar placeholder="Buscar tipo de obra..." />

      <select>
        <option>Estado: Todos</option>
        <option>Activo</option>
        <option>Inactivo</option>
      </select>

      <button className="tipos-obra-filtros-btn">
        <FaFilter />
        Filtros
      </button>
    </div>
  );
}