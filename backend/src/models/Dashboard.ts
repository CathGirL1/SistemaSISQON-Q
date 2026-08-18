export interface EmpresaDashboard {
  nombreEmpresa: string;
  rubro: string | null;
  email: string;
  telefono: string;
  ubicacion: string;
  logo: string | null;
}

export interface KPIsDashboard {
  cotizaciones: number;
  clientes: number;
  proyectosActivos: number;
  ingresosEstimados: number;
}

export interface CotizacionReciente {
  cliente: string;
  proyecto: string;
  total: number;
  estado: string;
}

export interface ClienteReciente {
  nombre: string;
  proyecto: string;
  iniciales: string;
}

export interface ProyectoActivo {
  nombre: string;
  cliente: string;
  progreso: number;
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

export interface DistribucionTipoObra {
  nombre: string;
  cantidad: number;
}

export interface IngresoMensual {
  mes: number;
  total: number;
}