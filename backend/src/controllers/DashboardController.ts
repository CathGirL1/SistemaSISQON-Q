import type { Request, Response } from "express";

import { DashboardService } from "../services/DashboardService";

export class DashboardController {

  private service = new DashboardService();

  public obtenerDashboard = async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const idEmpresa = Number(req.params.id);

      const dashboard =
        await this.service.obtenerDashboard(idEmpresa);

      res.status(200).json(dashboard);

    } catch (error) {

      const mensaje =
        error instanceof Error
          ? error.message
          : "Error interno del servidor";

      res.status(400).json({
        mensaje,
      });

    }

  };

}