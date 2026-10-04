import ModalBase from "../components/common/ModalBase";

type Props = {
  abierto: boolean;
  onCerrar: () => void;
  onConfirmar: () => void;
};

export default function ConfirmFinalizarCotizacion({
  abierto,
  onCerrar,
  onConfirmar,
}: Props) {

    
  return (
    <ModalBase
      abierto={abierto}
      titulo="Finalizar cotización"
      onCerrar={onCerrar}
    >
      <div className="confirmar-finalizar-cotizacion">
        <p>
          ¿Seguro que querés finalizar esta cotización?
        </p>

        <p className="confirmar-finalizar-cotizacion-aviso">
          Una vez finalizada, la cotización no podrá volver a
          modificarse.
        </p>

        <div className="confirmar-finalizar-cotizacion-actions">
          <button
            type="button"
            className="btn-cancelar-finalizar"
            onClick={onCerrar}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="btn-confirmar-finalizar"
            onClick={onConfirmar}
          >
            Finalizar cotización
          </button>
        </div>
      </div>
    </ModalBase>
  );
}