import { Router } from "express";
import { ProyectoController } from "../controllers/ProyectoController";


const proyectoController = new ProyectoController();
const router = Router();
router.post("/crearProyecto", proyectoController.crearProyecto);

export default router;