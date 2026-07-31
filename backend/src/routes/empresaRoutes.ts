import { Router } from "express";

import { EmpresaController } from "../controllers/EmpresaController";

const router = Router();

const controller = new EmpresaController();

router.get(
  "/usuario/:idUsuario",
  controller.obtenerEmpresaPorUsuario
);

router.get(
  "/:id",
  controller.obtenerEmpresaPorId
);

router.put(
  "/:id",
  controller.actualizarEmpresa
);

export default router;