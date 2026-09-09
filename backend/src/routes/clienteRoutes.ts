import { Router } from "express";
import { ClienteController } from "../controllers/ClienteController";
import { uploadFotoCliente } from "../middlewares/uploadLogoCliente";

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

router.put(
  "/:id/foto",
  uploadFotoCliente.single("foto"),
  controller.actualizarLogoCliente
);

router.delete(
  "/:id",
  controller.eliminarCliente
);

router.delete(
  "/:id/baja",
  controller.darDeBajaCliente
);

export default router;