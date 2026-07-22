import "../styles/PanelClienteContenido.css";
import SidebarCliente from "./cliente/SidebarCliente";
import HeaderCliente from "./cliente/HeaderCliente";
import FlowCliente from "./cliente/FlowCliente";
import DashboardCard from "./cliente/DashboardCard";
import ProjectItem from "./cliente/ProjectItem";
import QuoteItem from "./cliente/QuoteItem";
import CompanyItem from "./cliente/CompanyItem";
import ResponseItem from "./cliente/ResponseItem";
import { useState } from "react";

export default function PanelClienteContenido(){

    const [menuOpen, setMenuOpen] = useState(false);

    return(
        <div className="cliente-panel">
            <SidebarCliente
                menuOpen={menuOpen}
                onClose={() => setMenuOpen(false)}
            />

            <main className="cliente-main">
                <HeaderCliente
                    title="Hola, Nicolás 👋"
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
                    title="Empresas favoritas"
                    linkText="Ver todas mis favoritas"
                >
                    <CompanyItem
                        logo="ABC"
                        name="Constructora ABC"
                        category="Quinchos y Terrazas"
                        rating="4.8"
                    />

                    <CompanyItem
                        logo="NORTE"
                        name="Construcciones del Norte"
                        category="Ampliaciones y Obras"
                        rating="4.6"
                    />

                    <CompanyItem
                        logo="HC"
                        name="Hogar Construcciones"
                        category="Remodelaciones"
                        rating="4.5"
                    />

                    <CompanyItem
                        logo="OS"
                        name="Obras y Servicios SRL"
                        category="Construcción en general"
                        rating="4.3"
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
