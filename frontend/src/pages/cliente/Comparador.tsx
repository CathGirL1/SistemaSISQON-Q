import {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  Sparkles,
  ArrowRight,
  CircleDollarSign,
  PackageSearch,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

import SidebarCliente from "../../components/cliente/SidebarCliente";
import HeaderCliente from "../../components/cliente/HeaderCliente";
import type { Cotizacion } from "../../interfaces/Cotizacion";

import "../../styles/PanelClienteContenido.css";
import "../../styles/Comparador.css";


// =====================================================
// INTERFACES
// =====================================================

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
}

interface ComparacionMaterial {
  idMaterialProyecto: number;
  idProyecto: number;

  idMaterialActual: number;
  material: string;
  unidad: string;
  cantidad: number;

  idEmpresaActual: number;
  empresaActual: string;
  precioUnitarioActual: number;
  subtotalActual: number;

  idMaterialAlternativa: number;
  idEmpresaAlternativa: number;
  empresaAlternativa: string;
  precioUnitarioAlternativa: number;
  subtotalAlternativa: number;

  diferencia: number;
}

interface RespuestaComparacion {
  success: boolean;
  idProyecto: number;
  comparacion: ComparacionMaterial[];
}

interface RespuestaUsarAlternativa {
  success: boolean;
  mensaje?: string;
  actualizado?: boolean;
  idProyecto?: number;
  idCotizacion?: number;

  materialAnterior?: {
    idMaterial: number;
    nombre: string;
    costoUnitario: number;
  };

  materialNuevo?: {
    idMaterial: number;
    nombre: string;
    costoUnitario: number;
  };
}


const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000";


// =====================================================
// COMPONENTE
// =====================================================

