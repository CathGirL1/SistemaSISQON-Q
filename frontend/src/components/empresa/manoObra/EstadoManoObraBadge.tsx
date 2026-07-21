import type { EstadoManoObra } from "../../../interfaces/ManoObraEmpresa";

type Props = {
  estado: EstadoManoObra;
};

export default function EstadoManoObraBadge({ estado }: Props) {
  return (
    <span className={`estado-mano-obra ${estado.toLowerCase()}`}>
      {estado}
    </span>
  );
}