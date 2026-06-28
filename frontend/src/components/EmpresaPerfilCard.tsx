import { FaBuilding, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

export default function EmpresaPerfilCard() {
  return (
    <div className="dashboard-card empresa-perfil-card">
      <div className="empresa-perfil-avatar">
        <FaBuilding />
      </div>

      <h2>Constructora Demo</h2>
      <p className="empresa-rubro">Construcción y quinchos</p>

      <div className="empresa-info-list">
        <span><FaEnvelope /> empresa@demo.com</span>
        <span><FaPhoneAlt /> 099 123 456</span>
        <span><FaMapMarkerAlt /> Maldonado, Uruguay</span>
      </div>

      <button className="perfil-btn">Ver perfil</button>
    </div>
  );
}