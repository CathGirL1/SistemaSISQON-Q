import "../styles/DatosEmpresaPerfil.css";

export default function DatosEmpresaPerfil() {
  return (
    <div className="perfil-panel">
      <div className="perfil-panel-header">
        <h2>Información de la cuenta</h2>
        <p>Datos principales utilizados dentro del panel de empresa.</p>
      </div>

      <form className="perfil-form">
        <div className="form-group">
          <label>Nombre de usuario</label>
          <input type="text" defaultValue="empresa_demo" />
        </div>

        <div className="form-group">
          <label>Nombre</label>
          <input type="text" defaultValue="Mateo" />
        </div>

        <div className="form-group">
          <label>Apellido</label>
          <input type="text" defaultValue="Faccio" />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" defaultValue="empresa@demo.com" />
        </div>

        <div className="form-group">
          <label>Teléfono</label>
          <input type="text" defaultValue="099 123 456" />
        </div>

        <div className="form-group">
          <label>Dirección</label>
          <input type="text" defaultValue="Av. Principal 123" />
        </div>

        <div className="form-group">
          <label>Ciudad</label>
          <input type="text" defaultValue="Maldonado" />
        </div>

        <div className="form-group">
          <label>País</label>
          <input type="text" defaultValue="Uruguay" />
        </div>

        <div className="form-group">
          <label>Cargo</label>
          <input type="text" defaultValue="Administrador" />
        </div>

        <div className="form-group">
          <label>Departamento</label>
          <input type="text" defaultValue="Gestión Comercial" />
        </div>

        <div className="form-group full">
          <label>Zona de trabajo</label>
          <input type="text" defaultValue="Maldonado, Punta del Este y alrededores" />
        </div>
      </form>
    </div>
  );
}