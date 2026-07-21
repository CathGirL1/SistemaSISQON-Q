import { Router } from "express";

import { ClienteController } from "../controllers/ClienteController";

const router = Router();
const controller = new ClienteController();

router.get("/", controller.obtenerClientes);

router.get(
  "/:id",
  controller.obtenerClientePorId
);

router.post("/", controller.crearCliente);

router.put(
  "/:id",
  controller.actualizarCliente
);

router.delete(
  "/:id",
  controller.eliminarCliente
);

export default router;