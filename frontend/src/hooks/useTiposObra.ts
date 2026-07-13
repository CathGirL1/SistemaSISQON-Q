import { useRef, useState } from "react";

import { tiposObraData } from "../data/tiposObraData";
import type { TipoObraEmpresa } from "../interfaces/TipoObraEmpresa";

type ModoModalTipoObra = "crear" | "editar";

export default function useTiposObra() {
  const [tiposObra, setTiposObra] =
    useState<TipoObraEmpresa[]>(tiposObraData);

  const [tipoSeleccionado, setTipoSeleccionado] =
    useState<TipoObraEmpresa>(tiposObraData[0]);

  const [tipoAccion, setTipoAccion] =
    useState<TipoObraEmpresa | null>(null);

  const [modoModal, setModoModal] =
    useState<ModoModalTipoObra>("crear");

  const [modalTipoObra, setModalTipoObra] = useState(false);
  const [modalObservaciones, setModalObservaciones] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMensaje, setToastMensaje] = useState("");
  const [toastTipo, setToastTipo] =
    useState<"success" | "error">("success");

  const timeoutToast = useRef<number | null>(null);

  const mostrarToast = (
    mensaje: string,
    tipo: "success" | "error" = "success"
  ) => {
    setToastMensaje(mensaje);
    setToastTipo(tipo);
    setToastVisible(true);

    if (timeoutToast.current !== null) {
      window.clearTimeout(timeoutToast.current);
    }

    timeoutToast.current = window.setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };

  const cerrarToast = () => {
    setToastVisible(false);

    if (timeoutToast.current !== null) {
      window.clearTimeout(timeoutToast.current);
    }
  };

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

  const seleccionarTipoObra = (tipoObra: TipoObraEmpresa) => {
    setTipoSeleccionado(tipoObra);
  };

  const guardarTipoObra = (tipoObraGuardado: TipoObraEmpresa) => {
    if (modoModal === "crear") {
      setTiposObra((listaActual) => [
        ...listaActual,
        tipoObraGuardado,
      ]);

      setTipoSeleccionado(tipoObraGuardado);
      mostrarToast("Tipo de obra agregado correctamente.");
    } else {
      setTiposObra((listaActual) =>
        listaActual.map((tipoObra) =>
          tipoObra.id === tipoObraGuardado.id
            ? tipoObraGuardado
            : tipoObra
        )
      );

      if (tipoSeleccionado.id === tipoObraGuardado.id) {
        setTipoSeleccionado(tipoObraGuardado);
      }

      mostrarToast("Tipo de obra actualizado correctamente.");
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

    setTiposObra((listaActual) => [...listaActual, copia]);
    setTipoSeleccionado(copia);

    mostrarToast("Tipo de obra duplicado correctamente.");
  };

  const cambiarEstado = (tipoObra: TipoObraEmpresa) => {
    const nuevoEstado =
      tipoObra.estado === "Activo" ? "Inactivo" : "Activo";

    const tipoActualizado: TipoObraEmpresa = {
      ...tipoObra,
      estado: nuevoEstado,
    };

    setTiposObra((listaActual) =>
      listaActual.map((item) =>
        item.id === tipoObra.id ? tipoActualizado : item
      )
    );

    if (tipoSeleccionado.id === tipoObra.id) {
      setTipoSeleccionado(tipoActualizado);
    }

    mostrarToast(
      nuevoEstado === "Activo"
        ? "Tipo de obra activado correctamente."
        : "Tipo de obra desactivado correctamente."
    );
  };

  const eliminarTipoObra = () => {
    if (!tipoAccion) {
      mostrarToast(
        "No se pudo identificar el tipo de obra.",
        "error"
      );
      return;
    }

    const nuevaLista = tiposObra.filter(
      (tipoObra) => tipoObra.id !== tipoAccion.id
    );

    setTiposObra(nuevaLista);

    if (
      tipoSeleccionado.id === tipoAccion.id &&
      nuevaLista.length > 0
    ) {
      setTipoSeleccionado(nuevaLista[0]);
    }

    mostrarToast("Tipo de obra eliminado correctamente.");
    cerrarModales();
  };

  return {
    tiposObra,
    tipoSeleccionado,
    tipoAccion,

    modoModal,

    modalTipoObra,
    modalObservaciones,
    modalEliminar,

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
  };
}