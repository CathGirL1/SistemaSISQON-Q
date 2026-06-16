import PanelClienteContenedor from "../layouts/PanelClienteContenedor";
import PanelClienteContenido from "../components/PanelClienteContenido"

import "../styles/PanelClienteContenido.css";
export default function PanelCliente() {
  return (
    <>
      <PanelClienteContenedor>

        <PanelClienteContenido/>
        
      </PanelClienteContenedor>

    </>
   
  );
}