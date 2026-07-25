import "../../../styles/empresa/materiales/MaterialesFiltros.css";
import PanelSearchBar from "../../common/PanelSearchBar";
import { FaFilter, FaSearch } from "react-icons/fa";

type Props = {
  busqueda: string;
  categoria: string;
  estado: string;
  disponibilidad: string;

  categorias: string[];

  onBusquedaChange: (valor: string) => void;
  onCategoriaChange: (valor: string) => void;
  onEstadoChange: (valor: string) => void;
  onDisponibilidadChange: (valor: string) => void;
};
export default function MaterialesFiltros({
  busqueda,
  categoria,
  estado,
  disponibilidad,
  categorias,
  onBusquedaChange,
  onCategoriaChange,
  onEstadoChange,
  onDisponibilidadChange,
}: Props) {
  return (
    <div className="materiales-filtros">
      <PanelSearchBar
      placeholder="Buscar material..."
      value={busqueda}
      onChange={onBusquedaChange}
      />

      <select
        value={categoria}
        onChange={(e) =>
          onCategoriaChange(e.target.value)
        }
      >
        <option value="Todas">
          Todas las categorías
        </option>

        {categorias.map((categoria) => (
          <option
            key={categoria}
            value={categoria}
          >
            {categoria}
          </option>
        ))}
      </select>

      <select
        value={estado}
        onChange={(e) => onEstadoChange(e.target.value)}
      >
        <option value="Todos">Todos los estados</option>
        <option value="Activo">Activo</option>
        <option value="Inactivo">Inactivo</option>
      </select>

      <select
        value={disponibilidad}
        onChange={(e) => onDisponibilidadChange(e.target.value)}
      >
        <option value="Todas">Toda disponibilidad</option>
        <option value="Disponible">Disponible</option>
        <option value="Stock bajo">Stock bajo</option>
        <option value="Sin stock">Sin stock</option>
      </select>

      <button
        type="button"
        className="materiales-filtros-btn"
      >
        <FaFilter />
        Filtros
      </button>
    </div>
  );
}