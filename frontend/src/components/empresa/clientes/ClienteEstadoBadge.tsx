import type { EstadoCliente } from "../../../interfaces/ClienteEmpresa";

type Props = {
  estado: EstadoCliente;
};

export default function ClienteEstadoBadge({ estado }: Props) {
  const clase = estado.toLowerCase().replace(" ", "-");

  return <span className={`cliente-estado ${clase}`}>{estado}</span>;
}