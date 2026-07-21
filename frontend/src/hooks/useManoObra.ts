import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  EstadoManoObra,
  ManoObraEmpresa,
} from "../interfaces/ManoObraEmpresa";

import {
  actualizarManoObra,
  crearManoObra,
  eliminarManoObra as eliminarManoObraApi,
  obtenerManoObra,
} from "../services/manoObraService";

type ModoModalManoObra =
  | "crear"
  | "editar";

type FiltroEstadoManoObra =
  | "Todos"
  | EstadoManoObra;

const obtenerMensajeError = (
  error: unknown
): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Ocurrió un error inesperado.";
};

const normalizarTexto = (
  texto: string
): string => {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
};

export default function useManoObra() {
  const [trabajos, setTrabajos] =
    useState<ManoObraEmpresa[]>([]);

  const [
    trabajoAccion,
    setTrabajoAccion,
  ] = useState<ManoObraEmpresa | null>(
    null
  );

  const [modoModal, setModoModal] =
    useState<ModoModalManoObra>("crear");

  const [
    modalManoObra,
    setModalManoObra,
  ] = useState(false);

  const [
    modalEliminar,
    setModalEliminar,
  ] = useState(false);

  const [busqueda, setBusqueda] =
    useState("");

  const [
    categoriaFiltro,
    setCategoriaFiltro,
  ] = useState("Todas");

  const [
    unidadFiltro,
    setUnidadFiltro,
  ] = useState("Todas");

  const [
    estadoFiltro,
    setEstadoFiltro,
  ] = useState<FiltroEstadoManoObra>(
    "Todos"
  );

  const [cargando, setCargando] =
    useState(true);

  const [guardando, setGuardando] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [toastVisible, setToastVisible] =
    useState(false);

  const [toastMensaje, setToastMensaje] =
    useState("");

  const [toastTipo, setToastTipo] =
    useState<"success" | "error">(
      "success"
    );

  const timeoutToast =
    useRef<number | null>(null);

  useEffect(() => {
    void cargarManoObra();

    return () => {
      if (timeoutToast.current !== null) {
        window.clearTimeout(
          timeoutToast.current
        );
      }
    };
  }, []);

  const mostrarToast = (
    mensaje: string,
    tipo: "success" | "error" =
      "success"
  ) => {
    setToastMensaje(mensaje);
    setToastTipo(tipo);
    setToastVisible(true);

    if (timeoutToast.current !== null) {
      window.clearTimeout(
        timeoutToast.current
      );
    }

    timeoutToast.current =
      window.setTimeout(() => {
        setToastVisible(false);
        timeoutToast.current = null;
      }, 3000);
  };

  const cerrarToast = () => {
    setToastVisible(false);

    if (timeoutToast.current !== null) {
      window.clearTimeout(
        timeoutToast.current
      );

      timeoutToast.current = null;
    }
  };

  const cargarManoObra =
    async (): Promise<void> => {
      try {
        setCargando(true);
        setError(null);

        const datos =
          await obtenerManoObra();

        const datosOrdenados = [
          ...datos,
        ].sort((trabajoA, trabajoB) =>
          trabajoA.nombre.localeCompare(
            trabajoB.nombre
          )
        );

        setTrabajos(datosOrdenados);
      } catch (errorCapturado) {
        const mensaje =
          obtenerMensajeError(
            errorCapturado
          );

        setError(mensaje);
        mostrarToast(mensaje, "error");
      } finally {
        setCargando(false);
      }
    };

  const abrirCrear = () => {
    setTrabajoAccion(null);
    setModoModal("crear");
    setModalManoObra(true);
  };

  const abrirEditar = (
    trabajo: ManoObraEmpresa
  ) => {
    setTrabajoAccion(trabajo);
    setModoModal("editar");
    setModalManoObra(true);
  };

  const abrirEliminar = (
    trabajo: ManoObraEmpresa
  ) => {
    setTrabajoAccion(trabajo);
    setModalEliminar(true);
  };

  const cerrarModales = () => {
    setModalManoObra(false);
    setModalEliminar(false);
    setTrabajoAccion(null);
  };

  const guardarManoObra = async (
    trabajoFormulario: ManoObraEmpresa
  ): Promise<void> => {
    try {
      setGuardando(true);

      if (modoModal === "crear") {
        const trabajoParaCrear: ManoObraEmpresa =
          {
            ...trabajoFormulario,

            // El backend genera estos valores.
            id: "",
            codigo: "",
          };

        const trabajoCreado =
          await crearManoObra(
            trabajoParaCrear
          );

        setTrabajos(
          (listaActual) =>
            [
              ...listaActual,
              trabajoCreado,
            ].sort(
              (trabajoA, trabajoB) =>
                trabajoA.nombre.localeCompare(
                  trabajoB.nombre
                )
            )
        );

        mostrarToast(
          "Trabajo de mano de obra agregado correctamente."
        );
      } else {
        if (!trabajoAccion) {
          throw new Error(
            "No se pudo identificar el trabajo que se desea editar."
          );
        }

        const trabajoActualizado =
          await actualizarManoObra(
            trabajoAccion.id,
            trabajoFormulario
          );

        setTrabajos(
          (listaActual) =>
            listaActual
              .map((trabajo) =>
                trabajo.id ===
                trabajoActualizado.id
                  ? trabajoActualizado
                  : trabajo
              )
              .sort(
                (
                  trabajoA,
                  trabajoB
                ) =>
                  trabajoA.nombre.localeCompare(
                    trabajoB.nombre
                  )
              )
        );

        mostrarToast(
          "Trabajo de mano de obra actualizado correctamente."
        );
      }

      cerrarModales();
    } catch (errorCapturado) {
      mostrarToast(
        obtenerMensajeError(
          errorCapturado
        ),
        "error"
      );
    } finally {
      setGuardando(false);
    }
  };

  const cambiarEstado = async (
    trabajo: ManoObraEmpresa
  ): Promise<void> => {
    try {
      const nuevoEstado: EstadoManoObra =
        trabajo.estado === "Activo"
          ? "Inactivo"
          : "Activo";

      const trabajoParaActualizar: ManoObraEmpresa =
        {
          ...trabajo,
          estado: nuevoEstado,
        };

      const trabajoActualizado =
        await actualizarManoObra(
          trabajo.id,
          trabajoParaActualizar
        );

      setTrabajos(
        (listaActual) =>
          listaActual.map((item) =>
            item.id ===
            trabajoActualizado.id
              ? trabajoActualizado
              : item
          )
      );

      mostrarToast(
        nuevoEstado === "Activo"
          ? "Trabajo activado correctamente."
          : "Trabajo desactivado correctamente."
      );
    } catch (errorCapturado) {
      mostrarToast(
        obtenerMensajeError(
          errorCapturado
        ),
        "error"
      );
    }
  };

  const eliminarManoObra =
    async (): Promise<void> => {
      if (!trabajoAccion) {
        mostrarToast(
          "No se pudo identificar el trabajo de mano de obra.",
          "error"
        );

        return;
      }

      try {
        setGuardando(true);

        await eliminarManoObraApi(
          trabajoAccion.id
        );

        const idEliminado =
          trabajoAccion.id;

        setTrabajos(
          (listaActual) =>
            listaActual.filter(
              (trabajo) =>
                trabajo.id !==
                idEliminado
            )
        );

        mostrarToast(
          "Trabajo de mano de obra eliminado correctamente."
        );

        cerrarModales();
      } catch (errorCapturado) {
        mostrarToast(
          obtenerMensajeError(
            errorCapturado
          ),
          "error"
        );
      } finally {
        setGuardando(false);
      }
    };

  const limpiarFiltros = () => {
    setBusqueda("");
    setCategoriaFiltro("Todas");
    setUnidadFiltro("Todas");
    setEstadoFiltro("Todos");
  };

  const categoriasDisponibles =
    useMemo(() => {
      return Array.from(
        new Set(
          trabajos
            .map(
              (trabajo) =>
                trabajo.categoria
            )
            .filter(
              (categoria) =>
                categoria.trim() !== ""
            )
        )
      ).sort((categoriaA, categoriaB) =>
        categoriaA.localeCompare(
          categoriaB
        )
      );
    }, [trabajos]);

  const unidadesDisponibles =
    useMemo(() => {
      return Array.from(
        new Set(
          trabajos
            .map(
              (trabajo) =>
                trabajo.unidad
            )
            .filter(
              (unidad) =>
                unidad.trim() !== ""
            )
        )
      ).sort((unidadA, unidadB) =>
        unidadA.localeCompare(unidadB)
      );
    }, [trabajos]);

  const trabajosFiltrados =
    useMemo(() => {
      const busquedaNormalizada =
        normalizarTexto(busqueda);

      return trabajos.filter(
        (trabajo) => {
          const coincideBusqueda =
            busquedaNormalizada === "" ||
            normalizarTexto(
              trabajo.codigo
            ).includes(
              busquedaNormalizada
            ) ||
            normalizarTexto(
              trabajo.nombre
            ).includes(
              busquedaNormalizada
            ) ||
            normalizarTexto(
              trabajo.descripcion
            ).includes(
              busquedaNormalizada
            ) ||
            normalizarTexto(
              trabajo.categoria
            ).includes(
              busquedaNormalizada
            ) ||
            normalizarTexto(
              trabajo.unidad
            ).includes(
              busquedaNormalizada
            );

          const coincideCategoria =
            categoriaFiltro === "Todas" ||
            trabajo.categoria ===
              categoriaFiltro;

          const coincideUnidad =
            unidadFiltro === "Todas" ||
            trabajo.unidad ===
              unidadFiltro;

          const coincideEstado =
            estadoFiltro === "Todos" ||
            trabajo.estado ===
              estadoFiltro;

          return (
            coincideBusqueda &&
            coincideCategoria &&
            coincideUnidad &&
            coincideEstado
          );
        }
      );
    }, [
      trabajos,
      busqueda,
      categoriaFiltro,
      unidadFiltro,
      estadoFiltro,
    ]);

  return {
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

    categoriasDisponibles,
    unidadesDisponibles,

    cargando,
    guardando,
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
    cerrarToast,

    limpiarFiltros,

    cargarManoObra,
    guardarManoObra,
    cambiarEstado,
    eliminarManoObra,
  };
}