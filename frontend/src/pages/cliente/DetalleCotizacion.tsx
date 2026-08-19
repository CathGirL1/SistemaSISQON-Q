import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Trash2,
  FileText,
  CalendarDays,
  FolderOpen,
  Ruler,
  MapPin,
  Package,
} from "lucide-react";

import { type ProyectoAPI } from "../cliente/MisProyectos";

import SidebarCliente from "../../components/cliente/SidebarCliente";
import HeaderCliente from "../../components/cliente/HeaderCliente";

import {
  formatearPrecioUYU,
  formatearPrecioUSD,
} from "../../utilities/formatoMoneda";

import "../../styles/PanelClienteContenido.css";
import "../../styles/DetalleCotizacion.css";

// =========================================================
// ESTADOS
// =========================================================

type EstadoCotizacion =
  | "Borrador"
  | "Enviada"
  | "Revisada"
  | "Aceptada"
  | "Rechazada";

// =========================================================
// INTERFAZ COTIZACIÓN
// =========================================================

interface Cotizacion {
  idCotizacion: number;
  idProyecto: number;
  codigo: string;

  fechaCreacion: string;
  fechaActualizacion: string | null;

  version: number;
  estado: EstadoCotizacion;

  // Precio original en USD
  precioEstimado: number | null;

  // Precio convertido a UYU
  precioEstimadoUYU: number | null;

  // Tipo de cambio utilizado
  tipoCambio: number;

  moneda: string;

  observaciones: string | null;

  // CLIENTE
  idCliente: number;

  // PROYECTO
  idTipoObra: number;
  nombreProyecto: string;
  descripcionProyecto: string | null;
  ubicacion: string | null;

  alto: number;
  ancho: number;
  largo: number;
  superficie: number;

  // MATERIALES
  resumenMateriales: string;

  materiales: {
    idMaterialProyecto: number;
    idProyecto: number;
    idMaterial: number;
    cantidad: number;
    nombre: string;
    costoUnitario: number;
    unidad: string;
    subtotal: number;
  }[];
}

// =========================================================
// RESPUESTA API
// =========================================================

interface RespuestaAPI {
  mensaje?: string;
}

// =========================================================
// API
// =========================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000";

// =========================================================
// COMPONENTE PRINCIPAL
// =========================================================

