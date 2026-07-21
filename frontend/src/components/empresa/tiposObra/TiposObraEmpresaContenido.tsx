import "../../../styles/empresa/tiposObra/TiposObraEmpresa.css";

import PageHeader from "../../common/PageHeader";
import Toast from "../../common/Toast";

import TiposObraKPIs from "./TiposObraKPIs";
import TiposObraFiltros from "./TiposObraFiltros";
import TablaTiposObra from "./TablaTiposObra";
import TipoObraDetallePanel from "./TipoObraDetallePanel";

import TipoObraModal from "./TipoObraModal";
import ObservacionesTipoObraModal from "./ObservacionesTipoObraModal";
import ConfirmEliminarTipoObraModal from "./ConfirmEliminarTipoObraModal";

import useTiposObra from "../../../hooks/useTiposObra";

export default function TiposObraEmpresaContenido() {
  const {
    tiposObra,
    tipoSeleccionado,
    tipoAccion,

    modoModal,

    modalTipoObra,
    modalObservaciones,
    modalEliminar,

    cargando,
    guardando,
    error,

    toastVisible,
    toastMensaje,
    toastTipo,

    seleccionarTipoObra,

    abrirCrear,
    abrirEditar,
    abrirObservaciones,
    abrirEliminar,

    cerrarModales,
    cerrarToast,

    guardarTipoObra,
    duplicarTipoObra,
    cambiarEstado,
    eliminarTipoObra,
  } = useTiposObra();

  return (
    <section className="tipos-obra-page">
      <PageHeader
        title="Gestión de tipos de obra"
        subtitle="Configura los tipos de obra que el sistema puede cotizar y sus parámetros."
        buttonText="Agregar tipo de obra"
        onButtonClick={abrirCrear}
      />

      <TiposObraKPIs />

      <TiposObraFiltros />

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
            tiposObra={tiposObra}
            tipoSeleccionado={tipoSeleccionado}
            onSeleccionarTipo={seleccionarTipoObra}
            onEditar={abrirEditar}
            onObservaciones={abrirObservaciones}
            onDuplicar={duplicarTipoObra}
            onCambiarEstado={cambiarEstado}
            onEliminar={abrirEliminar}
          />

          {tipoSeleccionado ? (
            <TipoObraDetallePanel
              tipoObra={tipoSeleccionado}
            />
          ) : (
            <div className="tipos-obra-vacio">
              No hay tipos de obra registrados.
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

      <ConfirmEliminarTipoObraModal
        abierto={modalEliminar}
        tipoObra={tipoAccion}
        onCerrar={cerrarModales}
        onConfirmar={eliminarTipoObra}
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