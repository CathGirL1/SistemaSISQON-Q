import { Router } from "express";
import { ClienteController } from "../controllers/ClienteController";

const router = Router();

const controller = new ClienteController();

router.get(
  "/",
  controller.obtenerClientes
);

router.get(
  "/empresa/:idEmpresa",
  controller.obtenerClientesPorEmpresa
);

router.get(
  "/:idCliente/cotizaciones/empresa/:idEmpresa",
  controller.obtenerHistorialCotizaciones
);

router.get(
  "/:id",
  controller.obtenerClientePorId
);

router.post(
  "/",
  controller.crearCliente
);

router.put(
  "/:id",
  controller.actualizarCliente
);

router.delete(
  "/:id",
  controller.eliminarCliente
);

export default router;