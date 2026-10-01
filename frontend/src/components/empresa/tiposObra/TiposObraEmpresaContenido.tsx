import "../../../styles/empresa/tiposObra/TiposObraEmpresa.css";

import PageHeader from "../../common/PageHeader";
import Toast from "../../common/Toast";

import TiposObraKPIs from "./TiposObraKPIs";
import TiposObraFiltros from "./TiposObraFiltros";
import TablaTiposObra from "./TablaTiposObra";
import TipoObraDetallePanel from "./TipoObraDetallePanel";

import TipoObraModal from "./TipoObraModal";
import ObservacionesTipoObraModal from "./ObservacionesTipoObraModal";

import useTiposObra from "../../../hooks/useTiposObra";

export default function TiposObraEmpresaContenido() {
  const {
    tiposObra,
    tiposObraFiltrados,

    busqueda,
    estadoFiltro,

    setBusqueda,
    setEstadoFiltro,

    tipoSeleccionado,
    tipoAccion,

    modoModal,

    modalTipoObra,
    modalObservaciones,

    cargando,
    guardando,
    error,

    toastVisible,
    toastMensaje,
    toastTipo,

    seleccionarTipoObra,
    limpiarSeleccion,
    abrirEditar,
    abrirObservaciones,

    cerrarModales,
    cerrarToast,

    guardarTipoObra,
    cambiarEstado,
  } = useTiposObra();

  return (
    <section className="tipos-obra-page">
      <PageHeader
        title="Gestión de tipos de obra"
        subtitle="Consulta los tipos de obra disponibles y administra su estado."
      />

      <TiposObraKPIs tiposObra={tiposObra} />

      <TiposObraFiltros
        busqueda={busqueda}
        estado={estadoFiltro}
        onBusquedaChange={setBusqueda}
        onEstadoChange={setEstadoFiltro}
      />

      {cargando && (
        <div className="tipos-obra-vacio">
          Cargando tipos de obra...
        </div>
      )}

      {error && !cargando && (
        <div className="tipos-obra-vacio">
          {error}
        </div>
      )}

      {!cargando && !error && (
        <div className="tipos-obra-main-grid">
          <TablaTiposObra
            tiposObra={tiposObraFiltrados}
            tipoSeleccionado={tipoSeleccionado}
            onSeleccionarTipo={seleccionarTipoObra}
            onEditar={abrirEditar}
            onObservaciones={abrirObservaciones}
            onCambiarEstado={cambiarEstado}
          />

          {tipoSeleccionado &&
          tiposObraFiltrados.some(
            (tipo) => tipo.id === tipoSeleccionado.id
          ) ? (
            <TipoObraDetallePanel
              tipoObra={tipoSeleccionado}
              onCerrar={limpiarSeleccion}
            />
          ) : (
            <div className="tipo-obra-detalle-vacio">
              <h3>Seleccioná un tipo de obra</h3>
              <p>
                Elegí un registro de la tabla para visualizar su información.
              </p>
            </div>
          )}
        </div>
      )}

      <TipoObraModal
        abierto={modalTipoObra}
        modo={modoModal}
        tipoObra={tipoAccion}
        onCerrar={cerrarModales}
        onGuardar={guardarTipoObra}
        guardando={guardando}
      />

      <ObservacionesTipoObraModal
        abierto={modalObservaciones}
        tipoObra={tipoAccion}
        onCerrar={cerrarModales}
      />

      <Toast
        visible={toastVisible}
        mensaje={toastMensaje}
        tipo={toastTipo}
        onCerrar={cerrarToast}
      />
    </section>
  );
}