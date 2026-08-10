import { useEffect, useState } from "react";
import { Search, ChevronDown } from "lucide-react";

import "../../styles/FiltrosProyecto.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

interface TipoObra {
  idTipoObra: number;
  nombre: string;
}

interface Props {
  busqueda: string;
  setBusqueda: React.Dispatch<React.SetStateAction<string>>;

  estado: string;
  setEstado: React.Dispatch<React.SetStateAction<string>>;

  tipoObra: string;
  setTipoObra: React.Dispatch<React.SetStateAction<string>>;

  orden: string;
  setOrden: React.Dispatch<React.SetStateAction<string>>;
}

export default function FiltrosProyecto({
  busqueda,
  setBusqueda,
  estado,
  setEstado,
  tipoObra,
  setTipoObra,
  orden,
  setOrden,
}: Props) {
  const [tiposObra, setTiposObra] = useState<TipoObra[]>([]);

  const [mostrarTipos, setMostrarTipos] = useState(false);
  const [mostrarEstados, setMostrarEstados] = useState(false);
  const [mostrarOrden, setMostrarOrden] = useState(false);

  useEffect(() => {
    obtenerTiposObra();
  }, []);

  const obtenerTiposObra = async () => {
    try {
      const response = await fetch(
       `${API_URL}/api/tipos-obra`
      );

      if (!response.ok) {
        throw new Error();
      }

      const data = await response.json();

      setTiposObra(data);
    } catch {
      console.error("No se pudieron obtener los tipos de obra.");
    }
  };

  return (

    <>
    
    <section className="proyectos-filters">
      <label className="proyectos-search">
        <Search size={19} />

        <input
          type="search"
          placeholder="Buscar proyecto..."
          value={busqueda}
          onChange={(event) =>
            setBusqueda(event.target.value)
          }
        />
      </label>

       <div className="proyecto-dropdown">
        <button
            type="button"
            className="proyecto-filter-button"
            onClick={() => {
            setMostrarTipos(!mostrarTipos);
            setMostrarEstados(false);
            setMostrarOrden(false);
            }}
        >
            <div className="proyecto-filter-info">
            <span className="proyecto-filter-label">
                Tipo de obra
            </span>

            <strong>
                {tipoObra || "Todos los tipos"}
            </strong>
            </div>

            <ChevronDown
            size={18}
            className={mostrarTipos ? "dropdown-open" : ""}
            />
        </button>

        {mostrarTipos && (
            <div className="proyecto-dropdown-menu">
            <button
                onClick={() => {
                setTipoObra("");
                setMostrarTipos(false);
                }}
            >
                Todos los tipos
            </button>

            {tiposObra.map((tipo) => (
                <button
                key={tipo.idTipoObra}
                onClick={() => {
                    setTipoObra(tipo.nombre);
                    setMostrarTipos(false);
                }}
                >
                {tipo.nombre}
                </button>
            ))}
            </div>
        )}
        </div>


        <div className="proyecto-dropdown">

            <button
                className="proyecto-filter-button"
                type="button"
                onClick={()=>{
                    setMostrarEstados(!mostrarEstados);
                    setMostrarTipos(false);
                    setMostrarOrden(false);
                }}
            >

                <div className="proyecto-filter-info">
                    <span className="proyecto-filter-label">
                        Estado
                    </span>

                    <strong>
                        {estado || "Todos los estados"}
                    </strong>
                </div>

                <ChevronDown
                    size={18}
                    className={mostrarEstados ? "dropdown-open":""}
                />

            </button>

            {mostrarEstados && (

                <div className="proyecto-dropdown-menu">

                    {[
                        "Todos",
                        "Activo",
                        "Pendiente",
                        "En proceso",
                        "Finalizado",
                        "Borrador"
                    ].map(item=>(

                        <button
                            key={item}
                            onClick={()=>{
                                setEstado(item==="Todos"?"":item);
                                setMostrarEstados(false);
                            }}
                        >
                            {item}
                        </button>

                    ))}

                </div>

            )}

        </div>

        <div className="proyecto-dropdown">

            <button
                className="proyecto-filter-button"
                type="button"
                onClick={()=>{
                    setMostrarOrden(!mostrarOrden);
                    setMostrarEstados(false);
                    setMostrarTipos(false);
                }}
            >

            <div className="proyecto-filter-info">

                <span className="proyecto-filter-label">
                    Ordenar
                </span>

                <strong>

                    {
                        orden==="recientes"
                        ? "Más recientes"

                        : orden==="antiguos"
                        ? "Más antiguos"

                        : orden==="az"
                        ? "Nombre A-Z"

                        : orden==="za"
                        ? "Nombre Z-A"

                        : "Más recientes"
                    }

                </strong>

            </div>

            <ChevronDown
                size={18}
                className={mostrarOrden ? "dropdown-open":""}
            />

        </button>

            {mostrarOrden && (

                <div className="proyecto-dropdown-menu">

                    <button
                        onClick={()=>{
                            setOrden("recientes");
                            setMostrarOrden(false);
                        }}
                    >
                        Más recientes
                    </button>

                    <button
                        onClick={()=>{
                            setOrden("antiguos");
                            setMostrarOrden(false);
                        }}
                    >
                        Más antiguos
                    </button>

                    <button
                        onClick={()=>{
                            setOrden("az");
                            setMostrarOrden(false);
                        }}
                    >
                        Nombre A-Z
                    </button>

                    <button
                        onClick={()=>{
                            setOrden("za");
                            setMostrarOrden(false);
                        }}
                    >
                        Nombre Z-A
                    </button>

                </div>

            )}

        </div>
      
    </section>

   
    </>
    
  );
}

