import "../../../styles/empresa/clientes/ClientesFiltros.css";

import { FaFilter } from "react-icons/fa";

import PanelSearchBar from "../../common/PanelSearchBar";

type Props = {
  busqueda: string;
  estado: string;
  ciudad: string;

  ciudades: string[];

  onBusquedaChange: (valor: string) => void;
  onEstadoChange: (valor: string) => void;
  onCiudadChange: (valor: string) => void;

  onLimpiarFiltros: () => void;
};

export default function ClientesFiltros({
  busqueda,
  estado,
  ciudad,
  ciudades,
  onBusquedaChange,
  onEstadoChange,
  onCiudadChange,
  onLimpiarFiltros,
}: Props) {
  return (
    <div className="clientes-filtros">
      <PanelSearchBar
        placeholder="Buscar por nombre, email o teléfono..."
        value={busqueda}
        onChange={onBusquedaChange}
      />

      <select
        value={estado}
        onChange={(evento) =>
          onEstadoChange(evento.target.value)
        }
      >
        <option value="">
          Todos los estados
        </option>

        <option value="Nuevo">
          Nuevo
        </option>

        <option value="Interesado">
          Interesado
        </option>

        <option value="Contactado">
          Contactado
        </option>

        <option value="Cliente confirmado">
          Cliente confirmado
        </option>
      </select>

      <select
        value={ciudad}
        onChange={(evento) =>
          onCiudadChange(evento.target.value)
        }
      >
        <option value="">
          Todas las ciudades
        </option>

        {ciudades.map((nombreCiudad) => (
          <option
            key={nombreCiudad}
            value={nombreCiudad}
          >
            {nombreCiudad}
          </option>
        ))}
      </select>

      <button
        type="button"
        className="clientes-filtros-btn"
        onClick={onLimpiarFiltros}
      >
        <FaFilter />
        Limpiar filtros
      </button>
    </div>
  );
}