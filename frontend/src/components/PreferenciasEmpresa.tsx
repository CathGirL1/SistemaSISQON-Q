import "../styles/PreferenciasEmpresa.css";

export default function PreferenciasEmpresa() {
  return (
    <div className="preferencias-card">
      <div className="preferencias-header">
        <h2>Preferencias</h2>
        <p>Configuración general de notificaciones.</p>
      </div>

      <div className="preferencias-list">
        <label>
          <input type="checkbox" defaultChecked />
          Recibir emails importantes
        </label>

        <label>
          <input type="checkbox" defaultChecked />
          Avisos de nuevas cotizaciones
        </label>

        <label>
          <input type="checkbox" defaultChecked />
          Cotizaciones aprobadas
        </label>

        <label>
          <input type="checkbox" />
          Recordatorios de seguimiento
        </label>

        <label>
          <input type="checkbox" defaultChecked />
          Nuevos clientes registrados
        </label>
      </div>
    </div>
  );
}