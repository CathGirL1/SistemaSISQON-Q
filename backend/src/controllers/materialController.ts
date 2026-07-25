import { Request, Response } from "express";
import * as materialService from "../services/materialService";

export async function obtenerMateriales(
  req: Request,
  res: Response
) {
  try {
    const materiales =
      await materialService.obtenerMateriales();

    res.status(200).json(materiales);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al obtener los materiales",
    });
  }
}

export async function obtenerMaterialPorId(
  req: Request,
  res: Response
) {
  try {
    const idMaterial = Number(req.params.idMaterial);

    const material =
      await materialService.obtenerMaterialPorId(
        idMaterial
      );

    res.status(200).json(material);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        mensaje: error.message,
      });
    }

    res.status(500).json({
      mensaje: "Error interno del servidor",
    });
  }
}