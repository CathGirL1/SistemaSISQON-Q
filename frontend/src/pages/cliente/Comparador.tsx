import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  Scale,
  Plus,
  Sparkles,
  BrainCircuit,
} from "lucide-react";

import SidebarCliente from "../../components/cliente/SidebarCliente";
import HeaderCliente from "../../components/cliente/HeaderCliente";
import type { Cotizacion } from "../../interfaces/Cotizacion";


import "../../styles/PanelClienteContenido.css";
import "../../styles/Comparador.css";


interface ProyectoComparador {
  idProyecto: number;
  idCliente: number;
  idEmpresa: number | null;
  idTipoObra: number;
  nombre: string;
  descripcion: string | null;
  imagenUrl: string | null;
  ubicacion: string | null;
  estado: string;
  alto: number;
  ancho: number;
  largo: number;
  fechaCreacion: string;
  tipoObra: string;
}

interface UsuarioLocal {
  id_Cliente?: number;
}

interface EstadoComparador {
  nuevaComparacion?: boolean;
  tipoObraSeleccionado?: string;
  proyectoSeleccionado?: number | null;
  idsParaComparar?: number[];
}

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Comparador() {
  const navigate = useNavigate();
  const location = useLocation();

  const [proyectos, setProyectos] =
    useState<ProyectoComparador[]>([]);

  const estadoAnterior =
    location.state as EstadoComparador | null;

  const [proyectoSeleccionado, setProyectoSeleccionado] =
    useState<number | null>(
      estadoAnterior?.proyectoSeleccionado ?? null
    );

  const [cotizacionesProyecto, setCotizacionesProyecto] =
    useState<Cotizacion[]>([]);

  const [idsParaComparar, setIdsParaComparar] =
    useState<number[]>(
      estadoAnterior?.idsParaComparar ?? []
    );

  const [cargandoProyectos, setCargandoProyectos] =
    useState(true);

  const [cargandoCotizaciones, setCargandoCotizaciones] =
    useState(false);

  const [errorComparador, setErrorComparador] =
    useState("");

  const [menuOpen, setMenuOpen] = useState(false);

  const [nuevaComparacion, setNuevaComparacion] =
    useState(
      estadoAnterior?.nuevaComparacion ?? false
    );

  const [tipoObraSeleccionado, setTipoObraSeleccionado] =
    useState(
      estadoAnterior?.tipoObraSeleccionado ?? ""
    );
  // =====================================================
  // CARGAR PROYECTOS DEL CLIENTE
  // =====================================================

  useEffect(() => {
    const cargarProyectos = async () => {
      try {
        setCargandoProyectos(true);
        setErrorComparador("");

        const usuarioGuardado =
          localStorage.getItem("usuario");

        if (!usuarioGuardado) {
          throw new Error(
            "No hay un usuario autenticado."
          );
        }

        const usuario: UsuarioLocal =
          JSON.parse(usuarioGuardado);

        if (!usuario.id_Cliente) {
          throw new Error(
            "El usuario no tiene un cliente asociado."
          );
        }

        const response = await fetch(
          `${API_URL}/api/proyectos/cliente/${usuario.id_Cliente}`
        );

        if (!response.ok) {
          throw new Error(
            "No se pudieron obtener los proyectos."
          );
        }

        const data: ProyectoComparador[] =
          await response.json();

        setProyectos(data);

      } catch (error) {
        setErrorComparador(
          error instanceof Error
            ? error.message
            : "Error al cargar los proyectos."
        );
      } finally {
        setCargandoProyectos(false);
      }
    };

    cargarProyectos();
  }, []);

  // =====================================================
  // CARGAR COTIZACIONES REALES DEL PROYECTO
  // =====================================================

  useEffect(() => {
    if (proyectoSeleccionado === null) {
      setCotizacionesProyecto([]);
      setIdsParaComparar([]);
      return;
    }

    const cargarCotizaciones = async () => {
      try {
        setCargandoCotizaciones(true);
        setErrorComparador("");

        const response = await fetch(
          `${API_URL}/api/cotizaciones/proyecto/${proyectoSeleccionado}`
        );

        if (!response.ok) {
          throw new Error(
            "No se pudieron obtener las cotizaciones del proyecto."
          );
        }

        const data: Cotizacion[] =
          await response.json();

        setCotizacionesProyecto(data);

        console.table(
          data.map((cotizacion) => ({
            idCotizacion: cotizacion.idCotizacion,
            idEmpresa: cotizacion.idEmpresa,
            estado: cotizacion.estado,
            nombreEmpresa: cotizacion.nombreEmpresa,
          }))
        );

        console.log(
          "COTIZACIONES REALES DEL PROYECTO:",
          data
        );
      } catch (error) {
        setCotizacionesProyecto([]);

        setErrorComparador(
          error instanceof Error
            ? error.message
            : "Error al cargar las cotizaciones."
        );
      } finally {
        setCargandoCotizaciones(false);
      }
    };

    cargarCotizaciones();
  }, [proyectoSeleccionado]);

  // =====================================================
  // COTIZACIONES DISPONIBLES PARA COMPARAR
  // =====================================================

  const cotizacionesComparables = useMemo(() => {
    return cotizacionesProyecto.filter(
      (cotizacion) =>
        cotizacion.idEmpresa !== null &&
        cotizacion.idEmpresa !== undefined
    );
  }, [cotizacionesProyecto]);

  console.log(
    "COTIZACIONES COMPARABLES:",
    cotizacionesComparables
  );

  const toggleCotizacionParaComparar = (
    idCotizacion: number
  ) => {
    setIdsParaComparar((prev) => {
      if (prev.includes(idCotizacion)) {
        return prev.filter((id) => id !== idCotizacion);
      }

      if (prev.length >= 3) {
        alert(
          "Podés comparar un máximo de 3 propuestas a la vez."
        );
        return prev;
      }

      return [...prev, idCotizacion];
    });
  };

  const opcionesReales = useMemo(() => {
    return cotizacionesComparables.map((cotizacion) => ({
      id: cotizacion.idCotizacion,
      empresa: cotizacion.nombreEmpresa || "Empresa",
      codigo: `COT-${cotizacion.idCotizacion}`,
      costoMateriales: Number(cotizacion.costoMateriales),
      costoManoObra: Number(cotizacion.costoManoObra),
      total: Number(cotizacion.totalCotizacion),
      observaciones:
        cotizacion.observaciones || "Sin observaciones",
      version: cotizacion.version,
      materiales:
        cotizacion.resumenMateriales || "Sin detalle",
    }));
  }, [cotizacionesComparables]);

  const opcionesSeleccionadas = useMemo(() => {
    return opcionesReales.filter((opcion) =>
      idsParaComparar.includes(opcion.id)
    );
  }, [opcionesReales, idsParaComparar]);

  const mejorPropuesta = useMemo(() => {
    if (opcionesSeleccionadas.length === 0) {
      return null;
    }

    return opcionesSeleccionadas.reduce(
      (mejor, actual) =>
        actual.total < mejor.total
          ? actual
          : mejor
    );
  }, [opcionesSeleccionadas]);

  const menorCostoMateriales = useMemo(() => {
    if (opcionesSeleccionadas.length === 0) {
      return null;
    }

    return Math.min(
      ...opcionesSeleccionadas.map(
        (opcion) => opcion.costoMateriales
      )
    );
  }, [opcionesSeleccionadas]);

  const menorCostoManoObra = useMemo(() => {
    if (opcionesSeleccionadas.length === 0) {
      return null;
    }

    return Math.min(
      ...opcionesSeleccionadas.map(
        (opcion) => opcion.costoManoObra
      )
    );
  }, [opcionesSeleccionadas]);

  const tiposObraDisponibles = useMemo(() => {
    return Array.from(
      new Set(
        proyectos
          .map((proyecto) => proyecto.tipoObra)
          .filter(Boolean)
      )
    ).sort();
  }, [proyectos]);

  const proyectosFiltrados = useMemo(() => {
    if (!tipoObraSeleccionado) {
      return [];
    }

    return proyectos.filter(
      (proyecto) =>
        proyecto.tipoObra === tipoObraSeleccionado
    );
  }, [proyectos, tipoObraSeleccionado]);

  const iniciarNuevaComparacion = () => {
    setNuevaComparacion(true);
    setTipoObraSeleccionado("");
    setProyectoSeleccionado(null);
    setCotizacionesProyecto([]);
    setIdsParaComparar([]);
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


        <section className="comparador-heading">
          <div>
            <h2>Comparación del proyecto</h2>
            <p>
              Compará costos, materiales y características para elegir la mejor opción.
            </p>
          </div>

          <div className="comparador-heading-actions">
            {nuevaComparacion && (
              <>
                <select
                  className="comparador-project-select"
                  value={tipoObraSeleccionado}
                  onChange={(e) => {
                    setTipoObraSeleccionado(e.target.value);
                    setProyectoSeleccionado(null);
                    setCotizacionesProyecto([]);
                    setIdsParaComparar([]);
                  }}
                  disabled={cargandoProyectos}
                >
                  <option value="">
                    Seleccioná un tipo de obra
                  </option>

                  {tiposObraDisponibles.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>

                {tipoObraSeleccionado && (
                  <select
                    className="comparador-project-select"
                    value={proyectoSeleccionado ?? ""}
                    onChange={(e) =>
                      setProyectoSeleccionado(
                        e.target.value
                          ? Number(e.target.value)
                          : null
                      )
                    }
                  >
                    <option value="">
                      Seleccioná un proyecto
                    </option>

                    {proyectosFiltrados.map((proyecto) => (
                      <option
                        key={proyecto.idProyecto}
                        value={proyecto.idProyecto}
                      >
                        {proyecto.nombre}
                      </option>
                    ))}
                  </select>
                )}
              </>
            )}
            {errorComparador && (
              <p>{errorComparador}</p>
            )}

            {cargandoCotizaciones ? (
              <p>Cargando cotizaciones...</p>
            ) : (
              <p>
                Cotizaciones encontradas:{" "}
                {cotizacionesProyecto.length}
              </p>
            )}

            <button
              type="button"
              className="comparador-new-button"
              onClick={iniciarNuevaComparacion}
            >
              <Plus size={19} />
              Nueva comparación
            </button>
          </div>
        </section>

        {opcionesSeleccionadas.length > 0 && (
          <section className="comparador-stats">
            <article className="comparador-stat-card">
              <div className="comparador-stat-icon blue">
                <Scale size={23} />
              </div>

              <div>
                <strong>{opcionesSeleccionadas.length}</strong>
                <span>Propuestas comparadas</span>
              </div>
            </article>

            <article className="comparador-stat-card">
              <div className="comparador-stat-icon purple">
                <Sparkles size={23} />
              </div>

              <div>
                <strong>
                  USD{" "}
                  {menorCostoMateriales?.toLocaleString("es-UY", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </strong>
                <span>Menor costo en materiales</span>
              </div>
            </article>

            <article className="comparador-stat-card">
              <div className="comparador-stat-icon green">
                <BrainCircuit size={23} />
              </div>

              <div>
                <strong>
                  {mejorPropuesta?.empresa}
                </strong>

                <span>
                  Menor costo total: USD{" "}
                  {mejorPropuesta?.total.toLocaleString("es-UY", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </article>

            <article className="comparador-stat-card">
              <div className="comparador-stat-icon green">
                <Scale size={23} />
              </div>

              <div>
                <strong>
                  USD{" "}
                  {menorCostoManoObra?.toLocaleString("es-UY", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </strong>
                <span>Menor costo en mano de obra</span>
              </div>
            </article>
          </section>
        )}

        <section className="comparador-selector-propuestas">
          <div>
            <h3>Seleccioná las propuestas a comparar</h3>
            <p>
              Podés seleccionar hasta 3 propuestas.{" "}
              {idsParaComparar.length}/3 seleccionadas.
            </p>
          </div>

          <div className="comparador-propuestas-list">
            {cotizacionesComparables.map((cotizacion) => {
              const seleccionada = idsParaComparar.includes(
                cotizacion.idCotizacion
              );

              return (
                <button
                  key={cotizacion.idCotizacion}
                  type="button"
                  className={`comparador-propuesta-selector ${seleccionada ? "selected" : ""
                    }`}
                  onClick={() =>
                    toggleCotizacionParaComparar(
                      cotizacion.idCotizacion
                    )
                  }
                >
                  <span>
                    {cotizacion.nombreEmpresa || "Empresa"}
                  </span>

                  <strong>
                    USD{" "}
                    {Number(
                      cotizacion.totalCotizacion
                    ).toLocaleString("es-UY", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </strong>

                  <span>
                    {seleccionada
                      ? "✓ Seleccionada"
                      : "Seleccionar"}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {opcionesSeleccionadas.length > 0 && (
          <section className="comparador-planes">
            <div className="comparador-planes-heading">
              <h3>Comparación de propuestas</h3>
              <p>
                Compará los costos de cada empresa antes de tomar una decisión.
              </p>
            </div>

            <div className="comparador-planes-grid">
              {opcionesSeleccionadas.map((opcion) => {
                const esRecomendada =
                  mejorPropuesta?.id === opcion.id;

                const tieneMejorMateriales =
                  opcion.costoMateriales === menorCostoMateriales;

                const tieneMejorManoObra =
                  opcion.costoManoObra === menorCostoManoObra;

                return (
                  <article
                    key={opcion.id}
                    className={`comparador-plan-card ${esRecomendada ? "recommended" : ""
                      }`}
                  >
                    {esRecomendada && (
                      <div className="comparador-plan-badge">
                        ★ RECOMENDADA · MENOR COSTO TOTAL
                      </div>
                    )}

                    <div className="comparador-plan-header">
                      <span className="comparador-plan-version">
                        Propuesta · Versión {opcion.version}
                      </span>

                      <h3>{opcion.empresa}</h3>

                      <div className="comparador-plan-price">
                        <span>USD</span>

                        <strong>
                          {opcion.total.toLocaleString("es-UY", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </strong>
                      </div>

                      <span className="comparador-plan-total-label">
                        Costo total
                      </span>
                    </div>

                    <div className="comparador-plan-details">
                      <div className="comparador-plan-detail">
                        <div>
                          <span>Materiales</span>

                          <strong>
                            USD{" "}
                            {opcion.costoMateriales.toLocaleString(
                              "es-UY",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </strong>
                        </div>

                        {tieneMejorMateriales && (
                          <span className="comparador-best-value">
                            ✓ Menor costo en materiales
                          </span>
                        )}
                      </div>

                      <div className="comparador-plan-detail">
                        <div>
                          <span>Mano de obra</span>

                          <strong>
                            USD{" "}
                            {opcion.costoManoObra.toLocaleString(
                              "es-UY",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </strong>
                        </div>

                        {tieneMejorManoObra && (
                          <span className="comparador-best-value">
                            ✓ Menor costo en mano de obra
                          </span>
                        )}
                      </div>

                      <div className="comparador-plan-detail">
                        <div>
                          <span>Materiales seleccionados</span>
                          <p>{opcion.materiales}</p>
                        </div>
                      </div>

                      <div className="comparador-plan-detail">
                        <div>
                          <span>Observaciones</span>
                          <p>{opcion.observaciones}</p>
                        </div>
                      </div>
                    </div>

                    {esRecomendada && (
                      <div className="comparador-plan-reason">
                        <strong>¿Por qué la recomendamos?</strong>
                        <p>
                          Es la propuesta con el menor costo total entre
                          las opciones seleccionadas.
                        </p>
                      </div>
                    )}

                    <button
                      type="button"
                      className="select-option-button"
                      onClick={() =>
                        navigate(
                          `/panel-cliente/cotizaciones/${opcion.id}`,
                          {
                            state: {
                              origen: "comparador",
                              estadoComparador: {
                                nuevaComparacion,
                                tipoObraSeleccionado,
                                proyectoSeleccionado,
                                idsParaComparar,
                              },
                            },
                          }
                        )
                      }
                    >
                      Ver propuesta
                    </button>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}