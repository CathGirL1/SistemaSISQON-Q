import "../../../styles/empresa/clientes/ClientesEmpresa.css";

import { useCallback, useEffect, useState } from "react";

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

import {
  actualizarCliente,
  crearCliente,
  eliminarCliente,
  obtenerClientes,
} from "../../../services/clienteService";

import type {
  ActualizarClienteRequest,
  CrearClienteRequest,
} from "../../../services/clienteService";

import type { ClienteEmpresa } from "../../../interfaces/ClienteEmpresa";

export default function ClientesEmpresaContenido() {
  const [clientes, setClientes] = useState<ClienteEmpresa[]>([]);

  const [clienteSeleccionado, setClienteSeleccionado] =
    useState<ClienteEmpresa | null>(null);

  const [clienteAccion, setClienteAccion] =
    useState<ClienteEmpresa | null>(null);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalNota, setModalNota] = useState(false);
  const [modalHistorial, setModalHistorial] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);

  const cargarClientes = useCallback(async () => {
    try {
      setCargando(true);
      setError("");

      const clientesObtenidos = await obtenerClientes();

      setClientes(clientesObtenidos);

      setClienteSeleccionado((seleccionActual) => {
        if (clientesObtenidos.length === 0) {
          return null;
        }

        if (seleccionActual) {
          const clienteActualizado = clientesObtenidos.find(
            (cliente) => cliente.id === seleccionActual.id
          );

          if (clienteActualizado) {
            return clienteActualizado;
          }
        }

        return clientesObtenidos[0];
      });
    } catch (errorDesconocido) {
      console.error(
        "Error al cargar clientes:",
        errorDesconocido
      );

      setError(
        errorDesconocido instanceof Error
          ? errorDesconocido.message
          : "Ocurrió un error al cargar los clientes."
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarClientes();
  }, [cargarClientes]);

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

    if (!numero) return;

    window.open(
      `https://wa.me/${numero}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const llamarCliente = (cliente: ClienteEmpresa) => {
    const numero = cliente.telefono.replace(/\D/g, "");

    if (!numero) return;

    window.location.href = `tel:${numero}`;
  };

  const guardarNuevoCliente = async (
    datos: CrearClienteRequest
  ) => {
    const clienteCreado = await crearCliente(datos);

    setClientes((listaActual) => [
      clienteCreado,
      ...listaActual,
    ]);

    setClienteSeleccionado(clienteCreado);
    setModalCrear(false);
  };

  const guardarEdicionCliente = async (
    datos: ActualizarClienteRequest
  ) => {
    if (!clienteAccion) {
      throw new Error(
        "No se pudo identificar el cliente."
      );
    }

    const clienteActualizado = await actualizarCliente(
      clienteAccion.id,
      datos
    );

    setClientes((listaActual) =>
      listaActual.map((cliente) =>
        cliente.id === clienteActualizado.id
          ? clienteActualizado
          : cliente
      )
    );

    if (
      clienteSeleccionado?.id === clienteActualizado.id
    ) {
      setClienteSeleccionado(clienteActualizado);
    }

    cerrarModales();
  };

  const guardarNotaCliente = async (nota: string) => {
    if (!clienteAccion) {
      throw new Error(
        "No se pudo identificar el cliente."
      );
    }

    const datos: ActualizarClienteRequest = {
      nombreUsuario: clienteAccion.nombreUsuario,
      gmail: clienteAccion.email,
      telefono: clienteAccion.telefono || null,
      direccion: clienteAccion.direccion || null,
      cedula: clienteAccion.cedula,
      nombre: clienteAccion.nombreReal,
      apellido: clienteAccion.apellido,
      ciudad: clienteAccion.ciudad || null,
      estado: clienteAccion.estado,
      notas: nota || null,
    };

    const clienteActualizado = await actualizarCliente(
      clienteAccion.id,
      datos
    );

    setClientes((listaActual) =>
      listaActual.map((cliente) =>
        cliente.id === clienteActualizado.id
          ? clienteActualizado
          : cliente
      )
    );

    if (
      clienteSeleccionado?.id === clienteActualizado.id
    ) {
      setClienteSeleccionado(clienteActualizado);
    }

    cerrarModales();
  };

  const confirmarEliminarCliente = async () => {
    if (!clienteAccion) {
      throw new Error(
        "No se pudo identificar el cliente."
      );
    }

    await eliminarCliente(clienteAccion.id);

    const nuevaLista = clientes.filter(
      (cliente) => cliente.id !== clienteAccion.id
    );

    setClientes(nuevaLista);

    if (clienteSeleccionado?.id === clienteAccion.id) {
      setClienteSeleccionado(nuevaLista[0] ?? null);
    }

    cerrarModales();
  };

  return (
    <section className="clientes-page">
      <PageHeader
        title="Gestión de clientes"
        subtitle="Administra la información de tus clientes y su historial de cotizaciones."
        buttonText="Agregar cliente"
        onButtonClick={() => setModalCrear(true)}
      />

      <ClientesKPIs />

      <ClientesFiltros />

      <div className="clientes-main-grid">
        <TablaClientes
          clientes={clientes}
          clienteSeleccionado={clienteSeleccionado}
          cargando={cargando}
          error={error}
          onSeleccionarCliente={setClienteSeleccionado}
          onWhatsapp={abrirWhatsapp}
          onEditar={abrirEditar}
          onAgregarNota={abrirNota}
          onLlamar={llamarCliente}
          onVerHistorial={abrirHistorial}
          onEliminar={abrirEliminar}
        />

        {clienteSeleccionado ? (
          <ClienteDetallePanel
            cliente={clienteSeleccionado}
          />
        ) : (
          <aside className="cliente-detalle-vacio">
            <h3>Sin cliente seleccionado</h3>
            <p>
              Seleccioná un cliente para consultar sus datos.
            </p>
          </aside>
        )}
      </div>

      <PanelBottomCard
        title="Mantené tu base de clientes actualizada"
        description="Una buena gestión de clientes aumenta tus oportunidades de cierre."
      />

      <ClienteModal
        abierto={modalCrear}
        modo="crear"
        cliente={null}
        onCerrar={() => setModalCrear(false)}
        onGuardar={(datos) =>
          guardarNuevoCliente(
            datos as CrearClienteRequest
          )
        }
      />

      <ClienteModal
        abierto={modalEditar}
        modo="editar"
        cliente={clienteAccion}
        onCerrar={cerrarModales}
        onGuardar={(datos) =>
          guardarEdicionCliente(
            datos as ActualizarClienteRequest
          )
        }
      />

      <NotaClienteModal
        abierto={modalNota}
        cliente={clienteAccion}
        onCerrar={cerrarModales}
        onGuardar={guardarNotaCliente}
      />

      <HistorialClienteModal
        abierto={modalHistorial}
        cliente={clienteAccion}
        onCerrar={cerrarModales}
      />

      <ConfirmEliminarClienteModal
        abierto={modalEliminar}
        cliente={clienteAccion}
        onCerrar={cerrarModales}
        onConfirmar={confirmarEliminarCliente}
      />
    </section>
  );
}