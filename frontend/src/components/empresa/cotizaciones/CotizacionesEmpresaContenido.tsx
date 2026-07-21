import "../../../styles/empresa/cotizaciones/CotizacionesEmpresa.css";

import PageHeader from "../../common/PageHeader";
import CotizacionesKPIs from "./CotizacionesKPIs";
import CotizacionesFiltros from "./CotizacionesFiltros";
import TablaCotizaciones from "./TablaCotizaciones";
import PanelPagination from "../../common/PanelPagination";
import PanelBottomCard from "../../common/PanelBottomCard";

export default function CotizacionesEmpresaContenido() {
  return (
    <section className="cotizaciones-page">
      <PageHeader
        title="Gestión de cotizaciones"
        subtitle="Administra y da seguimiento a las solicitudes de cotización recibidas."
        buttonText="Exportar reporte"
      />

      <CotizacionesKPIs />

      <CotizacionesFiltros />

      <TablaCotizaciones />


        <PanelPagination
            currentPage={1}
            totalPages={8}
        />

        <PanelBottomCard
            title="Consejo"
            description="Recordá realizar el seguimiento de las cotizaciones en revisión para aumentar las probabilidades de cierre."
        />
    </section>
  );
}