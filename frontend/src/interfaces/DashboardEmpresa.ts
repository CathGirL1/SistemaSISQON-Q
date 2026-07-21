export interface EmpresaDashboard {
  nombreEmpresa: string;
  rubro: string;
  email: string;
  telefono: string;
  ubicacion: string;
}

export interface KPIsEmpresa {
  cotizaciones: number;
  clientes: number;
  proyectosActivos: number;
  ingresosEstimados: number;
}

export interface CotizacionReciente {
  cliente: string;
  proyecto: string;
  total: number;
  estado: "Aprobada" | "Pendiente" | "Rechazada";
}

export interface ClienteReciente {
  iniciales: string;
  nombre: string;
  proyecto: string;
}

export interface ProyectoActivo {
  nombre: string;
  cliente: string;
  progreso: number;
}

export interface DashboardEmpresaData {
  empresa: EmpresaDashboard;
  kpis: KPIsEmpresa;
  cotizaciones: CotizacionReciente[];
  clientes: ClienteReciente[];
  proyectos: ProyectoActivo[];
}