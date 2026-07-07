import "../../../styles/empresa/clientes/ClientesFiltros.css";

import { FaFilter } from "react-icons/fa";
import PanelSearchBar from "../../common/PanelSearchBar";

export default function ClientesFiltros() {
  return (
    <div className="clientes-filtros">
      <PanelSearchBar placeholder="Buscar por nombre, email o teléfono..." />

      <select>
        <option>Todos los estados</option>
        <option>Nuevo</option>
        <option>Interesado</option>
        <option>Contactado</option>
        <option>Cliente confirmado</option>
      </select>

      <select>
        <option>Todas las ciudades</option>
        <option>Maldonado</option>
        <option>Montevideo</option>
        <option>Punta del Este</option>
      </select>

      <button className="clientes-filtros-btn">
        <FaFilter />
        Filtros
      </button>
    </div>
  );
}