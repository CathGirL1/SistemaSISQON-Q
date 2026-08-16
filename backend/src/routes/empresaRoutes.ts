import { Router } from "express";
import { EmpresaController } from "../controllers/EmpresaController";

const router = Router();

const controller = new EmpresaController();

router.get("/", controller.obtenerEmpresas);

export default router;