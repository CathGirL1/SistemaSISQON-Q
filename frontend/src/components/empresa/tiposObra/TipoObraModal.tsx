import {
  type FormEvent,
  useEffect,
  useState,
} from "react";

import "../../../styles/empresa/tiposObra/TiposObraModales.css";

import ModalBase from "../../common/ModalBase";

import type {
  DificultadTipoObra,
  EstadoTipoObra,
  TipoObraEmpresa,
} from "../../../interfaces/TipoObraEmpresa";

type Props = {
  abierto: boolean;
  modo: "crear" | "editar";
  tipoObra: TipoObraEmpresa | null;

  guardando: boolean;

  onCerrar: () => void;

  onGuardar: (
    tipoObra: TipoObraEmpresa
  ) => Promise<void>;
};

type ErroresFormulario = {
  nombre?: string;
  descripcion?: string;
  tiempoAproximado?: string;
  formulaCalculo?: string;
  manoObra?: string;
  extras?: string;
  observaciones?: string;
};

const FORMULARIO_INICIAL: TipoObraEmpresa = {
  id: 0,
  codigo: "",
  nombre: "",
  descripcion: "",
  materialesAsociados: 0,
  tiempoAproximado: "",
  dificultad: "Media",
  estado: "Activo",
  formulaCalculo: "",
  manoObra: "",
  extras: "",
  observaciones: "",
};

