import { DashboardRepository } from "../repositories/DashboardRepository";

import type { Dashboard } from "../models/Dashboard";

export class DashboardService {

  private repository = new DashboardRepository();

  public async obtenerDashboard(
    idEmpresa: number
  ): Promise<Dashboard> {

    return this.repository.obtenerDashboard(
      idEmpresa
    );

  }

}