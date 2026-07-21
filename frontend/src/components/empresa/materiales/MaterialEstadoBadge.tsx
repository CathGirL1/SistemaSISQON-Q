import type { EstadoMaterial } from "../../../interfaces/MaterialEmpresa";

type Props = {
  estado: EstadoMaterial;
};

export default function MaterialEstadoBadge({ estado }: Props) {
  const clase = estado.toLowerCase();

  return <span className={`material-estado ${clase}`}>{estado}</span>;
}