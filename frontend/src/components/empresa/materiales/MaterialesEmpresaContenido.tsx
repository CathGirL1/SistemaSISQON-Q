import "../../../styles/empresa/materiales/MaterialesEmpresa.css";

import { useCallback, useEffect, useState } from "react";

import PageHeader from "../../common/PageHeader";
import MaterialesKPIs from "./MaterialesKPIs";
import MaterialesFiltros from "./MaterialesFiltros";
import TablaMateriales from "./TablaMateriales";
import PanelBottomCard from "../../common/PanelBottomCard";
import MaterialModal from "./MaterialModal";


import type { MaterialEmpresa } from "../../../interfaces/MaterialEmpresa";

import {
  crearMaterial,
  obtenerMateriales,
} from "../../../services/materialService";

import type { CrearMaterialRequest } from "../../../services/materialService";

export default function MaterialesEmpresaContenido() {
  const [materiales, setMateriales] = useState<
    MaterialEmpresa[]
  >([]);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [modalCrearAbierto, setModalCrearAbierto] =
    useState(false);

  const cargarMateriales = useCallback(async () => {
    try {
      setCargando(true);
      setError("");

      const materialesObtenidos =
        await obtenerMateriales();

      setMateriales(materialesObtenidos);
    } catch (errorDesconocido) {
      console.error(
        "Error al cargar materiales:",
        errorDesconocido
      );

      setError(
        errorDesconocido instanceof Error
          ? errorDesconocido.message
          : "Ocurrió un error al cargar los materiales."
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarMateriales();
  }, [cargarMateriales]);

  const guardarNuevoMaterial = async (
    datos: CrearMaterialRequest
  ) => {
    const materialCreado = await crearMaterial(datos);

    setMateriales((listaActual) => [
      materialCreado,
      ...listaActual,
    ]);

    setModalCrearAbierto(false);
  };

  return (
    <section className="materiales-page">
      <PageHeader
        title="Gestión de materiales"
        subtitle="Administra los materiales, precios y disponibilidad del sistema."
        buttonText="Agregar material"
        onButtonClick={() => setModalCrearAbierto(true)}
      />

      <MaterialesKPIs />

      <MaterialesFiltros />

      <TablaMateriales
        materialesIniciales={materiales}
        cargando={cargando}
        error={error}
      />

      <PanelBottomCard
        title="Importante"
        description="Mantené los precios y stocks actualizados para asegurar cotizaciones precisas y competitivas."
      />

      <MaterialModal
        abierto={modalCrearAbierto}
        modo="crear"
        material={null}
        onCerrar={() => setModalCrearAbierto(false)}
        onGuardar={guardarNuevoMaterial}
      />
    </section>
  );
}