import { useEffect, useState } from "react";

import DashboardCard from "./DashboardCard";
import ResponseItem from "./ResponseItem";

import "../../styles/RespuestasFinalizadas.css";

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3000";

interface CotizacionFinalizada {
    idCotizacion: number;
    idProyecto: number;
    idEmpresa: number | null;

    nombreEmpresa: string | null;
    telefonoEmpresa: string | null;
    logoEmpresa: string | null;

    codigo: string;

    fechaCreacion: string;
    fechaActualizacion: string | null;

    version: number;

    costoMateriales: number;
    costoManoObra: number;
    costoManoObraAdicional: number;

    subtotal: number;
    porcentajeIVAAplicado: number;
    montoIVA: number;

    totalCotizacion: number;

    tipoCambioUSD: number | null;
    totalUYU: number | null;

    estado: string;
    precioEstimado: number | null;

    observaciones: string | null;

    idCliente: number;
    idTipoObra: number;

    nombreProyecto: string;
    descripcionProyecto: string | null;
    ubicacion: string | null;

    alto: number;
    ancho: number;
    largo: number;
    superficie: number;

    moneda: string;
    tipoCambio: number;

    precioEstimadoUYU: number | null;
    totalCotizacionUYU: number;

    conversionHistorica: boolean;
}

interface RespuestasFinalizadasProps {
    idCliente: number;
}

