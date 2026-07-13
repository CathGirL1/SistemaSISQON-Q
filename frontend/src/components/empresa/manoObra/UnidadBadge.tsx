import type { UnidadManoObra } from "../../../interfaces/ManoObraEmpresa";

type Props = {
  unidad: UnidadManoObra;
};

export default function UnidadBadge({ unidad }: Props) {
  const clase = unidad
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace("²", "2")
    .toLowerCase();

  return (
    <span className={`unidad-mano-obra unidad-${clase}`}>
      {unidad}
    </span>
  );
}