import "../../../styles/empresa/cotizaciones/CotizacionesFiltros.css";

import type {
  EstadoCotizacion,
} from "../../../interfaces/Cotizacion";

type Props = {
  busqueda: string;
  onBusquedaChange: (valor: string) => void;

  tipoObra: string;
  onTipoObraChange: (valor: string) => void;

  estado: string;
  onEstadoChange: (valor: string) => void;

  tiposObra: string[];
};

export default function CotizacionesFiltros({
  busqueda,
  onBusquedaChange,
  tipoObra,
  onTipoObraChange,
  estado,
  onEstadoChange,
  tiposObra,
}: Props) {

  const estados: EstadoCotizacion[] = [
    "Nueva",
    "En revisión",
    "Contactado",
    "Aprobada",
    "Rechazada",
    "Finalizada",
  ];

  return (
    <div className="cotizaciones-filtros">

      {/* =========================================
          BUSCADOR
          ========================================= */}

      <input
        type="text"
        className="cotizaciones-buscador"
        placeholder="Buscar por cliente, email o ID..."
        value={busqueda}
        onChange={(event) =>
          onBusquedaChange(event.target.value)
        }
      />


      {/* =========================================
          TIPO DE OBRA
          ========================================= */}

      <select
        value={tipoObra}
        onChange={(event) =>
          onTipoObraChange(event.target.value)
        }
      >
        <option value="">
          Todos los tipos de obra
        </option>

        {tiposObra.map((tipo) => (
          <option
            key={tipo}
            value={tipo}
          >
            {tipo}
          </option>
        ))}
      </select>


      {/* =========================================
          ESTADO
          ========================================= */}

      <select
        value={estado}
        onChange={(event) =>
          onEstadoChange(event.target.value)
        }
      >
        <option value="">
          Todos los estados
        </option>

        {estados.map((estadoCotizacion) => (
          <option
            key={estadoCotizacion}
            value={estadoCotizacion}
          >
            {estadoCotizacion}
          </option>
        ))}
      </select>

    </div>
  );
}