export default function RespuestasFinalizadas({
    idCliente,
}: RespuestasFinalizadasProps) {
    const [respuestas, setRespuestas] = useState<
        CotizacionFinalizada[]
    >([]);

    const [cargando, setCargando] = useState(true);

    const [modalRespuestasAbierto, setModalRespuestasAbierto] =
        useState(false);

    const [cotizacionSeleccionada, setCotizacionSeleccionada] =
        useState<CotizacionFinalizada | null>(null);

    useEffect(() => {
        const obtenerRespuestas = async () => {
            try {
                setCargando(true);

                const response = await fetch(
                    `${API_URL}/api/cotizaciones/cliente/${idCliente}/finalizadas`
                );

                if (!response.ok) {
                    throw new Error(
                        "No se pudieron obtener las respuestas de las empresas"
                    );
                }

                const data = await response.json();

                setRespuestas(
                    Array.isArray(data)
                        ? data
                        : []
                );
            } catch (error) {
                console.error(
                    "Error al obtener respuestas finalizadas:",
                    error
                );

                setRespuestas([]);
            } finally {
                setCargando(false);
            }
        };

        obtenerRespuestas();
    }, [idCliente]);

    const respuestasRecientes =
        respuestas.slice(0, 4);

    const formatearFecha = (
        fecha: string
    ): string => {
        const fechaFormateada =
            new Date(fecha);

        if (
            Number.isNaN(
                fechaFormateada.getTime()
            )
        ) {
            return "Fecha no disponible";
        }

        return new Intl.DateTimeFormat(
            "es-UY",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }
        ).format(fechaFormateada);
    };

    const formatearUSD = (
        valor: number | null | undefined
    ): string => {
        if (
            valor === null ||
            valor === undefined
        ) {
            return "Sin precio";
        }

        return `USD ${Number(valor).toLocaleString(
            "es-UY",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        )}`;
    };

    const formatearUYU = (
        valor: number | null | undefined
    ): string => {
        if (
            valor === null ||
            valor === undefined
        ) {
            return "Sin conversión";
        }

        return `$ ${Number(valor).toLocaleString(
            "es-UY",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        )}`;
    };


    const convertirAPesos = (
        valorUSD: number | null | undefined,
        tipoCambio: number | null | undefined
    ): number | null => {
        if (
            valorUSD === null ||
            valorUSD === undefined ||
            tipoCambio === null ||
            tipoCambio === undefined
        ) {
            return null;
        }

        return Number(valorUSD) * Number(tipoCambio);
    };

    const obtenerIniciales = (
        nombre: string | null
    ): string => {
        if (!nombre) {
            return "EM";
        }

        return nombre
            .trim()
            .substring(0, 2)
            .toUpperCase();
    };

    const abrirTodasLasRespuestas = () => {
        setModalRespuestasAbierto(true);
    };

    const cerrarTodasLasRespuestas = () => {
        setModalRespuestasAbierto(false);
    };

    const abrirDetalle = (
        cotizacion: CotizacionFinalizada
    ) => {
        setCotizacionSeleccionada(cotizacion);
        setModalRespuestasAbierto(false);
    };

    const cerrarDetalle = () => {
        setCotizacionSeleccionada(null);
    };

    const volverALista = () => {
        setCotizacionSeleccionada(null);
        setModalRespuestasAbierto(true);
    };

    return (
        <>
            <DashboardCard
                title="Últimas respuestas recibidas"
                linkText="Ver todas las respuestas"
                onViewAll={
                    abrirTodasLasRespuestas
                }
            >
                {cargando ? (
                    <p>
                        Cargando respuestas...
                    </p>
                ) : respuestasRecientes.length ===
                  0 ? (
                    <p className="dashboard-empty">
                        No tienes respuestas de
                        empresas todavía.
                    </p>
                ) : (
                    respuestasRecientes.map(
                        (respuesta) => (
                            <ResponseItem
                                key={
                                    respuesta.idCotizacion
                                }
                                logo={respuesta.logoEmpresa || undefined}
                                company={
                                    respuesta.nombreEmpresa ||
                                    "Empresa"
                                }
                                code={
                                    respuesta.codigo
                                }
                                status="Cotización finalizada"
                                time={formatearFecha(
                                    respuesta.fechaActualizacion ||
                                        respuesta.fechaCreacion
                                )}
                            />
                        )
                    )
                )}
            </DashboardCard>

            {/* =====================================================
                MODAL - TODAS LAS RESPUESTAS
            ===================================================== */}

            {modalRespuestasAbierto && (
                <div
                    className="respuestas-modal-overlay"
                    onClick={
                        cerrarTodasLasRespuestas
                    }
                >
                    <div
                        className="respuestas-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="respuestas-modal-header">
                            <div>
                                <h2>
                                    Respuestas recibidas
                                </h2>

                                <p>
                                    Cotizaciones
                                    finalizadas por
                                    las empresas.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="respuestas-modal-close"
                                onClick={
                                    cerrarTodasLasRespuestas
                                }
                                aria-label="Cerrar"
                            >
                                ×
                            </button>
                        </div>

                        <div className="respuestas-modal-content">
                            {respuestas.length ===
                            0 ? (
                                <p className="respuestas-empty">
                                    No tienes
                                    respuestas de
                                    empresas
                                    todavía.
                                </p>
                            ) : (
                                respuestas.map(
                                    (
                                        respuesta
                                    ) => (
                                        <div
                                            key={
                                                respuesta.idCotizacion
                                            }
                                            className="respuesta-card"
                                        >
                                            <div className="respuesta-card-info">
                                                <div className="respuesta-logo">
                                                    {respuesta.logoEmpresa ? (
                                                        <img
                                                        src={respuesta.logoEmpresa}
                                                        alt={`Logo de ${respuesta.nombreEmpresa || "Empresa"}`}
                                                        />
                                                    ) : (
                                                        obtenerIniciales(respuesta.nombreEmpresa)
                                                    )}
                                                </div>
                                                <div className="respuesta-company-info">
                                                    <h3>
                                                        {respuesta.nombreEmpresa ||
                                                            "Empresa"}
                                                    </h3>

                                                    <p>
                                                        Proyecto:{" "}
                                                        <strong>
                                                            {
                                                                respuesta.nombreProyecto
                                                            }
                                                        </strong>
                                                    </p>

                                                    <p>
                                                        Cotización:{" "}
                                                        <strong>
                                                            {
                                                                respuesta.codigo
                                                            }
                                                        </strong>
                                                    </p>

                                                    <p>
                                                        📞{" "}
                                                        {respuesta.telefonoEmpresa ||
                                                            "Teléfono no disponible"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="respuesta-card-right">
                                                <span className="respuesta-status">
                                                    Finalizada
                                                </span>

                                                <strong className="respuesta-total">
                                                    {formatearUSD(
                                                        respuesta.totalCotizacion
                                                    )}
                                                </strong>

                                                <button
                                                    type="button"
                                                    className="respuesta-detalles-button"
                                                    onClick={() =>
                                                        abrirDetalle(
                                                            respuesta
                                                        )
                                                    }
                                                >
                                                    Ver detalles
                                                </button>
                                            </div>
                                        </div>
                                    )
                                )
                            )}
                        </div>

                        <div className="respuestas-modal-footer">
                            <button
                                type="button"
                                className="respuestas-volver-button"
                                onClick={
                                    cerrarTodasLasRespuestas
                                }
                            >
                                Volver al dashboard
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* =====================================================
                MODAL - DETALLE DE COTIZACIÓN
            ===================================================== */}

            {cotizacionSeleccionada && (
                <div
                    className="respuestas-modal-overlay"
                    onClick={
                        cerrarDetalle
                    }
                >
                    <div
                        className="cotizacion-detalle-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="cotizacion-detalle-header">
                            <button
                                type="button"
                                className="cotizacion-volver-lista"
                                onClick={
                                    volverALista
                                }
                            >
                                ← Volver
                            </button>

                            <button
                                type="button"
                                className="respuestas-modal-close"
                                onClick={
                                    cerrarDetalle
                                }
                                aria-label="Cerrar"
                            >
                                ×
                            </button>
                        </div>

                        <div className="cotizacion-detalle-content">
                            <div className="cotizacion-detalle-title">
                                <span>
                                    Cotización finalizada
                                </span>

                                <h2>
                                    {
                                        cotizacionSeleccionada.codigo
                                    }
                                </h2>
                            </div>

                            <div className="cotizacion-detalle-company">
                               <div className="respuesta-logo">
                                {cotizacionSeleccionada.logoEmpresa ? (
                                    <img
                                    src={cotizacionSeleccionada.logoEmpresa}
                                    alt={`Logo de ${
                                        cotizacionSeleccionada.nombreEmpresa || "Empresa"
                                    }`}
                                    />
                                ) : (
                                    obtenerIniciales(cotizacionSeleccionada.nombreEmpresa)
                                )}
                                </div>

                                <div>
                                    <span>
                                        Empresa
                                    </span>

                                    <h3>
                                        {cotizacionSeleccionada.nombreEmpresa ||
                                            "Empresa"}
                                    </h3>

                                    <p>
                                        📞{" "}
                                        {cotizacionSeleccionada.telefonoEmpresa ||
                                            "Teléfono no disponible"}
                                    </p>
                                </div>
                            </div>

                            <div className="cotizacion-detalle-project">
                                <span>
                                    Proyecto
                                </span>

                                <h3>
                                    {
                                        cotizacionSeleccionada.nombreProyecto
                                    }
                                </h3>

                                {cotizacionSeleccionada.ubicacion && (
                                    <p>
                                        📍{" "}
                                        {
                                            cotizacionSeleccionada.ubicacion
                                        }
                                    </p>
                                )}

                                <p>
                                    Superficie:{" "}
                                    {
                                        cotizacionSeleccionada.superficie
                                    }{" "}
                                    m²
                                </p>
                            </div>

                            <div className="cotizacion-detalle-prices">

                                <div className="precio-row">
                                    <span>
                                        Precio estimado
                                    </span>

                                    <div className="precio-valores">
                                        <strong>
                                            {formatearUSD(
                                                cotizacionSeleccionada.precioEstimado
                                            )}
                                        </strong>

                                        <small>
                                            {formatearUYU(
                                                convertirAPesos(
                                                    cotizacionSeleccionada.precioEstimado,
                                                    cotizacionSeleccionada.tipoCambioUSD
                                                )
                                            )}
                                        </small>
                                    </div>
                                </div>

                                <div className="precio-row">
                                    <span>
                                        Costo de obra
                                    </span>

                                    <div className="precio-valores">
                                        <strong>
                                            {formatearUSD(
                                                cotizacionSeleccionada.subtotal
                                            )}
                                        </strong>

                                        <small>
                                            {formatearUYU(
                                                convertirAPesos(
                                                    cotizacionSeleccionada.subtotal,
                                                    cotizacionSeleccionada.tipoCambioUSD
                                                )
                                            )}
                                        </small>
                                    </div>
                                </div>

                                <div className="precio-row">
                                    <span>
                                        IVA (
                                        {
                                            cotizacionSeleccionada.porcentajeIVAAplicado
                                        }
                                        %)
                                    </span>

                                    <div className="precio-valores">
                                        <strong>
                                            {formatearUSD(
                                                cotizacionSeleccionada.montoIVA
                                            )}
                                        </strong>

                                        <small>
                                            {formatearUYU(
                                                convertirAPesos(
                                                    cotizacionSeleccionada.montoIVA,
                                                    cotizacionSeleccionada.tipoCambioUSD
                                                )
                                            )}
                                        </small>
                                    </div>
                                </div>

                                <div className="precio-row precio-total">
                                    <span>
                                        Total final
                                    </span>

                                    <div className="precio-valores">
                                        <strong>
                                            {formatearUSD(
                                                cotizacionSeleccionada.totalCotizacion
                                            )}
                                        </strong>

                                        <small>
                                            {formatearUYU(
                                                cotizacionSeleccionada.totalCotizacionUYU
                                            )}
                                        </small>
                                    </div>
                                </div>

                            </div>

                            {cotizacionSeleccionada.observaciones && (
                                <div className="cotizacion-observaciones">
                                    <span>
                                        Observaciones
                                    </span>

                                    <p>
                                        {
                                            cotizacionSeleccionada.observaciones
                                        }
                                    </p>
                                </div>
                            )}

                            <div className="cotizacion-detalle-date">
                                Fecha de
                                actualización:{" "}
                                {formatearFecha(
                                    cotizacionSeleccionada.fechaActualizacion ||
                                        cotizacionSeleccionada.fechaCreacion
                                )}
                            </div>
                        </div>

                        <div className="cotizacion-detalle-footer">
                            {cotizacionSeleccionada.telefonoEmpresa ? (
                                <a
                                    href={`tel:${cotizacionSeleccionada.telefonoEmpresa}`}
                                    className="cotizacion-contactar-button"
                                >
                                    📞 Contactar empresa
                                </a>
                            ) : (
                                <button
                                    type="button"
                                    className="cotizacion-contactar-button"
                                    disabled
                                >
                                    Teléfono no disponible
                                </button>
                            )}

                            <button
                                type="button"
                                className="cotizacion-dashboard-button"
                                onClick={
                                    cerrarDetalle
                                }
                            >
                                Volver al dashboard
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}