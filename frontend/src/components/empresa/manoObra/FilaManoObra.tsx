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

import EstadoManoObraBadge from "./EstadoManoObraBadge";
import UnidadBadge from "./UnidadBadge";
import AccionesManoObra from "./AccionesManoObra";

type Props = {
  trabajo: ManoObraEmpresa;
  onEditar: (trabajo: ManoObraEmpresa) => void;
  onCambiarEstado: (trabajo: ManoObraEmpresa) => void;
  onEliminar: (trabajo: ManoObraEmpresa) => void;
};

function obtenerIconoTrabajo(nombre: string) {
  const normalizado = nombre.toLowerCase();

  if (normalizado.includes("quincho")) return <FaHome />;
  if (normalizado.includes("albañilería")) return <FaToolbox />;
  if (normalizado.includes("techo")) return <FaThLarge />;
  if (normalizado.includes("pintura")) return <FaPaintRoller />;
  if (normalizado.includes("eléctrica")) return <FaBolt />;
  if (normalizado.includes("sanitaria")) return <FaWater />;
  if (normalizado.includes("piso")) return <FaThLarge />;
  if (normalizado.includes("aberturas")) return <FaWindowMaximize />;

  return <FaToolbox />;
}

export default function FilaManoObra({
  trabajo,
  onEditar,
  onCambiarEstado,
  onEliminar,
}: Props) {
  const formatoMoneda = new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: "UYU",
    maximumFractionDigits: 0,
  });

  return (
    <tr>
      <td>
        <div className="trabajo-cell">
          <div className={`trabajo-icon trabajo-icon-${trabajo.id}`}>
            {obtenerIconoTrabajo(trabajo.trabajo)}
          </div>

          <div>
            <h4>{trabajo.trabajo}</h4>
            <p>{trabajo.codigo}</p>
          </div>
        </div>
      </td>

      <td>
        <p className="trabajo-descripcion">{trabajo.descripcion}</p>
      </td>

      <td>
        <UnidadBadge unidad={trabajo.unidad} />
      </td>

      <td className="costo-cell">
        {formatoMoneda.format(trabajo.costoBaja)}
      </td>

      <td className="costo-cell">
        {formatoMoneda.format(trabajo.costoMedia)}
      </td>

      <td className="costo-cell">
        {formatoMoneda.format(trabajo.costoAlta)}
      </td>

      <td>{trabajo.zona}</td>

      <td>
        <div className="actualizacion-cell">
          <strong>{trabajo.ultimaActualizacion}</strong>
          <span>{trabajo.horaActualizacion}</span>
        </div>
      </td>

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