import { Router } from "express";
import { MaterialProyectoController } from "../controllers/MaterialProyectoController";

const router = Router();

const controller = new MaterialProyectoController();

router.post(
  "/agregarMaterialAProyecto",
  controller.agregarMaterial.bind(controller)
);

router.get(
  "/proyecto/:idProyecto",
  controller.obtenerMaterialesPorProyecto.bind(controller)
);

router.get(
  "/proyecto/:idProyecto/comparacion",
  controller.obtenerComparacionMateriales.bind(controller)
);

router.put(
  "/:idMaterialProyecto/usar-alternativa",
  controller.usarMaterialAlternativo.bind(controller)
);

router.put(
  "/:idMaterialProyecto",
  controller.actualizarCantidad.bind(controller)
);

router.delete(
  "/:idMaterialProyecto",
  controller.eliminarMaterial.bind(controller)
);

export default router;