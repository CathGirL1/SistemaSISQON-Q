import type { DisponibilidadMaterial } from "../../../interfaces/MaterialEmpresa";

type Props = {
  disponibilidad: DisponibilidadMaterial;
};

export default function MaterialDisponibilidad({ disponibilidad }: Props) {
  const clase = disponibilidad.toLowerCase().replace(" ", "-");

  return (
    <span className={`material-disponibilidad ${clase}`}>
      <span></span>
      {disponibilidad}
    </span>
  );
}