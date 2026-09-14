import "../../../styles/empresa/materiales/MaterialesEmpresa.css";

import { useCallback, useEffect, useState } from "react";

import PageHeader from "../../common/PageHeader";
import MaterialesKPIs from "./MaterialesKPIs";
import MaterialesFiltros from "./MaterialesFiltros";
import TablaMateriales from "./TablaMateriales";
import PanelBottomCard from "../../common/PanelBottomCard";
import MaterialModal from "./MaterialModal";
import PaginacionMateriales from "../../common/PaginacionMateriales";

import type { MaterialEmpresa } from "../../../interfaces/MaterialEmpresa";

import {
  crearMaterial,
  obtenerMaterialesPorEmpresa,
} from "../../../services/materialService";

import type { MaterialFormulario } from "../../../services/materialService";

export default function MaterialesEmpresaContenido() {
  const [materiales, setMateriales] = useState<MaterialEmpresa[]>([]);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);

  const [paginaActual, setPaginaActual] = useState(1);

  const materialesPorPagina = 10;

  // filtros
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [estado, setEstado] = useState("Todos");
  const [disponibilidad, setDisponibilidad] = useState("Todas");


  const cargarMateriales = useCallback(async () => {
    try {
      setCargando(true);
      setError("");

        const usuario = JSON.parse(
          localStorage.getItem("usuario") || "{}"
        );

    const idEmpresa = usuario.idEmpresa;

    if (!idEmpresa) {
      throw new Error(
        "No se pudo identificar la empresa autenticada."
      );
    }

      const materialesObtenidos =
        await obtenerMaterialesPorEmpresa(idEmpresa);

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

  useEffect(() => {
    setPaginaActual(1);
  }, [
    busqueda,
    categoria,
    estado,
    disponibilidad,
  ]);


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

    agregarMaterialLista(materialCreado);
    setPaginaActual(1);

    setModalCrearAbierto(false);
  };

  const actualizarMaterialLista = (
    materialActualizado: MaterialEmpresa
  ) => {
    setMateriales((listaActual) =>
      listaActual.map((material) =>
        material.id === materialActualizado.id
          ? materialActualizado
          : material
      )
    );
  };

  const eliminarMaterialLista = (
    idMaterial: string
  ) => {
    setMateriales((listaActual) =>
      listaActual.filter(
        (material) => material.id !== idMaterial
      )
    );
  };

  const agregarMaterialLista = (
    material: MaterialEmpresa
  ) => {
    setMateriales((listaActual) => [
      material,
      ...listaActual,
    ]);
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

    const totalPaginas = Math.ceil(
      materialesFiltrados.length /
      materialesPorPagina
    );

    const indiceInicial =
      (paginaActual - 1) *
      materialesPorPagina;

    const indiceFinal =
      indiceInicial +
      materialesPorPagina;

    const materialesPagina =
      materialesFiltrados.slice(
        indiceInicial,
        indiceFinal
    );

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
        materialesIniciales={materialesPagina}
        cargando={cargando}
        error={error}
        onActualizarMaterial={actualizarMaterialLista}
        onEliminarMaterial={eliminarMaterialLista}
      />

      <PaginacionMateriales
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        onCambiarPagina={setPaginaActual}
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