import { Router } from "express";

import { ManoObraController } from "../controllers/ManoObraController";

const router = Router();

const controller = new ManoObraController();

router.get(
  "/empresa/:idEmpresa",
  controller.obtenerManoObraPorEmpresa
);

router.get(
  "/:id/empresa/:idEmpresa",
  controller.obtenerManoObraPorId
);

router.post(
  "/",
  controller.crearManoObra
);

router.put(
  "/:id/empresa/:idEmpresa",
  controller.actualizarManoObra
);

router.delete(
  "/:id/empresa/:idEmpresa",
  controller.eliminarManoObra
);

export default router;