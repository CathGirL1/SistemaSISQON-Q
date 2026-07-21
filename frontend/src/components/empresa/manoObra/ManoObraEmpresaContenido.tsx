import "../../../styles/empresa/manoObra/ManoObraEmpresa.css";

import ConfirmEliminarManoObra from "./ConfirmEliminarManoObra";
import ManoObraFiltros from "./ManoObraFiltros";
import ManoObraKPIs from "./ManoObraKPIs";
import ManoObraModal from "./ManoObraModal";
import TablaManoObra from "./TablaManoObra";

import PageHeader from "../../common/PageHeader";
import PanelBottomCard from "../../common/PanelBottomCard";
import Toast from "../../common/Toast";

import useManoObra from "../../../hooks/useManoObra";

export default function ManoObraEmpresaContenido() {
  const {
    trabajos,
    trabajosFiltrados,
    trabajoAccion,

    modoModal,
    modalManoObra,
    modalEliminar,

    busqueda,
    categoriaFiltro,
    unidadFiltro,
    estadoFiltro,

    cargando,
    error,

    toastVisible,
    toastMensaje,
    toastTipo,

    setBusqueda,
    setCategoriaFiltro,
    setUnidadFiltro,
    setEstadoFiltro,

    abrirCrear,
    abrirEditar,
    abrirEliminar,
    cerrarModales,

    guardarManoObra,
    cambiarEstado,
    eliminarManoObra,

    cerrarToast,
  } = useManoObra();

  const manejarCambioEstadoFiltro = (valor: string) => {
    if (
      valor === "Todos" ||
      valor === "Activo" ||
      valor === "Inactivo"
    ) {
      setEstadoFiltro(valor);
    }
  };

  return (
    <section className="mano-obra-page">
      <PageHeader
        title="Gestión de mano de obra"
        subtitle="Administra los trabajos, categorías, unidades y costos de mano de obra de tu empresa."
        buttonText="Agregar trabajo"
        onButtonClick={abrirCrear}
      />

      <ManoObraKPIs trabajos={trabajos} />

      <ManoObraFiltros
        busqueda={busqueda}
        categoria={categoriaFiltro}
        unidad={unidadFiltro}
        estado={estadoFiltro}
        onBusquedaChange={setBusqueda}
        onCategoriaChange={setCategoriaFiltro}
        onUnidadChange={setUnidadFiltro}
        onEstadoChange={manejarCambioEstadoFiltro}
      />

      {error && (
        <div
          className="mano-obra-error"
          role="alert"
        >
          <strong>No se pudo cargar la información.</strong>
          <span>{error}</span>
        </div>
      )}

      {cargando ? (
        <div
          className="mano-obra-cargando"
          role="status"
          aria-live="polite"
        >
          Cargando trabajos de mano de obra...
        </div>
      ) : (
        <TablaManoObra
          trabajos={trabajosFiltrados}
          onEditar={abrirEditar}
          onCambiarEstado={cambiarEstado}
          onEliminar={abrirEliminar}
        />
      )}

      <PanelBottomCard
        title="Información importante"
        description="Mantén actualizados los costos unitarios y la información de cada trabajo para generar presupuestos más precisos."
      />

      <ManoObraModal
        abierto={modalManoObra}
        modo={modoModal}
        trabajo={trabajoAccion}
        onCerrar={cerrarModales}
        onGuardar={guardarManoObra}
      />

      <ConfirmEliminarManoObra
        abierto={modalEliminar}
        trabajo={trabajoAccion}
        onCerrar={cerrarModales}
        onConfirmar={eliminarManoObra}
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