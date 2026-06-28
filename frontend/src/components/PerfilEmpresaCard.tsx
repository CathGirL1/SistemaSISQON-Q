import "../styles/PerfilEmpresaCard.css";
import { FaBuilding, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaIdCard } from "react-icons/fa";

export default function PerfilEmpresaCard() {
  return (
    <div className="perfil-card">
      <div className="perfil-avatar-empresa">
        <FaBuilding />
      </div>

      <h2>Constructora Demo</h2>
      <p className="perfil-rubro">Construcción y quinchos</p>

      <div className="perfil-info-list">
        <span><FaEnvelope /> empresa@demo.com</span>
        <span><FaPhoneAlt /> 099 123 456</span>
        <span><FaMapMarkerAlt /> Maldonado, Uruguay</span>
        <span><FaIdCard /> RUT: 213123120001</span>
      </div>

      <button className="perfil-card-btn">Cambiar logo</button>
    </div>
  );
}