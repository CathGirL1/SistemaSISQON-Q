import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegistroEmpresa(){
    const [nombreEmpresa, setNombreEmpresa] = useState("");
    const [rut, setRut] = useState("");

    const [nombreUsuario, setNombreUsuario] = useState("");
    const [telefono, setTelefono] = useState("");
    const [direccion, setDireccion] = useState("");

    const [gmail, setGmail] = useState("");

    const [password, setPassword] = useState("");
    const [confirmarPassword, setConfirmarPassword] = useState("");
    const [mensaje, setMensaje] = useState("");

    const navigate = useNavigate();

    const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

    const soloNumeros = /^[0-9]+$/;

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    const registrarEmpresa = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();
        setMensaje("");
        if (
            nombreEmpresa.trim() === "" ||
            rut.trim() === "" ||
            nombreUsuario.trim() === "" ||
            telefono.trim() === "" ||
            direccion.trim() === "" ||
            gmail.trim() === "" ||
            password.trim() === "" ||
            confirmarPassword.trim() === ""
        ) {

            setMensaje("Debe completar todos los campos.");

            return;

        }

        if (nombreEmpresa.length < 2) {

            setMensaje("El nombre comercial debe tener al menos 2 caracteres.");

            return;

        }

        if (nombreEmpresa.length > 100) {

            setMensaje("El nombre comercial no puede superar los 100 caracteres.");

            return;

        }

        if (!soloLetras.test(nombreEmpresa)) {

            setMensaje("El nombre comercial solo puede contener letras.");

            return;

        }

        if (!soloNumeros.test(rut)) {

            setMensaje("El RUT solo puede contener números.");

            return;

        }

        if (rut.length > 12) {

            setMensaje("El RUT no puede superar los 12 dígitos.");

            return;

        }

        if (nombreUsuario.length < 4) {

            setMensaje("El nombre de usuario debe tener al menos 4 caracteres.");

            return;

        }

        if (nombreUsuario.length > 30) {

            setMensaje("El nombre de usuario no puede superar los 30 caracteres.");

            return;

        }

        if (!soloNumeros.test(telefono)) {

            setMensaje("El teléfono solo puede contener números.");

            return;

        }

        if (telefono.length > 15) {

            setMensaje("El teléfono no puede superar los 15 dígitos.");

            return;

        }

        if (direccion.length > 100) {

            setMensaje("La dirección no puede superar los 100 caracteres.");

            return;

        }

        if (!emailValido.test(gmail)) {

            setMensaje("Debe ingresar un correo electrónico válido.");

            return;

        }

        if (password.length < 8) {

            setMensaje("La contraseña debe tener al menos 8 caracteres.");

            return;

        }

        if (password.length > 50) {

            setMensaje("La contraseña no puede superar los 50 caracteres.");

            return;

        }


        if (password !== confirmarPassword) {

            setMensaje("Las contraseñas no coinciden");
            return;

        }

        try {

            const respuesta = await fetch(
                "http://localhost:3000/api/registro/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        nombreUsuario,
                        gmail,
                        telefono,
                        password,
                        direccion,
                        rol: "empresa",

                        nombreEmpresa,
                        rut
                    })
                }
            );

            const datos = await respuesta.json();

            console.log(datos);

            if (respuesta.ok) {

                navigate("/panel-empresa");

            }

        } catch (error) {

            console.error(error);

        }

    };

    return(

        <>
        
            <form className="formulario-registro" onSubmit={registrarEmpresa}>

                <label>Nombre comercial</label>
                <input
                    type="text"
                    value={nombreEmpresa}
                    onChange={(e) => setNombreEmpresa(e.target.value)}
                />

                <label>RUT</label>
                <input
                    type="text"
                    value={rut}
                    onChange={(e) => setRut(e.target.value)}
                />

                <label>Nombre de usuario</label>
                <input
                    type="text"
                    value={nombreUsuario}
                    onChange={(e) => setNombreUsuario(e.target.value)}
                />

                <label>Teléfono</label>
                <input
                    type="text"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                />

                <label>Dirección</label>
                <input
                    type="text"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                />

                <label>Email</label>
                <input
                    type="email"
                    value={gmail}
                    onChange={(e) => setGmail(e.target.value)}
                />

                <label>Contraseña</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <label>Confirmar contraseña</label>
                <input
                    type="password"
                    value={confirmarPassword}
                    onChange={(e) => setConfirmarPassword(e.target.value)}
                />

                <button
                    type="submit"
                    className="boton-crear-cuenta"
                >
                    Crear cuenta
                </button>
                    {mensaje && (

                        <p className="mensaje-error">
                            {mensaje}
                        </p>

                    )}

            </form>
          
        </>

    );


}