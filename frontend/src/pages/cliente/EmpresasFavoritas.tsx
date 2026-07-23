import { useState } from "react";
import {
  Search,
  ChevronDown,
  Heart,
  Star,
  MapPin,
  ShieldCheck,
  Eye,
  Send,
  Trash2,
  FolderHeart,
} from "lucide-react";

import SidebarCliente from "../../components/cliente/SidebarCliente";
import HeaderCliente from "../../components/cliente/HeaderCliente";

import "../../styles/PanelClienteContenido.css";
import "../../styles/EmpresasFavoritas.css";

interface EmpresaFavorita {
  id: number;
  nombre: string;
  iniciales: string;
  especialidad: string;
  ubicacion: string;
  descripcion: string;
  calificacion: string;
  reseñas: number;
  proyectos: number;
  experiencia: string;
  imagen: string;
  servicios: string[];
  disponible: boolean;
}

const empresasFavoritas: EmpresaFavorita[] = [
  {
    id: 1,
    nombre: "Constructora ABC",
    iniciales: "ABC",
    especialidad: "Quinchos y terrazas",
    ubicacion: "Maldonado, Uruguay",
    descripcion:
      "Especialistas en quinchos, barbacoas, pérgolas y espacios exteriores.",
    calificacion: "4.8",
    reseñas: 42,
    proyectos: 68,
    experiencia: "12 años",
    imagen:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900",
    servicios: ["Quinchos", "Terrazas", "Pérgolas"],
    disponible: true,
  },
  {
    id: 2,
    nombre: "Madera Sur",
    iniciales: "MS",
    especialidad: "Estructuras de madera",
    ubicacion: "Rocha, Uruguay",
    descripcion:
      "Construcción de decks, techos, pérgolas y estructuras en madera.",
    calificacion: "4.7",
    reseñas: 31,
    proyectos: 46,
    experiencia: "8 años",
    imagen:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=900",
    servicios: ["Decks", "Madera", "Pérgolas"],
    disponible: true,
  },
  {
    id: 3,
    nombre: "Estudio Obra Moderna",
    iniciales: "EOM",
    especialidad: "Arquitectura y diseño",
    ubicacion: "Maldonado, Uruguay",
    descripcion:
      "Proyectos contemporáneos con asesoramiento arquitectónico integral.",
    calificacion: "4.9",
    reseñas: 48,
    proyectos: 59,
    experiencia: "11 años",
    imagen:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900",
    servicios: ["Diseño", "Arquitectura", "Dirección de obra"],
    disponible: false,
  },
];

export default function EmpresasFavoritas() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [favoritas, setFavoritas] = useState(empresasFavoritas);

  const favoritasFiltradas = favoritas.filter((empresa) => {
    const texto = `${empresa.nombre} ${empresa.especialidad} ${empresa.ubicacion}`;

    return texto.toLowerCase().includes(busqueda.toLowerCase());
  });

  const eliminarFavorita = (id: number) => {
    setFavoritas((actuales) =>
      actuales.filter((empresa) => empresa.id !== id),
    );
  };

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

        <section className="favoritas-heading">
          <div>
            <h2>Mis empresas favoritas</h2>
            <p>
              Revisá sus perfiles y solicitá cotizaciones cuando lo necesites.
            </p>
          </div>

          <div className="favoritas-total">
            <FolderHeart size={20} />
            <strong>{favoritas.length}</strong>
            <span>empresas guardadas</span>
          </div>
        </section>

        <section className="favoritas-toolbar">
          <label className="favoritas-search">
            <Search size={19} />

            <input
              type="search"
              placeholder="Buscar empresa favorita..."
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
            />
          </label>

          <button type="button" className="favoritas-filter">
            Todas las especialidades
            <ChevronDown size={17} />
          </button>

          <button type="button" className="favoritas-filter">
            Todas las ubicaciones
            <ChevronDown size={17} />
          </button>

          <button type="button" className="favoritas-filter">
            Mejor calificadas
            <ChevronDown size={17} />
          </button>
        </section>

        {favoritasFiltradas.length > 0 ? (
          <section className="favoritas-grid">
            {favoritasFiltradas.map((empresa) => (
              <article className="favorita-card" key={empresa.id}>
                <div className="favorita-cover">
                  <img src={empresa.imagen} alt={empresa.nombre} />

                  <span className="favorita-verified">
                    <ShieldCheck size={14} />
                    Verificada
                  </span>

                  <button
                    type="button"
                    className="favorita-remove"
                    onClick={() => eliminarFavorita(empresa.id)}
                    aria-label={`Quitar ${empresa.nombre} de favoritas`}
                  >
                    <Heart size={19} fill="currentColor" />
                  </button>
                </div>

                <div className="favorita-body">
                  <div className="favorita-identity">
                    <div className="favorita-logo">
                      {empresa.iniciales}
                    </div>

                    <div>
                      <h3>{empresa.nombre}</h3>
                      <span>{empresa.especialidad}</span>
                    </div>
                  </div>

                  <div className="favorita-location">
                    <MapPin size={15} />
                    <span>{empresa.ubicacion}</span>
                  </div>

                  <p className="favorita-description">
                    {empresa.descripcion}
                  </p>

                  <div className="favorita-services">
                    {empresa.servicios.map((servicio) => (
                      <span key={servicio}>{servicio}</span>
                    ))}
                  </div>

                  <div className="favorita-metrics">
                    <div>
                      <span>Calificación</span>
                      <strong className="favorita-rating">
                        <Star size={15} fill="currentColor" />
                        {empresa.calificacion}
                        <small>({empresa.reseñas})</small>
                      </strong>
                    </div>

                    <div>
                      <span>Proyectos</span>
                      <strong>{empresa.proyectos}</strong>
                    </div>

                    <div>
                      <span>Experiencia</span>
                      <strong>{empresa.experiencia}</strong>
                    </div>
                  </div>

                  <div className="favorita-availability">
                    <span
                      className={
                        empresa.disponible
                          ? "favorita-dot available"
                          : "favorita-dot unavailable"
                      }
                    />

                    {empresa.disponible
                      ? "Disponible para nuevos proyectos"
                      : "Agenda completa temporalmente"}
                  </div>

                  <div className="favorita-actions">
                    <button type="button">
                      <Eye size={16} />
                      Ver perfil
                    </button>

                    <button
                      type="button"
                      className="favorita-primary"
                      disabled={!empresa.disponible}
                    >
                      <Send size={16} />
                      Solicitar cotización
                    </button>

                    <button
                      type="button"
                      className="favorita-delete"
                      onClick={() => eliminarFavorita(empresa.id)}
                    >
                      <Trash2 size={16} />
                      Quitar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section className="favoritas-empty">
            <div className="favoritas-empty-icon">
              <Heart size={34} />
            </div>

            <h3>No encontrás empresas favoritas</h3>

            <p>
              Guardá empresas desde el listado general para acceder a ellas
              rápidamente.
            </p>

            <button type="button">
              Explorar empresas
            </button>
          </section>
        )}

        <footer className="favoritas-results">
          Mostrando {favoritasFiltradas.length} de {favoritas.length} favoritas
        </footer>
      </main>
    </div>
  );
}