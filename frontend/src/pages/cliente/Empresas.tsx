import { useEffect, useState } from "react";


import SidebarCliente from "../../components/cliente/SidebarCliente";
import HeaderCliente from "../../components/cliente/HeaderCliente";

import type { EmpresaCliente } from "../../interfaces/EmpresaCliente";
import EmpresaCard from "../../components/cliente/EmpresaCard";
import PaginacionEmpresaCliente from "../../components/cliente/PaginacionEmpresaCliente";
import EmpresaDetalle from "../../pages/cliente/EmpresaDetalle";
import EmpresaStatCard from "../../pages/cliente/EmpresaStatCard";
import FiltrosEmpresaCliente from "../../components/cliente/FiltrosEmpresaCliente";

import {
  Building2,
  FileText,
  BriefcaseBusiness,
} from "lucide-react";

import "../../styles/PanelClienteContenido.css";
import "../../styles/EmpresasCliente.css";



export default function Empresas() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [empresas, setEmpresas] = useState<EmpresaCliente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [empresaSeleccionada, setEmpresaSeleccionada] =
    useState<EmpresaCliente | null>(null);
  const [error, setError] = useState("");
  const [cotizacionesEnviadas, setCotizacionesEnviadas] = useState(0);
  const [cantidadProyectos, setCantidadProyectos] = useState(0);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroDireccion, setFiltroDireccion] = useState("");
  const [filtroRubro, setFiltroRubro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const EMPRESAS_POR_PAGINA = 3;

  const rubros = Array.from(
    new Set(
      empresas
        .map((empresa) => empresa.rubro)
        .filter(Boolean)
    )
  );


  const empresasFiltradas = empresas.filter((empresa) => {
    const coincideNombre = empresa.nombreEmpresa
      .toLowerCase()
      .includes(filtroNombre.toLowerCase());

    const coincideDireccion = empresa.direccion
      .toLowerCase()
      .includes(filtroDireccion.toLowerCase());

    const coincideRubro =
      !filtroRubro ||
      empresa.rubro === filtroRubro;

    return (
      coincideNombre &&
      coincideDireccion &&
      coincideRubro
    );
  });

  const totalPaginas = Math.ceil(
    empresasFiltradas.length / EMPRESAS_POR_PAGINA
  );

  const indiceInicio =
    (paginaActual - 1) * EMPRESAS_POR_PAGINA;

  const indiceFin =
    indiceInicio + EMPRESAS_POR_PAGINA;

  const empresasPaginadas = empresasFiltradas.slice(
    indiceInicio,
    indiceFin
  );


  useEffect(() => {
    const obtenerEmpresas = async () => {
      try {
        setCargando(true);
        setError("");

        const respuesta = await fetch("http://localhost:3000/api/empresa");

        if (!respuesta.ok) {
          throw new Error("No se pudieron obtener las empresas");
        }

        const datos = await respuesta.json();
        console.log("Empresas recibidas:", datos);

        setEmpresas(datos);
      } catch (error) {
        console.error("Error al obtener empresas:", error);
        setError("No se pudieron cargar las empresas.");
      } finally {
        setCargando(false);
      }
    };

    obtenerEmpresas();

    const obtenerEstadisticas = async () => {
      try {



        const usuario = JSON.parse(
          localStorage.getItem("usuario") || "{}"
        );

        const idCliente = Number(usuario.id_Cliente);

        console.log("USUARIO GUARDADO:", usuario);
        console.log("ID CLIENTE:", usuario.idCliente);
        console.log("ID_CLIENTE:", usuario.id_Cliente);

        const respuesta = await fetch(
          `http://localhost:3000/api/cotizaciones/estadisticas/cliente/${idCliente}`
        );

        if (!respuesta.ok) {
          throw new Error(
            "No se pudieron obtener las estadísticas"
          );
        }

        const datos = await respuesta.json();

        console.log(
          "Estadísticas recibidas:",
          datos
        );

        setCotizacionesEnviadas(
          datos.cotizacionesEnviadas
        );

      } catch (error) {

        console.error(
          "Error al obtener estadísticas:",
          error
        );

      }
    };

    obtenerEstadisticas();

    const obtenerProyectosDeCliente = async () => {
      try {
        const usuarioGuardado =
          localStorage.getItem("usuario");

        if (!usuarioGuardado) {
          throw new Error("No hay un usuario autenticado");
        }

        const usuario = JSON.parse(usuarioGuardado);

        const respuestaProyectos = await fetch(
          `http://localhost:3000/api/proyectos/cliente/${usuario.id_Cliente}`
        );

        if (!respuestaProyectos.ok) {
          throw new Error(
            "No se pudieron obtener los proyectos"
          );
        }

        const proyectos =
          await respuestaProyectos.json();

        console.log(
          "Proyectos del cliente:",
          proyectos
        );

        setCantidadProyectos(proyectos.length);

      } catch (error) {
        console.error(
          "Error al obtener proyectos:",
          error
        );

        setError(
          "No se pudieron cargar los proyectos."
        );

      } finally {
        setCargando(false);
      }
    };

    obtenerProyectosDeCliente();
  }, []);



  return (
    <div className="cliente-panel">

      <SidebarCliente
        menuOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <main className="cliente-main">
        <HeaderCliente
          menuOpen={menuOpen}
          onToggleMenu={() => setMenuOpen((prev) => !prev)}
        />

        {empresaSeleccionada ? (

          <EmpresaDetalle
            empresa={empresaSeleccionada}
            onVolver={() => setEmpresaSeleccionada(null)}
          />

        ) : (

          <>
            <section className="empresas-heading">
              <div>
                <h2>Empresas disponibles</h2>

                <p>
                  Conocé las empresas disponibles antes de
                  elegir una para tu proyecto.
                </p>
              </div>
            </section>

            {cargando && (
              <section className="empresas-estado">
                <p>Cargando empresas...</p>
              </section>
            )}

            {!cargando && error && (
              <section className="empresas-estado empresas-estado-error">
                <p>{error}</p>
              </section>
            )}

            {!cargando && !error && empresas.length === 0 && (
              <section className="empresas-estado">
                <p>
                  No hay empresas disponibles actualmente.
                </p>
              </section>
            )}
            {!cargando && !error && (
              <section className="empresas-stats">

                <EmpresaStatCard
                  icon={<Building2 size={22} />}
                  valor={empresas.length}
                  titulo="Empresas disponibles"
                  variante="blue"
                />

                <EmpresaStatCard
                  icon={<FileText size={22} />}
                  valor={cotizacionesEnviadas}
                  titulo="Cotizaciones enviadas a empresas"
                  variante="green"
                />

                <EmpresaStatCard
                  icon={<BriefcaseBusiness size={22} />}
                  valor={cantidadProyectos}
                  titulo="Proyectos registrados"
                  variante="purple"
                />


              </section>
            )}

            {!cargando && !error && (
              <FiltrosEmpresaCliente
                nombre={filtroNombre}
                direccion={filtroDireccion}
                rubro={filtroRubro}
                rubros={rubros}
                onNombreChange={(valor) => {
                  setFiltroNombre(valor);
                  setPaginaActual(1);
                }}
                onDireccionChange={(valor) => {
                  setFiltroDireccion(valor);
                  setPaginaActual(1);
                }}
                onRubroChange={(valor) => {
                  setFiltroRubro(valor);
                  setPaginaActual(1);
                }}
              />
            )}

            {!cargando && !error && empresas.length > 0 && (
              <>
                <section className="empresas-grid">
                  {empresasPaginadas.map((empresa) => (
                    <EmpresaCard
                      key={empresa.idEmpresa}
                      empresa={empresa}
                      onVerDetalles={setEmpresaSeleccionada}
                    />
                  ))}
                </section>

                {empresasFiltradas.length > 0 && (
                  <PaginacionEmpresaCliente
                    paginaActual={paginaActual}
                    totalPaginas={totalPaginas}
                    onCambiarPagina={setPaginaActual}
                  />
                )}
              </>
            )}

            {!cargando && !error && empresas.length > 0 && (
              <footer className="empresas-results">
                Mostrando{" "}
                {empresasFiltradas.length === 0
                  ? 0
                  : indiceInicio + 1}
                –
                {Math.min(indiceFin, empresasFiltradas.length)} de{" "}
                {empresasFiltradas.length} empresas
              </footer>
            )}

          </>

        )}

      </main>

    </div>
  );
}