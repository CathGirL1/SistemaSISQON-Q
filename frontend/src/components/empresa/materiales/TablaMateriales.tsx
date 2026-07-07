import "../../../styles/empresa/materiales/TablaMateriales.css";

import { useState } from "react";
import { materialesData } from "../../../data/materialesData";
import type { MaterialEmpresa } from "../../../interfaces/MaterialEmpresa";

import FilaMaterial from "./FilaMaterial";
import MaterialModal from "./MaterialModal";
import ActualizarPrecioMaterialModal from "./ActualizarPrecioMaterialModal";
import ConfirmEliminarMaterialModal from "./ConfirmEliminarMaterialModal";

export default function TablaMateriales() {
  const [materiales, setMateriales] = useState<MaterialEmpresa[]>(materialesData);

  const [materialSeleccionado, setMaterialSeleccionado] =
    useState<MaterialEmpresa | null>(null);

  const [modalEditar, setModalEditar] = useState(false);
  const [modalPrecio, setModalPrecio] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);

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

  const eliminarMaterial = () => {
    if (!materialSeleccionado) return;

    setMateriales(
      materiales.filter((material) => material.id !== materialSeleccionado.id)
    );

    cerrarModales();
  };

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
            {materiales.map((material) => (
              <FilaMaterial
                key={material.id}
                material={material}
                onEditar={abrirEditar}
                onActualizarPrecio={abrirPrecio}
                onEliminar={abrirEliminar}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="materiales-table-footer">
        Mostrando 1 a {materiales.length} de 87 materiales
      </div>

      <MaterialModal
        abierto={modalEditar}
        modo="editar"
        material={materialSeleccionado}
        onCerrar={cerrarModales}
      />

      <ActualizarPrecioMaterialModal
        abierto={modalPrecio}
        material={materialSeleccionado}
        onCerrar={cerrarModales}
      />

      <ConfirmEliminarMaterialModal
        abierto={modalEliminar}
        material={materialSeleccionado}
        onCerrar={cerrarModales}
        onConfirmar={eliminarMaterial}
      />
    </div>
  );
}