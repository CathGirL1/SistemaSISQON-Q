import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import SidebarCliente from "../../components/cliente/SidebarCliente";
import HeaderCliente from "../../components/cliente/HeaderCliente";
import VerDetallePerfilCliente from "../../components/cliente/VerDetallePerfilCliente";
import EdicionPerfilCliente from "../../components/cliente/EdicionVerPerfilCliente";

import "../../styles/VerPerfilCliente.css";



interface Cliente {
  id_Cliente: number;
  id_Usuario: number;
  cedula: string;
  nombre: string;
  apellido: string;
  nombreUsuario: string;
  gmail: string;
  telefono: string | null;
  direccion: string | null;
  ciudad: string | null;
  estado: string;
  notas: string | null;
}

export default function VerPerfilCliente() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const [cliente, setCliente] = useState<Cliente | null>(null);

  const [cargando, setCargando] = useState(true);

  const [editando, setEditando] = useState(false);

  const [mensaje, setMensaje] = useState("");

  const [error, setError] = useState("");


  // =========================================
  // OBTENER CLIENTE
  // =========================================

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");

    if (!usuarioGuardado) {
      navigate("/login");
      return;
    }

    const usuario = JSON.parse(usuarioGuardado);

    if (!usuario.id_Cliente) {
      navigate("/login");
      return;
    }

    const obtenerCliente = async () => {
      try {
        const respuesta = await fetch(
          `http://localhost:3000/api/clientes/${usuario.id_Cliente}`
        );

        if (!respuesta.ok) {
          throw new Error("No se pudo obtener el cliente");
        }

        const datosCliente = await respuesta.json();

        setCliente(datosCliente);

      } catch (error) {
        console.error(
          "Error al obtener los datos del cliente:",
          error
        );

        setError(
          "No se pudieron cargar los datos del perfil."
        );

      } finally {
        setCargando(false);
      }
    };

    obtenerCliente();

  }, [navigate]);


  // =========================================
  // ACTUALIZAR CLIENTE
  // =========================================

  const actualizarCliente = async (
    clienteActualizado: Cliente
  ) => {

    setMensaje("");
    setError("");

    try {

      const respuesta = await fetch(
        `http://localhost:3000/api/clientes/${clienteActualizado.id_Cliente}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            nombreUsuario: clienteActualizado.nombreUsuario,

            gmail: clienteActualizado.gmail,

            telefono:
              clienteActualizado.telefono || null,

            direccion:
              clienteActualizado.direccion || null,

            cedula: clienteActualizado.cedula,

            nombre: clienteActualizado.nombre,

            apellido: clienteActualizado.apellido,

            ciudad:
              clienteActualizado.ciudad || null,

            estado: clienteActualizado.estado,

            notas:
              clienteActualizado.notas || null,
          }),
        }
      );


      if (!respuesta.ok) {

        const datosError =
          await respuesta.json().catch(() => null);

        throw new Error(
          datosError?.mensaje ||
          "No se pudieron guardar los cambios."
        );
      }


      const datosActualizados =
        await respuesta.json();


      // Actualizamos el estado del padre
      setCliente(datosActualizados);


      // Salimos del modo edición
      setEditando(false);


      // Mostramos mensaje
      setMensaje(
        "Los cambios se guardaron correctamente."
      );


      // Quitamos el mensaje después de unos segundos
      setTimeout(() => {
        setMensaje("");
      }, 3000);

    } catch (error) {

      console.error(
        "Error al actualizar el perfil:",
        error
      );

      throw new Error(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al guardar los cambios."
      );
    }
  };


  // =========================================
  // CARGANDO
  // =========================================

  if (cargando) {
    return (
      <div className="cliente-panel">

        <SidebarCliente
          menuOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
        />

        <main className="cliente-main">

          <HeaderCliente
            title="Mi perfil"
            subtitle="Consulta y administra tus datos personales."
            menuOpen={menuOpen}
            onToggleMenu={() =>
              setMenuOpen((prev) => !prev)
            }
          />

          <div className="perfil-loading">
            <p>
              Cargando información del perfil...
            </p>
          </div>

        </main>

      </div>
    );
  }


  // =========================================
  // VISTA PRINCIPAL
  // =========================================

  return (
    <div className="cliente-panel">

      <SidebarCliente
        menuOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />


      <main className="cliente-main">

        <HeaderCliente
          title="Mi perfil"
          subtitle="Consulta y administra tus datos personales."
          menuOpen={menuOpen}
          onToggleMenu={() =>
            setMenuOpen((prev) => !prev)
          }
        />


        <section className="perfil-section">

          {/* =================================
              MENSAJE DE ÉXITO
              ================================= */}

          {mensaje && (
            <div className="perfil-mensaje-exito">
              ✓ {mensaje}
            </div>
          )}


          {/* =================================
              ERROR
              ================================= */}

          {error && !editando && (
            <div className="perfil-mensaje-error">
              {error}
            </div>
          )}


          {/* =================================
              DETALLE / EDICIÓN
              ================================= */}

          {cliente && (

            editando ? (

              <EdicionPerfilCliente
                cliente={cliente}
                onGuardar={actualizarCliente}
                onCancelar={() => {
                  setEditando(false);
                  setError("");
                }}
              />

            ) : (

              <VerDetallePerfilCliente
                cliente={cliente}
                onEditar={() => {
                  setMensaje("");
                  setError("");
                  setEditando(true);
                }}
              />

            )

          )}

        </section>

      </main>

    </div>
  );
}