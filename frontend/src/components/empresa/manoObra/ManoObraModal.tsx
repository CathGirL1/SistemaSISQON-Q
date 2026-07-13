import "../../../styles/empresa/manoObra/ManoObraModales.css";

import { useEffect, useState } from "react";

import ModalBase from "../../common/ModalBase";

import type {
  EstadoManoObra,
  ManoObraEmpresa,
  UnidadManoObra,
} from "../../../interfaces/ManoObraEmpresa";

type Props = {
  abierto: boolean;
  modo: "crear" | "editar";
  trabajo: ManoObraEmpresa | null;
  onCerrar: () => void;
  onGuardar: (trabajo: ManoObraEmpresa) => void;
};

type FormularioTrabajo = {
  codigo: string;
  trabajo: string;
  descripcion: string;
  unidad: UnidadManoObra;
  costoBaja: string;
  costoMedia: string;
  costoAlta: string;
  zona: string;
  estado: EstadoManoObra;
};

const formularioInicial: FormularioTrabajo = {
  codigo: "",
  trabajo: "",
  descripcion: "",
  unidad: "m²",
  costoBaja: "",
  costoMedia: "",
  costoAlta: "",
  zona: "Montevideo",
  estado: "Activo",
};

export default function ManoObraModal({
  abierto,
  modo,
  trabajo,
  onCerrar,
  onGuardar,
}: Props) {
  const [formulario, setFormulario] =
    useState<FormularioTrabajo>(formularioInicial);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!abierto) return;

    if (modo === "editar" && trabajo) {
      setFormulario({
        codigo: trabajo.codigo,
        trabajo: trabajo.trabajo,
        descripcion: trabajo.descripcion,
        unidad: trabajo.unidad,
        costoBaja: String(trabajo.costoBaja),
        costoMedia: String(trabajo.costoMedia),
        costoAlta: String(trabajo.costoAlta),
        zona: trabajo.zona,
        estado: trabajo.estado,
      });
    } else {
      setFormulario(formularioInicial);
    }

    setError("");
  }, [abierto, modo, trabajo]);

  const actualizarCampo = (
    campo: keyof FormularioTrabajo,
    valor: string
  ) => {
    setFormulario((actual) => ({
      ...actual,
      [campo]: valor,
    }));
  };

  const guardar = () => {
    if (
      !formulario.codigo.trim() ||
      !formulario.trabajo.trim() ||
      !formulario.descripcion.trim()
    ) {
      setError("Completá los campos obligatorios.");
      return;
    }

    const costos = [
      Number(formulario.costoBaja),
      Number(formulario.costoMedia),
      Number(formulario.costoAlta),
    ];

    if (costos.some((costo) => Number.isNaN(costo) || costo < 0)) {
      setError("Los costos deben ser números válidos.");
      return;
    }

    if (!(costos[0] <= costos[1] && costos[1] <= costos[2])) {
      setError(
        "El costo bajo debe ser menor o igual al medio, y el medio menor o igual al alto."
      );
      return;
    }

    const fechaActual = new Date();

    const trabajoGuardado: ManoObraEmpresa = {
      id: trabajo?.id ?? Date.now(),
      codigo: formulario.codigo.trim(),
      trabajo: formulario.trabajo.trim(),
      descripcion: formulario.descripcion.trim(),
      unidad: formulario.unidad,
      costoBaja: costos[0],
      costoMedia: costos[1],
      costoAlta: costos[2],
      zona: formulario.zona,
      ultimaActualizacion: fechaActual.toLocaleDateString("es-UY"),
      horaActualizacion: fechaActual.toLocaleTimeString("es-UY", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      estado: formulario.estado,
    };

    onGuardar(trabajoGuardado);
  };

  return (
    <ModalBase
      abierto={abierto}
      titulo={
        modo === "crear"
          ? "Agregar trabajo"
          : `Editar trabajo - ${trabajo?.trabajo ?? ""}`
      }
      onCerrar={onCerrar}
    >
      <form
        className="mano-obra-modal-form"
        onSubmit={(evento) => {
          evento.preventDefault();
          guardar();
        }}
      >
        <div className="campo-mano-obra">
          <label htmlFor="codigo-trabajo">Código *</label>
          <input
            id="codigo-trabajo"
            type="text"
            value={formulario.codigo}
            placeholder="Ej: MO-009"
            onChange={(evento) =>
              actualizarCampo("codigo", evento.target.value)
            }
          />
        </div>

        <div className="campo-mano-obra">
          <label htmlFor="nombre-trabajo">Nombre del trabajo *</label>
          <input
            id="nombre-trabajo"
            type="text"
            value={formulario.trabajo}
            placeholder="Ej: Colocación de revestimiento"
            onChange={(evento) =>
              actualizarCampo("trabajo", evento.target.value)
            }
          />
        </div>

        <div className="campo-mano-obra campo-completo">
          <label htmlFor="descripcion-trabajo">Descripción *</label>
          <textarea
            id="descripcion-trabajo"
            value={formulario.descripcion}
            placeholder="Describí brevemente el trabajo..."
            onChange={(evento) =>
              actualizarCampo("descripcion", evento.target.value)
            }
          />
        </div>

        <div className="campo-mano-obra">
          <label htmlFor="unidad-trabajo">Unidad de medida</label>
          <select
            id="unidad-trabajo"
            value={formulario.unidad}
            onChange={(evento) =>
              actualizarCampo(
                "unidad",
                evento.target.value as UnidadManoObra
              )
            }
          >
            <option value="m²">m²</option>
            <option value="día">Día</option>
            <option value="punto">Punto</option>
            <option value="unidad">Unidad</option>
            <option value="metro">Metro</option>
            <option value="hora">Hora</option>
          </select>
        </div>

        <div className="campo-mano-obra">
          <label htmlFor="zona-trabajo">Zona</label>
          <select
            id="zona-trabajo"
            value={formulario.zona}
            onChange={(evento) =>
              actualizarCampo("zona", evento.target.value)
            }
          >
            <option value="Montevideo">Montevideo</option>
            <option value="Canelones">Canelones</option>
            <option value="Maldonado">Maldonado</option>
          </select>
        </div>

        <div className="campo-mano-obra">
          <label htmlFor="costo-bajo">Costo bajo</label>
          <input
            id="costo-bajo"
            type="number"
            min="0"
            value={formulario.costoBaja}
            onChange={(evento) =>
              actualizarCampo("costoBaja", evento.target.value)
            }
          />
        </div>

        <div className="campo-mano-obra">
          <label htmlFor="costo-medio">Costo medio</label>
          <input
            id="costo-medio"
            type="number"
            min="0"
            value={formulario.costoMedia}
            onChange={(evento) =>
              actualizarCampo("costoMedia", evento.target.value)
            }
          />
        </div>

        <div className="campo-mano-obra">
          <label htmlFor="costo-alto">Costo alto</label>
          <input
            id="costo-alto"
            type="number"
            min="0"
            value={formulario.costoAlta}
            onChange={(evento) =>
              actualizarCampo("costoAlta", evento.target.value)
            }
          />
        </div>

        <div className="campo-mano-obra">
          <label htmlFor="estado-trabajo">Estado</label>
          <select
            id="estado-trabajo"
            value={formulario.estado}
            onChange={(evento) =>
              actualizarCampo(
                "estado",
                evento.target.value as EstadoManoObra
              )
            }
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        {error && (
          <p className="mano-obra-form-error">{error}</p>
        )}

        <div className="mano-obra-modal-actions">
          <button
            type="button"
            className="mano-obra-btn-cancelar"
            onClick={onCerrar}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="mano-obra-btn-guardar"
          >
            {modo === "crear"
              ? "Agregar trabajo"
              : "Guardar cambios"}
          </button>
        </div>
      </form>
    </ModalBase>
  );
}