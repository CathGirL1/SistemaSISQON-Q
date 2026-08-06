import type { Dashboard } from "../interfaces/Dashboard";

export async function obtenerDashboard(): Promise<Dashboard> {

    const respuesta = await fetch(
        "http://localhost:3000/api/dashboard/1"
    );

    if (!respuesta.ok) {

        throw new Error(
            "No fue posible obtener el Dashboard"
        );

    }

    return await respuesta.json();

}