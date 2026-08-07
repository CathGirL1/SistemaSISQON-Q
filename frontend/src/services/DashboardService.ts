import type { Dashboard } from "../interfaces/Dashboard";

export async function obtenerDashboard(): Promise<Dashboard> {
  const usuario = JSON.parse(
    localStorage.getItem("usuario") || "{}"
  );

  const idEmpresa = usuario.idEmpresa;

  if (!idEmpresa) {
    throw new Error(
      "No se encontró la empresa asociada al usuario."
    );
  }

  const respuesta = await fetch(
    `http://localhost:3000/api/dashboard/${idEmpresa}`
  );

  if (!respuesta.ok) {
    throw new Error(
      "No fue posible obtener el Dashboard"
    );
  }

  return await respuesta.json();
}