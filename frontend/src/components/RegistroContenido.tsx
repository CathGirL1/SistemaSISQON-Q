import { useState } from "react";

import RegistroCliente from "./RegistroCliente";
import RegistroEmpresa from "./RegistroEmpresa";

import "../styles/RegistroContenido.css";

import imagenRegistro from "../assets/imagenRegistro.png";
import imagenLogo from "../assets/iconoHomeMenu.png";

import {
  ClipboardList,
  ShieldCheck,
  SearchCheck,
  Building2,
  TrendingUp,
  BriefcaseBusiness
} from "lucide-react";

export default function RegistroContenido() {

    const [tipoCuenta, setTipoCuenta] = useState("cliente");

    const esCliente = tipoCuenta === "cliente";
    const esEmpresa = tipoCuenta === "empresa";

    return (

        <section className="seccion-registro">

            <div className="contenedor-registro">

                {/* PANEL IZQUIERDO */}

                <div
                    className="panel-informacion-registro"
                    style={{
                        backgroundImage: `url(${imagenRegistro})`
                    }}
                >

                    <div className="capa-oscura-registro">

                        <div className="logo-registro">

                            <img
                                src={imagenLogo}
                                alt="SISCON-Q"
                            />

                            <div className="texto-logo-registro">

                                <h1>SISCON-Q</h1>

                                <p>
                                    Sistema de Cotizaciones Inteligentes
                                </p>

                            </div>

                        </div>

                        <div className="contenido-informacion-registro">

                            {esCliente && (

                                <>
                                    <h2>
                                        Encontrá la mejor
                                        <br />
                                        cotización.
                                    </h2>

                                    <div className="linea-destacada-registro"></div>

                                    <p className="descripcion-registro">
                                        Compará presupuestos y encontrá empresas
                                        verificadas para llevar adelante tu proyecto.
                                    </p>

                                    <div className="item-beneficio-registro">

                                        <ClipboardList className="icono-beneficio-registro" />

                                        <div>
                                            <h3>Compará presupuestos</h3>

                                            <p>
                                                Recibí múltiples cotizaciones.
                                            </p>
                                        </div>

                                    </div>

                                    <div className="item-beneficio-registro">

                                        <ShieldCheck className="icono-beneficio-registro" />

                                        <div>
                                            <h3>Empresas verificadas</h3>

                                            <p>
                                                Trabajá con proveedores confiables.
                                            </p>
                                        </div>

                                    </div>

                                    <div className="item-beneficio-registro">

                                        <SearchCheck className="icono-beneficio-registro" />

                                        <div>
                                            <h3>Seguimiento simple</h3>

                                            <p>
                                                Gestioná solicitudes fácilmente.
                                            </p>
                                        </div>

                                    </div>

                                </>

                            )}

                            {esEmpresa && (

                                <>
                                    <h2>
                                        Sumá clientes
                                        <br />
                                        a tu empresa.
                                    </h2>

                                    <div className="linea-destacada-registro"></div>

                                    <p className="descripcion-registro">
                                        Publicá tus servicios y recibí nuevas
                                        oportunidades comerciales.
                                    </p>

                                    <div className="item-beneficio-registro">

                                        <Building2 className="icono-beneficio-registro" />

                                        <div>
                                            <h3>Mayor visibilidad</h3>

                                            <p>
                                                Mostrá tu empresa a más clientes.
                                            </p>
                                        </div>

                                    </div>

                                    <div className="item-beneficio-registro">

                                        <TrendingUp className="icono-beneficio-registro" />

                                        <div>
                                            <h3>Más oportunidades</h3>

                                            <p>
                                                Recibí nuevas solicitudes.
                                            </p>
                                        </div>

                                    </div>

                                    <div className="item-beneficio-registro">

                                        <BriefcaseBusiness className="icono-beneficio-registro" />

                                        <div>
                                            <h3>Perfil profesional</h3>

                                            <p>
                                                Generá confianza y credibilidad.
                                            </p>
                                        </div>

                                    </div>

                                </>

                            )}

                        </div>

                    </div>

                </div>

                {/* PANEL DERECHO */}

                <div className="panel-formulario-registro">

                    <div className="contenedor-formulario-registro">

                        <h2>Crear cuenta</h2>

                        <p className="subtitulo-registro">
                            Elegí el tipo de cuenta que deseas crear.
                        </p>

                        <div className="selector-tipo-cuenta">

                            <button
                                type="button"
                                className={`boton-selector ${esCliente ? "activo" : ""}`}
                                onClick={() => setTipoCuenta("cliente")}
                            >
                                Cliente
                            </button>

                            <button
                                type="button"
                                className={`boton-selector ${esEmpresa ? "activo" : ""}`}
                                onClick={() => setTipoCuenta("empresa")}
                            >
                                Empresa
                            </button>

                        </div>

                        {esCliente && <RegistroCliente />}

                        {esEmpresa && <RegistroEmpresa />}

                    </div>

                </div>

            </div>

        </section>

    );

}