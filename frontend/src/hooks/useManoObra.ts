import { useMemo, useRef, useState } from "react";

import { manoObraData } from "../data/manoObraData";
import type {
  EstadoManoObra,
  ManoObraEmpresa,
  UnidadManoObra,
} from "../interfaces/ManoObraEmpresa";

type ModoModal = "crear" | "editar";

export default function useManoObra() {
  const [trabajos, setTrabajos] =
    useState<ManoObraEmpresa[]>(manoObraData);

  const [trabajoAccion, setTrabajoAccion] =
    useState<ManoObraEmpresa | null>(null);

  const [modoModal, setModoModal] = useState<ModoModal>("crear");
  const [modalTrabajo, setModalTrabajo] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);

  const [busqueda, setBusqueda] = useState("");
  const [zonaFiltro, setZonaFiltro] = useState("Todas");
  const [unidadFiltro, setUnidadFiltro] = useState("Todas");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");

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
    setTrabajoAccion(null);
    setModoModal("crear");
    setModalTrabajo(true);
  };

  const abrirEditar = (trabajo: ManoObraEmpresa) => {
    setTrabajoAccion(trabajo);
    setModoModal("editar");
    setModalTrabajo(true);
  };

  const abrirEliminar = (trabajo: ManoObraEmpresa) => {
    setTrabajoAccion(trabajo);
    setModalEliminar(true);
  };

  const cerrarModales = () => {
    setModalTrabajo(false);
    setModalEliminar(false);
    setTrabajoAccion(null);
  };

  const guardarTrabajo = (trabajoGuardado: ManoObraEmpresa) => {
    if (modoModal === "crear") {
      setTrabajos((listaActual) => [
        ...listaActual,
        trabajoGuardado,
      ]);

      mostrarToast("Trabajo agregado correctamente.");
    } else {
      setTrabajos((listaActual) =>
        listaActual.map((trabajo) =>
          trabajo.id === trabajoGuardado.id
            ? trabajoGuardado
            : trabajo
        )
      );

      mostrarToast("Trabajo actualizado correctamente.");
    }

    cerrarModales();
  };

  const cambiarEstado = (trabajo: ManoObraEmpresa) => {
    const nuevoEstado: EstadoManoObra =
      trabajo.estado === "Activo" ? "Inactivo" : "Activo";

    setTrabajos((listaActual) =>
      listaActual.map((item) =>
        item.id === trabajo.id
          ? { ...item, estado: nuevoEstado }
          : item
      )
    );

    mostrarToast(
      nuevoEstado === "Activo"
        ? "Trabajo activado correctamente."
        : "Trabajo desactivado correctamente."
    );
  };

  const eliminarTrabajo = () => {
    if (!trabajoAccion) {
      mostrarToast(
        "No se pudo identificar el trabajo.",
        "error"
      );
      return;
    }

    setTrabajos((listaActual) =>
      listaActual.filter(
        (trabajo) => trabajo.id !== trabajoAccion.id
      )
    );

    mostrarToast("Trabajo eliminado correctamente.");
    cerrarModales();
  };

  const trabajosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return trabajos.filter((trabajo) => {
      const coincideBusqueda =
        termino === "" ||
        trabajo.trabajo.toLowerCase().includes(termino) ||
        trabajo.descripcion.toLowerCase().includes(termino) ||
        trabajo.codigo.toLowerCase().includes(termino);

      const coincideZona =
        zonaFiltro === "Todas" ||
        trabajo.zona === zonaFiltro;

      const coincideUnidad =
        unidadFiltro === "Todas" ||
        trabajo.unidad === (unidadFiltro as UnidadManoObra);

      const coincideEstado =
        estadoFiltro === "Todos" ||
        trabajo.estado === estadoFiltro;

      return (
        coincideBusqueda &&
        coincideZona &&
        coincideUnidad &&
        coincideEstado
      );
    });
  }, [
    trabajos,
    busqueda,
    zonaFiltro,
    unidadFiltro,
    estadoFiltro,
  ]);

  return {
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
  };
}