import type { EstadoCotizacion } from "./Cotizacion";

export interface EmpresaDashboard {
  nombreEmpresa: string;
  rubro: string;
  email: string;
  telefono: string;
  ubicacion: string;
  logo?: string
}

export interface KPIsDashboard {
  cotizaciones: number;
  clientes: number;
  proyectosActivos: number;
  ingresosEstimados: number;
}

export interface CotizacionReciente {
  id_Cotizacion: number;
  cliente: string;
  proyecto: string;
  totalCotizacion: number;
  estado: EstadoCotizacion;
  fechaRealizada: string;
}

export interface ClienteReciente {
  id_Cliente: number;
  nombre: string;
  apellido: string;
  proyecto: string;
}

export interface ProyectoActivo {
  nombre: string;
  estado: string;
}

export interface DistribucionTipoObra {
  nombre: string;
  cantidad: number;
}

export interface IngresoMensual {
  mes: number;
  total: number;
}

export interface Dashboard {
  empresa: EmpresaDashboard;

  kpis: KPIsDashboard;

  cotizaciones: CotizacionReciente[];

  clientes: ClienteReciente[];

  proyectos: ProyectoActivo[];

  distribucion: DistribucionTipoObra[];

  ingresos: IngresoMensual[];
}