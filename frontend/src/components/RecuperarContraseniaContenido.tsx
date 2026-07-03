
import "../styles/RecuperarContraseniaContenido.css";
import imagenLogo from "../assets/iconoHomeMenu.png";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function RecuperarContraseniaContenido(){


    const [gmail, setGmail] = useState("");
    const [codigo, setCodigo] = useState("");
    const [mensaje, setMensaje] = useState("");

    const [codigoEnviado, setCodigoEnviado] = useState(false);
    const navigate = useNavigate();

    const enviarCodigo = async () => {
        try {

            const respuesta = await fetch(
                "http://localhost:3000/api/recuperacionAcceso/enviar-codigo",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        gmail
                    })
                }
            );

            const resultado = await respuesta.json();

            if (!respuesta.ok) {

                setMensaje(resultado.mensaje);

                return;

            }

            setCodigoEnviado(true);

            setMensaje(resultado.mensaje);

        } catch (error) {

            console.error(error);

            setMensaje("Ocurrió un error al enviar el código.");

        }

    }

    const verificarCodigo = async () => {
        try {

            const respuesta = await fetch(
                "http://localhost:3000/api/recuperacionAcceso/verificar-codigo",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        gmail,
                        codigoIngresado: codigo
                    })
                }
            );

            const resultado = await respuesta.json();

            if (!respuesta.ok) {

                setMensaje(resultado.mensaje);

                return;

            }

            if (resultado.rol === "cliente") {

                navigate("/panel-cliente");

            }

            if (resultado.rol === "empresa") {

                navigate("/panel-empresa");

            }

        } catch (error) {

            console.error(error);

            setMensaje("Ocurrió un error al verificar el código.");

        }

    }

    return(

        <>
            <section className="seccion-recuperar">

                <div className="contenedor-recuperar">
                    <div className="logo-recuperar">

                        <img
                            src={imagenLogo}
                            alt="SISCON-Q"
                        />

                        <div className="texto-logo-recuperar">

                            <h1>SISCON-Q</h1>

                            <p>Sistema de Cotizaciones Inteligentes</p>

                        </div>

                    </div>

                    <h2>Recuperar acceso</h2>

                    <p className="subtitulo-recuperar">
                        Ingresá el correo electrónico asociado a tu cuenta.
                        Te enviaremos un código de verificación para
                        confirmar tu identidad.
                    </p>

                    <form className="formulario-recuperar">

                        <label>Correo electrónico</label>

                        <input
                            type="email"
                            placeholder="tu@email.com"
                            value={gmail}
                            onChange={(e) => setGmail(e.target.value)}
                            disabled={codigoEnviado}
                        />

                        {!codigoEnviado && (

                            <button
                                type="button"
                                className="boton-recuperar" onClick={enviarCodigo}
                            >
                                Enviar código
                            </button>

                        )}

                        {mensaje && (

                            <p className="mensaje-codigo">
                                {mensaje}
                            </p>

                        )}

                        {codigoEnviado && (

                            <>


                                <label>Código de verificación</label>

                                <input
                                    type="text"
                                    placeholder="Ingresá el código"
                                    value={codigo}
                                    onChange={(e) => setCodigo(e.target.value)}
                                />

                                <button
                                    type="button"
                                    className="boton-recuperar" onClick={verificarCodigo}
                                >
                                    Verificar código
                                </button>

                            </>

                        )}

                    </form>

                </div>

            </section>
        
        </>

    ) 
}