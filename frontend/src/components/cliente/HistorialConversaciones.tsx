import { useEffect, useState } from "react";

import { Trash2 } from "lucide-react";

interface Conversacion {
    idConversacion: number;
    idCliente: number;
    idProyecto: number | null;
    titulo: string;
    fechaCreacion: string;
    fechaUltimoMensaje: string;
}

interface HistorialConversacionesProps {
    idCliente: number;
    idConversacion: number | null;
    onSeleccionarConversacion: (
        idConversacion: number,
        idProyecto: number | null
    ) => void;

    onConversacionEliminada: (
        idConversacion: number
    ) => void;

    actualizarHistorial: number;
}

export default function HistorialConversaciones({
    idCliente,
    idConversacion,
    onSeleccionarConversacion,
    onConversacionEliminada,
    actualizarHistorial,
}: HistorialConversacionesProps) {

    const [conversaciones, setConversaciones] =
        useState<Conversacion[]>([]);

    const [cargando, setCargando] =
        useState(true);

    useEffect(() => {
        const obtenerConversaciones = async () => {
            try {
                setCargando(true);

                const respuesta = await fetch(
                    `http://localhost:3000/api/conversacion-ia/cliente/${idCliente}`
                );

                if (!respuesta.ok) {
                    throw new Error(
                        "No se pudieron obtener las conversaciones"
                    );
                }

                const datos = await respuesta.json();

                setConversaciones(datos);
            } catch (error) {
                console.error(
                    "Error al obtener conversaciones:",
                    error
                );
            } finally {
                setCargando(false);
            }
        };

        obtenerConversaciones();
    }, [idCliente, actualizarHistorial]);

    const formatearFecha = (
        fecha: string
    ) => {
        const fechaConversacion =
            new Date(fecha);

        return fechaConversacion.toLocaleDateString(
            "es-UY",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }
        );
    };

    const eliminarConversacion = async (
        idConversacion: number
    ) => {

        const confirmar = window.confirm(
            "¿Querés eliminar esta conversación?"
        );

        if (!confirmar) {
            return;
        }

        try {

            const respuesta = await fetch(
                `http://localhost:3000/api/conversacion-ia/${idConversacion}`,
                {
                    method: "DELETE",
                }
            );

            if (!respuesta.ok) {
                const datos = await respuesta.json();

                throw new Error(
                    datos.mensaje ||
                    "No se pudo eliminar la conversación"
                );
            }

            setConversaciones((actuales) =>
                actuales.filter(
                    (conversacion) =>
                        conversacion.idConversacion !==
                        idConversacion
                )
            );

            onConversacionEliminada(idConversacion);

        } catch (error) {

            console.error(
                "Error al eliminar conversación:",
                error
            );

            window.alert(
                "No se pudo eliminar la conversación. Intentá nuevamente."
            );
        }
    };

    return (
        <section className="historial-conversaciones">

            <div className="historial-conversaciones-header">
                <div>
                    <span>
                        HISTORIAL
                    </span>

                    <h3>
                        Tus conversaciones
                    </h3>
                </div>
            </div>

            {cargando ? (
                <div className="historial-vacio">
                    <span>
                        Cargando conversaciones...
                    </span>
                </div>
            ) : conversaciones.length === 0 ? (
                <div className="historial-vacio">
                    <span>
                        Todavía no tenés conversaciones.
                    </span>
                </div>
            ) : (
                <div className="historial-lista">
                    {conversaciones.map(
                        (conversacion) => (
                            <div
                                key={conversacion.idConversacion}
                                className={`
                                    historial-conversacion
                                    ${
                                        idConversacion ===
                                        conversacion.idConversacion
                                            ? "activa"
                                            : ""
                                    }
                                `}
                            >
                                <button
                                    type="button"
                                    className="historial-conversacion-contenido"
                                    onClick={() =>
                                        onSeleccionarConversacion(
                                            conversacion.idConversacion,
                                            conversacion.idProyecto
                                        )
                                    }
                                >
                                    <div className="historial-conversacion-info">
                                        <strong>
                                            {conversacion.titulo}
                                        </strong>

                                        <span>
                                            {conversacion.idProyecto
                                                ? `Proyecto #${conversacion.idProyecto}`
                                                : "Consulta general"}
                                        </span>
                                    </div>

                                    <time>
                                        {formatearFecha(
                                            conversacion.fechaUltimoMensaje
                                        )}
                                    </time>
                                </button>

                                <button
                                    type="button"
                                    className="historial-conversacion-eliminar"
                                    title="Eliminar conversación"
                                    onClick={(event) => {
                                        event.stopPropagation();

                                        eliminarConversacion(
                                            conversacion.idConversacion
                                        );
                                    }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        )
                    )}
                </div>
            )}
        </section>
    );
}