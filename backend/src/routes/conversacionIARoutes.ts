import { Router } from "express";

import {
  ConversacionIAController,
} from "../controllers/ConversacionIAController";

const router = Router();

const controller =
  new ConversacionIAController();


// Crear conversación
router.post(
  "/",
  controller.crearConversacion
);


// Obtener historial del cliente
router.get(
  "/cliente/:idCliente",
  controller.obtenerConversacionesPorCliente
);


// Obtener conversación
router.get(
  "/:idConversacion",
  controller.obtenerConversacionPorId
);

router.put(
  "/:idConversacion/titulo",
  controller.actualizarTitulo
);

router.delete(
  "/:idConversacion",
  controller.eliminarConversacion
);


// Obtener mensajes
router.get(
  "/:idConversacion/mensajes",
  controller.obtenerMensajes
);


// Guardar mensaje
router.post(
  "/:idConversacion/mensajes",
  controller.crearMensaje
);


export default router;