import { Router } from "express";
import { AuthController } from "../controllers/RegistroUsuarioController";

const router = Router();

const controller = new AuthController();

router.post(
    "/register",
    controller.registrar
);

export default router;