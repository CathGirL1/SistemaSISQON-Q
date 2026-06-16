import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegistroCliente(){
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [cedula, setCedula] = useState("");

    const [nombreUsuario, setNombreUsuario] = useState("");
    const [telefono, setTelefono] = useState("");
    const [direccion, setDireccion] = useState("");

    const [gmail, setGmail] = useState("");

    const [password, setPassword] = useState("");
    const [confirmarPassword, setConfirmarPassword] = useState("");

    const navigate = useNavigate();

    const registrarCliente = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();
         
        if (password !== confirmarPassword) {

            alert("Las contraseñas no coinciden");
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
                        rol: "cliente",

                        cedula,
                        nombre,
                        apellido
                    })
                }
            );

            const datos = await respuesta.json();

            console.log(datos);

            if (respuesta.ok) {

                navigate("/panel-cliente");

            }

        } catch (error) {

            console.error(error);

        }

    };

    return(
        
        <>
        
            <form className="formulario-registro" onSubmit={registrarCliente}>

                <label>Nombre</label>
                <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />

                <label>Apellido</label>
                <input
                    type="text"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                />

                <label>Cédula</label>
                <input
                    type="text"
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value)}
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

            </form>
        
        </>

    );


}