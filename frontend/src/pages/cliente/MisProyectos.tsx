import { useEffect, useState } from "react";
import {
  Search,
  ChevronDown,
  Plus,
  FolderOpen,
  Clock3,
  CircleCheck,
  CircleDashed,
  Eye,
  Pencil,
  FileText,
  MoreVertical,
} from "lucide-react";

import SidebarCliente from "../../components/cliente/SidebarCliente";
import { useNavigate } from "react-router-dom";

import "../../styles/PanelClienteContenido.css";
import "../../styles/MisProyectos.css";

type EstadoProyecto =
  | "Activo"
  | "Borrador"
  | "Finalizado"
  | "Pendiente";

interface Proyecto {
  id_Proyecto: number;
  nombre: string;
  estado: EstadoProyecto;
  alto: number;
  ancho: number;
  largo: number;
  fechaCreacion: string;
  tipoObra: string;
}

export default function MisProyectos() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const [proyectos, setProyectos] = useState<Proyecto[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
      const cargarProyectos = async () => {
        try {
          const usuario = JSON.parse(
            localStorage.getItem("usuario") || "{}"
          );

          const respuesta = await fetch(
            `http://localhost:3000/api/crearProyecto/obtenerProyectos/${usuario.id_Cliente}`
          );

          const datos = await respuesta.json();

          setProyectos(datos);
        } catch (error) {
          console.error("Error al cargar proyectos:", error);
        }
      };

      cargarProyectos();
    }, []);

    const proyectosFiltrados = proyectos.filter((proyecto) => {
      const texto = `${proyecto.nombre} ${proyecto.tipoObra} ${proyecto.estado}`;
      return texto.toLowerCase().includes(busqueda.toLowerCase());
    });

    const proyectosActivos = proyectos.filter(
      (p) => p.estado === "Activo"
    ).length;

    const proyectosPendientes = proyectos.filter(
      (p) => p.estado === "Pendiente"
    ).length;

    const proyectosFinalizados = proyectos.filter(
      (p) => p.estado === "Finalizado"
    ).length;

    return (
      <>
        <div className="cliente-panel">
          <SidebarCliente
            menuOpen={menuOpen}
            onClose={() => setMenuOpen(false)}
          />

        <main className="cliente-main">

          <section className="proyectos-heading">
            <div>
              <h2>Mis proyectos</h2>
              <p>
                Gestioná, editá y revisá todos tus proyectos.
              </p>
            </div>

            <button
              type="button"
              className="nuevo-proyecto-button"
              onClick={() => navigate("/registro-proyecto")}
            >
              <Plus size={20} />
              Crear nuevo proyecto
            </button>
          </section>

          <section className="proyectos-stats">

            <StatCard
              icon={<FolderOpen size={23} />}
              value={proyectos.length.toString()}
              label="Total proyectos"
              variant="blue"
            />

            <StatCard
              icon={<CircleDashed size={23} />}
              value={proyectosActivos.toString()}
              label="Activos"
              variant="green"
            />

            <StatCard
              icon={<Clock3 size={23} />}
              value={proyectosPendientes.toString()}
              label="Pendientes"
              variant="orange"
            />

            <StatCard
              icon={<CircleCheck size={23} />}
              value={proyectosFinalizados.toString()}
              label="Finalizados"
              variant="purple"
            />

          </section>

          <section className="proyectos-filters">

            <label className="proyectos-search">

              <Search size={19} />

              <input
                type="search"
                placeholder="Buscar proyecto..."
                value={busqueda}
                onChange={(event) =>
                  setBusqueda(event.target.value)
                }
              />

            </label>

            <button
              type="button"
              className="proyecto-filter-button"
            >
              Todos los tipos
              <ChevronDown size={17} />
            </button>

            <button
              type="button"
              className="proyecto-filter-button"
            >
              Todos los estados
              <ChevronDown size={17} />
            </button>

            <button
              type="button"
              className="proyecto-filter-button"
            >
              Más recientes
              <ChevronDown size={17} />
            </button>

          </section>

          <section className="proyectos-grid">

            {proyectosFiltrados.map((proyecto) => (

              <article
                className="proyecto-card"
                key={proyecto.id_Proyecto}
              >

                <div className="proyecto-card-image">

                  <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700"
                    alt={proyecto.nombre}
                  />

                  <EstadoProyectoBadge
                    estado={proyecto.estado}
                  />

                  <button
                    type="button"
                    className="proyecto-options"
                  >
                    <MoreVertical size={19} />
                  </button>

                </div>

                <div className="proyecto-card-content">

                  <div className="proyecto-card-title">

                    <div>

                      <h3>{proyecto.nombre}</h3>

                      <p>
                        Proyecto N° {proyecto.id_Proyecto}
                      </p>

                    </div>

                  </div>

                  <div className="proyecto-details">

                    <div>

                      <span>Tipo de obra</span>

                      <strong>{proyecto.tipoObra}</strong>

                    </div>

                    <div>

                      <span>Superficie</span>

                      <strong>
                        {proyecto.ancho * proyecto.largo} m²
                      </strong>

                    </div>

                    <div>

                      <span>Actualizado</span>

                      <strong>
                        {new Date(
                          proyecto.fechaCreacion
                        ).toLocaleDateString()}
                      </strong>

                    </div>

                    <div>

                      <span>Cotizaciones</span>

                      <strong>0</strong>

                    </div>

                  </div>

                  <div className="proyecto-card-actions">

                    <button
                      type="button"
                      className="primary-action"
                    >
                      <Eye size={16} />
                      Ver detalle
                    </button>

                    <button type="button">
                      <Pencil size={16} />
                      Editar
                    </button>

                    <button type="button">
                      <FileText size={16} />
                      Cotizar
                    </button>

                  </div>

                </div>

              </article>

            ))}

          </section>

        </main>

      </div>
      </>
    
    );
  }
  interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  variant: "blue" | "green" | "orange" | "purple";
}

function StatCard({
  icon,
  value,
  label,
  variant,
}: StatCardProps) {
  return (
    <article className="proyecto-stat-card">
      <div className={`proyecto-stat-icon proyecto-stat-${variant}`}>
        {icon}
      </div>

      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </article>
  );
}

interface EstadoProyectoBadgeProps {
  estado: EstadoProyecto;
}

function EstadoProyectoBadge({
  estado,
}: EstadoProyectoBadgeProps) {
  const clase = `proyecto-status proyecto-status-${estado.toLowerCase()}`;

  return (
    <span className={clase}>
      {estado}
    </span>
  );
}