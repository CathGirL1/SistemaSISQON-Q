import "../../../styles/empresa/manoObra/ManoObraFiltros.css";

import { FaFilter, FaSearch } from "react-icons/fa";

type Props = {
  busqueda: string;
  zona: string;
  unidad: string;
  estado: string;

  onBusquedaChange: (valor: string) => void;
  onZonaChange: (valor: string) => void;
  onUnidadChange: (valor: string) => void;
  onEstadoChange: (valor: string) => void;
};

export default function ManoObraFiltros({
  busqueda,
  zona,
  unidad,
  estado,
  onBusquedaChange,
  onZonaChange,
  onUnidadChange,
  onEstadoChange,
}: Props) {
  return (
    <div className="mano-obra-filtros">
      <div className="mano-obra-buscador">
        <FaSearch />

        <input
          type="text"
          value={busqueda}
          placeholder="Buscar trabajo..."
          onChange={(evento) =>
            onBusquedaChange(evento.target.value)
          }
        />
      </div>

      <select
        value={zona}
        onChange={(evento) =>
          onZonaChange(evento.target.value)
        }
      >
        <option value="Todas">Todas las zonas</option>
        <option value="Montevideo">Montevideo</option>
        <option value="Canelones">Canelones</option>
        <option value="Maldonado">Maldonado</option>
      </select>

      <select
        value={unidad}
        onChange={(evento) =>
          onUnidadChange(evento.target.value)
        }
      >
        <option value="Todas">Todas las unidades</option>
        <option value="m²">m²</option>
        <option value="día">Día</option>
        <option value="punto">Punto</option>
        <option value="unidad">Unidad</option>
        <option value="metro">Metro</option>
        <option value="hora">Hora</option>
      </select>

      <select
        value={estado}
        onChange={(evento) =>
          onEstadoChange(evento.target.value)
        }
      >
        <option value="Todos">Todos los estados</option>
        <option value="Activo">Activo</option>
        <option value="Inactivo">Inactivo</option>
      </select>

      <button type="button" className="mano-obra-filtros-btn">
        <FaFilter />
        Filtros
      </button>
    </div>
  );
}