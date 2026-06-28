import "../../../styles/empresa/cotizaciones/CotizacionesFiltros.css";

import { FaFilter, FaCalendarAlt } from "react-icons/fa";
import PanelSearchBar from "../../common/PanelSearchBar";

export default function CotizacionesFiltros() {
  return (
    <div className="cotizaciones-filtros">
      <PanelSearchBar placeholder="Buscar por cliente, email o ID..." />

      <select>
        <option>Todos los tipos de obra</option>
        <option>Quincho</option>
        <option>Reforma</option>
        <option>Construcción general</option>
      </select>

      <select>
        <option>Todos los estados</option>
        <option>Nueva</option>
        <option>En revisión</option>
        <option>Contactado</option>
        <option>Aprobada</option>
        <option>Rechazada</option>
        <option>Finalizada</option>
      </select>

      <div className="fecha-filtro">
        <span>Desde</span>
        <span>-</span>
        <span>Hasta</span>
        <FaCalendarAlt />
      </div>

      <button className="filtros-btn">
        <FaFilter />
        Filtros
      </button>
    </div>
  );
}