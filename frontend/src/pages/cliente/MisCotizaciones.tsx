import { useState } from "react";
import {
  Search,
  ChevronDown,
  CalendarDays,
  FileText,
  Clock3,
  Send,
  ClipboardCheck,
  CircleCheck,
  CircleX,
  Plus,
  Eye,
  Download,
  Pencil,
} from "lucide-react";

import SidebarCliente from "../../components/cliente/SidebarCliente";
import "../../styles/PanelClienteContenido.css";
import "../../styles/MisCotizaciones.css";

type EstadoCotizacion =
  | "Pendiente"
  | "Enviada"
  | "Revisada"
  | "Aprobada"
  | "Rechazada";

interface Cotizacion {
  id: number;
  codigo: string;
  nombre: string;
  imagen: string;
  fecha: string;
  hora: string;
  tipo: string;
  superficie: string;
  estado: EstadoCotizacion;
  precio: string;
}

const cotizaciones: Cotizacion[] = [
  {
    id: 1,
    codigo: "COT-2024-0012",
    nombre: "Quincho en patio trasero",
    imagen:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200",
    fecha: "28 May 2024",
    hora: "10:30",
    tipo: "Quincho",
    superficie: "30,00 m²",
    estado: "Pendiente",
    precio: "$ 6.890.000",
  },
  {
    id: 2,
    codigo: "COT-2024-0011",
    nombre: "Reforma cocina",
    imagen:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=200",
    fecha: "26 May 2024",
    hora: "16:45",
    tipo: "Reforma",
    superficie: "18,00 m²",
    estado: "Enviada",
    precio: "$ 3.450.000",
  },
  {
    id: 3,
    codigo: "COT-2024-0010",
    nombre: "Construcción casa",
    imagen:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=200",
    fecha: "24 May 2024",
    hora: "09:15",
    tipo: "Construcción general",
    superficie: "120,00 m²",
    estado: "Revisada",
    precio: "$ 24.750.000",
  },
  {
    id: 4,
    codigo: "COT-2024-0009",
    nombre: "Quincho rústico",
    imagen:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200",
    fecha: "20 May 2024",
    hora: "11:20",
    tipo: "Quincho",
    superficie: "25,00 m²",
    estado: "Aprobada",
    precio: "$ 5.980.000",
  },
  {
    id: 5,
    codigo: "COT-2024-0008",
    nombre: "Ampliación y reforma",
    imagen:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=200",
    fecha: "18 May 2024",
    hora: "14:10",
    tipo: "Reforma",
    superficie: "35,00 m²",
    estado: "Rechazada",
    precio: "$ 8.200.000",
  },
  {
    id: 6,
    codigo: "COT-2024-0007",
    nombre: "Quincho con parrilla",
    imagen:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=200",
    fecha: "15 May 2024",
    hora: "08:30",
    tipo: "Quincho",
    superficie: "22,00 m²",
    estado: "Enviada",
    precio: "$ 4.950.000",
  },
];

export default function MisCotizaciones() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const cotizacionesFiltradas = cotizaciones.filter((cotizacion) => {
    const texto = `${cotizacion.codigo} ${cotizacion.nombre} ${cotizacion.tipo}`;
    return texto.toLowerCase().includes(busqueda.toLowerCase());
  });

  return (
    <div className="cliente-panel">
      <SidebarCliente
        menuOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <main className="cliente-main">
       

        <section className="cotizaciones-heading">
          <div>
            <h2>Mis cotizaciones</h2>
            <p>
              Consultá, filtrá y gestioná todas tus cotizaciones desde un solo
              lugar.
            </p>
          </div>

          <button type="button" className="nueva-cotizacion-button">
            <Plus size={20} />
            Nueva cotización
          </button>
        </section>

        <section className="cotizaciones-stats">
          <StatCard
            icon={<FileText size={24} />}
            value="12"
            label="Total cotizaciones"
            variant="blue"
          />

          <StatCard
            icon={<Clock3 size={24} />}
            value="3"
            label="Pendientes"
            variant="orange"
          />

          <StatCard
            icon={<Send size={24} />}
            value="4"
            label="Enviadas"
            variant="blue"
          />

          <StatCard
            icon={<ClipboardCheck size={24} />}
            value="3"
            label="Revisadas"
            variant="purple"
          />

          <StatCard
            icon={<CircleCheck size={24} />}
            value="1"
            label="Aprobadas"
            variant="green"
          />

          <StatCard
            icon={<CircleX size={24} />}
            value="1"
            label="Rechazadas"
            variant="red"
          />
        </section>

        <section className="cotizaciones-filters">
          <label className="cotizaciones-search">
            <Search size={19} />

            <input
              type="search"
              placeholder="Buscar cotización..."
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
            />
          </label>

          <button type="button" className="filter-button">
            Todos los tipos
            <ChevronDown size={17} />
          </button>

          <button type="button" className="filter-button">
            Todos los estados
            <ChevronDown size={17} />
          </button>

          <button type="button" className="filter-button date-filter">
            <CalendarDays size={18} />
            Fecha: más reciente
          </button>
        </section>

        <section className="cotizaciones-table-card">
          <div className="cotizaciones-table-wrapper">
            <table className="cotizaciones-table">
              <thead>
                <tr>
                  <th>Cotización</th>
                  <th>Fecha</th>
                  <th>Tipo de obra</th>
                  <th>Superficie</th>
                  <th>Estado</th>
                  <th>Precio estimado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {cotizacionesFiltradas.map((cotizacion) => (
                  <tr key={cotizacion.id}>
                    <td>
                      <div className="cotizacion-info">
                        <img
                          src={cotizacion.imagen}
                          alt={cotizacion.nombre}
                        />

                        <div>
                          <strong>{cotizacion.codigo}</strong>
                          <span>{cotizacion.nombre}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="table-double-line">
                        <strong>{cotizacion.fecha}</strong>
                        <span>{cotizacion.hora}</span>
                      </div>
                    </td>

                    <td>{cotizacion.tipo}</td>

                    <td>{cotizacion.superficie}</td>

                    <td>
                      <EstadoBadge estado={cotizacion.estado} />
                    </td>

                    <td className="cotizacion-precio">
                      {cotizacion.precio}
                    </td>

                    <td>
                      <div className="cotizacion-actions">
                        <button type="button">
                          <Eye size={16} />
                          Ver detalle
                        </button>

                        <button type="button">
                          <Download size={16} />
                          PDF
                        </button>

                        <button type="button">
                          <Send size={16} />
                          Enviar
                        </button>

                        <button type="button">
                          <Pencil size={16} />
                          Modificar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <footer className="cotizaciones-pagination">
            <span>
              Mostrando 1 a {cotizacionesFiltradas.length} de 12 cotizaciones
            </span>

            <div className="pagination-buttons">
              <button type="button">‹</button>
              <button type="button" className="active">
                1
              </button>
              <button type="button">2</button>
              <button type="button">›</button>
            </div>

            <button type="button" className="rows-button">
              10 por página
              <ChevronDown size={16} />
            </button>
          </footer>
        </section>

        
      </main>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  variant: "blue" | "orange" | "purple" | "green" | "red";
}

function StatCard({
  icon,
  value,
  label,
  variant,
}: StatCardProps) {
  return (
    <article className="cotizacion-stat-card">
      <div className={`stat-icon stat-${variant}`}>{icon}</div>

      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </article>
  );
}

function EstadoBadge({ estado }: { estado: EstadoCotizacion }) {
  const className = `estado-badge estado-${estado
    .toLowerCase()
    .replace("ó", "o")}`;

  return <span className={className}>{estado}</span>;
}