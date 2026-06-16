import PanelClienteContenedor from "../layouts/PanelEmpresaContenedor";
import PanelClienteContenido from "../components/PanelEmpresaContenido"

import "../styles/PanelEmpresaContenido.css";
export default function PanelEmpresa() {
  return (
    <>
      <PanelClienteContenedor>

        <PanelClienteContenido/>
        
      </PanelClienteContenedor>

    </>
   
  );
}