import PanelClienteContenedor from "../layouts/PanelClienteContenedor";
import PanelClienteContenido from "../components/PanelClienteContenido";

export default function PanelCliente() {
  return (
    <PanelClienteContenedor>
      <PanelClienteContenido />
    </PanelClienteContenedor>
  );
}