import {
  useEffect,
  useRef,
  useState,
} from "react";

import type { TipoObraEmpresa } from "../interfaces/TipoObraEmpresa";

import {
  actualizarTipoObra,
  crearTipoObra,
  eliminarTipoObra as eliminarTipoObraApi,
  obtenerTiposObra,
} from "../services/tipoObraService";

type ModoModalTipoObra =
  | "crear"
  | "editar";

const obtenerMensajeError = (
  error: unknown
): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Ocurrió un error inesperado.";
};

export default function useTiposObra() {
  const [tiposObra, setTiposObra] =
    useState<TipoObraEmpresa[]>([]);

  const [
    tipoSeleccionado,
    setTipoSeleccionado,
  ] = useState<TipoObraEmpresa | null>(
    null
  );

  const limpiarSeleccion = () => {
  setTipoSeleccionado(null);
  };

  const [tipoAccion, setTipoAccion] =
    useState<TipoObraEmpresa | null>(null);

  const [modoModal, setModoModal] =
    useState<ModoModalTipoObra>("crear");

  const [
    modalTipoObra,
    setModalTipoObra,
  ] = useState(false);

  const [
    modalObservaciones,
    setModalObservaciones,
  ] = useState(false);

  const [
    modalEliminar,
    setModalEliminar,
  ] = useState(false);

  const [cargando, setCargando] =
    useState(true);

  const [guardando, setGuardando] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [busqueda, setBusqueda] =
    useState("");

  const [estadoFiltro, setEstadoFiltro] =
  useState("Todos");

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
    void cargarTiposObra();

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

  const cargarTiposObra =
    async (): Promise<void> => {
      try {
        setCargando(true);
        setError(null);

        const datos =
          await obtenerTiposObra();

        setTiposObra(datos);

        setTipoSeleccionado(
          (seleccionActual) => {
            if (datos.length === 0) {
              return null;
            }

            if (seleccionActual) {
              const seleccionEncontrada =
                datos.find(
                  (tipoObra) =>
                    tipoObra.id ===
                    seleccionActual.id
                );

              if (seleccionEncontrada) {
                return seleccionEncontrada;
              }
            }

            return datos[0];
          }
        );
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
    setTipoAccion(null);
    setModoModal("crear");
    setModalTipoObra(true);
  };

  const abrirEditar = (
    tipoObra: TipoObraEmpresa
  ) => {
    setTipoAccion(tipoObra);
    setModoModal("editar");
    setModalTipoObra(true);
  };

  const abrirObservaciones = (
    tipoObra: TipoObraEmpresa
  ) => {
    setTipoAccion(tipoObra);
    setModalObservaciones(true);
  };

  const abrirEliminar = (
    tipoObra: TipoObraEmpresa
  ) => {
    setTipoAccion(tipoObra);
    setModalEliminar(true);
  };

  const cerrarModales = () => {
    setModalTipoObra(false);
    setModalObservaciones(false);
    setModalEliminar(false);
    setTipoAccion(null);
  };

  const seleccionarTipoObra = (
    tipoObra: TipoObraEmpresa
  ) => {
    setTipoSeleccionado(tipoObra);
  };

  const guardarTipoObra = async (
    tipoObraFormulario: TipoObraEmpresa
  ): Promise<void> => {
    try {
      setGuardando(true);

      if (modoModal === "crear") {
        const tipoCreado =
          await crearTipoObra(
            tipoObraFormulario
          );

        setTiposObra(
          (listaActual) => {
            const nuevaLista = [
              ...listaActual,
              tipoCreado,
            ];

            return nuevaLista.sort(
              (tipoA, tipoB) =>
                tipoA.nombre.localeCompare(
                  tipoB.nombre
                )
            );
          }
        );

        setTipoSeleccionado(
          tipoCreado
        );

        mostrarToast(
          "Tipo de obra agregado correctamente."
        );
      } else {
        if (!tipoAccion) {
          throw new Error(
            "No se pudo identificar el tipo de obra que se desea editar."
          );
        }

        const tipoActualizado =
          await actualizarTipoObra(
            tipoAccion.id,
            tipoObraFormulario
          );

        setTiposObra(
          (listaActual) =>
            listaActual
              .map((tipoObra) =>
                tipoObra.id ===
                tipoActualizado.id
                  ? tipoActualizado
                  : tipoObra
              )
              .sort(
                (tipoA, tipoB) =>
                  tipoA.nombre.localeCompare(
                    tipoB.nombre
                  )
              )
        );

        setTipoSeleccionado(
          (seleccionActual) =>
            seleccionActual?.id ===
            tipoActualizado.id
              ? tipoActualizado
              : seleccionActual
        );

        mostrarToast(
          "Tipo de obra actualizado correctamente."
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

  const duplicarTipoObra = async (
    tipoObra: TipoObraEmpresa
  ): Promise<void> => {
    try {
      setGuardando(true);

      const copiaFormulario: TipoObraEmpresa =
        {
          ...tipoObra,

          // El backend genera el ID y el código.
          id: 0,
          codigo: "",

          nombre: `${tipoObra.nombre} copia`,

          // Los materiales no se copian todavía.
          materialesAsociados: 0,
        };

      const copiaCreada =
        await crearTipoObra(
          copiaFormulario
        );

      setTiposObra(
        (listaActual) =>
          [...listaActual, copiaCreada].sort(
            (tipoA, tipoB) =>
              tipoA.nombre.localeCompare(
                tipoB.nombre
              )
          )
      );

      setTipoSeleccionado(
        copiaCreada
      );

      mostrarToast(
        "Tipo de obra duplicado correctamente."
      );
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
    tipoObra: TipoObraEmpresa
  ): Promise<void> => {
    try {
      const nuevoEstado =
        tipoObra.estado === "Activo"
          ? "Inactivo"
          : "Activo";

      const tipoParaActualizar: TipoObraEmpresa =
        {
          ...tipoObra,
          estado: nuevoEstado,
        };

      const tipoActualizado =
        await actualizarTipoObra(
          tipoObra.id,
          tipoParaActualizar
        );

      setTiposObra(
        (listaActual) =>
          listaActual.map((item) =>
            item.id ===
            tipoActualizado.id
              ? tipoActualizado
              : item
          )
      );

      setTipoSeleccionado(
        (seleccionActual) =>
          seleccionActual?.id ===
          tipoActualizado.id
            ? tipoActualizado
            : seleccionActual
      );

      mostrarToast(
        nuevoEstado === "Activo"
          ? "Tipo de obra activado correctamente."
          : "Tipo de obra desactivado correctamente."
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

  const eliminarTipoObra =
    async (): Promise<void> => {
      if (!tipoAccion) {
        mostrarToast(
          "No se pudo identificar el tipo de obra.",
          "error"
        );

        return;
      }

      try {
        setGuardando(true);

        await eliminarTipoObraApi(
          tipoAccion.id
        );

        const idEliminado =
          tipoAccion.id;

        setTiposObra(
          (listaActual) => {
            const nuevaLista =
              listaActual.filter(
                (tipoObra) =>
                  tipoObra.id !==
                  idEliminado
              );

            setTipoSeleccionado(
              (seleccionActual) => {
                if (
                  seleccionActual?.id !==
                  idEliminado
                ) {
                  return seleccionActual;
                }

                return nuevaLista[0] ?? null;
              }
            );

            return nuevaLista;
          }
        );

        mostrarToast(
          "Tipo de obra eliminado correctamente."
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

  const tiposObraFiltrados =
  tiposObra.filter((tipoObra) => {
    const coincideBusqueda =
      tipoObra.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase()) ||
      tipoObra.codigo
        .toLowerCase()
        .includes(busqueda.toLowerCase());

    const coincideEstado =
      estadoFiltro === "Todos" ||
      tipoObra.estado === estadoFiltro;

    return (
      coincideBusqueda &&
      coincideEstado
    );
  });

  return {
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
    modalEliminar,

    cargando,
    guardando,
    error,

    toastVisible,
    toastMensaje,
    toastTipo,

    seleccionarTipoObra,
    limpiarSeleccion,
    abrirCrear,
    abrirEditar,
    abrirObservaciones,
    abrirEliminar,

    cerrarModales,
    cerrarToast,

    cargarTiposObra,
    guardarTipoObra,
    duplicarTipoObra,
    cambiarEstado,
    eliminarTipoObra,
  };
}