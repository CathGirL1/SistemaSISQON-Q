import type { ReactNode } from "react";
import {
  FolderOpen,
  FileText,
  Building2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export default function FlowCliente() {
  return (
    <section className="flow-card">
      <div className="flow-intro">
        <div className="flow-intro-icon">
          <FolderOpen size={28} />
        </div>

        <div>
          <h3>Así funciona SISCON-Q</h3>
          <p>
            A partir de tu proyecto puedes generar una o varias cotizaciones,
            comparar opciones y solicitar presupuestos a empresas.
          </p>
        </div>
      </div>

      <div className="flow-steps">
        <FlowStep
          icon={<FolderOpen size={30} />}
          title="Proyecto"
          text="Entidad principal"
          color="green"
        />

        <ArrowRight className="flow-arrow" size={42} />

        <FlowStep
          icon={<FileText size={30} />}
          title="Cotización"
          text="Resultado derivado"
          color="purple"
        />

        <ArrowRight className="flow-arrow" size={42} />

        <FlowStep
          icon={<Building2 size={30} />}
          title="Solicitud a Empresas"
          text="Para revisión"
          color="blue"
        />

        <ArrowRight className="flow-arrow" size={42} />

        <FlowStep
          icon={<CheckCircle2 size={30} />}
          title="Presupuesto Final"
          text="Respuesta de la empresa"
          color="orange"
        />
      </div>
    </section>
  );
}

interface FlowStepProps {
  icon: ReactNode;
  title: string;
  text: string;
  color: "green" | "purple" | "blue" | "orange";
}

function FlowStep({
  icon,
  title,
  text,
  color,
}: FlowStepProps) {
  return (
    <div className="flow-step">
      <div className={`flow-icon flow-${color}`}>{icon}</div>
      <strong>{title}</strong>
      <span>{text}</span>
    </div>
  );
}