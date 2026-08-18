import { Router } from "express";

import { UsuarioController } from "../controllers/UsuarioController";

const router = Router();

const controller = new UsuarioController();

router.get(
  "/:id",
  controller.obtenerUsuarioPorId
);

router.put(
  "/:id",
  controller.actualizarUsuario
);

export default router;