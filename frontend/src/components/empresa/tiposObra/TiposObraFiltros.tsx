import "../../../styles/empresa/tiposObra/TiposObraFiltros.css";

import { FaFilter } from "react-icons/fa";
import PanelSearchBar from "../../common/PanelSearchBar";

type Props = {
  busqueda: string;
  estado: string;

  onBusquedaChange: (valor: string) => void;
  onEstadoChange: (valor: string) => void;
};

export default function TiposObraFiltros({
  busqueda,
  estado,
  onBusquedaChange,
  onEstadoChange,
}: Props) {
  return (
    <div className="tipos-obra-filtros">
      <PanelSearchBar
        placeholder="Buscar tipo de obra..."
        value={busqueda}
        onChange={onBusquedaChange}
      />

      <select
        value={estado}
        onChange={(e) =>
          onEstadoChange(e.target.value)
        }
      >
        <option value="Todos">
          Estado: Todos
        </option>

        <option value="Activo">
          Activo
        </option>

        <option value="Inactivo">
          Inactivo
        </option>
      </select>

    </div>
  );
}