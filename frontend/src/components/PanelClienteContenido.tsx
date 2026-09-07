import "../styles/PanelClienteContenido.css";
import SidebarCliente from "./cliente/SidebarCliente";
import HeaderCliente from "./cliente/HeaderCliente";
import FlowCliente from "./cliente/FlowCliente";


import ProjectItem from "./cliente/ProjectItem";



import DashboardCard from "./cliente/DashboardCard";

import QuoteItem from "./cliente/QuoteItem";


import ResponseItem from "./cliente/ResponseItem";
import {useEffect, useState } from "react";

export default function PanelClienteContenido(){

    const [menuOpen, setMenuOpen] = useState(false);
     const [cliente, setCliente] = useState<{
        nombre: string;
        apellido: string;
    } | null>(null);

    useEffect(() => {
        const usuarioGuardado = localStorage.getItem("usuario");

        if (!usuarioGuardado) return;

        const usuario = JSON.parse(usuarioGuardado);

        if (!usuario.id_Cliente) return;

        const obtenerCliente = async () => {
            try {
                const respuesta = await fetch(
                    `http://localhost:3000/api/clientes/${usuario.id_Cliente}`
                );

                if (!respuesta.ok) {
                    throw new Error("No se pudo obtener el cliente");
                }

                const datosCliente = await respuesta.json();

                setCliente(datosCliente);

            } catch (error) {
                console.error(
                    "Error al obtener datos del cliente:",
                    error
                );
            }
        };

        obtenerCliente();

    }, []);


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
                    >
                        <ProjectItem
                            image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200"
                            name="Quincho familiar"
                            location="La Serena, IV Región"
                            status="Activo"
                        />

                        <ProjectItem
                            image="https://images.unsplash.com/photo-1556911220-bff31c812dba?w=200"
                            name="Ampliación cocina"
                            location="Coquimbo, IV Región"
                            status="Activo"
                        />

                        <ProjectItem
                            image="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=200"
                            name="Remodelación baño"
                            location="La Serena, IV Región"
                            status="Borrador"
                        />

                        <ProjectItem
                            image="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200"
                            name="Terraza y pérgola"
                            location="Coquimbo, IV Región"
                            status="Activo"
                        />
                    </DashboardCard>

                    <DashboardCard
                        title="Mis cotizaciones recientes"
                        linkText="Ver todas mis cotizaciones"
                    >
                    <QuoteItem
                        code="CTZ-2024-0007"
                        project="Quincho Familiar"
                        amount="$ 2.450.000"
                        date="28/05/2024"
                        tag="Estándar"
                    />

                    <QuoteItem
                        code="CTZ-2024-0006"
                        project="Ampliación Cocina"
                        amount="$ 1.780.000"
                        date="26/05/2024"
                        tag="Económica"
                    />

                    <QuoteItem
                        code="CTZ-2024-0005"
                        project="Ampliación Cocina"
                        amount="$ 2.950.000"
                        date="26/05/2024"
                        tag="Premium"
                    />

                    <QuoteItem
                        code="CTZ-2024-0004"
                        project="Remodelación Baño"
                        amount="$ 1.250.000"
                        date="24/05/2024"
                        tag="Estándar"
                    />
                </DashboardCard>

                

                    <DashboardCard
                        title="Últimas respuestas recibidas"
                        linkText="Ver todas las respuestas"
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
                    </DashboardCard>
                </section>

    


              

                

            </main>
        </div>
    ); 
}
