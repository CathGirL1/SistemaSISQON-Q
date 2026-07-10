import { useState } from "react";
import {
  FaCog,
  FaBoxes,
  FaCalculator,
  FaUserCog,
  FaPlusCircle,
} from "react-icons/fa";

import type { TipoObraEmpresa } from "../../../interfaces/TipoObraEmpresa";

type Props = {
  tipoObra: TipoObraEmpresa;
};

export default function TipoObraTabs({ tipoObra }: Props) {
  const [tabActiva, setTabActiva] = useState("configuracion");

  return (
    <>
      <div className="tipo-obra-tabs">
        <button
          className={tabActiva === "configuracion" ? "active" : ""}
          onClick={() => setTabActiva("configuracion")}
        >
          <FaCog /> Configuración
        </button>

        <button
          className={tabActiva === "materiales" ? "active" : ""}
          onClick={() => setTabActiva("materiales")}
        >
          <FaBoxes /> Materiales
        </button>

        <button
          className={tabActiva === "formulas" ? "active" : ""}
          onClick={() => setTabActiva("formulas")}
        >
          <FaCalculator /> Fórmulas
        </button>

        <button
          className={tabActiva === "manoObra" ? "active" : ""}
          onClick={() => setTabActiva("manoObra")}
        >
          <FaUserCog /> Mano de obra
        </button>

        <button
          className={tabActiva === "extras" ? "active" : ""}
          onClick={() => setTabActiva("extras")}
        >
          <FaPlusCircle /> Extras
        </button>
      </div>

      <div className="tipo-obra-tab-content">
        {tabActiva === "configuracion" && (
          <>
            <div className="detalle-grid">
              <div className="detalle-box">
                <span>Código</span>
                <strong>{tipoObra.codigo}</strong>
              </div>

              <div className="detalle-box">
                <span>Tiempo aprox.</span>
                <strong>{tipoObra.tiempoAproximado}</strong>
              </div>

              <div className="detalle-box">
                <span>Dificultad</span>
                <strong>{tipoObra.dificultad}</strong>
              </div>

              <div className="detalle-box">
                <span>Materiales</span>
                <strong>{tipoObra.materialesAsociados}</strong>
              </div>
            </div>

            <div className="detalle-section">
              <h4>Descripción</h4>
              <p>{tipoObra.descripcion}</p>
            </div>

            <div className="detalle-section">
              <h4>Observaciones</h4>
              <p>{tipoObra.observaciones}</p>
            </div>
          </>
        )}

        {tabActiva === "materiales" && (
          <div className="mini-table">
            <div className="mini-row head">
              <span>Material</span>
              <span>Cantidad</span>
              <span>Unidad</span>
            </div>

            <div className="mini-row">
              <span>Madera pino seco</span>
              <span>12</span>
              <span>m²</span>
            </div>

            <div className="mini-row">
              <span>Cemento</span>
              <span>6</span>
              <span>sacos</span>
            </div>

            <div className="mini-row">
              <span>Arena fina</span>
              <span>3</span>
              <span>m³</span>
            </div>

            <div className="mini-row">
              <span>Hierro 10mm</span>
              <span>8</span>
              <span>barras</span>
            </div>
          </div>
        )}

        {tabActiva === "formulas" && (
          <div className="formula-box">
            <div>Costo base</div>
            <span>+</span>
            <div>Materiales</div>
            <span>+</span>
            <div>Mano de obra</div>
            <span>+</span>
            <div>Extras</div>
            <span>=</span>
            <div className="total">Total</div>

            <p>{tipoObra.formulaCalculo}</p>
          </div>
        )}

        {tabActiva === "manoObra" && (
          <div className="mano-obra-grid">
            <div>
              <span>Equipo estimado</span>
              <strong>{tipoObra.manoObra}</strong>
            </div>

            <div>
              <span>Horas estimadas</span>
              <strong>48 hs</strong>
            </div>

            <div>
              <span>Costo hora</span>
              <strong>$ 750</strong>
            </div>

            <div>
              <span>Total estimado</span>
              <strong>$ 108.000</strong>
            </div>
          </div>
        )}

        {tabActiva === "extras" && (
          <div className="extras-list">
            {tipoObra.extras.split(",").map((extra) => (
              <div key={extra}>
                <span>✓</span>
                {extra.trim()}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}