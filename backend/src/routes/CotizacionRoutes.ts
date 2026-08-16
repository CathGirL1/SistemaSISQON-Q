import { Router } from "express";
import { CotizacionController } from "../controllers/CotizacionController";

const router = Router();
const controller = new CotizacionController();


router.post(
    "/",
    controller.crearCotizacion
);


router.get(
    "/cliente/:idCliente",
    controller.obtenerCotizacionesPorCliente
);


router.get(
    "/proyecto/:idProyecto",
    controller.obtenerCotizacionesPorProyecto
);

router.get(
  "/empresa/:idEmpresa",
  controller.obtenerCotizacionesPorEmpresa
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

router.post(
  "/generar/:idProyecto",
  controller.generarCotizacion
);

router.put(
  "/:idCotizacion/enviar",
  controller.enviarCotizacion
);

export default router;