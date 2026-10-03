import "../../../styles/empresa/miPerfil/MiPerfilEmpresa.css";

import PerfilEmpresaCard from "./PerfilEmpresaCard";
import DatosEmpresaPerfil from "./DatosEmpresaPerfil";
import CuentaUsuario from "./CuentaUsuario";

import useCuentaUsuario from "../../../hooks/useCuentaUsuario";
import usePerfilEmpresa from "../../../hooks/usePerfilEmpresa";

export default function MiPerfilEmpresaContenido() {
  const perfilEmpresa = usePerfilEmpresa();
  const cuentaUsuario = useCuentaUsuario();

  return (
    <section className="perfil-empresa-page">
      <div className="perfil-header">
        <div>
          <h1>Mi Perfil</h1>
          <p>
            Administrá la información de tu empresa y tu cuenta.
          </p>
        </div>
      </div>

      <div className="perfil-secciones">
        <PerfilEmpresaCard
          empresa={perfilEmpresa.empresa}
        />

        <DatosEmpresaPerfil
          empresa={perfilEmpresa.empresa}
          handleChange={perfilEmpresa.handleChange}
          handleCancelar={perfilEmpresa.handleCancelar}
          handleSubmit={perfilEmpresa.handleSubmit}
        />

        <CuentaUsuario
          usuario={cuentaUsuario.usuario}
          handleChange={cuentaUsuario.handleChange}
          handleCancelar={cuentaUsuario.handleCancelar}
          handleSubmit={cuentaUsuario.handleSubmit}
        />
      </div>
    </section>
  );
}