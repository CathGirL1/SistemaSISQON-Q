import "../../../styles/empresa/manoObra/ManoObraModales.css";

import { useEffect, useState } from "react";

import ModalBase from "../../common/ModalBase";

import type {
  EstadoManoObra,
  ManoObraEmpresa,
} from "../../../interfaces/ManoObraEmpresa";

export type ManoObraFormulario = {
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  unidad: string;
  costoUnitario: number;
  observaciones: string;
  estado: EstadoManoObra;
};

type Props = {
  abierto: boolean;
  modo: "crear" | "editar";
  trabajo: ManoObraEmpresa | null;
  onCerrar: () => void;
  onGuardar: (trabajo: ManoObraFormulario) => void;
};

type FormularioTrabajo = {
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  unidad: string;
  costoUnitario: string;
  observaciones: string;
  estado: EstadoManoObra;
};

const formularioInicial: FormularioTrabajo = {
  codigo: "",
  nombre: "",
  descripcion: "",
  categoria: "",
  unidad: "m²",
  costoUnitario: "",
  observaciones: "",
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
        nombre: trabajo.nombre,
        descripcion: trabajo.descripcion,
        categoria: trabajo.categoria,
        unidad: trabajo.unidad,
        costoUnitario: String(trabajo.costoUnitario),
        observaciones: trabajo.observaciones,
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
      !formulario.nombre.trim() ||
      !formulario.descripcion.trim() ||
      !formulario.categoria.trim()
    ) {
      setError("Completá todos los campos obligatorios.");
      return;
    }

    const costo = Number(formulario.costoUnitario);

    if (Number.isNaN(costo) || costo < 0) {
      setError(
        "El costo unitario debe ser un número válido."
      );
      return;
    }

    const trabajoGuardado: ManoObraFormulario = {
      codigo: formulario.codigo.trim(),
      nombre: formulario.nombre.trim(),
      descripcion: formulario.descripcion.trim(),
      categoria: formulario.categoria.trim(),
      unidad: formulario.unidad,
      costoUnitario: costo,
      observaciones: formulario.observaciones.trim(),
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
          : `Editar trabajo - ${trabajo?.nombre ?? ""}`
      }
      onCerrar={onCerrar}
    >
      <form
        className="mano-obra-modal-form"
        onSubmit={(e) => {
          e.preventDefault();
          guardar();
        }}
      >
        <div className="campo-mano-obra">
          <label>Código *</label>
          <input
            type="text"
            value={formulario.codigo}
            onChange={(e) =>
              actualizarCampo(
                "codigo",
                e.target.value
              )
            }
            placeholder="Ej: MO-001"
          />
        </div>

        <div className="campo-mano-obra">
          <label>Nombre *</label>
          <input
            type="text"
            value={formulario.nombre}
            onChange={(e) =>
              actualizarCampo(
                "nombre",
                e.target.value
              )
            }
            placeholder="Ej: Albañilería"
          />
        </div>

        <div className="campo-mano-obra">
          <label>Descripción *</label>
          <textarea
            value={formulario.descripcion}
            onChange={(e) =>
              actualizarCampo(
                "descripcion",
                e.target.value
              )
            }
            placeholder="Descripción del trabajo"
          />
        </div>

        <div className="campo-mano-obra">
          <label>Categoría *</label>
          <input
            type="text"
            value={formulario.categoria}
            onChange={(e) =>
              actualizarCampo(
                "categoria",
                e.target.value
              )
            }
            placeholder="Ej: Construcción"
          />
        </div>

        <div className="campo-mano-obra">
          <label>Unidad</label>
          <select
            value={formulario.unidad}
            onChange={(e) =>
              actualizarCampo(
                "unidad",
                e.target.value
              )
            }
          >
            <option value="m²">m²</option>
            <option value="m³">m³</option>
            <option value="hora">Hora</option>
            <option value="jornal">Jornal</option>
            <option value="unidad">Unidad</option>
          </select>
        </div>

        <div className="campo-mano-obra">
          <label>Costo unitario *</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formulario.costoUnitario}
            onChange={(e) =>
              actualizarCampo(
                "costoUnitario",
                e.target.value
              )
            }
            placeholder="0.00"
          />
        </div>

        <div className="campo-mano-obra">
          <label>Observaciones</label>
          <textarea
            value={formulario.observaciones}
            onChange={(e) =>
              actualizarCampo(
                "observaciones",
                e.target.value
              )
            }
            placeholder="Observaciones adicionales"
          />
        </div>

        <div className="campo-mano-obra">
          <label>Estado</label>
          <select
            value={formulario.estado}
            onChange={(e) =>
              actualizarCampo(
                "estado",
                e.target.value
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

        {error && (
          <div
            className="mano-obra-modal-error"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="mano-obra-modal-actions">
          <button
            type="button"
            className="btn-secundario"
            onClick={onCerrar}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="btn-primario"
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