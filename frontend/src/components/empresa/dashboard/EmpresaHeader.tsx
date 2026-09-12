import { useNavigate } from "react-router-dom";


export default function EmpresaHeader() {

  const navigate = useNavigate();
  return (
    <div className="dashboard-header">
      <div>
        <h1>Panel de Empresa</h1>
        <p>Resumen general de cotizaciones, clientes y proyectos.</p>
      </div>

    </div>
  );
}