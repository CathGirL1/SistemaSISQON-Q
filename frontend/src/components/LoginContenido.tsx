import "../styles/LoginContenido.css"
import imagenLogin from "../assets/imagenLogin.png";
import imagenLogo from "../assets/iconoHomeMenu.png";

import { Calculator } from "lucide-react";
import { BarChart3 } from "lucide-react";

export default function LoginContenido() {
  return (
    <section className="seccion-login">

      <div className="contenedor-login">

        {/* Panel izquierdo */}
        <div
          className="panel-informacion-login"
          style={{ backgroundImage: `url(${imagenLogin})` }}
        >

          <div className="capa-oscura-login">

            <div className="logo-login">
              <img src={imagenLogo} alt="SISCON-Q"></img>
                <div className="texto-logo-login">
                    <h1>SISCON-Q</h1>
                    <p>Sistema de Cotizaciones Inteligentes</p>
                </div>
              
            </div>

            <div className="contenido-informacion-login">

              <h2>
                Cotizá mejor.
                <br />
                Construí más.
              </h2>

              <div className="linea-destacada-login"></div>

              <p className="descripcion-login">
                Plataforma inteligente para generar cotizaciones
                de obras de construcción y quinchos de manera
                rápida, precisa y profesional.
              </p>

                <div className="item-beneficio-login">

                    <Calculator className="icono-beneficio-login" />

                        <div className="contenido-beneficio-login">
                            <h3>Cotizaciones precisas</h3>

                            <p>
                                Calculá costos de materiales y mano de obra
                                en segundos.
                            </p>
                        </div>

                    </div>

                        <div className="item-beneficio-login">

                            <BarChart3 className="icono-beneficio-login" />

                            <div className="contenido-beneficio-login">
                                <h3>Gestión eficiente</h3>

                                <p>
                                    Organizá tus proyectos de manera simple.
                                </p>
                            </div>

                        </div>
                    </div>
                </div>

        </div>

        {/* Panel derecho */}
        <div className="panel-formulario-login">

          <div className="contenedor-formulario-login">

            <h2>Iniciar sesión</h2>

            <p className="subtitulo-login">
              Ingresá tus datos para acceder a tu cuenta.
            </p>

            <form className="formulario-login">

              <label>Email</label>

              <input
                type="email"
                placeholder="tu@email.com"
              />

              <label>Contraseña</label>

              <input
                type="password"
                placeholder="Tu contraseña"
              />
              
                <div className="opcion-login">

                    <a href="/recuperar-password" className="enlace-recuperar-password">
                        ¿Olvidaste tu contraseña?
                    </a>

                </div>

              <button
                type="submit"
                className="boton-ingresar-login"
              >
                Ingresar
              </button>

            </form>

            <p className="texto-registro-login">
              ¿No tenés cuenta?
              <a href="/register">
                Registrate aquí
              </a>
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}