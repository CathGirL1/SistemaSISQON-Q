import "../../../styles/empresa/cotizaciones/TablaCotizaciones.css";

import {
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import GestionarCotizacionModal from "./GestionarCotizacionModal";

import type {
  Cotizacion,
  EstadoCotizacion,
} from "../../../interfaces/Cotizacion";

import {
  finalizarCotizacion,
} from "../../../services/cotizacionService";

import FilaCotizacion from "./FilaCotizacion";
import DetalleCotizacionModal from "./DetalleCotizacionModal";
import EditarEstadoCotizacionModal from "./EditarEstadoCotizacionModal";
import ConfirmEliminarCotizacionModal from "./ConfirmEliminarCotizacionModal";


// =====================================================
// PROPS
// =====================================================

type Props = {
  cotizaciones: Cotizacion[];

  setCotizaciones: Dispatch<
    SetStateAction<Cotizacion[]>
  >;

  cargando: boolean;
  error: string;

  onActualizada: () => Promise<void>;

  paginaActual: number;
  porPagina: number;
  totalCotizaciones: number;
};


// =====================================================
// COMPONENTE
// =====================================================

export default function TablaCotizaciones({
  cotizaciones,
  setCotizaciones,
  cargando,
  error,
  onActualizada,
  paginaActual,
  porPagina,
  totalCotizaciones,
}: Props) {

  const [modalDetalle, setModalDetalle] =
    useState(false);

  const [modalGestionar, setModalGestionar] =
    useState(false);

  const [modalEditar, setModalEditar] =
    useState(false);

  const [modalEliminar, setModalEliminar] =
    useState(false);

  const [
    cotizacionSeleccionada,
    setCotizacionSeleccionada,
  ] = useState<Cotizacion | null>(null);


  // =====================================================
  // ABRIR MODALES
  // =====================================================

  const abrirDetalle = (
    cotizacion: Cotizacion
  ) => {
    setCotizacionSeleccionada(cotizacion);
    setModalDetalle(true);
  };


  const abrirGestionar = (
    cotizacion: Cotizacion
  ) => {
    setCotizacionSeleccionada(cotizacion);
    setModalGestionar(true);
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


  // =====================================================
  // CERRAR MODALES
  // =====================================================

  const cerrarModales = () => {
    setModalDetalle(false);
    setModalGestionar(false);
    setModalEditar(false);
    setModalEliminar(false);
    setCotizacionSeleccionada(null);
  };


  // =====================================================
  // FINALIZAR COTIZACIÓN
  // =====================================================

  const finalizarCotizacionSeleccionada =
    async (
      cotizacion: Cotizacion
    ) => {
      const confirmar =
        window.confirm(
          "¿Seguro que querés finalizar esta cotización? Una vez finalizada no podrá volver a modificarse."
        );

      if (!confirmar) {
        return;
      }

      try {
        await finalizarCotizacion(
          cotizacion.idCotizacion
        );

        // Recarga las cotizaciones desde la BDD.
        // Al estar en el componente padre,
        // también actualiza automáticamente los KPIs.
        await onActualizada();

      } catch (error: unknown) {
        console.error(error);

        const mensaje =
          error instanceof Error
            ? error.message
            : "No se pudo finalizar la cotización";

        window.alert(mensaje);
      }
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
      (anteriores) =>
        anteriores.map(
          (cotizacion) =>
            cotizacion.id ===
            cotizacionSeleccionada.id
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

    const id =
      cotizacionSeleccionada.id;

    setCotizaciones(
      (anteriores) =>
        anteriores.filter(
          (cotizacion) =>
            cotizacion.id !== id
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
        <p>
          Cargando cotizaciones...
        </p>
      </div>
    );
  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="tabla-cotizaciones-card">
        <p>
          {error}
        </p>
      </div>
    );
  }


  // =====================================================
  // VISTA
  // =====================================================

  return (
    <div className="tabla-cotizaciones-card">

      {/* =================================================
          ENCABEZADO
          ================================================= */}

      <div className="tabla-cotizaciones-header">
        <div>
          <h2>
            Listado de cotizaciones
          </h2>

          <p>
            Visualizá y gestioná las solicitudes recibidas.
          </p>
        </div>
      </div>


      {/* =================================================
          TABLA
          ================================================= */}

      <div className="tabla-cotizaciones-wrapper">

        <table className="tabla-cotizaciones">

          <thead>
            <tr>
              <th>ID ↕</th>
              <th>Cliente ↕</th>
              <th>Tipo de obra ↕</th>
              <th>Fecha ↕</th>
              <th>Total ↕</th>
              <th>Estado ↕</th>
              <th>Acciones</th>
            </tr>
          </thead>


          <tbody>

            {cotizaciones.map(
              (cotizacion) => (

                <FilaCotizacion
                  key={cotizacion.id}

                  cotizacion={
                    cotizacion
                  }

                  onVerDetalle={
                    abrirDetalle
                  }

                  onGestionar={
                    abrirGestionar
                  }

                  onEditarEstado={
                    abrirEditar
                  }

                  onFinalizar={
                    finalizarCotizacionSeleccionada
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


      {/* =================================================
          INFORMACIÓN INFERIOR
          ================================================= */}

      <div className="tabla-footer-info">

        {totalCotizaciones === 0 ? (
          <>
            No hay cotizaciones que coincidan con los filtros
          </>
        ) : (
          <>
            Mostrando{" "}
            {(paginaActual - 1) * porPagina + 1}
            -
            {Math.min(
              paginaActual * porPagina,
              totalCotizaciones
            )}
            {" "}de{" "}
            {totalCotizaciones}
            {" "}cotizaciones
          </>
        )}

      </div>


      {/* =================================================
          MODAL DETALLE
          ================================================= */}

      <DetalleCotizacionModal
        abierto={modalDetalle}
        cotizacion={
          cotizacionSeleccionada
        }
        onCerrar={
          cerrarModales
        }
      />


      {/* =================================================
          MODAL GESTIONAR
          ================================================= */}

      <GestionarCotizacionModal
        abierto={modalGestionar}
        cotizacion={
          cotizacionSeleccionada
        }
        onCerrar={
          cerrarModales
        }
        onActualizada={
          onActualizada
        }
      />


      {/* =================================================
          MODAL EDITAR ESTADO
          ================================================= */}

      <EditarEstadoCotizacionModal
        abierto={modalEditar}
        cotizacion={
          cotizacionSeleccionada
        }
        onCerrar={
          cerrarModales
        }
        onGuardar={
          guardarEstado
        }
      />


      {/* =================================================
          MODAL ELIMINAR
          ================================================= */}

      <ConfirmEliminarCotizacionModal
        abierto={modalEliminar}
        cotizacion={
          cotizacionSeleccionada
        }
        onCerrar={
          cerrarModales
        }
        onConfirmar={
          eliminarCotizacion
        }
      />

    </div>
  );
}