export default function Comparador() {

  const navigate = useNavigate();
  const location = useLocation();

  const estadoAnterior =
    location.state as EstadoComparador | null;


  // =====================================================
  // ESTADOS
  // =====================================================

  const [proyectos, setProyectos] =
    useState<ProyectoComparador[]>([]);

  const [proyectoSeleccionado, setProyectoSeleccionado] =
    useState<number | null>(
      estadoAnterior?.proyectoSeleccionado ?? null
    );

  const [tipoObraSeleccionado, setTipoObraSeleccionado] =
    useState(
      estadoAnterior?.tipoObraSeleccionado ?? ""
    );

  const [cotizacionesProyecto, setCotizacionesProyecto] =
    useState<Cotizacion[]>([]);

  const [comparaciones, setComparaciones] =
    useState<ComparacionMaterial[]>([]);

  const [cargandoProyectos, setCargandoProyectos] =
    useState(true);

  const [cargandoDatos, setCargandoDatos] =
    useState(false);

  const [errorComparador, setErrorComparador] =
    useState("");

  const [mensajeExito, setMensajeExito] =
    useState("");

  const [materialAplicando, setMaterialAplicando] =
    useState<number | null>(null);

  const [menuOpen, setMenuOpen] =
    useState(false);


  // =====================================================
  // FORMATEADORES
  // =====================================================

  const formatearMoneda = (
    valor: number | null | undefined
  ) => {
    const numero = Number(valor ?? 0);

    return new Intl.NumberFormat("es-UY", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numero);
  };

  const formatearCantidad = (
    valor: number | null | undefined
  ) => {
    const numero = Number(valor ?? 0);

    return new Intl.NumberFormat("es-UY", {
      maximumFractionDigits: 2,
    }).format(numero);
  };


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
  // TIPOS DE OBRA
  // =====================================================

  const tiposObra = useMemo(() => {

    return Array.from(
      new Set(
        proyectos
          .map((proyecto) => proyecto.tipoObra)
          .filter(Boolean)
      )
    ).sort();

  }, [proyectos]);


  // =====================================================
  // PROYECTOS FILTRADOS
  // =====================================================

  const proyectosFiltrados = useMemo(() => {

    if (!tipoObraSeleccionado) {
      return proyectos;
    }

    return proyectos.filter(
      (proyecto) =>
        proyecto.tipoObra === tipoObraSeleccionado
    );

  }, [
    proyectos,
    tipoObraSeleccionado,
  ]);


  // =====================================================
  // PROYECTO ACTUAL
  // =====================================================

  const proyectoActual = useMemo(() => {

    if (proyectoSeleccionado === null) {
      return null;
    }

    return (
      proyectos.find(
        (proyecto) =>
          proyecto.idProyecto ===
          proyectoSeleccionado
      ) ?? null
    );

  }, [
    proyectos,
    proyectoSeleccionado,
  ]);


  // =====================================================
  // COTIZACIÓN BORRADOR
  // =====================================================

  const cotizacionBorrador = useMemo(() => {

    return (
      cotizacionesProyecto.find(
        (cotizacion) =>
          cotizacion.estado
            ?.toLowerCase()
            .trim() === "borrador"
      ) ?? null
    );

  }, [cotizacionesProyecto]);


  // =====================================================
  // AHORRO DISPONIBLE
  // =====================================================

  const ahorroTotalDisponible = useMemo(() => {

    return comparaciones.reduce(
      (total, comparacion) =>
        total +
        Math.max(
          0,
          Number(comparacion.diferencia)
        ),
      0
    );

  }, [comparaciones]);


  // =====================================================
  // CARGAR DATOS DEL PROYECTO
  // =====================================================

  const cargarDatosProyecto =
    useCallback(
      async (
        idProyecto: number,
        mostrarCarga = true
      ) => {

        try {

          if (mostrarCarga) {
            setCargandoDatos(true);
          }

          setErrorComparador("");

          const [
            responseCotizaciones,
            responseComparacion,
          ] = await Promise.all([

            fetch(
              `${API_URL}/api/cotizaciones/proyecto/${idProyecto}`
            ),

            fetch(
              `${API_URL}/api/materiales-proyecto/proyecto/${idProyecto}/comparacion`
            ),

          ]);


          if (!responseCotizaciones.ok) {

            throw new Error(
              "No se pudo obtener la estimación del proyecto."
            );

          }


          if (!responseComparacion.ok) {

            throw new Error(
              "No se pudieron obtener las alternativas de materiales."
            );

          }


          const cotizaciones: Cotizacion[] =
            await responseCotizaciones.json();

          const respuestaComparacion:
            RespuestaComparacion =
            await responseComparacion.json();


          setCotizacionesProyecto(
            Array.isArray(cotizaciones)
              ? cotizaciones
              : []
          );


          setComparaciones(
            Array.isArray(
              respuestaComparacion.comparacion
            )
              ? respuestaComparacion.comparacion
              : []
          );

        } catch (error) {

          setCotizacionesProyecto([]);
          setComparaciones([]);

          setErrorComparador(
            error instanceof Error
              ? error.message
              : "No se pudieron cargar los datos del comparador."
          );

        } finally {

          if (mostrarCarga) {
            setCargandoDatos(false);
          }

        }

      },
      []
    );


  // =====================================================
  // RECARGAR AL CAMBIAR DE PROYECTO
  // =====================================================

  useEffect(() => {

    setMensajeExito("");

    if (proyectoSeleccionado === null) {

      setCotizacionesProyecto([]);
      setComparaciones([]);

      return;

    }

    cargarDatosProyecto(
      proyectoSeleccionado
    );

  }, [
    proyectoSeleccionado,
    cargarDatosProyecto,
  ]);


  // =====================================================
  // CAMBIAR TIPO DE OBRA
  // =====================================================

  const manejarCambioTipoObra = (
    valor: string
  ) => {

    setTipoObraSeleccionado(valor);
    setProyectoSeleccionado(null);

    setCotizacionesProyecto([]);
    setComparaciones([]);

    setMensajeExito("");
    setErrorComparador("");

  };


  // =====================================================
  // CAMBIAR PROYECTO
  // =====================================================

  const manejarCambioProyecto = (
    valor: string
  ) => {

    if (!valor) {

      setProyectoSeleccionado(null);

      return;

    }

    setProyectoSeleccionado(
      Number(valor)
    );

    setMensajeExito("");
    setErrorComparador("");

  };


  // =====================================================
  // USAR ALTERNATIVA
  // =====================================================

  const usarAlternativa = async (
    comparacion: ComparacionMaterial
  ) => {

    if (!cotizacionBorrador) {

      setErrorComparador(
        "La estimación ya no se encuentra en borrador y no puede modificarse."
      );

      return;
    }


    try {

      setMaterialAplicando(
        comparacion.idMaterialProyecto
      );

      setErrorComparador("");
      setMensajeExito("");


      const response = await fetch(
        `${API_URL}/api/materiales-proyecto/${comparacion.idMaterialProyecto}/usar-alternativa`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            idMaterialAlternativo:
              comparacion.idMaterialAlternativa,
          }),
        }
      );


      const data:
        RespuestaUsarAlternativa =
        await response.json();


      if (!response.ok || !data.success) {

        throw new Error(
          data.mensaje ||
          "No se pudo aplicar la alternativa."
        );

      }


      setMensajeExito(
        `${comparacion.material}: se aplicó la alternativa de ${comparacion.empresaAlternativa}. La estimación fue recalculada.`
      );


      // El backend recalcula el mismo borrador.
      // Volvemos a pedir los datos reales para no
      // calcular importes manualmente en React.
      if (proyectoSeleccionado !== null) {

        await cargarDatosProyecto(
          proyectoSeleccionado,
          false
        );

      }

    } catch (error) {

      setErrorComparador(
        error instanceof Error
          ? error.message
          : "No se pudo aplicar la alternativa."
      );

    } finally {

      setMaterialAplicando(null);

    }

  };


  // =====================================================
  // RENDER
  // =====================================================

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
          title="Comparador de materiales"
          subtitle="Compará precios y optimizá la estimación de tu proyecto antes de enviarla a una empresa."
          menuOpen={menuOpen}
          onToggleMenu={() =>
            setMenuOpen(
              (prev) => !prev
            )
          }
        />

        <section className="comparador-page">


          {/* =================================================
              SELECTORES
          ================================================= */}

          <section className="comparador-config-card">

            <div className="comparador-config-header">

              <div>

                <span className="comparador-step">
                  1
                </span>

                <div>
                  <h2>
                    Seleccioná un proyecto
                  </h2>

                  <p>
                    Elegí el tipo de obra y el proyecto
                    cuya estimación querés optimizar.
                  </p>
                </div>

              </div>

            </div>


            <div className="comparador-select-grid">

              <label>

                <span>
                  Tipo de obra
                </span>

                <select
                  value={tipoObraSeleccionado}
                  disabled={cargandoProyectos}
                  onChange={(event) =>
                    manejarCambioTipoObra(
                      event.target.value
                    )
                  }
                >

                  <option value="">
                    Todos los tipos de obra
                  </option>

                  {tiposObra.map(
                    (tipoObra) => (

                      <option
                        key={tipoObra}
                        value={tipoObra}
                      >
                        {tipoObra}
                      </option>

                    )
                  )}

                </select>

              </label>


              <label>

                <span>
                  Proyecto
                </span>

                <select
                  value={
                    proyectoSeleccionado ?? ""
                  }
                  disabled={cargandoProyectos}
                  onChange={(event) =>
                    manejarCambioProyecto(
                      event.target.value
                    )
                  }
                >

                  <option value="">
                    Seleccioná un proyecto
                  </option>

                  {proyectosFiltrados.map(
                    (proyecto) => (

                      <option
                        key={proyecto.idProyecto}
                        value={proyecto.idProyecto}
                      >
                        {proyecto.nombre}
                      </option>

                    )
                  )}

                </select>

              </label>

            </div>

          </section>


          {/* =================================================
              ERROR
          ================================================= */}

          {errorComparador && (

            <div className="comparador-alert comparador-alert-error">

              {errorComparador}

            </div>

          )}


          {/* =================================================
              ÉXITO
          ================================================= */}

          {mensajeExito && (

            <div className="comparador-alert comparador-alert-success">

              <CheckCircle2 size={20} />

              <span>
                {mensajeExito}
              </span>

            </div>

          )}


          {/* =================================================
              SIN PROYECTO
          ================================================= */}

          {proyectoSeleccionado === null &&
            !cargandoProyectos && (

              <section className="comparador-empty">

                <PackageSearch size={42} />

                <h2>
                  Seleccioná un proyecto
                </h2>

                <p>
                  Cuando elijas un proyecto vas a poder
                  consultar su estimación y las
                  alternativas de materiales disponibles.
                </p>

              </section>

            )}


          {/* =================================================
              CARGANDO
          ================================================= */}

          {proyectoSeleccionado !== null &&
            cargandoDatos && (

              <section className="comparador-empty">

                <RefreshCw
                  size={36}
                  className="comparador-spin"
                />

                <h2>
                  Analizando materiales...
                </h2>

                <p>
                  SISCON-Q está buscando alternativas
                  para los materiales de tu proyecto.
                </p>

              </section>

            )}


          {/* =================================================
              CONTENIDO
          ================================================= */}

          {proyectoSeleccionado !== null &&
            !cargandoDatos && (

              <>

                {/* =============================================
                    ESTIMACIÓN
                ============================================= */}

                <section className="comparador-estimacion-card">

                  <div className="comparador-estimacion-top">

                    <div>

                      <span className="comparador-step">
                        2
                      </span>

                      <div>

                        <span className="comparador-kicker">
                          Estimación actual
                        </span>

                        <h2>
                          {proyectoActual?.nombre ||
                            "Proyecto"}
                        </h2>

                        <p>
                          {proyectoActual?.tipoObra}
                        </p>

                      </div>

                    </div>


                    {cotizacionBorrador && (

                      <span className="comparador-badge-borrador">
                        Borrador
                      </span>

                    )}

                  </div>


                  {cotizacionBorrador ? (

                    <div className="comparador-resumen-grid">

                      <div className="comparador-resumen-item">

                        <span>
                          Materiales
                        </span>

                        <strong>
                          {formatearMoneda(
                            Number(
                              cotizacionBorrador
                                .costoMateriales
                            )
                          )}
                        </strong>

                      </div>


                      <div className="comparador-resumen-item comparador-resumen-total">

                        <span>
                          Total estimado
                        </span>

                        <strong>
                          {formatearMoneda(
                            Number(
                              cotizacionBorrador
                                .totalCotizacion
                            )
                          )}
                        </strong>

                      </div>

                    </div>

                  ) : (

                    <div className="comparador-sin-borrador">

                      <p>
                        Este proyecto no tiene una
                        cotización estimada en estado
                        Borrador.
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            "/panel-cliente/proyectos"
                          )
                        }
                      >
                        Ir a mis proyectos
                      </button>

                    </div>

                  )}

                </section>


                {/* =============================================
                    ALTERNATIVAS
                ============================================= */}

                {cotizacionBorrador && (

                  <section className="comparador-alternativas">

                    <div className="comparador-section-header">

                      <div>

                        <span className="comparador-step">
                          3
                        </span>

                        <div>

                          <h2>
                            Alternativas encontradas
                          </h2>

                          <p>
                            SISCON-Q compara los
                            materiales actuales con
                            materiales equivalentes de
                            otras empresas.
                          </p>

                        </div>

                      </div>


                      {comparaciones.length > 0 && (

                        <div className="comparador-ahorro-total">

                          <Sparkles size={18} />

                          <span>
                            Ahorro disponible
                          </span>

                          <strong>
                            {formatearMoneda(
                              ahorroTotalDisponible
                            )}
                          </strong>

                        </div>

                      )}

                    </div>


                    {comparaciones.length === 0 ? (

                      <div className="comparador-sin-alternativas">

                        <CheckCircle2 size={38} />

                        <h3>
                          Ya tenés los mejores precios
                          disponibles
                        </h3>

                        <p>
                          No encontramos alternativas
                          más económicas para los
                          materiales actuales de este
                          proyecto.
                        </p>

                      </div>

                    ) : (

                      <div className="comparador-materiales-lista">

                        {comparaciones.map(
                          (comparacion) => {

                            const aplicando =
                              materialAplicando ===
                              comparacion.idMaterialProyecto;

                            return (

                              <article
                                key={`${comparacion.idMaterialProyecto}-${comparacion.idMaterialAlternativa}`}
                                className="comparador-material-card"
                              >

                                <div className="comparador-material-header">

                                  <div>

                                    <span className="comparador-material-label">
                                      Material
                                    </span>

                                    <h3>
                                      {comparacion.material}
                                    </h3>

                                    <p>
                                      {formatearCantidad(
                                        comparacion.cantidad
                                      )}{" "}
                                      {comparacion.unidad}
                                    </p>

                                  </div>


                                  <div className="comparador-ahorro-badge">

                                    <span>
                                      Ahorrás
                                    </span>

                                    <strong>
                                      {formatearMoneda(
                                        comparacion.diferencia
                                      )}
                                    </strong>

                                  </div>

                                </div>


                                <div className="comparador-precios">

                                  {/* ACTUAL */}

                                  <div className="comparador-precio-box comparador-precio-actual">

                                    <span className="comparador-precio-titulo">
                                      Precio actual
                                    </span>

                                    <strong className="comparador-empresa">
                                      {
                                        comparacion.empresaActual
                                      }
                                    </strong>

                                    <div className="comparador-precio-unitario">

                                      <strong>
                                        {formatearMoneda(
                                          comparacion
                                            .precioUnitarioActual
                                        )}
                                      </strong>

                                      <span>
                                        / {comparacion.unidad}
                                      </span>

                                    </div>

                                    <div className="comparador-calculo">

                                      {formatearCantidad(
                                        comparacion.cantidad
                                      )}
                                      {" × "}
                                      {formatearMoneda(
                                        comparacion
                                          .precioUnitarioActual
                                      )}

                                    </div>

                                    <div className="comparador-subtotal">

                                      <span>
                                        Subtotal
                                      </span>

                                      <strong>
                                        {formatearMoneda(
                                          comparacion
                                            .subtotalActual
                                        )}
                                      </strong>

                                    </div>

                                  </div>


                                  {/* FLECHA */}

                                  <div className="comparador-arrow">

                                    <ArrowRight size={24} />

                                  </div>


                                  {/* ALTERNATIVA */}

                                  <div className="comparador-precio-box comparador-precio-alternativa">

                                    <span className="comparador-precio-titulo">

                                      <Sparkles size={15} />

                                      Alternativa

                                    </span>

                                    <strong className="comparador-empresa">
                                      {
                                        comparacion
                                          .empresaAlternativa
                                      }
                                    </strong>

                                    <div className="comparador-precio-unitario">

                                      <strong>
                                        {formatearMoneda(
                                          comparacion
                                            .precioUnitarioAlternativa
                                        )}
                                      </strong>

                                      <span>
                                        / {comparacion.unidad}
                                      </span>

                                    </div>

                                    <div className="comparador-calculo">

                                      {formatearCantidad(
                                        comparacion.cantidad
                                      )}
                                      {" × "}
                                      {formatearMoneda(
                                        comparacion
                                          .precioUnitarioAlternativa
                                      )}

                                    </div>

                                    <div className="comparador-subtotal">

                                      <span>
                                        Subtotal
                                      </span>

                                      <strong>
                                        {formatearMoneda(
                                          comparacion
                                            .subtotalAlternativa
                                        )}
                                      </strong>

                                    </div>

                                  </div>

                                </div>


                                <div className="comparador-material-footer">

                                  <p>
                                    Usar este precio no
                                    selecciona a{" "}
                                    <strong>
                                      {
                                        comparacion
                                          .empresaAlternativa
                                      }
                                    </strong>
                                    . Solo modifica la
                                    estimación del proyecto.
                                  </p>


                                  <button
                                    type="button"
                                    className="comparador-usar-btn"
                                    disabled={aplicando}
                                    onClick={() =>
                                      usarAlternativa(
                                        comparacion
                                      )
                                    }
                                  >

                                    {aplicando ? (

                                      <>
                                        <RefreshCw
                                          size={17}
                                          className="comparador-spin"
                                        />
                                        Recalculando...
                                      </>

                                    ) : (

                                      <>
                                        <CircleDollarSign
                                          size={18}
                                        />
                                        Usar esta alternativa
                                      </>

                                    )}

                                  </button>

                                </div>

                              </article>

                            );

                          }
                        )}

                      </div>

                    )}

                  </section>

                )}

              </>

            )}

        </section>

      </main>

    </div>

  );
}