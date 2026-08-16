import type { Request, Response } from "express";
import { EmpresaService } from "../services/EmpresaService";

export class EmpresaController {
  private service = new EmpresaService();

  // GET /api/empresas
  public obtenerEmpresas = async (
    _req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const empresas = await this.service.obtenerEmpresas();

      res.status(200).json(empresas);
    } catch (error: unknown) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al obtener las empresas";

      console.error("Error al obtener empresas:", error);

      res.status(500).json({
        mensaje,
      });
    }
  };
}