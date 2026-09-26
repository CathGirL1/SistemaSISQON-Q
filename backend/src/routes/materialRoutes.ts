import { Router } from "express";

import { MaterialController } from "../controllers/MaterialController";

const router = Router();

const controller = new MaterialController();

router.get(
  "/",
  controller.obtenerMateriales
);

router.get(
  "/empresa/:idEmpresa",
  controller.obtenerMaterialesPorEmpresa
);

router.get(
  "/:id",
  controller.obtenerMaterialPorId
);

router.post(
  "/",
  controller.crearMaterial
);

router.put(
  "/:id",
  controller.actualizarMaterial
);

router.delete(
  "/:id",
  controller.eliminarMaterial
);

export default router;