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

import type { CrearMaterialRequest, MaterialFormulario } from "../../../services/materialService";

export default function MaterialesEmpresaContenido() {
  const [materiales, setMateriales] = useState<
    MaterialEmpresa[]
  >([]);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [modalCrearAbierto, setModalCrearAbierto] =
    useState(false);

  // Estados de filtros
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [estado, setEstado] = useState("Todos");
  const [disponibilidad, setDisponibilidad] =
    useState("Todas");

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
    datos: MaterialFormulario
  ) => {

    const usuario = JSON.parse(
      localStorage.getItem("usuario")!
    );

    console.log("Usuario:", usuario);
    console.log("usuario.idEmpresa:", usuario.idEmpresa);

    const datosEnviar = {
      ...datos,
      idEmpresa: usuario.idEmpresa,
    };

    console.log("Datos a enviar:", datosEnviar);

    const materialCreado = await crearMaterial(datosEnviar);

    setMateriales((listaActual) => [
      materialCreado,
      ...listaActual,
    ]);

    setModalCrearAbierto(false);
  };

  // Categorías dinámicas
  const categorias = [
    ...new Set(
      materiales.map(
        (material) => material.categoria
      )
    ),
  ].sort();

  // Materiales filtrados
  const materialesFiltrados =
    materiales.filter((material) => {
      const coincideBusqueda =
        material.nombre
          .toLowerCase()
          .includes(busqueda.toLowerCase()) ||
        material.descripcion
          .toLowerCase()
          .includes(busqueda.toLowerCase());

      const coincideCategoria =
        categoria === "Todas" ||
        material.categoria === categoria;

      const coincideEstado =
        estado === "Todos" ||
        material.estado === estado;

      const coincideDisponibilidad =
        disponibilidad === "Todas" ||
        material.disponibilidad ===
          disponibilidad;

      return (
        coincideBusqueda &&
        coincideCategoria &&
        coincideEstado &&
        coincideDisponibilidad
      );
    });

  return (
    <section className="materiales-page">
      <PageHeader
        title="Gestión de materiales"
        subtitle="Administra los materiales, precios y disponibilidad del sistema."
        buttonText="Agregar material"
        onButtonClick={() =>
          setModalCrearAbierto(true)
        }
      />

      <MaterialesKPIs
        materiales={materiales}
      />

      <MaterialesFiltros
        busqueda={busqueda}
        categoria={categoria}
        estado={estado}
        disponibilidad={disponibilidad}
        categorias={categorias}
        onBusquedaChange={setBusqueda}
        onCategoriaChange={setCategoria}
        onEstadoChange={setEstado}
        onDisponibilidadChange={
          setDisponibilidad
        }
      />

      <TablaMateriales
        materialesIniciales={
          materialesFiltrados
        }
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
        onCerrar={() =>
          setModalCrearAbierto(false)
        }
        onGuardar={guardarNuevoMaterial}
      />
    </section>
  );
}