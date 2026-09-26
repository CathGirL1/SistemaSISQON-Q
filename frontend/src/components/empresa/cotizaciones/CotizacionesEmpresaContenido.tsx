import "../../../styles/empresa/cotizaciones/CotizacionesEmpresa.css";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import PageHeader from "../../common/PageHeader";
import CotizacionesKPIs from "./CotizacionesKPIs";
import CotizacionesFiltros from "./CotizacionesFiltros";
import TablaCotizaciones from "./TablaCotizaciones";
import PanelPagination from "../../common/PanelPagination";
import PanelBottomCard from "../../common/PanelBottomCard";

import type {
  Cotizacion,
} from "../../../interfaces/Cotizacion";

import {
  obtenerCotizacionesEmpresa,
} from "../../../services/cotizacionService";


// =====================================================
// CONFIGURACIÓN PAGINACIÓN
// =====================================================

const COTIZACIONES_POR_PAGINA = 10;


export default function CotizacionesEmpresaContenido() {

  // =====================================================
  // COTIZACIONES
  // =====================================================

  const [cotizaciones, setCotizaciones] =
    useState<Cotizacion[]>([]);

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState("");


  // =====================================================
  // FILTROS
  // =====================================================

  const [busqueda, setBusqueda] =
    useState("");

  const [tipoObra, setTipoObra] =
    useState("");

  const [estado, setEstado] =
    useState("");


  // =====================================================
  // PAGINACIÓN
  // =====================================================

  const [paginaActual, setPaginaActual] =
    useState(1);


  // =====================================================
  // CARGAR COTIZACIONES
  // =====================================================

  const cargarCotizaciones =
    async (): Promise<void> => {

      try {

        setCargando(true);
        setError("");

        const usuarioGuardado =
          localStorage.getItem("usuario");

        if (!usuarioGuardado) {
          throw new Error(
            "No hay una sesión iniciada"
          );
        }

        const usuario =
          JSON.parse(usuarioGuardado);

        const idEmpresa =
          Number(usuario.idEmpresa);

        if (!idEmpresa) {
          throw new Error(
            "No se encontró la empresa asociada al usuario"
          );
        }

        const datos =
          await obtenerCotizacionesEmpresa(
            idEmpresa
          );

        setCotizaciones(datos);

      } catch (error: unknown) {

        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Ocurrió un error al cargar las cotizaciones"
        );

      } finally {

        setCargando(false);

      }
    };


  useEffect(() => {
    cargarCotizaciones();
  }, []);


  // =====================================================
  // TIPOS DE OBRA DISPONIBLES
  // =====================================================

  const tiposObra =
    useMemo(() => {

      const tipos =
        cotizaciones
          .map(
            (cotizacion) =>
              cotizacion.tipoObra
          )
          .filter(
            (tipo) =>
              tipo &&
              tipo.trim() !== ""
          );

      return Array.from(
        new Set(tipos)
      ).sort((a, b) =>
        a.localeCompare(
          b,
          "es"
        )
      );

    }, [cotizaciones]);


  // =====================================================
  // COTIZACIONES FILTRADAS
  // =====================================================

  const cotizacionesFiltradas =
    useMemo(() => {

      const textoBusqueda =
        busqueda
          .trim()
          .toLocaleLowerCase("es");

      return cotizaciones.filter(
        (cotizacion) => {

          // BÚSQUEDA

          const coincideBusqueda =
            textoBusqueda === "" ||
            cotizacion.id
              .toLocaleLowerCase("es")
              .includes(textoBusqueda) ||
            cotizacion.cliente
              .toLocaleLowerCase("es")
              .includes(textoBusqueda) ||
            cotizacion.email
              .toLocaleLowerCase("es")
              .includes(textoBusqueda);


          // TIPO DE OBRA

          const coincideTipoObra =
            tipoObra === "" ||
            cotizacion.tipoObra ===
              tipoObra;


          // ESTADO

          const coincideEstado =
            estado === "" ||
            cotizacion.estado ===
              estado;


          return (
            coincideBusqueda &&
            coincideTipoObra &&
            coincideEstado
          );
        }
      );

    }, [
      cotizaciones,
      busqueda,
      tipoObra,
      estado,
    ]);


  // =====================================================
  // VOLVER A PÁGINA 1 AL CAMBIAR FILTROS
  // =====================================================

  useEffect(() => {

    setPaginaActual(1);

  }, [
    busqueda,
    tipoObra,
    estado,
  ]);


  // =====================================================
  // TOTAL DE PÁGINAS
  // =====================================================

  const totalPaginas =
    Math.ceil(
      cotizacionesFiltradas.length /
        COTIZACIONES_POR_PAGINA
    );


  // =====================================================
  // COTIZACIONES DE LA PÁGINA ACTUAL
  // =====================================================

  const cotizacionesPaginadas =
    useMemo(() => {

      const inicio =
        (paginaActual - 1) *
        COTIZACIONES_POR_PAGINA;

      const fin =
        inicio +
        COTIZACIONES_POR_PAGINA;

      return cotizacionesFiltradas.slice(
        inicio,
        fin
      );

    }, [
      cotizacionesFiltradas,
      paginaActual,
    ]);


  // =====================================================
  // CORREGIR PÁGINA SI CAMBIA LA CANTIDAD
  // =====================================================

  useEffect(() => {

    if (
      totalPaginas > 0 &&
      paginaActual > totalPaginas
    ) {
      setPaginaActual(totalPaginas);
    }

  }, [
    totalPaginas,
    paginaActual,
  ]);


  // =====================================================
  // VISTA
  // =====================================================

  return (
    <section className="cotizaciones-page">

      <PageHeader
        title="Gestión de cotizaciones"
        subtitle="Administra y da seguimiento a las solicitudes de cotización recibidas."
      />


      {/* KPIs GLOBALES */}

      <CotizacionesKPIs
        cotizaciones={cotizaciones}
      />


      {/* FILTROS */}

      <CotizacionesFiltros
        busqueda={busqueda}
        onBusquedaChange={setBusqueda}

        tipoObra={tipoObra}
        onTipoObraChange={setTipoObra}

        estado={estado}
        onEstadoChange={setEstado}

        tiposObra={tiposObra}
      />


      {/* TABLA */}

      <TablaCotizaciones
        cotizaciones={
          cotizacionesPaginadas
        }

        setCotizaciones={
          setCotizaciones
        }

        cargando={
          cargando
        }

        error={
          error
        }

        onActualizada={
          cargarCotizaciones
        }

        paginaActual={
          paginaActual
        }

        porPagina={
          COTIZACIONES_POR_PAGINA
        }

        totalCotizaciones={
          cotizacionesFiltradas.length
        }
      />


      {/* PAGINACIÓN */}

      <PanelPagination
        currentPage={paginaActual}
        totalPages={totalPaginas}
        onPageChange={setPaginaActual}
      />


      <PanelBottomCard
        title="Consejo"
        description="Recordá realizar el seguimiento de las cotizaciones en revisión para aumentar las probabilidades de cierre."
      />

    </section>
  );
}