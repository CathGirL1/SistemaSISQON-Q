

export default function RegistroCliente(){

    return(

        <>
        
            <form className="formulario-registro">

                <label>Nombre completo</label>
                <input type="text" />

                <label>Teléfono</label>
                <input type="text" />

                <label>Email</label>
                <input type="email" />

                <label>Contraseña</label>
                <input type="password" />

                <label>Confirmar contraseña</label>
                <input type="password" />

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