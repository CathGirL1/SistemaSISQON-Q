import "../../../styles/empresa/miPerfil/PreferenciasEmpresa.css";

export default function PreferenciasEmpresa() {
  return (
    <div className="preferencias-card">
      <div className="preferencias-header">
        <h2>Preferencias</h2>
        <p>
          Personalizá las notificaciones que querés recibir sobre la actividad
          de tu empresa.
        </p>
      </div>

      <div className="preferencias-seccion">
        <h3>Notificaciones por correo</h3>

        <label className="preferencia-item">
          <input type="checkbox" defaultChecked />
          <div>
            <span>Recibir emails importantes</span>
            <small>Comunicaciones relevantes del sistema.</small>
          </div>
        </label>

        <label className="preferencia-item">
          <input type="checkbox" defaultChecked />
          <div>
            <span>Nuevas cotizaciones</span>
            <small>Cuando un cliente solicite una cotización.</small>
          </div>
        </label>

        <label className="preferencia-item">
          <input type="checkbox" defaultChecked />
          <div>
            <span>Cotizaciones aprobadas</span>
            <small>Notificación cuando una cotización sea aceptada.</small>
          </div>
        </label>

        <label className="preferencia-item">
          <input type="checkbox" />
          <div>
            <span>Recordatorios de seguimiento</span>
            <small>Alertas para contactar clientes pendientes.</small>
          </div>
        </label>

        <label className="preferencia-item">
          <input type="checkbox" defaultChecked />
          <div>
            <span>Nuevos clientes registrados</span>
            <small>Cuando un nuevo cliente se registre en la plataforma.</small>
          </div>
        </label>
      </div>
    </div>
  );
}