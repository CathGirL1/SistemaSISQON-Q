import "../styles/PanelClienteContenido.css";
import SidebarCliente from "./cliente/SidebarCliente";
import HeaderCliente from "./cliente/HeaderCliente";
import FlowCliente from "./cliente/FlowCliente";


import ProjectItem from "./cliente/ProjectItem";



import DashboardCard from "./cliente/DashboardCard";

import QuoteItem from "./cliente/QuoteItem";


import ResponseItem from "./cliente/ResponseItem";
import {useEffect, useState, useMemo } from "react";

export default function PanelClienteContenido(){

    const [menuOpen, setMenuOpen] = useState(false);
     const [cliente, setCliente] = useState<{
        nombre: string;
        apellido: string;
    } | null>(null);

    const [proyectos, setProyectos] = useState<any[]>([]);
    const [cotizaciones, setCotizaciones] = useState<any[]>([]);

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
            }
    };
    obtenerDatosDashboard();}, []);

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


    return(
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
                        linkTo="/panel-cliente/proyectos"
                        >
                        {proyectosRecientes.length > 0 ? (
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
                            />
                            ))
                        ) : (
                            <p className="dashboard-empty">
                            Todavía no tenés proyectos registrados.
                            </p>
                        )}
                    </DashboardCard>

                                        
                    <DashboardCard
                        title="Mis cotizaciones recientes"
                        linkText="Ver todas mis cotizaciones"
                        linkTo="/panel-cliente/cotizaciones"
                    >
                        {cotizacionesRecientes.length > 0 ? (
                        cotizacionesRecientes.map((cotizacion) => (
                        <QuoteItem
                            key={cotizacion.idCotizacion}
                            code={cotizacion.codigo}
                            project={cotizacion.nombreProyecto}
                            amount={
                                cotizacion.precioEstimado !== null
                                ? `USD ${Number(
                                    cotizacion.precioEstimado
                                    ).toLocaleString("es-UY")}`
                                : "Sin precio"
                            }
                            amountUYU={
                                cotizacion.precioEstimadoUYU !== null
                                ? `$ ${Number(
                                    cotizacion.precioEstimadoUYU
                                    ).toLocaleString("es-UY")}`
                                : "Sin precio"
                            }
                            date={formatearFecha(
                                cotizacion.fechaCreacion
                            )}
                            tag={cotizacion.estado}
                        />
                        ))
                        ) : (
                        <p className="dashboard-empty">
                            Todavía no tenés cotizaciones registradas.
                        </p>
                        )}
                    </DashboardCard>

                
                
                    <section
                        title="Últimas respuestas recibidas"
                       
                    >
                        <ResponseItem
                            logo="ABC"
                            company="Constructora ABC"
                            code="CTZ-2024-0007"
                            status="Propuesta recibida"
                            time="Hoy, 10:30"
                        />

                        <ResponseItem
                            logo="NORTE"
                            company="Construcciones del Norte"
                            code="CTZ-2024-0007"
                            status="Propuesta recibida"
                            time="Ayer, 16:45"
                        />

                        <ResponseItem
                            logo="HC"
                            company="Hogar Construcciones"
                            code="CTZ-2024-0006"
                            status="En revisión"
                            time="Ayer, 11:20"
                        />

                        <ResponseItem
                            logo="OS"
                            company="Obras y Servicios SRL"
                            code="CTZ-2024-0005"
                            status="Rechazada"
                            time="20/05/2024"
                        />
                    </section>
                </section>

                
                

            </main>
        </div>
    ); 
}
