import { Router } from "express";
import { CotizacionController } from "../controllers/CotizacionController";

const router = Router();
const controller = new CotizacionController();

router.post("/", controller.crearCotizacion);

router.get(
  "/cliente/:idCliente",
  controller.obtenerCotizacionesPorCliente
);

router.get(
  "/proyecto/:idProyecto",
  controller.obtenerCotizacionesPorProyecto
);

router.get(
  "/:idCotizacion",
  controller.obtenerCotizacionPorId
);

router.put(
  "/:idCotizacion",
  controller.actualizarCotizacion
);

router.delete(
  "/:idCotizacion",
  controller.eliminarCotizacion
);

export default router;