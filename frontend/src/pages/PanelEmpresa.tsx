import PanelEmpresaContenedor from "../layouts/PanelEmpresaContenedor";
import PanelEmpresaContenido from "../components/PanelEmpresaContenido"

import "../styles/PanelEmpresaContenido.css";
export default function PanelEmpresa() {
  return (
    <>
      <PanelEmpresaContenedor>

        <PanelEmpresaContenido/>
        
      </PanelEmpresaContenedor>

    </>
   
  );
}