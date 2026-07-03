import { Router } from "express";
import { RecuperacionAccesoController } from "../controllers/RecuperacionAccesoController";

const router = Router();

const controller = new RecuperacionAccesoController();

router.post(
    "/enviar-codigo",
    controller.enviarCodigo
);

router.post(
    "/verificar-codigo",
    controller.verificarCodigo
);

export default router;