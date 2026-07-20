type Props = {
  unidad: string;
};

export default function UnidadBadge({ unidad }: Props) {
  const clase = unidad
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace("²", "2")
    .replace(/\s+/g, "-")
    .toLowerCase();

  return (
    <span className={`unidad-mano-obra unidad-${clase}`}>
      {unidad}
    </span>
  );
}