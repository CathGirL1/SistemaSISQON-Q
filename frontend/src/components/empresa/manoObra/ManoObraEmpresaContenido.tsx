import "../../../styles/empresa/manoObra/ManoObraEmpresa.css";

import PageHeader from "../../common/PageHeader";
import PanelBottomCard from "../../common/PanelBottomCard";
import Toast from "../../common/Toast";

import ManoObraKPIs from "./ManoObraKPIs";
import ManoObraFiltros from "./ManoObraFiltros";
import TablaManoObra from "./TablaManoObra";
import ManoObraModal from "./ManoObraModal";
import ConfirmEliminarManoObra from "./ConfirmEliminarManoObra";

import useManoObra from "../../../hooks/useManoObra";

export default function ManoObraEmpresaContenido() {
  const {
    trabajos,
    trabajosFiltrados,
    trabajoAccion,

    modoModal,
    modalTrabajo,
    modalEliminar,

    busqueda,
    zonaFiltro,
    unidadFiltro,
    estadoFiltro,

    toastVisible,
    toastMensaje,
    toastTipo,

    setBusqueda,
    setZonaFiltro,
    setUnidadFiltro,
    setEstadoFiltro,

    abrirCrear,
    abrirEditar,
    abrirEliminar,
    cerrarModales,

    guardarTrabajo,
    cambiarEstado,
    eliminarTrabajo,

    cerrarToast,
  } = useManoObra();

  return (
    <section className="mano-obra-page">
      <PageHeader
        title="Gestión de mano de obra"
        subtitle="Administra los costos de mano de obra por tipo de trabajo, unidad, zona y nivel de complejidad."
        buttonText="Agregar trabajo"
        onButtonClick={abrirCrear}
      />

      <ManoObraKPIs trabajos={trabajos} />

      <ManoObraFiltros
        busqueda={busqueda}
        zona={zonaFiltro}
        unidad={unidadFiltro}
        estado={estadoFiltro}
        onBusquedaChange={setBusqueda}
        onZonaChange={setZonaFiltro}
        onUnidadChange={setUnidadFiltro}
        onEstadoChange={setEstadoFiltro}
      />

      <TablaManoObra
        trabajos={trabajosFiltrados}
        onEditar={abrirEditar}
        onCambiarEstado={cambiarEstado}
        onEliminar={abrirEliminar}
      />

      <PanelBottomCard
        title="Información importante"
        description="Los costos de mano de obra pueden variar según la zona geográfica y la complejidad del trabajo."
        secondaryText="Guía de configuración"
      />

      <ManoObraModal
        abierto={modalTrabajo}
        modo={modoModal}
        trabajo={trabajoAccion}
        onCerrar={cerrarModales}
        onGuardar={guardarTrabajo}
      />

      <ConfirmEliminarManoObra
        abierto={modalEliminar}
        trabajo={trabajoAccion}
        onCerrar={cerrarModales}
        onConfirmar={eliminarTrabajo}
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