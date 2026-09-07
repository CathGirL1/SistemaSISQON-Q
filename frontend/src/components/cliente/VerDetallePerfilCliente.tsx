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

interface DetallePerfilClienteProps {
  cliente: Cliente;
  onEditar: () => void;
}

export default function VerDetallePerfilCliente({
  cliente,
  onEditar,
}: DetallePerfilClienteProps) {
  return (
    <div className="perfil-card">

      {/* HEADER DEL PERFIL */}

      <div className="perfil-header">

        <div className="perfil-avatar">
          {cliente.nombre.charAt(0)}
          {cliente.apellido.charAt(0)}
        </div>

        <div className="perfil-header-info">

          <h2>
            {cliente.nombre} {cliente.apellido}
          </h2>

          <p>
            Cliente de SISCON-Q
          </p>

        </div>

      </div>


      {/* INFORMACIÓN */}

      <div className="perfil-content">

        <div className="perfil-subtitle">

          <h3>
            Información personal
          </h3>

          <p>
            Datos asociados a tu cuenta.
          </p>

        </div>


        <div className="perfil-grid">

          {/* NOMBRE */}

          <div className="perfil-field">

            <span>
              Nombre
            </span>

            <strong>
              {cliente.nombre}
            </strong>

          </div>


          {/* APELLIDO */}

          <div className="perfil-field">

            <span>
              Apellido
            </span>

            <strong>
              {cliente.apellido}
            </strong>

          </div>


          {/* CÉDULA */}

          <div className="perfil-field">

            <span>
              Cédula
            </span>

            <strong>
              {cliente.cedula}
            </strong>

          </div>


          {/* CORREO */}

          <div className="perfil-field">

            <span>
              Correo electrónico
            </span>

            <strong>
              {cliente.gmail}
            </strong>

          </div>


          {/* TELÉFONO */}

          <div className="perfil-field">

            <span>
              Teléfono
            </span>

            <strong>
              {cliente.telefono || "No especificado"}
            </strong>

          </div>


          {/* CIUDAD */}

          <div className="perfil-field">

            <span>
              Ciudad
            </span>

            <strong>
              {cliente.ciudad || "No especificada"}
            </strong>

          </div>


          {/* DIRECCIÓN */}

          <div className="perfil-field perfil-field-full">

            <span>
              Dirección
            </span>

            <strong>
              {cliente.direccion || "No especificada"}
            </strong>

          </div>

        </div>

      </div>


      {/* ACCIONES */}

      <div className="perfil-actions">

        <button
          type="button"
          className="perfil-edit-button"
          onClick={onEditar}
        >
          ✎ Editar perfil
        </button>

      </div>

    </div>
  );
}