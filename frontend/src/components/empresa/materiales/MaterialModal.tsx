import "../../../styles/empresa/materiales/MaterialesModales.css";

import { useEffect, useState } from "react";

import ModalBase from "../../common/ModalBase";

import type {
  EstadoMaterial,
  MaterialEmpresa,
} from "../../../interfaces/MaterialEmpresa";

import type {
  MaterialFormulario,
} from "../../../services/materialService";

type Props = {
  abierto: boolean;
  modo: "crear" | "editar";
  material: MaterialEmpresa | null;
  onCerrar: () => void;
  onGuardar?: (
    datos: MaterialFormulario
  ) => Promise<void> | void;
};

type FormularioMaterial = {
  nombre: string;
  descripcion: string;
  categoria: string;
  unidad: string;
  costoUnitario: string;
  stock: string;
  imagenUrl: string;
  estado: EstadoMaterial;
};

const formularioInicial: FormularioMaterial = {
  nombre: "",
  descripcion: "",
  categoria: "",
  unidad: "",
  costoUnitario: "",
  stock: "",
  imagenUrl: "",
  estado: "Activo",
};

export default function MaterialModal({
  abierto,
  modo,
  material,
  onCerrar,
  onGuardar,
}: Props) {
  const [formulario, setFormulario] =
    useState<FormularioMaterial>(formularioInicial);

  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!abierto) return;

    if (modo === "editar" && material) {
      setFormulario({
        nombre: material.nombre,
        descripcion: material.descripcion,
        categoria: material.categoria,
        unidad: material.unidad,
        costoUnitario: String(material.costoUnitario),
        stock: String(material.stockCantidad),
        imagenUrl: String(material.imagenUrl),
        estado: material.estado,
        
      });
    } else {
      setFormulario(formularioInicial);
    }

    setError("");
    setGuardando(false);
  }, [abierto, modo, material]);

  const actualizarCampo = (
    campo: keyof FormularioMaterial,
    valor: string
  ) => {
    setFormulario((actual) => ({
      ...actual,
      [campo]: valor,
    }));
  };

  const guardar = async () => {
    setError("");

    if (!formulario.nombre.trim()) {
      setError("El nombre del material es obligatorio.");
      return;
    }

    if (!formulario.categoria.trim()) {
      setError("La categoría es obligatoria.");
      return;
    }

    if (!formulario.unidad.trim()) {
      setError("La unidad es obligatoria.");
      return;
    }

    const costoUnitario = Number(formulario.costoUnitario);
    const stock = Number(formulario.stock);

    if (
      !Number.isFinite(costoUnitario) ||
      costoUnitario < 0
    ) {
      setError(
        "El costo unitario debe ser un número mayor o igual a cero."
      );
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      setError(
        "El stock debe ser un número entero mayor o igual a cero."
      );
      return;
    }

    if (!onGuardar) {
      setError(
        "No se configuró la operación para guardar el material."
      );
      return;
    }

    const datos: MaterialFormulario = {
      
      nombre: formulario.nombre.trim(),
      descripcion:
        formulario.descripcion.trim() || null,
      categoria: formulario.categoria.trim(),
      unidad: formulario.unidad.trim(),
      costoUnitario,
      stock,
      estado: formulario.estado,
      imagenUrl: formulario.imagenUrl.trim() || "",
    };

    try {
      setGuardando(true);
      await onGuardar(datos);
    } catch (errorDesconocido) {
      setError(
        errorDesconocido instanceof Error
          ? errorDesconocido.message
          : "No se pudo guardar el material."
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <ModalBase
      abierto={abierto}
      titulo={
        modo === "crear"
          ? "Agregar material"
          : `Editar material - ${material?.nombre ?? ""}`
      }
      onCerrar={onCerrar}
    >
      <form
        className="material-modal-form"
        onSubmit={(evento) => {
          evento.preventDefault();
          guardar();
        }}
      >
        <div className="form-group-material">
          <label htmlFor="material-nombre">Nombre</label>

          <input
            id="material-nombre"
            type="text"
            value={formulario.nombre}
            onChange={(evento) =>
              actualizarCampo("nombre", evento.target.value)
            }
          />
        </div>

        <div className="form-group-material">
          <label htmlFor="material-categoria">
            Categoría
          </label>

          <select
            id="material-categoria"
            value={formulario.categoria}
            onChange={(evento) =>
              actualizarCampo(
                "categoria",
                evento.target.value
              )
            }
          >
            <option value="">Seleccionar categoría</option>
            <option value="Techos">Techos</option>
            <option value="Maderas">Maderas</option>
            <option value="Cubiertas">Cubiertas</option>
            <option value="Cementos">Cementos</option>
            <option value="Áridos">Áridos</option>
            <option value="Hierros">Hierros</option>
            <option value="Ladrillos">Ladrillos</option>
            <option value="Terminaciones">
              Terminaciones
            </option>
          </select>
        </div>

        <div className="form-group-material">
          <label htmlFor="material-unidad">Unidad</label>

          <input
            id="material-unidad"
            type="text"
            value={formulario.unidad}
            onChange={(evento) =>
              actualizarCampo("unidad", evento.target.value)
            }
          />
        </div>

        <div className="form-group-material">
          <label htmlFor="material-precio">
            Costo unitario
          </label>

          <input
            id="material-precio"
            type="number"
            min="0"
            step="0.01"
            value={formulario.costoUnitario}
            onChange={(evento) =>
              actualizarCampo(
                "costoUnitario",
                evento.target.value
              )
            }
          />
        </div>

        <div className="form-group-material">
          <label htmlFor="material-stock">Stock</label>

          <input
            id="material-stock"
            type="number"
            min="0"
            step="1"
            value={formulario.stock}
            onChange={(evento) =>
              actualizarCampo("stock", evento.target.value)
            }
          />
        </div>

        <div className="form-group-material">
          <label htmlFor="material-estado">Estado</label>

          <select
            id="material-estado"
            value={formulario.estado}
            onChange={(evento) =>
              actualizarCampo(
                "estado",
                evento.target.value as EstadoMaterial
              )
            }
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <div className="form-group-material material-campo-completo">
          <label htmlFor="material-imagen">
            URL de la imagen
          </label>

          <input
            id="material-imagen"
            type="url"
            placeholder="https://..."
            value={formulario.imagenUrl}
            onChange={(e) =>
              actualizarCampo("imagenUrl", e.target.value)
            }
          />
        </div>

        <div className="form-group-material material-campo-completo">
          <label htmlFor="material-descripcion">
            Descripción
          </label>

          <textarea
            id="material-descripcion"
            value={formulario.descripcion}
            onChange={(evento) =>
              actualizarCampo(
                "descripcion",
                evento.target.value
              )
            }
          />
        </div>

        {error && (
          <p className="material-form-error">{error}</p>
        )}

        <div className="material-modal-actions">
          <button
            type="button"
            className="material-btn-cancelar"
            onClick={onCerrar}
            disabled={guardando}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="material-btn-guardar"
            disabled={guardando}
          >
            {guardando
              ? "Guardando..."
              : modo === "crear"
                ? "Agregar material"
                : "Guardar cambios"}
          </button>
        </div>
      </form>
    </ModalBase>
  );
}