import { Search } from "lucide-react";
import "../../styles/FiltrosEmpresaCliente.css";

interface FiltrosEmpresaProps {
  nombre: string;
  direccion: string;
  rubro: string;
  rubros: string[];

  onNombreChange: (valor: string) => void;
  onDireccionChange: (valor: string) => void;
  onRubroChange: (valor: string) => void;
}

export default function FiltrosEmpresa({
  nombre,
  direccion,
  rubro,
  rubros,
  onNombreChange,
  onDireccionChange,
  onRubroChange,
}: FiltrosEmpresaProps) {
  return (
    <section className="filtros-empresa">

      {/* FILTRO NOMBRE */}
      <div className="filtro-empresa">
        <label>Nombre</label>

        <div className="filtro-input">
          <Search size={18} />

          <input
            type="text"
            placeholder="Buscar empresa..."
            value={nombre}
            onChange={(e) =>
              onNombreChange(e.target.value)
            }
          />
        </div>
      </div>

      {/* FILTRO DIRECCIÓN */}
      <div className="filtro-empresa">
        <label>Dirección</label>

        <div className="filtro-input">
          <Search size={18} />

          <input
            type="text"
            placeholder="Buscar por dirección..."
            value={direccion}
            onChange={(e) =>
              onDireccionChange(e.target.value)
            }
          />
        </div>
      </div>

      {/* FILTRO RUBRO */}
      <div className="filtro-empresa">
        <label>Rubro</label>

        <select
          value={rubro}
          onChange={(e) =>
            onRubroChange(e.target.value)
          }
        >
          <option value="">Todos los rubros</option>

          {rubros.map((rubroActual) => (
            <option
              key={rubroActual}
              value={rubroActual}
            >
              {rubroActual}
            </option>
          ))}
        </select>
      </div>

    </section>
  );
}