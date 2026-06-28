import "../styles/MiPerfilEmpresa.css";

import PerfilEmpresaCard from "./PerfilEmpresaCard";
import DatosEmpresaPerfil from "./DatosEmpresaPerfil";
import PreferenciasEmpresa from "./PreferenciasEmpresa";
import HistorialEmpresa from "./HistorialEmpresa";

export default function MiPerfilEmpresaContenido() {
  return (
    <section className="perfil-empresa-page">
      <div className="perfil-header">
        <div>
          <h1>Mi Perfil</h1>
          <p>Administrá la información de tu empresa y tu cuenta.</p>
        </div>

        <button className="perfil-header-btn">Guardar cambios</button>
      </div>

      <div className="perfil-grid">
        <div className="perfil-left">
          <PerfilEmpresaCard />
          <PreferenciasEmpresa />
        </div>

        <div className="perfil-right">
          <DatosEmpresaPerfil />
          <HistorialEmpresa />
        </div>
      </div>
    </section>
  );
}