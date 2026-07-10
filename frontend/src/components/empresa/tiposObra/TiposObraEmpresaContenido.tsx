import "../../../styles/empresa/tiposObra/TiposObraEmpresa.css";

import { useState } from "react";
import PageHeader from "../../common/PageHeader";
import PanelBottomCard from "../../common/PanelBottomCard";

import TiposObraKPIs from "./TiposObraKPIs";
import TiposObraFiltros from "./TiposObraFiltros";
import TablaTiposObra from "./TablaTiposObra";
import TipoObraDetallePanel from "./TipoObraDetallePanel";

import TipoObraModal from "./TipoObraModal";
import ObservacionesTipoObraModal from "./ObservacionesTipoObraModal";
import ConfirmEliminarTipoObraModal from "./ConfirmEliminarTipoObraModal";

import { tiposObraData } from "../../../data/tiposObraData";
import type { TipoObraEmpresa } from "../../../interfaces/TipoObraEmpresa";

export default function TiposObraEmpresaContenido() {
  const [tiposObra, setTiposObra] = useState<TipoObraEmpresa[]>(tiposObraData);
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoObraEmpresa>(tiposObraData[0]);
  const [tipoAccion, setTipoAccion] = useState<TipoObraEmpresa | null>(null);

  const [modoModal, setModoModal] = useState<"crear" | "editar">("crear");
  const [modalTipoObra, setModalTipoObra] = useState(false);
  const [modalObservaciones, setModalObservaciones] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);

  const abrirCrear = () => {
    setTipoAccion(null);
    setModoModal("crear");
    setModalTipoObra(true);
  };

  const abrirEditar = (tipoObra: TipoObraEmpresa) => {
    setTipoAccion(tipoObra);
    setModoModal("editar");
    setModalTipoObra(true);
  };

  const abrirObservaciones = (tipoObra: TipoObraEmpresa) => {
    setTipoAccion(tipoObra);
    setModalObservaciones(true);
  };

  const abrirEliminar = (tipoObra: TipoObraEmpresa) => {
    setTipoAccion(tipoObra);
    setModalEliminar(true);
  };

  const cerrarModales = () => {
    setModalTipoObra(false);
    setModalObservaciones(false);
    setModalEliminar(false);
    setTipoAccion(null);
  };

  const guardarTipoObra = (tipoObraGuardado: TipoObraEmpresa) => {
    if (modoModal === "crear") {
      setTiposObra([...tiposObra, tipoObraGuardado]);
      setTipoSeleccionado(tipoObraGuardado);
    } else {
      const listaActualizada = tiposObra.map((item) =>
        item.id === tipoObraGuardado.id ? tipoObraGuardado : item
      );

      setTiposObra(listaActualizada);

      if (tipoSeleccionado.id === tipoObraGuardado.id) {
        setTipoSeleccionado(tipoObraGuardado);
      }
    }

    cerrarModales();
  };

  const duplicarTipoObra = (tipoObra: TipoObraEmpresa) => {
    const copia: TipoObraEmpresa = {
      ...tipoObra,
      id: Date.now(),
      codigo: `${tipoObra.codigo}-COPIA`,
      nombre: `${tipoObra.nombre} copia`,
    };

    setTiposObra([...tiposObra, copia]);
  };

  const cambiarEstado = (tipoObra: TipoObraEmpresa) => {
    const nuevoEstado = tipoObra.estado === "Activo" ? "Inactivo" : "Activo";

    const listaActualizada = tiposObra.map((item) =>
      item.id === tipoObra.id ? { ...item, estado: nuevoEstado } : item
    );

    setTiposObra(listaActualizada);

    if (tipoSeleccionado.id === tipoObra.id) {
      setTipoSeleccionado({ ...tipoObra, estado: nuevoEstado });
    }
  };

  const eliminarTipoObra = () => {
    if (!tipoAccion) return;

    const nuevaLista = tiposObra.filter((item) => item.id !== tipoAccion.id);
    setTiposObra(nuevaLista);

    if (tipoSeleccionado.id === tipoAccion.id && nuevaLista.length > 0) {
      setTipoSeleccionado(nuevaLista[0]);
    }

    cerrarModales();
  };

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

      <div className="tipos-obra-main-grid">
        <TablaTiposObra
          tiposObra={tiposObra}
          tipoSeleccionado={tipoSeleccionado}
          onSeleccionarTipo={setTipoSeleccionado}
          onEditar={abrirEditar}
          onObservaciones={abrirObservaciones}
          onDuplicar={duplicarTipoObra}
          onCambiarEstado={cambiarEstado}
          onEliminar={abrirEliminar}
        />

        <TipoObraDetallePanel tipoObra={tipoSeleccionado} />
      </div>

      <PanelBottomCard
        title="Importante"
        description="La configuración correcta de los tipos de obra es fundamental para generar cotizaciones precisas."
        secondaryText="Ver guía de configuración"
      />

      <TipoObraModal
        abierto={modalTipoObra}
        modo={modoModal}
        tipoObra={tipoAccion}
        onCerrar={cerrarModales}
        onGuardar={guardarTipoObra}
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
    </section>
  );
}