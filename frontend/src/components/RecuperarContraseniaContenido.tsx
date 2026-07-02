
import "../styles/RecuperarContraseniaContenido.css";
import imagenLogo from "../assets/iconoHomeMenu.png";

import { useState } from "react";
export default function RecuperarContraseniaContenido(){


    const [gmail, setGmail] = useState("");
    const [codigo, setCodigo] = useState("");

    const [codigoEnviado, setCodigoEnviado] = useState(false);

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
                                className="boton-recuperar"
                            >
                                Enviar código
                            </button>

                        )}

                        {codigoEnviado && (

                            <>

                                <p className="mensaje-codigo">

                                    ✔ Te enviamos un código de verificación
                                    a tu correo electrónico.

                                </p>

                                <label>Código de verificación</label>

                                <input
                                    type="text"
                                    placeholder="Ingresá el código"
                                    value={codigo}
                                    onChange={(e) => setCodigo(e.target.value)}
                                />

                                <button
                                    type="button"
                                    className="boton-recuperar"
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