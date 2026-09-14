import {
  FaBolt,
  FaHome,
  FaPaintRoller,
  FaThLarge,
  FaToolbox,
  FaWater,
  FaWindowMaximize,
} from "react-icons/fa";

import type { ManoObraEmpresa } from "../../../interfaces/ManoObraEmpresa";

import AccionesManoObra from "./AccionesManoObra";
import EstadoManoObraBadge from "./EstadoManoObraBadge";
import UnidadBadge from "./UnidadBadge";

type Props = {
  trabajo: ManoObraEmpresa;
  onEditar: (trabajo: ManoObraEmpresa) => void;
  onCambiarEstado: (trabajo: ManoObraEmpresa) => void;
  onEliminar: (trabajo: ManoObraEmpresa) => void;
};

function obtenerIconoTrabajo(nombre: string) {
  const normalizado = nombre.toLowerCase();

  if (normalizado.includes("quincho")) return <FaHome />;
  if (normalizado.includes("albañiler")) return <FaToolbox />;
  if (normalizado.includes("techo")) return <FaThLarge />;
  if (normalizado.includes("pintura")) return <FaPaintRoller />;
  if (normalizado.includes("eléctr")) return <FaBolt />;
  if (normalizado.includes("electr")) return <FaBolt />;
  if (normalizado.includes("sanitaria")) return <FaWater />;
  if (normalizado.includes("sanitar")) return <FaWater />;
  if (normalizado.includes("piso")) return <FaThLarge />;
  if (normalizado.includes("abertura")) return <FaWindowMaximize />;

  return <FaToolbox />;
}

export default function FilaManoObra({
  trabajo,
  onEditar,
  onCambiarEstado,
  onEliminar,
}: Props) {
  const formatearUSD = (valor: number): string => {
    return new Intl.NumberFormat("es-UY", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(valor);
  };

  const formatearUYU = (valor: number): string => {
    return `UYU ${new Intl.NumberFormat("es-UY", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(valor)}`;
  };

  return (
    <tr>
      <td>
        <div className="trabajo-cell">
          <div className={`trabajo-icon trabajo-icon-${trabajo.id}`}>
            {obtenerIconoTrabajo(trabajo.nombre)}
          </div>

          <div>
            <h4>{trabajo.nombre}</h4>
            <p>{trabajo.codigo}</p>
          </div>
        </div>
      </td>

      <td>
        <p className="trabajo-descripcion">{trabajo.descripcion}</p>
      </td>

      <td>{trabajo.categoria}</td>

      <td>
        <UnidadBadge unidad={trabajo.unidad} />
      </td>

      <td className="costo-cell">
        <strong>
          {formatearUSD(trabajo.costoUnitarioUSD)}
        </strong>

        <span className="precio-pesos">
          ({formatearUYU(trabajo.costoUnitario)})
        </span>
      </td>

      <td>{trabajo.ultimaActualizacion}</td>

      <td>
        <EstadoManoObraBadge estado={trabajo.estado} />
      </td>

      <td>
        <AccionesManoObra
          trabajo={trabajo}
          onEditar={onEditar}
          onCambiarEstado={onCambiarEstado}
          onEliminar={onEliminar}
        />
      </td>
    </tr>
  );
}