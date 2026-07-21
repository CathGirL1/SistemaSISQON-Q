import "../../../styles/empresa/materiales/MaterialesFiltros.css";

import { FaFilter } from "react-icons/fa";
import PanelSearchBar from "../../common/PanelSearchBar";

export default function MaterialesFiltros() {
  return (
    <div className="materiales-filtros">
      <PanelSearchBar placeholder="Buscar material..." />

      <select>
        <option>Todas las categorías</option>
        <option>Techos</option>
        <option>Maderas</option>
        <option>Cubiertas</option>
        <option>Cementos</option>
        <option>Áridos</option>
        <option>Hierros</option>
        <option>Ladrillos</option>
        <option>Terminaciones</option>
      </select>

      <select>
        <option>Estado: Todos</option>
        <option>Activo</option>
        <option>Inactivo</option>
      </select>

      <select>
        <option>Disponibilidad: Todos</option>
        <option>Disponible</option>
        <option>Stock bajo</option>
        <option>Sin stock</option>
      </select>

      <button className="materiales-filtros-btn">
        <FaFilter />
        Filtros
      </button>
    </div>
  );
}