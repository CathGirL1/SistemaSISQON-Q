import "../../../styles/empresa/clientes/ClientesEmpresa.css";

import { useState } from "react";
import PageHeader from "../../common/PageHeader";
import ClientesKPIs from "./ClientesKPIs";
import ClientesFiltros from "./ClientesFiltros";
import TablaClientes from "./TablaClientes";
import ClienteDetallePanel from "./ClienteDetallePanel";
import PanelBottomCard from "../../common/PanelBottomCard";

import ClienteModal from "./ClienteModal";
import NotaClienteModal from "./NotaClienteModal";
import HistorialClienteModal from "./HistorialClienteModal";
import ConfirmEliminarClienteModal from "./ConfirmEliminarClienteModal";

import { clientesData } from "../../../data/clientesData";
import type { ClienteEmpresa } from "../../../interfaces/ClienteEmpresa";

export default function ClientesEmpresaContenido() {
  const [clientes, setClientes] = useState<ClienteEmpresa[]>(clientesData);
  const [clienteSeleccionado, setClienteSeleccionado] =
    useState<ClienteEmpresa>(clientesData[0]);

  const [clienteAccion, setClienteAccion] = useState<ClienteEmpresa | null>(null);

  const [modalEditar, setModalEditar] = useState(false);
  const [modalNota, setModalNota] = useState(false);
  const [modalHistorial, setModalHistorial] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);

  const abrirEditar = (cliente: ClienteEmpresa) => {
    setClienteAccion(cliente);
    setModalEditar(true);
  };

  const abrirNota = (cliente: ClienteEmpresa) => {
    setClienteAccion(cliente);
    setModalNota(true);
  };

  const abrirHistorial = (cliente: ClienteEmpresa) => {
    setClienteAccion(cliente);
    setModalHistorial(true);
  };

  const abrirEliminar = (cliente: ClienteEmpresa) => {
    setClienteAccion(cliente);
    setModalEliminar(true);
  };

  const cerrarModales = () => {
    setModalEditar(false);
    setModalNota(false);
    setModalHistorial(false);
    setModalEliminar(false);
    setClienteAccion(null);
  };

  const abrirWhatsapp = (cliente: ClienteEmpresa) => {
    const numero = cliente.telefono.replace(/\D/g, "");
    window.open(`https://wa.me/${numero}`, "_blank");
  };

  const llamarCliente = (cliente: ClienteEmpresa) => {
    window.location.href = `tel:${cliente.telefono.replace(/\s/g, "")}`;
  };

  const eliminarCliente = () => {
    if (!clienteAccion) return;

    const nuevaLista = clientes.filter((cliente) => cliente.id !== clienteAccion.id);

    setClientes(nuevaLista);

    if (clienteSeleccionado.id === clienteAccion.id && nuevaLista.length > 0) {
      setClienteSeleccionado(nuevaLista[0]);
    }

    cerrarModales();
  };

  return (
    <section className="clientes-page">
      <PageHeader
        title="Gestión de clientes"
        subtitle="Administra la información de tus clientes y su historial de cotizaciones."
        buttonText="Agregar cliente"
      />

      <ClientesKPIs />

      <ClientesFiltros />

      <div className="clientes-main-grid">
        <TablaClientes
          clientes={clientes}
          clienteSeleccionado={clienteSeleccionado}
          onSeleccionarCliente={setClienteSeleccionado}
          onWhatsapp={abrirWhatsapp}
          onEditar={abrirEditar}
          onAgregarNota={abrirNota}
          onLlamar={llamarCliente}
          onVerHistorial={abrirHistorial}
          onEliminar={abrirEliminar}
        />

        <ClienteDetallePanel cliente={clienteSeleccionado} />
      </div>

      <PanelBottomCard
        title="Mantené tu base de clientes actualizada"
        description="Una buena gestión de clientes aumenta tus oportunidades de cierre."
      />

      <ClienteModal abierto={modalEditar} cliente={clienteAccion} onCerrar={cerrarModales} />

      <NotaClienteModal abierto={modalNota} cliente={clienteAccion} onCerrar={cerrarModales} />

      <HistorialClienteModal
        abierto={modalHistorial}
        cliente={clienteAccion}
        onCerrar={cerrarModales}
      />

      <ConfirmEliminarClienteModal
        abierto={modalEliminar}
        cliente={clienteAccion}
        onCerrar={cerrarModales}
        onConfirmar={eliminarCliente}
      />
    </section>
  );
}