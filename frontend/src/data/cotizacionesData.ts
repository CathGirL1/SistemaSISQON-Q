import type { Cotizacion } from "../interfaces/Cotizacion";

export const cotizacionesData: Cotizacion[] = [
  {
    id: "COT-001",
    cliente: "Juan Pérez",
    email: "juan@email.com",
    tipoObra: "Quincho moderno",
    fecha: "22/06/2026",
    total: "$ 185.000",
    estado: "Nueva",
  },
  {
    id: "COT-002",
    cliente: "Lucía Gómez",
    email: "lucia@email.com",
    tipoObra: "Reforma exterior",
    fecha: "21/06/2026",
    total: "$ 92.300",
    estado: "En revisión",
  },
  {
    id: "COT-003",
    cliente: "Carlos Silva",
    email: "carlos@email.com",
    tipoObra: "Quincho rústico",
    fecha: "20/06/2026",
    total: "$ 220.000",
    estado: "Contactado",
  },
  {
    id: "COT-004",
    cliente: "Martina Acosta",
    email: "martina@email.com",
    tipoObra: "Construcción general",
    fecha: "18/06/2026",
    total: "$ 340.000",
    estado: "Aprobada",
  },
  {
    id: "COT-005",
    cliente: "Pedro Núñez",
    email: "pedro@email.com",
    tipoObra: "Quincho familiar",
    fecha: "15/06/2026",
    total: "$ 175.500",
    estado: "Rechazada",
  },
];