export default function TipoObraModal({
  abierto,
  modo,
  tipoObra,
  guardando,
  onCerrar,
  onGuardar,
}: Props) {
  const [formulario, setFormulario] =
    useState<TipoObraEmpresa>(
      FORMULARIO_INICIAL
    );

  const [errores, setErrores] =
    useState<ErroresFormulario>({});

  useEffect(() => {
    if (!abierto) {
      return;
    }

    if (
      modo === "editar" &&
      tipoObra
    ) {
      setFormulario({
        ...tipoObra,
      });
    } else {
      setFormulario({
        ...FORMULARIO_INICIAL,
      });
    }

    setErrores({});
  }, [
    abierto,
    modo,
    tipoObra,
  ]);

  const actualizarCampo = <
    Campo extends keyof TipoObraEmpresa
  >(
    campo: Campo,
    valor: TipoObraEmpresa[Campo]
  ) => {
    setFormulario((estadoActual) => ({
      ...estadoActual,
      [campo]: valor,
    }));

    if (
      campo in errores
    ) {
      setErrores((erroresActuales) => ({
        ...erroresActuales,
        [campo]: undefined,
      }));
    }
  };

  const validarFormulario = (): boolean => {
    const nuevosErrores: ErroresFormulario =
      {};

    const nombre =
      formulario.nombre.trim();

    const descripcion =
      formulario.descripcion.trim();

    const tiempo =
      formulario.tiempoAproximado.trim();

    const formulaCalculo =
      formulario.formulaCalculo.trim();

    const manoObra =
      formulario.manoObra.trim();

    const extras =
      formulario.extras.trim();

    const observaciones =
      formulario.observaciones.trim();

    if (!nombre) {
      nuevosErrores.nombre =
        "El nombre es obligatorio.";
    } else if (nombre.length > 50) {
      nuevosErrores.nombre =
        "El nombre no puede superar los 50 caracteres.";
    }

    if (descripcion.length > 255) {
      nuevosErrores.descripcion =
        "La descripción no puede superar los 255 caracteres.";
    }

    if (
      tiempo &&
      !validarFormatoTiempo(tiempo)
    ) {
      nuevosErrores.tiempoAproximado =
        "Ingresá un valor como “10 días” o “10 a 20 días”.";
    }

    if (formulaCalculo.length > 1000) {
      nuevosErrores.formulaCalculo =
        "La fórmula no puede superar los 1000 caracteres.";
    }

    if (manoObra.length > 500) {
      nuevosErrores.manoObra =
        "La mano de obra no puede superar los 500 caracteres.";
    }

    if (extras.length > 1000) {
      nuevosErrores.extras =
        "Los extras no pueden superar los 1000 caracteres.";
    }

    if (observaciones.length > 1000) {
      nuevosErrores.observaciones =
        "Las observaciones no pueden superar los 1000 caracteres.";
    }

    setErrores(nuevosErrores);

    return (
      Object.keys(nuevosErrores).length ===
      0
    );
  };

  const guardar = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (guardando) {
      return;
    }

    if (!validarFormulario()) {
      return;
    }

    const tipoObraParaGuardar: TipoObraEmpresa =
      {
        ...formulario,

        nombre:
          formulario.nombre.trim(),

        descripcion:
          formulario.descripcion.trim(),

        tiempoAproximado:
          formulario.tiempoAproximado.trim(),

        formulaCalculo:
          formulario.formulaCalculo.trim(),

        manoObra:
          formulario.manoObra.trim(),

        extras:
          formulario.extras.trim(),

        observaciones:
          formulario.observaciones.trim(),
      };

    await onGuardar(
      tipoObraParaGuardar
    );
  };

  const cerrar = () => {
    if (guardando) {
      return;
    }

    setErrores({});
    onCerrar();
  };

  return (
    <ModalBase
      abierto={abierto}
      titulo={
        modo === "crear"
          ? "Agregar tipo de obra"
          : `Editar tipo de obra${
              tipoObra?.nombre
                ? ` - ${tipoObra.nombre}`
                : ""
            }`
      }
      onCerrar={cerrar}
    >
      <form
        className="tipo-obra-modal-form"
        onSubmit={guardar}
        noValidate
      >
        <div>
          <label htmlFor="nombreTipoObra">
            Nombre
          </label>

          <input
            id="nombreTipoObra"
            type="text"
            value={formulario.nombre}
            maxLength={50}
            disabled={guardando}
            onChange={(event) =>
              actualizarCampo(
                "nombre",
                event.target.value
              )
            }
          />

          {errores.nombre && (
            <small className="campo-error">
              {errores.nombre}
            </small>
          )}
        </div>

        <div>
          <label htmlFor="codigoTipoObra">
            Código
          </label>

          <input
            id="codigoTipoObra"
            type="text"
            value={
              modo === "crear"
                ? "Se genera automáticamente"
                : formulario.codigo
            }
            disabled
          />
        </div>

        <div className="full">
          <label htmlFor="descripcionTipoObra">
            Descripción
          </label>

          <textarea
            id="descripcionTipoObra"
            value={formulario.descripcion}
            maxLength={255}
            disabled={guardando}
            onChange={(event) =>
              actualizarCampo(
                "descripcion",
                event.target.value
              )
            }
          />

          <div className="campo-contador">
            {formulario.descripcion.length}/255
          </div>

          {errores.descripcion && (
            <small className="campo-error">
              {errores.descripcion}
            </small>
          )}
        </div>

        <div>
          <label htmlFor="tiempoTipoObra">
            Tiempo aproximado
          </label>

          <input
            id="tiempoTipoObra"
            type="text"
            value={
              formulario.tiempoAproximado
            }
            placeholder="Ej.: 10 a 20 días"
            disabled={guardando}
            onChange={(event) =>
              actualizarCampo(
                "tiempoAproximado",
                event.target.value
              )
            }
          />

          {errores.tiempoAproximado && (
            <small className="campo-error">
              {errores.tiempoAproximado}
            </small>
          )}
        </div>

        <div>
          <label htmlFor="dificultadTipoObra">
            Dificultad
          </label>

          <select
            id="dificultadTipoObra"
            value={formulario.dificultad}
            disabled={guardando}
            onChange={(event) =>
              actualizarCampo(
                "dificultad",
                event.target
                  .value as DificultadTipoObra
              )
            }
          >
            <option value="Baja">
              Baja
            </option>

            <option value="Media">
              Media
            </option>

            <option value="Alta">
              Alta
            </option>
          </select>
        </div>

        <div>
          <label htmlFor="estadoTipoObra">
            Estado
          </label>

          <select
            id="estadoTipoObra"
            value={formulario.estado}
            disabled={guardando}
            onChange={(event) =>
              actualizarCampo(
                "estado",
                event.target
                  .value as EstadoTipoObra
              )
            }
          >
            <option value="Activo">
              Activo
            </option>

            <option value="Inactivo">
              Inactivo
            </option>
          </select>
        </div>

        <div className="full">
          <label htmlFor="formulaTipoObra">
            Fórmula de cálculo
          </label>

          <textarea
            id="formulaTipoObra"
            value={
              formulario.formulaCalculo
            }
            maxLength={1000}
            disabled={guardando}
            placeholder="Describe cómo se calcula el costo de este tipo de obra."
            onChange={(event) =>
              actualizarCampo(
                "formulaCalculo",
                event.target.value
              )
            }
          />

          <div className="campo-contador">
            {
              formulario.formulaCalculo
                .length
            }
            /1000
          </div>

          {errores.formulaCalculo && (
            <small className="campo-error">
              {errores.formulaCalculo}
            </small>
          )}
        </div>

        <div className="full">
          <label htmlFor="manoObraTipoObra">
            Mano de obra
          </label>

          <textarea
            id="manoObraTipoObra"
            value={formulario.manoObra}
            maxLength={500}
            disabled={guardando}
            placeholder="Describe los perfiles o la cantidad aproximada de trabajadores."
            onChange={(event) =>
              actualizarCampo(
                "manoObra",
                event.target.value
              )
            }
          />

          <div className="campo-contador">
            {formulario.manoObra.length}
            /500
          </div>

          {errores.manoObra && (
            <small className="campo-error">
              {errores.manoObra}
            </small>
          )}
        </div>

        <div className="full">
          <label htmlFor="extrasTipoObra">
            Extras
          </label>

          <textarea
            id="extrasTipoObra"
            value={formulario.extras}
            maxLength={1000}
            disabled={guardando}
            placeholder="Ej.: transporte, limpieza, retiro de escombros o terminaciones."
            onChange={(event) =>
              actualizarCampo(
                "extras",
                event.target.value
              )
            }
          />

          <div className="campo-contador">
            {formulario.extras.length}
            /1000
          </div>

          {errores.extras && (
            <small className="campo-error">
              {errores.extras}
            </small>
          )}
        </div>

        <div className="full">
          <label htmlFor="observacionesTipoObra">
            Observaciones
          </label>

          <textarea
            id="observacionesTipoObra"
            value={
              formulario.observaciones
            }
            maxLength={1000}
            disabled={guardando}
            placeholder="Agrega aclaraciones adicionales."
            onChange={(event) =>
              actualizarCampo(
                "observaciones",
                event.target.value
              )
            }
          />

          <div className="campo-contador">
            {
              formulario.observaciones
                .length
            }
            /1000
          </div>

          {errores.observaciones && (
            <small className="campo-error">
              {errores.observaciones}
            </small>
          )}
        </div>

        <div className="tipo-obra-modal-actions">
          <button
            type="button"
            className="btn-cancelar"
            onClick={cerrar}
            disabled={guardando}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="btn-guardar"
            disabled={guardando}
          >
            {guardando
              ? "Guardando..."
              : modo === "crear"
                ? "Agregar tipo de obra"
                : "Guardar cambios"}
          </button>
        </div>
      </form>
    </ModalBase>
  );
}

function validarFormatoTiempo(
  valor: string
): boolean {
  const texto = valor
    .trim()
    .toLowerCase();

  if (
    !texto ||
    texto === "sin definir"
  ) {
    return true;
  }

  const numeros =
    texto.match(/\d+/g)?.map(Number) ??
    [];

  if (
    numeros.length === 0 ||
    numeros.length > 2
  ) {
    return false;
  }

  if (
    numeros.some(
      (numero) =>
        !Number.isInteger(numero) ||
        numero < 0
    )
  ) {
    return false;
  }

  if (
    numeros.length === 2 &&
    numeros[1] < numeros[0]
  ) {
    return false;
  }

  return true;
}