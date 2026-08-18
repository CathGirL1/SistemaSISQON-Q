import "../../../styles/empresa/clientes/ClientesKPIs.css";

import {
  FaUsers,
  FaUserClock,
  FaPhoneAlt,
  FaCheckCircle,
} from "react-icons/fa";

import KpiCard from "../../common/KpiCard";

import type { ClienteEmpresa } from "../../../interfaces/ClienteEmpresa";

type Props = {
  clientes: ClienteEmpresa[];
};

export default function ClientesKPIs({
  clientes,
}: Props) {
  const totalClientes = clientes.length;

  const interesados = clientes.filter(
    (cliente) => cliente.estado === "Interesado"
  ).length;

  const contactados = clientes.filter(
    (cliente) => cliente.estado === "Contactado"
  ).length;

  const confirmados = clientes.filter(
    (cliente) =>
      cliente.estado === "Cliente confirmado"
  ).length;

  return (
    <div className="clientes-kpis">
      <KpiCard
        title="Total clientes"
        value={totalClientes}
        icon={<FaUsers />}
        variant="blue"
      />

      <KpiCard
        title="Interesados"
        value={interesados}
        icon={<FaUserClock />}
        variant="yellow"
      />

      <KpiCard
        title="Contactados"
        value={contactados}
        icon={<FaPhoneAlt />}
        variant="purple"
      />

      <KpiCard
        title="Confirmados"
        value={confirmados}
        icon={<FaCheckCircle />}
        variant="green"
      />
    </div>
  );
}