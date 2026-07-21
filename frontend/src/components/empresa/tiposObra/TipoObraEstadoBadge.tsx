import type { EstadoTipoObra } from "../../../interfaces/TipoObraEmpresa";

type Props = {
  estado: EstadoTipoObra;
};

export default function TipoObraEstadoBadge({ estado }: Props) {
  return <span className={`tipo-obra-estado ${estado.toLowerCase()}`}>{estado}</span>;
}