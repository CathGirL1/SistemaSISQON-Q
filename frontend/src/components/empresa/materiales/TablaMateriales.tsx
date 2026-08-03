import "../../../styles/empresa/materiales/TablaMateriales.css";

import { useState } from "react";

import type { MaterialEmpresa } from "../../../interfaces/MaterialEmpresa";

import type {
  MaterialFormulario,
} from "../../../services/materialService";

import {
  actualizarMaterial,
  eliminarMaterial,
} from "../../../services/materialService";

import FilaMaterial from "./FilaMaterial";
import MaterialModal from "./MaterialModal";
import ActualizarPrecioMaterialModal from "./ActualizarPrecioMaterialModal";
import ConfirmEliminarMaterialModal from "./ConfirmEliminarMaterialModal";

type Props = {
  materialesIniciales: MaterialEmpresa[];
  cargando: boolean;
  error: string;

  onActualizarMaterial: (
    material: MaterialEmpresa
  ) => void;

  onEliminarMaterial: (
    idMaterial: string
  ) => void;
};

export default function TablaMateriales({
  materialesIniciales,
  cargando,
  error,
  onActualizarMaterial,
  onEliminarMaterial,
}: Props) {
  
  
  const [materialSeleccionado, setMaterialSeleccionado] =
    useState<MaterialEmpresa | null>(null);

  const [modalEditar, setModalEditar] = useState(false);
  const [modalPrecio, setModalPrecio] = useState(false);
  const [modalEliminar, setModalEliminar] =
    useState(false);

  const abrirEditar = (material: MaterialEmpresa) => {
    setMaterialSeleccionado(material);
    setModalEditar(true);
  };

  const abrirPrecio = (material: MaterialEmpresa) => {
    setMaterialSeleccionado(material);
    setModalPrecio(true);
  };

  const abrirEliminar = (material: MaterialEmpresa) => {
    setMaterialSeleccionado(material);
    setModalEliminar(true);
  };

  const cerrarModales = () => {
    setModalEditar(false);
    setModalPrecio(false);
    setModalEliminar(false);
    setMaterialSeleccionado(null);
  };

  const guardarEdicion = async (
    datos: MaterialFormulario
  ) => {
    if (!materialSeleccionado) {
      throw new Error(
        "No se pudo identificar el material."
      );
    }

    const usuario = JSON.parse(
      localStorage.getItem("usuario")!
    );

    const materialActualizado =
      await actualizarMaterial(
        materialSeleccionado.id,
        {
          ...datos,
          idEmpresa: usuario.idEmpresa,
        }
      );

    onActualizarMaterial(materialActualizado);

    cerrarModales();
  };

  const guardarNuevoPrecio = async (
    nuevoPrecio: number
  ) => {
    if (!materialSeleccionado) {
      throw new Error(
        "No se pudo identificar el material."
      );
    }

    const usuario = JSON.parse(
      localStorage.getItem("usuario")!
    );

    const materialActualizado =
      await actualizarMaterial(
        materialSeleccionado.id,
        {
          idEmpresa: usuario.idEmpresa,
          nombre: materialSeleccionado.nombre,
          descripcion:
            materialSeleccionado.descripcion || null,
          categoria:
            materialSeleccionado.categoria,
          unidad: materialSeleccionado.unidad,
          costoUnitario: nuevoPrecio,
          stock: materialSeleccionado.stockCantidad,
          estado: materialSeleccionado.estado,
          imagenUrl:
            materialSeleccionado.imagenUrl || "",
        }
      );

    onActualizarMaterial(materialActualizado);

    cerrarModales();
  };

  const confirmarEliminarMaterial = async () => {
    if (!materialSeleccionado) {
      throw new Error(
        "No se pudo identificar el material."
      );
    }

    await eliminarMaterial(materialSeleccionado.id);

    onEliminarMaterial(materialSeleccionado.id);

    cerrarModales();
  };

  if (cargando) {
    return (
      <div className="tabla-materiales-card">
        <div className="materiales-estado-tabla">
          <span className="materiales-spinner" />
          <p>
            Cargando materiales desde la base de datos...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tabla-materiales-card">
        <div className="materiales-estado-tabla materiales-error">
          <h3>
            No se pudieron cargar los materiales
          </h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tabla-materiales-card">
      <div className="tabla-materiales-wrapper">
        <table className="tabla-materiales">
          <thead>
            <tr>
              <th>Material</th>
              <th>Categoría</th>
              <th>Unidad</th>
              <th>Precio actual</th>
              <th>Última actualización</th>
              <th>Disponibilidad</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {materialesIniciales.length > 0 ? (
              materialesIniciales.map((material) => (
                <FilaMaterial
                  key={material.id}
                  material={material}
                  onEditar={abrirEditar}
                  onActualizarPrecio={abrirPrecio}
                  onEliminar={abrirEliminar}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="materiales-tabla-vacia"
                >
                  No hay materiales registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="materiales-table-footer">
        {materialesIniciales.length === 0
          ? "No hay materiales para mostrar"
          : `Mostrando 1 a ${materialesIniciales.length} de ${materialesIniciales.length} materiales`}
      </div>

      <MaterialModal
        abierto={modalEditar}
        modo="editar"
        material={materialSeleccionado}
        onCerrar={cerrarModales}
        onGuardar={guardarEdicion}
      />

      <ActualizarPrecioMaterialModal
        abierto={modalPrecio}
        material={materialSeleccionado}
        onCerrar={cerrarModales}
        onGuardar={guardarNuevoPrecio}
      />

      <ConfirmEliminarMaterialModal
        abierto={modalEliminar}
        material={materialSeleccionado}
        onCerrar={cerrarModales}
        onConfirmar={confirmarEliminarMaterial}
      />
    </div>
  );
}