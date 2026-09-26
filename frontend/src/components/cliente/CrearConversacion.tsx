import React, { useState } from "react";

interface CrearConversacionProps {
    idCliente: number;
    idProyecto: number | null;
    onConversacionCreada: (idConversacion: number) => void;
}

const CrearConversacion: React.FC<CrearConversacionProps> = ({
    idCliente,
    idProyecto,
    onConversacionCreada,
}) => {
    const [creando, setCreando] = useState(false);

    const crearConversacion = async () => {
        if (creando) {
            return;
        }

        try {
            setCreando(true);

            const respuesta = await fetch(
                "http://localhost:3000/api/conversacion-ia",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        idCliente,
                        idProyecto,
                        titulo: "Nueva conversación",
                    }),
                }
            );

            if (!respuesta.ok) {
                throw new Error(
                    "No se pudo crear la conversación"
                );
            }

            const datos = await respuesta.json();

            onConversacionCreada(datos.idConversacion);
        } catch (error) {
            console.error(
                "Error al crear conversación:",
                error
            );
        } finally {
            setCreando(false);
        }
    };

    return (
        <button
            type="button"
            onClick={crearConversacion}
            disabled={creando}
            className="
              crear-conversacion-btn
            "
        >
            {creando ? (
                <>
                    <span
                        className="
                            w-4
                            h-4
                            border-2
                            border-gray-300
                            border-t-gray-700
                            rounded-full
                            animate-spin
                        "
                    />

                    <span>
                        Creando...
                    </span>
                </>
            ) : (
                <>
                    <span className="text-base">
                        +
                    </span>

                    <span>
                        Nueva conversación
                    </span>
                </>
            )}
        </button>
    );
};

export default CrearConversacion;