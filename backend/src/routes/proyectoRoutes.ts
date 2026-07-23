import { Router } from "express";
import { ProyectoController } from "../controllers/ProyectoController";

const router = Router();
const controller = new ProyectoController();

router.post("/", controller.crearProyecto);

router.get(
  "/cliente/:idCliente",
  controller.obtenerProyectosPorCliente
);

router.get(
  "/:idProyecto",
  controller.obtenerProyectoPorId
);

router.put(
  "/:idProyecto",
  controller.actualizarProyecto
);

router.delete(
  "/:idProyecto",
  controller.eliminarProyecto
);

export default router;