import type { MaterialEmpresa } from "../../../interfaces/MaterialEmpresa";
import MaterialEstadoBadge from "./MaterialEstadoBadge";
import MaterialDisponibilidad from "./MaterialDisponibilidad";
import MaterialAcciones from "./MaterialAcciones";

type Props = {
  material: MaterialEmpresa;
  onEditar: (material: MaterialEmpresa) => void;
  onActualizarPrecio: (material: MaterialEmpresa) => void;
  onEliminar: (material: MaterialEmpresa) => void;
};

const formatearPrecioUSD = (precio: number): string => {
  return new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(precio);
};

const formatearPrecioUYU = (precio: number): string => {
  return new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: "UYU",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(precio);
};

export default function FilaMaterial({
  material,
  onEditar,
  onActualizarPrecio,
  onEliminar,
}: Props) {
  return (
    <tr>
      <td>
        <div className="material-cell">
          <div className="material-img">
            {material.imagenUrl ? (
              <img
                src={material.imagenUrl}
                alt={material.nombre}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://placehold.co/50x50?text=Sin";
                }}
              />
            ) : (
              material.nombre.charAt(0)
            )}
          </div>

          <div>
            <h4>{material.nombre}</h4>
            <p>{material.id}</p>
          </div>
        </div>
      </td>

      <td>{material.categoria}</td>
      <td>{material.unidad}</td>

      <td>
        <strong>
          {formatearPrecioUSD(material.costoUnitario)}
        </strong>

        <span className="precio-pesos">
          {" "}
          ({formatearPrecioUYU(material.costoUnitarioUYU)})
        </span>

        <p>{material.precioDetalle}</p>
      </td>

      <td>{material.ultimaActualizacion}</td>

      <td>
        <MaterialDisponibilidad
          disponibilidad={material.disponibilidad}
        />
      </td>

      <td>
        <strong>{material.stock.split(" ")[0]}</strong>
        <p>{material.stock.split(" ").slice(1).join(" ")}</p>
      </td>

      <td>
        <MaterialEstadoBadge
          estado={material.estado}
        />
      </td>

      <td>
        <MaterialAcciones
          onEditar={() => onEditar(material)}
          onActualizarPrecio={() =>
            onActualizarPrecio(material)
          }
          onEliminar={() => onEliminar(material)}
        />
      </td>
    </tr>
  );
}