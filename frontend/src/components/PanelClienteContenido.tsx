import "../styles/PanelClienteContenido.css";
import SidebarCliente from "./cliente/SidebarCliente";
import HeaderCliente from "./cliente/HeaderCliente";
import FlowCliente from "./cliente/FlowCliente";

import { useNavigate } from "react-router-dom";

import ProjectItem from "./cliente/ProjectItem";



import DashboardCard from "./cliente/DashboardCard";

import QuoteItem from "./cliente/QuoteItem";


import ResponseItem from "./cliente/ResponseItem";

import { useEffect, useState, useMemo } from "react";

interface ProyectoDashboard {
    idProyecto: number;
    nombre: string;
    ubicacion: string | null;
    estado: string;
    imagenUrl: string | null;
    fechaCreacion: string;
}

interface CotizacionDashboard {
    idCotizacion: number;
    idProyecto: number;
    idEmpresa: number | null;
    nombreEmpresa: string | null;
    codigo: string;
    version: number;
    fechaCreacion: string;
    fechaActualizacion: string | null;
    estado: string;
    precioEstimado: number | null;
    moneda: string;
    nombreProyecto: string;
}

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function PanelClienteContenido() {

    const [menuOpen, setMenuOpen] = useState(false);
    const [cliente, setCliente] = useState<{
        nombre: string;
        apellido: string;
    } | null>(null);

    const [proyectos, setProyectos] =
        useState<ProyectoDashboard[]>([]);

    const [cargandoProyectos, setCargandoProyectos] =
        useState(true);

    const navigate = useNavigate();

    const [cotizaciones, setCotizaciones] =
        useState<CotizacionDashboard[]>([]);

    const [cargandoCotizaciones, setCargandoCotizaciones] =
        useState(true);

    useEffect(() => {
        const usuarioGuardado =
            localStorage.getItem("usuario");

        if (!usuarioGuardado) {
            return;
        }

        const usuario = JSON.parse(usuarioGuardado);

        if (!usuario.id_Cliente) {
            return;
        }

        const obtenerDatosDashboard = async () => {
            try {
                setCargandoProyectos(true);
                setCargandoCotizaciones(true);
                const idCliente = usuario.id_Cliente;

                const [
                    respuestaCliente,
                    respuestaProyectos,
                    respuestaCotizaciones,
                ] = await Promise.all([
                    fetch(
                        `http://localhost:3000/api/clientes/${idCliente}`
                    ),

                    fetch(
                        `http://localhost:3000/api/proyectos/cliente/${idCliente}`
                    ),

                    fetch(
                        `http://localhost:3000/api/cotizaciones/cliente/${idCliente}`
                    ),
                ]);

                if (!respuestaCliente.ok) {
                    throw new Error(
                        "No se pudo obtener el cliente"
                    );
                }

                if (!respuestaProyectos.ok) {
                    throw new Error(
                        "No se pudieron obtener los proyectos"
                    );
                }

                if (!respuestaCotizaciones.ok) {
                    throw new Error(
                        "No se pudieron obtener las cotizaciones"
                    );
                }

                const datosCliente =
                    await respuestaCliente.json();

                const datosProyectos =
                    await respuestaProyectos.json();

                const datosCotizaciones =
                    await respuestaCotizaciones.json();

                setCliente(datosCliente);

                setProyectos(datosProyectos);

                setCotizaciones(datosCotizaciones);

            } catch (error) {
                console.error(
                    "Error al obtener datos de la dashboard:",
                    error
                );
            } finally {
                setCargandoProyectos(false);
                setCargandoCotizaciones(false);
            }
        };
        obtenerDatosDashboard();
    }, []);

    const proyectosRecientes = useMemo(() => {
        return [...proyectos]
            .sort(
                (a, b) =>
                    new Date(b.fechaCreacion).getTime() -
                    new Date(a.fechaCreacion).getTime()
            )
            .slice(0, 4);
    }, [proyectos]);

    const cotizacionesRecientes = useMemo(() => {
        return [...cotizaciones]
            .sort(
                (a, b) =>
                    new Date(b.fechaCreacion).getTime() -
                    new Date(a.fechaCreacion).getTime()
            )
            .slice(0, 4);
    }, [cotizaciones]);

    function formatearFecha(fecha: string): string {
        const fechaFormateada = new Date(fecha);

        if (
            Number.isNaN(fechaFormateada.getTime())
        ) {
            return "Fecha no disponible";
        }

        return new Intl.DateTimeFormat("es-UY", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).format(fechaFormateada);
    }

    const respuestasRecientes = cotizaciones
        .filter(
            (cotizacion) =>
                cotizacion.idEmpresa !== null &&
                cotizacion.nombreEmpresa !== null
        )
        .slice(0, 4);

    const handleEliminarProyecto = async (
        idProyecto: number,
        nombreProyecto: string
    ) => {
        const confirmado = window.confirm(
            `¿Seguro que querés eliminar el proyecto "${nombreProyecto}"?\n\nTambién se eliminarán sus cotizaciones asociadas. Esta acción no se puede deshacer.`
        );

        if (!confirmado) {
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/api/proyectos/${idProyecto}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                const data = await response.json().catch(() => null);

                throw new Error(
                    data?.message ||
                    data?.mensaje ||
                    "No se pudo eliminar el proyecto"
                );
            }

            setProyectos((prev) =>
                prev.filter(
                    (proyecto) => proyecto.idProyecto !== idProyecto
                )
            );
        } catch (error) {
            console.error("Error al eliminar proyecto:", error);

            alert(
                error instanceof Error
                    ? error.message
                    : "No se pudo eliminar el proyecto"
            );
        }
    };

    return (
        <div className="cliente-panel">
            <SidebarCliente
                menuOpen={menuOpen}
                onClose={() => setMenuOpen(false)}
            />

            <main className="cliente-main">
                <HeaderCliente
                    title={
                        cliente
                            ? `Hola, ${cliente.nombre} 👋`
                            : "Hola 👋"
                    }
                    subtitle="Bienvenido a tu espacio de proyectos y cotizaciones."
                    menuOpen={menuOpen}
                    onToggleMenu={() => setMenuOpen((prev) => !prev)}
                />

                <FlowCliente />

                <section className="content-grid">
                    <DashboardCard
                        title="Mis proyectos recientes"
                        linkText="Ver todos mis proyectos"
                        onViewAll={() => navigate("/panel-cliente/proyectos")}
                    >
                        {cargandoProyectos ? (
                            <p>Cargando proyectos...</p>
                        ) : proyectosRecientes.length === 0 ? (
                            <p className="dashboard-empty">
                                Todavía no tenés proyectos registrados.
                            </p>
                        ) : (
                            proyectosRecientes.map((proyecto) => (
                                <ProjectItem
                                    key={proyecto.idProyecto}
                                    image={
                                        proyecto.imagenUrl?.trim() ||
                                        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500"
                                    }
                                    name={proyecto.nombre}
                                    location={
                                        proyecto.ubicacion ||
                                        "Ubicación no especificada"
                                    }
                                    status={proyecto.estado}
                                    date={formatearFecha(
                                        proyecto.fechaCreacion
                                    )}
                                    onView={() =>
                                        navigate(
                                            `/panel-cliente/proyectos/${proyecto.idProyecto}`
                                        )
                                    }
                                    onEdit={() =>
                                        navigate(
                                            `/panel-cliente/proyectos/${proyecto.idProyecto}/editar`
                                        )
                                    }
                                    onDelete={() =>
                                        handleEliminarProyecto(
                                            proyecto.idProyecto,
                                            proyecto.nombre
                                        )
                                    }
                                />
                            ))
                        )}
                    </DashboardCard>

                    <DashboardCard
                        title="Mis cotizaciones recientes"
                        linkText="Ver todas mis cotizaciones"
                        onViewAll={() =>
                            navigate("/panel-cliente/cotizaciones")
                        }
                    >
                        {cargandoCotizaciones ? (
                            <p>Cargando cotizaciones...</p>
                        ) : cotizacionesRecientes.length === 0 ? (
                            <p className="dashboard-empty">
                                Todavía no tenés cotizaciones registradas.
                            </p>
                        ) : (
                            cotizacionesRecientes.map((cotizacion) => (
                                <QuoteItem
                                    key={cotizacion.idCotizacion}
                                    code={cotizacion.codigo}
                                    project={cotizacion.nombreProyecto}
                                    amount={
                                        cotizacion.precioEstimado !== null
                                            ? `${cotizacion.moneda} ${Number(
                                                cotizacion.precioEstimado
                                            ).toLocaleString("es-UY", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}`
                                            : "Sin precio"
                                    }
                                    date={formatearFecha(
                                        cotizacion.fechaCreacion
                                    )}
                                    tag={cotizacion.estado}
                                    onClick={() =>
                                        navigate(
                                            `/panel-cliente/cotizaciones/${cotizacion.idCotizacion}`
                                        )
                                    }
                                />
                            ))
                        )}
                    </DashboardCard>

                    <DashboardCard
                        title="Últimas respuestas recibidas"
                        linkText="Ver todas las respuestas"
                        onViewAll={() =>
                            navigate("/panel-cliente/comparador")
                        }
                    >
                        {cargandoCotizaciones ? (
                            <p>Cargando respuestas...</p>
                        ) : respuestasRecientes.length === 0 ? (
                            <p>No tienes respuestas de empresas todavía.</p>
                        ) : (
                            respuestasRecientes.map((respuesta) => (
                                <ResponseItem
                                    key={respuesta.idCotizacion}
                                    logo={
                                        respuesta.nombreEmpresa
                                            ?.substring(0, 2)
                                            .toUpperCase() || "EM"
                                    }
                                    company={
                                        respuesta.nombreEmpresa || "Empresa"
                                    }
                                    code={respuesta.codigo}
                                    status="Propuesta recibida"
                                    time={formatearFecha(
                                        respuesta.fechaActualizacion ||
                                        respuesta.fechaCreacion
                                    )}
                                />
                            ))
                        )}
                    </DashboardCard>

                </section>

            </main >
        </div >
    );
}
