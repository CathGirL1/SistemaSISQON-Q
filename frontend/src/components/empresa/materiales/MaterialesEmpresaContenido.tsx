import "../../../styles/empresa/materiales/MaterialesEmpresa.css";

import { useState } from "react";

import PageHeader from "../../common/PageHeader";
import MaterialesKPIs from "./MaterialesKPIs";
import MaterialesFiltros from "./MaterialesFiltros";
import TablaMateriales from "./TablaMateriales";
import PanelBottomCard from "../../common/PanelBottomCard";
import MaterialModal from "./MaterialModal";

export default function MaterialesEmpresaContenido() {
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);

  return (
    <section className="materiales-page">
      <PageHeader
        title="Gestión de materiales"
        subtitle="Administra los materiales, precios y disponibilidad del sistema."
        buttonText="Agregar material"
        onButtonClick={() => setModalCrearAbierto(true)}
      />

      <MaterialesKPIs />

      <MaterialesFiltros />

      <TablaMateriales />

      <PanelBottomCard
        title="Importante"
        description="Mantené los precios y stocks actualizados para asegurar cotizaciones precisas y competitivas."
        secondaryText="Ver guía de actualización"
      />

      <MaterialModal
        abierto={modalCrearAbierto}
        modo="crear"
        material={null}
        onCerrar={() => setModalCrearAbierto(false)}
      />
    </section>
  );
}