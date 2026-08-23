import { Router } from "express";

import { EmpresaController } from "../controllers/EmpresaController";
import { uploadLogoEmpresa } from "../middlewares/uploadLogoEmpresa";

const router = Router();

const controller = new EmpresaController();

router.get("/", controller.obtenerEmpresas);

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

router.post(
  "/:id/logo",
  uploadLogoEmpresa.single("logo"),
  controller.actualizarLogoEmpresa
);

export default router;