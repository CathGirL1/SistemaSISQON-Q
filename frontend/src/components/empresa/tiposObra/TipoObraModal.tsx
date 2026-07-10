import "../../../styles/empresa/tiposObra/TiposObraModales.css";

import ModalBase from "../../common/ModalBase";
import type { TipoObraEmpresa, EstadoTipoObra } from "../../../interfaces/TipoObraEmpresa";

type Props = {
  abierto: boolean;
  modo: "crear" | "editar";
  tipoObra: TipoObraEmpresa | null;
  onCerrar: () => void;
  onGuardar: (tipoObra: TipoObraEmpresa) => void;
};

export default function TipoObraModal({
  abierto,
  modo,
  tipoObra,
  onCerrar,
  onGuardar,
}: Props) {
  const guardar = () => {
    const nuevoTipo: TipoObraEmpresa = {
      id: tipoObra?.id || Date.now(),
      codigo: (document.getElementById("codigoTipoObra") as HTMLInputElement).value,
      nombre: (document.getElementById("nombreTipoObra") as HTMLInputElement).value,
      descripcion: (document.getElementById("descripcionTipoObra") as HTMLTextAreaElement).value,
      materialesAsociados: Number((document.getElementById("materialesTipoObra") as HTMLInputElement).value),
      tiempoAproximado: (document.getElementById("tiempoTipoObra") as HTMLInputElement).value,
      dificultad: (document.getElementById("dificultadTipoObra") as HTMLInputElement).value,
      estado: (document.getElementById("estadoTipoObra") as HTMLSelectElement).value as EstadoTipoObra,
      formulaCalculo: tipoObra?.formulaCalculo || "Basada en materiales + mano de obra + extras.",
      manoObra: tipoObra?.manoObra || "2 - 3 personas según complejidad.",
      extras: tipoObra?.extras || "Transporte, limpieza, terminaciones.",
      observaciones: tipoObra?.observaciones || "Sin observaciones registradas.",
    };

    onGuardar(nuevoTipo);
  };

  return (
    <ModalBase
      abierto={abierto}
      titulo={modo === "crear" ? "Agregar tipo de obra" : `Editar tipo de obra - ${tipoObra?.nombre}`}
      onCerrar={onCerrar}
    >
      <form className="tipo-obra-modal-form">
        <div>
          <label>Nombre</label>
          <input id="nombreTipoObra" type="text" defaultValue={tipoObra?.nombre || ""} />
        </div>

        <div>
          <label>Código</label>
          <input id="codigoTipoObra" type="text" defaultValue={tipoObra?.codigo || ""} />
        </div>

        <div className="full">
          <label>Descripción</label>
          <textarea id="descripcionTipoObra" defaultValue={tipoObra?.descripcion || ""}></textarea>
        </div>

        <div>
          <label>Materiales asociados</label>
          <input id="materialesTipoObra" type="number" defaultValue={tipoObra?.materialesAsociados || 0} />
        </div>

        <div>
          <label>Tiempo aproximado</label>
          <input id="tiempoTipoObra" type="text" defaultValue={tipoObra?.tiempoAproximado || ""} />
        </div>

        <div>
          <label>Dificultad</label>
          <input id="dificultadTipoObra" type="text" defaultValue={tipoObra?.dificultad || ""} />
        </div>

        <div>
          <label>Estado</label>
          <select id="estadoTipoObra" defaultValue={tipoObra?.estado || "Activo"}>
            <option>Activo</option>
            <option>Inactivo</option>
          </select>
        </div>

        <div className="tipo-obra-modal-actions">
          <button type="button" className="btn-cancelar" onClick={onCerrar}>
            Cancelar
          </button>

          <button type="button" className="btn-guardar" onClick={guardar}>
            {modo === "crear" ? "Agregar tipo de obra" : "Guardar cambios"}
          </button>
        </div>
      </form>
    </ModalBase>
  );
}