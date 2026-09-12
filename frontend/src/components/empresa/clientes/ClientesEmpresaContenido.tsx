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
  obtenerClientesPorEmpresa,
  obtenerHistorialCotizacionesCliente,
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

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroCiudad, setFiltroCiudad] = useState("");
  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalNota, setModalNota] = useState(false);
  const [modalHistorial, setModalHistorial] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);

  const cargarClientes = useCallback(async () => {
    try {
    setCargando(true);
    setError("");

    const usuario = JSON.parse(
      localStorage.getItem("usuario") || "{}"
    );

    const idEmpresa = usuario.idEmpresa;

    if (!idEmpresa) {
      throw new Error(
        "No se pudo identificar la empresa autenticada."
      );
    }

    const clientesObtenidos =
      await obtenerClientesPorEmpresa(idEmpresa);

    const clientesConHistorial =
      await Promise.all(
        clientesObtenidos.map(async (cliente) => {
          try {
            const historial =
              await obtenerHistorialCotizacionesCliente(
                cliente.id,
                idEmpresa
              );

            return {
              ...cliente,

              historialCotizaciones: historial,

              historial:
                historial.length === 0
                  ? "Sin cotizaciones"
                  : historial.length === 1
                    ? "1 cotización"
                    : `${historial.length} cotizaciones`,

              ultimaCotizacion:
                historial.length > 0
                  ? historial[0].fecha
                  : "Sin registros",
            };
          } catch (error) {
            console.error(
              `Error al cargar historial del cliente ${cliente.id}:`,
              error
            );

            return cliente;
          }
        })
      );

    setClientes(clientesConHistorial);

    setClienteSeleccionado((seleccionActual) => {
      if (clientesConHistorial.length === 0) {
        return null;
      }

      if (seleccionActual) {
        const clienteActualizado =
          clientesConHistorial.find(
            (cliente) =>
              cliente.id === seleccionActual.id
          );

        if (clienteActualizado) {
          return clienteActualizado;
        }
      }

      return clientesConHistorial[0];
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

  const ciudades = Array.from(
  new Set(
    clientes
      .map((cliente) => cliente.ciudad)
      .filter(
        (ciudad) =>
          ciudad &&
          ciudad.trim().length > 0
      )
    )
  ).sort();

  const clientesFiltrados = clientes.filter(
  (cliente) => {
    const textoBusqueda =
      `${cliente.nombre} ${cliente.email} ${cliente.telefono}`
        .toLowerCase();

    const coincideBusqueda =
      textoBusqueda.includes(
        busqueda.toLowerCase().trim()
      );

    const coincideEstado =
      !filtroEstado ||
      cliente.estado === filtroEstado;

    const coincideCiudad =
      !filtroCiudad ||
      cliente.ciudad === filtroCiudad;

    return (
      coincideBusqueda &&
      coincideEstado &&
      coincideCiudad
    );
    }
  );

  const limpiarFiltros = () => {
  setBusqueda("");
  setFiltroEstado("");
  setFiltroCiudad("");
  };

  const abrirEditar = (cliente: ClienteEmpresa) => {
    setClienteAccion(cliente);
    setModalEditar(true);
  };

  const abrirNota = (cliente: ClienteEmpresa) => {
    setClienteAccion(cliente);
    setModalNota(true);
  };

  const abrirHistorial = async (
  cliente: ClienteEmpresa
  ) => {
  try {
    const usuario = JSON.parse(
      localStorage.getItem("usuario") || "{}"
    );

    const idEmpresa = usuario.idEmpresa;

    if (!idEmpresa) {
      throw new Error(
        "No se pudo identificar la empresa autenticada."
      );
    }

    const historial =
      await obtenerHistorialCotizacionesCliente(
        cliente.id,
        idEmpresa
      );

    const clienteConHistorial: ClienteEmpresa = {
      ...cliente,
      historialCotizaciones: historial,
      historial:
        historial.length === 0
          ? "Sin cotizaciones"
          : historial.length === 1
            ? "1 cotización"
            : `${historial.length} cotizaciones`,
      ultimaCotizacion:
        historial.length > 0
          ? historial[0].fecha
          : "Sin registros",
    };

    setClienteAccion(clienteConHistorial);

    setClientes((listaActual) =>
      listaActual.map((item) =>
        item.id === cliente.id
          ? clienteConHistorial
          : item
      )
    );

    if (clienteSeleccionado?.id === cliente.id) {
      setClienteSeleccionado(
        clienteConHistorial
      );
    }

    setModalHistorial(true);
    } catch (errorDesconocido) {
    console.error(
      "Error al obtener historial:",
      errorDesconocido
    );
    }
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
    const usuario = JSON.parse(
      localStorage.getItem("usuario") || "{}"
    );

    const idEmpresa = usuario.idEmpresa;

    if (!idEmpresa) {
      throw new Error(
        "No se pudo identificar la empresa autenticada."
      );
    }
    const clienteCreado = await crearCliente(datos, idEmpresa);

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

    const usuario = JSON.parse(
      localStorage.getItem("usuario") || "{}"
    );

    const idEmpresa = usuario.idEmpresa;

    if (!idEmpresa) {
      throw new Error(
        "No se pudo identificar la empresa autenticada."
      );
    }

    

    const clienteActualizado = await actualizarCliente(
      clienteAccion.id,
      idEmpresa, 
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

    const usuario = JSON.parse(
      localStorage.getItem("usuario") || "{}"
    );

    const idEmpresa = usuario.idEmpresa;

    if (!idEmpresa) {
      throw new Error(
        "No se pudo identificar la empresa autenticada."
      );
    }
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
      idEmpresa, 
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

    await eliminarCliente(clienteAccion.id, clienteAccion.idEmpresa);

    const nuevaLista = clientes.filter(
      (cliente) => cliente.id !== clienteAccion.id
    );

    setClientes(nuevaLista);

    if (clienteSeleccionado?.id === clienteAccion.id) {
      setClienteSeleccionado(nuevaLista[0] ?? null);
    }

    cerrarModales();
  };
   const seleccionarCliente = async (
    cliente: ClienteEmpresa
    ) => {
    try {
    const usuario = JSON.parse(
      localStorage.getItem("usuario") || "{}"
    );

    const idEmpresa = usuario.idEmpresa;

    if (!idEmpresa) {
      throw new Error(
        "No se pudo identificar la empresa autenticada."
      );
    }

    const historial =
      await obtenerHistorialCotizacionesCliente(
        cliente.id,
        idEmpresa
      );

    const clienteConHistorial: ClienteEmpresa = {
      ...cliente,
      historialCotizaciones: historial,
      historial:
        historial.length === 0
          ? "Sin cotizaciones"
          : historial.length === 1
            ? "1 cotización"
            : `${historial.length} cotizaciones`,
      ultimaCotizacion:
        historial.length > 0
          ? historial[0].fecha
          : "Sin registros",
    };

    setClientes((listaActual) =>
      listaActual.map((item) =>
        item.id === cliente.id
          ? clienteConHistorial
          : item
      )
    );

    setClienteSeleccionado(
      clienteConHistorial
    );
    } catch (errorDesconocido) {
    console.error(
      "Error al cargar historial:",
      errorDesconocido
    );

    setClienteSeleccionado(cliente);
    }
   };

  return (
    <section className="clientes-page">
      <PageHeader
        title="Gestión de clientes"
        subtitle="Administra la información de tus clientes y su historial de cotizaciones."
      />

  <ClientesKPIs
    clientes={clientes}
  />

  <ClientesFiltros
    busqueda={busqueda}
    estado={filtroEstado}
    ciudad={filtroCiudad}
    ciudades={ciudades}
    onBusquedaChange={setBusqueda}
    onEstadoChange={setFiltroEstado}
    onCiudadChange={setFiltroCiudad}
    onLimpiarFiltros={limpiarFiltros}
  />

      <div className="clientes-main-grid">
        <TablaClientes
          clientes={clientesFiltrados}
          clienteSeleccionado={clienteSeleccionado}
          cargando={cargando}
          error={error}
          onSeleccionarCliente={seleccionarCliente}
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
            onCerrar={() =>
              setClienteSeleccionado(null)
            }
            onVerHistorial={abrirHistorial}
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