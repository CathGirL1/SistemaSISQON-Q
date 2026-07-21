import { Router } from "express";

import { ManoObraController } from "../controllers/ManoObraController";

const router = Router();

const controller = new ManoObraController();

router.get(
  "/",
  controller.obtenerManoObra
);

router.get(
  "/:id",
  controller.obtenerManoObraPorId
);

router.post(
  "/",
  controller.crearManoObra
);

router.put(
  "/:id",
  controller.actualizarManoObra
);

router.delete(
  "/:id",
  controller.eliminarManoObra
);

export default router;