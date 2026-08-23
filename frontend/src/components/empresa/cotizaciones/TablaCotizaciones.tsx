import "../../../styles/empresa/cotizaciones/TablaCotizaciones.css";

import { useEffect, useState } from "react";

import type {
  Cotizacion,
  EstadoCotizacion,
} from "../../../interfaces/Cotizacion";

import {
  obtenerCotizacionesEmpresa,
} from "../../../services/cotizacionService";

import FilaCotizacion from "./FilaCotizacion";
import DetalleCotizacionModal from "./DetalleCotizacionModal";
import EditarEstadoCotizacionModal from "./EditarEstadoCotizacionModal";
import ConfirmEliminarCotizacionModal from "./ConfirmEliminarCotizacionModal";

export default function TablaCotizaciones() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);

  const [seleccionadas, setSeleccionadas] =
    useState<string[]>([]);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [modalDetalle, setModalDetalle] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);

  const [cotizacionSeleccionada, setCotizacionSeleccionada] =
    useState<Cotizacion | null>(null);

  // =====================================================
  // OBTENER COTIZACIONES
  // =====================================================

  useEffect(() => {
    const cargarCotizaciones = async () => {
      try {
        setCargando(true);
        setError("");

        const usuarioGuardado =
          localStorage.getItem("usuario");

        if (!usuarioGuardado) {
          throw new Error(
            "No hay una sesión iniciada"
          );
        }

        const usuario = JSON.parse(usuarioGuardado);

        const idEmpresa = Number(usuario.idEmpresa);

        if (!idEmpresa) {
          throw new Error(
            "No se encontró la empresa asociada al usuario"
          );
        }

        const datos =
          await obtenerCotizacionesEmpresa(idEmpresa);

        setCotizaciones(datos);
      } catch (error: unknown) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Ocurrió un error al cargar las cotizaciones"
        );
      } finally {
        setCargando(false);
      }
    };

    cargarCotizaciones();
  }, []);

  // =====================================================
  // SELECCIÓN
  // =====================================================

  const todasSeleccionadas =
    cotizaciones.length > 0 &&
    seleccionadas.length === cotizaciones.length;

  const seleccionarTodas = () => {
    if (todasSeleccionadas) {
      setSeleccionadas([]);
    } else {
      setSeleccionadas(
        cotizaciones.map(
          (cotizacion) => cotizacion.id
        )
      );
    }
  };

  const seleccionarCotizacion = (id: string) => {
    if (seleccionadas.includes(id)) {
      setSeleccionadas(
        seleccionadas.filter(
          (item) => item !== id
        )
      );
    } else {
      setSeleccionadas([
        ...seleccionadas,
        id,
      ]);
    }
  };

  // =====================================================
  // MODALES
  // =====================================================

  const abrirDetalle = (
    cotizacion: Cotizacion
  ) => {
    setCotizacionSeleccionada(cotizacion);
    setModalDetalle(true);
  };

  const abrirEditar = (
    cotizacion: Cotizacion
  ) => {
    setCotizacionSeleccionada(cotizacion);
    setModalEditar(true);
  };

  const abrirEliminar = (
    cotizacion: Cotizacion
  ) => {
    setCotizacionSeleccionada(cotizacion);
    setModalEliminar(true);
  };

  const cerrarModales = () => {
    setModalDetalle(false);
    setModalEditar(false);
    setModalEliminar(false);
    setCotizacionSeleccionada(null);
  };

  // =====================================================
  // CAMBIAR ESTADO
  // =====================================================

  const guardarEstado = (
    estado: EstadoCotizacion
  ) => {
    if (!cotizacionSeleccionada) {
      return;
    }

    setCotizaciones(
      cotizaciones.map(
        (cotizacion) =>
          cotizacion.id === cotizacionSeleccionada.id
            ? {
                ...cotizacion,
                estado,
              }
            : cotizacion
      )
    );

    cerrarModales();
  };

  // =====================================================
  // ELIMINAR
  // =====================================================

  const eliminarCotizacion = () => {
    if (!cotizacionSeleccionada) {
      return;
    }

    setCotizaciones(
      cotizaciones.filter(
        (cotizacion) =>
          cotizacion.id !== cotizacionSeleccionada.id
      )
    );

    setSeleccionadas(
      seleccionadas.filter(
        (id) =>
          id !== cotizacionSeleccionada.id
      )
    );

    cerrarModales();
  };

  // =====================================================
  // CARGANDO
  // =====================================================

  if (cargando) {
    return (
      <div className="tabla-cotizaciones-card">
        <p>Cargando cotizaciones...</p>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="tabla-cotizaciones-card">
        <p>{error}</p>
      </div>
    );
  }

  // =====================================================
  // VISTA
  // =====================================================

  return (
    <div className="tabla-cotizaciones-card">

      <div className="tabla-cotizaciones-header">

        <div>
          <h2>
            Listado de cotizaciones
          </h2>

          <p>
            Visualizá y gestioná las solicitudes recibidas.
          </p>
        </div>

        {seleccionadas.length > 0 && (
          <div className="acciones-masivas">

            <span>
              {seleccionadas.length} seleccionada(s)
            </span>

            <button>
              Cambiar estado
            </button>

            <button>
              Exportar
            </button>

            <button className="danger">
              Eliminar
            </button>

          </div>
        )}

      </div>

      <div className="tabla-cotizaciones-wrapper">

        <table className="tabla-cotizaciones">

          <thead>
            <tr>

              <th>
                <input
                  type="checkbox"
                  checked={todasSeleccionadas}
                  onChange={seleccionarTodas}
                />
              </th>

              <th>ID ↕</th>
              <th>Cliente ↕</th>
              <th>Tipo de obra ↕</th>
              <th>Fecha ↕</th>
              <th>Total estimado ↕</th>
              <th>Estado ↕</th>
              <th>Acciones</th>

            </tr>
          </thead>

          <tbody>

            {cotizaciones.map(
              (cotizacion) => (
                <FilaCotizacion
                  key={cotizacion.id}

                  cotizacion={cotizacion}

                  seleccionada={
                    seleccionadas.includes(
                      cotizacion.id
                    )
                  }

                  onSeleccionar={
                    seleccionarCotizacion
                  }

                  onVerDetalle={
                    abrirDetalle
                  }

                  onEditarEstado={
                    abrirEditar
                  }

                  onEliminar={
                    abrirEliminar
                  }
                />
              )
            )}

          </tbody>

        </table>

      </div>

      <div className="tabla-footer-info">

        Mostrando 1-
        {cotizaciones.length}
        {" "}de{" "}
        {cotizaciones.length}
        {" "}cotizaciones

      </div>

      <DetalleCotizacionModal
        abierto={modalDetalle}
        cotizacion={cotizacionSeleccionada}
        onCerrar={cerrarModales}
      />

      <EditarEstadoCotizacionModal
        abierto={modalEditar}
        cotizacion={cotizacionSeleccionada}
        onCerrar={cerrarModales}
        onGuardar={guardarEstado}
      />

      <ConfirmEliminarCotizacionModal
        abierto={modalEliminar}
        cotizacion={cotizacionSeleccionada}
        onCerrar={cerrarModales}
        onConfirmar={eliminarCotizacion}
      />

    </div>
  );
}