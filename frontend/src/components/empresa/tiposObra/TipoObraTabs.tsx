import { useState } from "react";
import {
  FaCog,
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
                <span>Estado</span>
                <strong>{tipoObra.estado}</strong>
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

        {tabActiva === "extras" && (
          <div className="extras-list">
            {tipoObra.extras
              .split(",")
              .filter((extra) => extra.trim() !== "")
              .map((extra) => (
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