import "../styles/RegistroProyectoContenido.css"


import { useState } from "react";
import { FolderPlus } from "lucide-react";



export default function CrearProyecto() {


    const [nombre, setNombre] = useState("");
    const [tipoObra, setTipoObra] = useState("");
    const [alto, setAlto] = useState("");
    const [ancho, setAncho] = useState("");
    const [largo, setLargo] = useState("");
    const [estado, setEstado] = useState("Borrador");

    const usuario = JSON.parse(
        localStorage.getItem("usuario") || "{}"
    );

    const idCliente = usuario.id_Cliente;

    const crearProyecto = async (e: React.FormEvent) => {

        e.preventDefault();

        try {
            console.log(usuario);
            console.log(usuario.idCliente);
            console.log(usuario.id_Cliente);
            console.log(Object.keys(usuario));
            const respuesta = await fetch(
                "http://localhost:3000/api/crearProyecto/crearProyecto",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({

                        idCliente,

                        idEmpresa: null,

                        idTipoObra: Number(tipoObra),

                        nombre,

                        estado,

                        alto: Number(alto),

                        ancho: Number(ancho),

                        largo: Number(largo)

                    })
                }
            );

            const datos = await respuesta.json();

            if (datos.success) {

                alert("Proyecto creado correctamente.");

              

            } else {

                alert(datos.message);

            }

        } catch (error) {

            console.error(error);

            alert("Ocurrió un error al crear el proyecto.");

        }

    };
    

    return (

        <section className="seccion-crear-proyecto">

            <div className="card-crear-proyecto">

                <div className="encabezado-proyecto">

                    <FolderPlus size={45}/>

                    <div>

                        <h2>Crear nuevo proyecto</h2>

                        <p>

                            Completá la información para comenzar a gestionar tu proyecto.

                        </p>

                    </div>

                </div>

                <form
                    className="formulario-proyecto"
                    onSubmit={crearProyecto}
                >

                    <label>

                        Nombre del proyecto

                    </label>

                    <input
                        type="text"
                        placeholder="Ej: Quincho del fondo"
                        value={nombre}
                        onChange={(e)=>setNombre(e.target.value)}
                        required
                    />

                    <label>

                        Tipo de obra

                    </label>

                    <select
                        value={tipoObra}
                        onChange={(e)=>setTipoObra(e.target.value)}
                        required
                    >

                        <option value="">

                            Seleccione un tipo de obra

                        </option>

                        <option value="1">

                            Quincho

                        </option>

                        <option value="2">

                            Remodelación

                        </option>

                        <option value="3">

                            Ampliación

                        </option>

                        <option value="4">

                            Construcción General

                        </option>

                    </select>

                    <h3 className="titulo-medidas">

                        Medidas del proyecto

                    </h3>

                    <div className="fila-medidas">

                        <div>

                            <label>

                                Alto (m)

                            </label>

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={alto}
                                onChange={(e)=>setAlto(e.target.value)}
                                required
                            />

                        </div>

                        <div>

                            <label>

                                Ancho (m)

                            </label>

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={ancho}
                                onChange={(e)=>setAncho(e.target.value)}
                                required
                            />

                        </div>

                        <div>

                            <label>

                                Largo (m)

                            </label>

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={largo}
                                onChange={(e)=>setLargo(e.target.value)}
                                required
                            />

                        </div>

                    </div>

                    <label>Estado</label>

                    <select
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                    >

                        <option value="Borrador">
                            Borrador
                        </option>

                        <option value="Activo">
                            Activo
                        </option>

                        <option value="Pausado">
                            Pausado
                        </option>

                    </select>
                    <div className="informacion-extra">


                        <div>

                            <strong>Empresa asignada</strong>

                            <span>Se asignará luego de solicitar una cotización.</span>

                        </div>

                    </div>

                    <div className="botones-proyecto">

                        <button
                            type="button"
                            className="boton-cancelar"
                        >

                            Cancelar

                        </button>

                        <button
                            type="submit"
                            className="boton-crear"
                        >

                            Crear proyecto

                        </button>

                    </div>

                </form>

            </div>

        </section>

    );

}