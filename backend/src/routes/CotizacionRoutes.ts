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

router.get(
  "/cliente/:idCliente/finalizadas",
  controller.obtenerCotizacionesFinalizadasPorCliente
);

router.get(
    "/estadisticas/cliente/:idCliente",
    controller.obtenerEstadisticasCliente
);

router.post(
    "/:idCotizacion/propuesta",
    controller.crearPropuestaEmpresa
);

router.put(
    "/:idCotizacion/propuesta",
    controller.actualizarPropuestaEmpresa
);

router.put(
    "/:idCotizacion/enviar",
    controller.enviarCotizacion
);

router.put(
    "/:idCotizacion/seleccionar",
    controller.seleccionarPropuesta
);

router.put(
    "/:idCotizacion/empresa",
    (req, res) =>
        controller.actualizarCotizacionDesdeEmpresa(
            req,
            res
        )
);

router.put(
    "/:idCotizacion/finalizar",
    (req, res) =>
        controller.finalizarCotizacion(
            req,
            res
        )
);

export default router;