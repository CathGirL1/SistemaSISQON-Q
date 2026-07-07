import "../../../styles/empresa/materiales/MaterialesModales.css";

import ModalBase from "../../common/ModalBase";
import type { MaterialEmpresa } from "../../../interfaces/MaterialEmpresa";

type Props = {
  abierto: boolean;
  modo: "crear" | "editar";
  material: MaterialEmpresa | null;
  onCerrar: () => void;
};

export default function MaterialModal({
  abierto,
  modo,
  material,
  onCerrar,
}: Props) {
  return (
    <ModalBase
      abierto={abierto}
      titulo={modo === "crear" ? "Agregar material" : "Editar material"}
      onCerrar={onCerrar}
    >
      <form className="material-modal-form">
        <div className="form-group-material">
          <label>Nombre del material</label>
          <input
            type="text"
            defaultValue={material?.nombre || ""}
            placeholder="Ej: Madera pino seco"
          />
        </div>

        <div className="form-group-material">
          <label>Categoría</label>
          <select defaultValue={material?.categoria || ""}>
            <option value="">Seleccionar categoría</option>
            <option>Techos</option>
            <option>Maderas</option>
            <option>Cubiertas</option>
            <option>Cementos</option>
            <option>Áridos</option>
            <option>Hierros</option>
            <option>Ladrillos</option>
            <option>Terminaciones</option>
          </select>
        </div>

        <div className="form-group-material">
          <label>Unidad</label>
          <input
            type="text"
            defaultValue={material?.unidad || ""}
            placeholder="Ej: m3, unidad, saco"
          />
        </div>

        <div className="form-group-material">
          <label>Precio actual</label>
          <input
            type="text"
            defaultValue={material?.precioActual || ""}
            placeholder="$ 0"
          />
        </div>

        <div className="form-group-material">
          <label>Stock</label>
          <input
            type="text"
            defaultValue={material?.stock || ""}
            placeholder="Ej: 50 unidades"
          />
        </div>

        <div className="form-group-material">
          <label>Estado</label>
          <select defaultValue={material?.estado || "Activo"}>
            <option>Activo</option>
            <option>Inactivo</option>
          </select>
        </div>

        <div className="material-modal-actions">
          <button type="button" className="material-btn-cancelar" onClick={onCerrar}>
            Cancelar
          </button>

          <button type="button" className="material-btn-guardar" onClick={onCerrar}>
            {modo === "crear" ? "Agregar material" : "Guardar cambios"}
          </button>
        </div>
      </form>
    </ModalBase>
  );
}