export default function DetalleCotizacion() {
  const navigate = useNavigate();

  const { idCotizacion } = useParams();

  // =======================================================
  // ESTADOS
  // =======================================================

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [cotizacion, setCotizacion] =
    useState<Cotizacion | null>(null);

  const [proyecto, setProyecto] =
    useState<ProyectoAPI | null>(null);

  const [cargando, setCargando] =
    useState(true);

  const [eliminando, setEliminando] =
    useState(false);

  const [mostrarConfirmacion, setMostrarConfirmacion] =
    useState(false);

  const [error, setError] =
    useState("");

  // =======================================================
  // OBTENER COTIZACIÓN
  // =======================================================

  useEffect(() => {
    obtenerCotizacion();
  }, [idCotizacion]);

  const obtenerCotizacion = async () => {
    try {
      setCargando(true);
      setError("");

      if (!idCotizacion) {
        throw new Error(
          "El ID de la cotización no es válido"
        );
      }

      // ---------------------------------------------------
      // OBTENER COTIZACIÓN
      // ---------------------------------------------------

      const response = await fetch(
        `${API_URL}/api/cotizaciones/${idCotizacion}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.mensaje ||
            "No se pudo obtener la cotización"
        );
      }

      const cotizacionRecibida: Cotizacion =
        data;

      console.log(
        "COTIZACIÓN RECIBIDA:",
        cotizacionRecibida
      );

      console.log(
        "MATERIALES DE LA COTIZACIÓN:",
        cotizacionRecibida.materiales
      );

      setCotizacion(
        cotizacionRecibida
      );

      // ---------------------------------------------------
      // OBTENER PROYECTO RELACIONADO
      // ---------------------------------------------------

      const responseProyecto =
        await fetch(
          `${API_URL}/api/proyectos/${cotizacionRecibida.idProyecto}`
        );

      if (responseProyecto.ok) {
        const proyectoRecibido: ProyectoAPI =
          await responseProyecto.json();

        setProyecto(
          proyectoRecibido
        );
      }

    } catch (error) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al cargar la cotización";

      setError(mensaje);

    } finally {
      setCargando(false);
    }
  };

  // =======================================================
  // ELIMINAR COTIZACIÓN
  // =======================================================

  const eliminarCotizacion = async () => {
    if (!idCotizacion) {
      return;
    }

    try {
      setEliminando(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/cotizaciones/${idCotizacion}`,
        {
          method: "DELETE",
        }
      );

      const data: RespuestaAPI =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.mensaje ||
            "No se pudo eliminar la cotización"
        );
      }

      navigate(
        "/panel-cliente/cotizaciones"
      );

    } catch (error) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al eliminar la cotización";

      setError(mensaje);

      setMostrarConfirmacion(
        false
      );

    } finally {
      setEliminando(false);
    }
  };

  // =======================================================
  // CARGANDO
  // =======================================================

  if (cargando) {
    return (
      <EstructuraDetalle
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      >
        <div className="detalle-cotizacion-feedback">
          Cargando cotización...
        </div>
      </EstructuraDetalle>
    );
  }

  // =======================================================
  // ERROR
  // =======================================================

  if (error && !cotizacion) {
    return (
      <EstructuraDetalle
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      >
        <div className="detalle-cotizacion-feedback">

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/panel-cliente/cotizaciones"
              )
            }
          >
            Volver a Mis cotizaciones
          </button>

        </div>
      </EstructuraDetalle>
    );
  }

  if (!cotizacion) {
    return null;
  }

  // =======================================================
  // VISTA PRINCIPAL
  // =======================================================

  return (
    <div className="cliente-panel">

      {/* ================================================= */}
      {/* SIDEBAR */}
      {/* ================================================= */}

      <SidebarCliente
        menuOpen={menuOpen}
        onClose={() =>
          setMenuOpen(false)
        }
      />

      <main className="cliente-main">

        {/* ================================================= */}
        {/* ENCABEZADO */}
        {/* ================================================= */}

        <section className="detalle-cotizacion-top">

          <button
            type="button"
            className="detalle-cotizacion-back"
            onClick={() =>
              navigate(
                "/panel-cliente/cotizaciones"
              )
            }
          >
            <ArrowLeft size={18} />

            Volver a Mis cotizaciones
          </button>

          <div className="detalle-cotizacion-header">

            <div>

              <div className="detalle-cotizacion-title-row">

                <h2>
                  {cotizacion.codigo}
                </h2>

                <EstadoBadge
                  estado={cotizacion.estado}
                />

              </div>

              <p>
                {cotizacion.nombreProyecto}
              </p>

            </div>

            <div className="detalle-cotizacion-actions">

              <button
                type="button"
                className="detalle-cotizacion-project-button"
                onClick={() =>
                  navigate(
                    `/panel-cliente/proyectos/${cotizacion.idProyecto}`
                  )
                }
              >
                <FolderOpen size={17} />

                Ver proyecto
              </button>

              <button
                type="button"
                className="detalle-cotizacion-delete-button"
                onClick={() =>
                  setMostrarConfirmacion(
                    true
                  )
                }
              >
                <Trash2 size={17} />

                Eliminar
              </button>

            </div>

          </div>

        </section>

        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {error && (
          <div className="detalle-cotizacion-error">
            {error}
          </div>
        )}

        {/* ================================================= */}
        {/* CONTENIDO */}
        {/* ================================================= */}

        <section className="detalle-cotizacion-content">

          {/* ================================================= */}
          {/* INFORMACIÓN DE COTIZACIÓN */}
          {/* ================================================= */}

          <article className="detalle-cotizacion-card">

            <CardTitle
              icon={
                <FileText size={21} />
              }
              title="Información de la cotización"
            />

            <div className="detalle-cotizacion-info-grid">

              <InfoItem
                label="Código"
                value={
                  cotizacion.codigo
                }
              />

              <InfoItem
                label="Estado"
                value={
                  cotizacion.estado
                }
              />

              <InfoItem
                label="Versión"
                value={`${cotizacion.version}`}
              />

              <InfoItem
                label="Fecha de creación"
                value={formatearFecha(
                  cotizacion.fechaCreacion
                )}
                icon={
                  <CalendarDays size={16} />
                }
              />

              <InfoItem
                label="Última actualización"
                value={
                  cotizacion.fechaActualizacion
                    ? formatearFecha(
                        cotizacion.fechaActualizacion
                      )
                    : "Sin modificaciones"
                }
              />

              {/* ================================================= */}
              {/* PRECIO ESTIMADO */}
              {/* ================================================= */}

              <div className="detalle-cotizacion-info-item">

                <span>
                  Precio estimado
                </span>

                <strong className="detalle-cotizacion-precio">

                  <div className="precio-doble">

                    <span>
                      {formatearPrecioUYU(
                        cotizacion.precioEstimadoUYU
                      )}{" "}
                      UYU
                    </span>

                    <small>
                      (
                      {formatearPrecioUSD(
                        cotizacion.precioEstimado
                      )}{" "}
                      USD)
                    </small>

                  </div>

                </strong>

              </div>

              {/* ================================================= */}
              {/* OBSERVACIONES */}
              {/* ================================================= */}

              <div className="detalle-cotizacion-description">

                <span>
                  Observaciones
                </span>

                <p>
                  {cotizacion.observaciones ||
                    "Sin observaciones"}
                </p>

              </div>

            </div>

          </article>

          {/* ================================================= */}
          {/* PROYECTO RELACIONADO */}
          {/* ================================================= */}

          <article className="detalle-cotizacion-card">

            <CardTitle
              icon={
                <FolderOpen size={21} />
              }
              title="Proyecto relacionado"
            />

            <div className="detalle-cotizacion-info-grid">

              <InfoItem
                label="Proyecto"
                value={
                  cotizacion.nombreProyecto
                }
              />

              <InfoItem
                label="Ubicación"
                value={
                  cotizacion.ubicacion ||
                  "No especificada"
                }
                icon={
                  <MapPin size={16} />
                }
              />

              <InfoItem
                label="Tipo de obra"
                value={
                  proyecto?.tipoObra ??
                  "No especificado"
                }
              />

              <InfoItem
                label="Superficie"
                value={`${formatearNumero(
                  cotizacion.superficie
                )} m²`}
                icon={
                  <Ruler size={16} />
                }
              />

            </div>

            {/* ================================================= */}
            {/* DIMENSIONES */}
            {/* ================================================= */}

            <div className="detalle-cotizacion-measures">

              <MeasureItem
                label="Alto"
                value={`${cotizacion.alto} m`}
              />

              <MeasureItem
                label="Ancho"
                value={`${cotizacion.ancho} m`}
              />

              <MeasureItem
                label="Largo"
                value={`${cotizacion.largo} m`}
              />

            </div>

          </article>

          {/* ================================================= */}
          {/* MATERIALES */}
          {/* ================================================= */}

          <article className="detalle-cotizacion-card">

            <CardTitle
              icon={
                <Package size={21} />
              }
              title="Materiales utilizados"
            />

            {cotizacion.materiales?.length === 0 ? (

              <p>
                No hay materiales asociados a
                este proyecto.
              </p>

            ) : (

              <div className="detalle-cotizacion-materiales-lista">

                {cotizacion.materiales?.map(
                  (material) => {

                    // -----------------------------------------
                    // PRECIO UNITARIO USD
                    // -----------------------------------------

                    const precioUSD =
                      Number(
                        material.costoUnitario
                      );

                    // -----------------------------------------
                    // PRECIO UNITARIO UYU
                    // -----------------------------------------

                    const precioUYU =
                      precioUSD *
                      Number(
                        cotizacion.tipoCambio
                      );

                    // -----------------------------------------
                    // SUBTOTAL USD
                    // -----------------------------------------

                    const subtotalUSD =
                      Number(
                        material.subtotal
                      );

                    // -----------------------------------------
                    // SUBTOTAL UYU
                    // -----------------------------------------

                    const subtotalUYU =
                      subtotalUSD *
                      Number(
                        cotizacion.tipoCambio
                      );

                    return (

                      <div
                        key={
                          material.idMaterialProyecto
                        }
                        className="detalle-cotizacion-material"
                      >

                        {/* ================================= */}
                        {/* MATERIAL */}
                        {/* ================================= */}

                        <div className="detalle-cotizacion-material-nombre">

                          {material.nombre}

                        </div>

                        {/* ================================= */}
                        {/* CANTIDAD */}
                        {/* ================================= */}

                        <div className="detalle-cotizacion-material-dato">

                          <span>
                            Cantidad
                          </span>

                          <strong>
                            {material.cantidad}{" "}
                            {material.unidad}
                          </strong>

                        </div>

                        {/* ================================= */}
                        {/* PRECIO UNITARIO */}
                        {/* ================================= */}

                        <div className="detalle-cotizacion-material-dato">

                          <span>
                            Precio unitario
                          </span>

                          <strong>

                            <div className="precio-doble">

                              <span>
                                {formatearPrecioUYU(
                                  precioUYU
                                )}{" "}
                                UYU
                              </span>

                              <small>
                                (
                                {formatearPrecioUSD(
                                  precioUSD
                                )}{" "}
                                USD)
                              </small>

                            </div>

                          </strong>

                        </div>

                        {/* ================================= */}
                        {/* SUBTOTAL */}
                        {/* ================================= */}

                        <div className="detalle-cotizacion-material-dato">

                          <span>
                            Subtotal
                          </span>

                          <strong>

                            <div className="precio-doble">

                              <span>
                                {formatearPrecioUYU(
                                  subtotalUYU
                                )}{" "}
                                UYU
                              </span>

                              <small>
                                (
                                {formatearPrecioUSD(
                                  subtotalUSD
                                )}{" "}
                                USD)
                              </small>

                            </div>

                          </strong>

                        </div>

                      </div>

                    );
                  }
                )}

              </div>

            )}

          </article>

        </section>

      </main>

      {/* ================================================= */}
      {/* MODAL ELIMINAR */}
      {/* ================================================= */}

      {mostrarConfirmacion && (

        <div className="detalle-cotizacion-modal-overlay">

          <div
            className="detalle-cotizacion-modal"
            role="dialog"
            aria-modal="true"
          >

            <div className="detalle-cotizacion-modal-icon">

              <Trash2 size={25} />

            </div>

            <h3>
              Eliminar cotización
            </h3>

            <p>

              ¿Seguro que querés eliminar la
              cotización{" "}

              <strong>
                {cotizacion.codigo}
              </strong>
              ?

              {" "}
              Esta acción no se puede deshacer.

            </p>

            <div className="detalle-cotizacion-modal-actions">

              <button
                type="button"
                className="detalle-cotizacion-cancel-button"
                onClick={() =>
                  setMostrarConfirmacion(
                    false
                  )
                }
                disabled={eliminando}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="detalle-cotizacion-confirm-delete"
                onClick={
                  eliminarCotizacion
                }
                disabled={eliminando}
              >
                {eliminando
                  ? "Eliminando..."
                  : "Eliminar cotización"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

// =========================================================
// ESTRUCTURA PARA CARGA / ERROR
// =========================================================

interface EstructuraDetalleProps {
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  children: ReactNode;
}

function EstructuraDetalle({
  menuOpen,
  setMenuOpen,
  children,
}: EstructuraDetalleProps) {
  return (
    <div className="cliente-panel">

      <SidebarCliente
        menuOpen={menuOpen}
        onClose={() =>
          setMenuOpen(false)
        }
      />

      <main className="cliente-main">

        <HeaderCliente
          title="Detalle de cotización"
          subtitle="Información de la cotización."
          menuOpen={menuOpen}
          onToggleMenu={() =>
            setMenuOpen(
              (prev) => !prev
            )
          }
        />

        {children}

      </main>

    </div>
  );
}

// =========================================================
// ESTADO
// =========================================================

function EstadoBadge({
  estado,
}: {
  estado: EstadoCotizacion;
}) {
  const clase =
    `detalle-cotizacion-status detalle-cotizacion-status-${estado.toLowerCase()}`;

  return (
    <span className={clase}>
      {estado}
    </span>
  );
}

// =========================================================
// TÍTULO DE CARD
// =========================================================

interface CardTitleProps {
  icon: ReactNode;
  title: string;
}

function CardTitle({
  icon,
  title,
}: CardTitleProps) {
  return (
    <div className="detalle-cotizacion-card-title">

      <div className="detalle-cotizacion-card-icon">
        {icon}
      </div>

      <h3>
        {title}
      </h3>

    </div>
  );
}

// =========================================================
// ITEM DE INFORMACIÓN
// =========================================================

interface InfoItemProps {
  label: string;
  value: string;
  icon?: ReactNode;
}

function InfoItem({
  label,
  value,
  icon,
}: InfoItemProps) {
  return (
    <div className="detalle-cotizacion-info-item">

      <span>
        {label}
      </span>

      <strong>
        {icon}
        {value}
      </strong>

    </div>
  );
}

// =========================================================
// MEDIDAS
// =========================================================

interface MeasureItemProps {
  label: string;
  value: string;
}

function MeasureItem({
  label,
  value,
}: MeasureItemProps) {
  return (
    <div className="detalle-cotizacion-measure">

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

    </div>
  );
}

// =========================================================
// FORMATEAR FECHA
// =========================================================

function formatearFecha(
  fecha: string
): string {
  const fechaCotizacion =
    new Date(fecha);

  if (
    Number.isNaN(
      fechaCotizacion.getTime()
    )
  ) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat(
    "es-UY",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(fechaCotizacion);
}

// =========================================================
// FORMATEAR NÚMERO
// =========================================================

function formatearNumero(
  numero: number
): string {
  return Number(numero)
    .toFixed(2)
    .replace(".00", "");
}