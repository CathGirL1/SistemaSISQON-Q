import "../../../styles/empresa/manoObra/ManoObraFiltros.css";

import { FaSearch } from "react-icons/fa";

type Props = {
  busqueda: string;
  categoria: string;
  unidad: string;
  estado: string;

  onBusquedaChange: (valor: string) => void;
  onCategoriaChange: (valor: string) => void;
  onUnidadChange: (valor: string) => void;
  onEstadoChange: (valor: string) => void;
};

export default function ManoObraFiltros({
  busqueda,
  categoria,
  unidad,
  estado,
  onBusquedaChange,
  onCategoriaChange,
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
        value={categoria}
        onChange={(evento) =>
          onCategoriaChange(evento.target.value)
        }
      >
        <option value="Todas">Todas las categorías</option>
        <option value="Albañilería">Albañilería</option>
        <option value="Pintura">Pintura</option>
        <option value="Electricidad">Electricidad</option>
        <option value="Sanitaria">Sanitaria</option>
        <option value="Carpintería">Carpintería</option>
        <option value="Herrería">Herrería</option>
        <option value="Otros">Otros</option>
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
        <option value="hora">Hora</option>
        <option value="metro">Metro</option>
        <option value="unidad">Unidad</option>
        <option value="punto">Punto</option>
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


    </div>
  );
}