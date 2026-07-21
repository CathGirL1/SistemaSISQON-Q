import type { DashboardEmpresaData } from "../interfaces/DashboardEmpresa";

export async function obtenerDashboardEmpresa(): Promise<DashboardEmpresaData> {
  return {
    empresa: {
      nombreEmpresa: "Constructora Demo",
      rubro: "Construcción y quinchos",
      email: "empresa@demo.com",
      telefono: "099 123 456",
      ubicacion: "Maldonado, Uruguay",
    },

    kpis: {
      cotizaciones: 128,
      clientes: 64,
      proyectosActivos: 21,
      ingresosEstimados: 842500,
    },

    cotizaciones: [
      {
        cliente: "Juan Pérez",
        proyecto: "Quincho moderno",
        total: 185000,
        estado: "Aprobada",
      },
      {
        cliente: "Lucía Gómez",
        proyecto: "Reforma patio",
        total: 92300,
        estado: "Pendiente",
      },
      {
        cliente: "Carlos Silva",
        proyecto: "Quincho rústico",
        total: 220000,
        estado: "Rechazada",
      },
    ],

    clientes: [
      {
        iniciales: "JP",
        nombre: "Juan Pérez",
        proyecto: "Quincho moderno",
      },
      {
        iniciales: "LG",
        nombre: "Lucía Gómez",
        proyecto: "Reforma exterior",
      },
      {
        iniciales: "CS",
        nombre: "Carlos Silva",
        proyecto: "Quincho rústico",
      },
    ],

    proyectos: [
      {
        nombre: "Quincho familiar",
        cliente: "Martín Rodríguez",
        progreso: 75,
      },
      {
        nombre: "Reforma exterior",
        cliente: "Sofía Acosta",
        progreso: 45,
      },
      {
        nombre: "Construcción quincho",
        cliente: "Pedro Núñez",
        progreso: 30,
      },
    ],
  };
}