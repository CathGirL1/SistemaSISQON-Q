
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import iconoHomeMenu from "../../assets/iconoHomeMenu.png";

interface SidebarClienteProps {
  menuOpen: boolean;
  onClose: () => void;
}


export default function SidebarCliente({
  menuOpen,
  onClose,
  
}: SidebarClienteProps) {

  const navigate = useNavigate();

  const [cliente, setCliente] = useState<{
    nombre: string;
    apellido: string;
    logo: string | null;
  } | null>(null);

  const [perfilOpen, setPerfilOpen] = useState(false);

  useEffect(() => {
    const obtenerCliente = async () => {
      const usuarioGuardado = localStorage.getItem("usuario");

      if (!usuarioGuardado) {
        return;
      }

      const usuario = JSON.parse(usuarioGuardado);

      if (!usuario.id_Cliente) {
        return;
      }

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
          "Error al obtener datos del cliente:",
          error
        );
      }
    };

    // Cargar los datos al entrar
    obtenerCliente();

    // Escuchar cuando se actualiza la foto
    window.addEventListener(
      "cliente-logo-actualizado",
      obtenerCliente
    );

    return () => {
      window.removeEventListener(
        "cliente-logo-actualizado",
        obtenerCliente
      );
    };
  }, []);

  
  return (
    <>
      <aside className={`cliente-sidebar ${menuOpen ? "open" : ""}`}>
        <div className="cliente-logo">
          <img
            src={iconoHomeMenu}
            alt="SISCON-Q"
            className="logo-sisconq"
          />

          <div className="logo-info">
            <h2>SISCON-Q</h2>
            <p>Sistema de Cotizaciones Inteligentes</p>
          </div>
        </div>

        
          <nav className="cliente-menu">
  <NavLink
    to="/panel-cliente"
    end
    className={({ isActive }) => (isActive ? "active" : "")}
    onClick={onClose}
  >
    ⌂ Dashboard / Inicio
  </NavLink>

  <NavLink
    to="/panel-cliente/proyectos"
    className={({ isActive }) => (isActive ? "active" : "")}
    onClick={onClose}
  >
    ▣ Mis Proyectos
  </NavLink>

  <NavLink
    to="/panel-cliente/cotizaciones"
    className={({ isActive }) => (isActive ? "active" : "")}
    onClick={onClose}
  >
    ▤ Mis Cotizaciones
  </NavLink>

  <NavLink
    to="/panel-cliente/materiales"
    className={({ isActive }) => (isActive ? "active" : "")}
    onClick={onClose}
  >
    ▦ Catálogo de Materiales
  </NavLink>

  <NavLink
    to="/panel-cliente/comparador"
    className={({ isActive }) => (isActive ? "active" : "")}
    onClick={onClose}
  >
    ⚖ Comparador
  </NavLink>

  <NavLink
    to="/panel-cliente/empresas"
    className={({ isActive }) => (isActive ? "active" : "")}
    onClick={onClose}
  >
    ▥ Empresas
  </NavLink>



  <NavLink

    to="/panel-cliente/asistente"
    className={({ isActive }) => (isActive ? "active" : "")}
    onClick={onClose}
  >
    ✦ Asistente IA
  </NavLink>

      </nav>

        <div className="cliente-user-container">

          <button
            type="button"
            className="cliente-user"
            onClick={() => setPerfilOpen((prev) => !prev)}
          >
           <div className="avatar">
              {cliente?.logo ? (
                <img
                  src={`http://localhost:3000${cliente.logo}`}
                  alt={`Foto de ${cliente.nombre} ${cliente.apellido}`}
                />
              ) : (
                cliente
                  ? `${cliente.nombre.charAt(0)}${cliente.apellido.charAt(0)}`
                  : "CL"
              )}
            </div>

            <div>
              <strong>
                {cliente
                  ? `${cliente.nombre} ${cliente.apellido}`
                  : "Cliente"}
              </strong>

              <span>Cliente</span>
            </div>
          </button>

          {perfilOpen && (
            <div className="perfil-dropdown">
              <button
                type="button"
                onClick={() => {
                  setPerfilOpen(false);
                  navigate("/panel-cliente/perfil");
                }}
              >
                ⚙ Configuración de perfil
              </button>
            </div>
          )}

        </div>
      </aside>

      {menuOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          onClick={onClose}
          aria-label="Cerrar menú"
        />
      )}
    </>
  );
}