import { Router } from "express";


import {
  obtenerMateriales,
  obtenerMaterialPorId,
} from "../controllers/materialController";

const router = Router();


router.get("/", obtenerMateriales);

router.get("/:idMaterial", obtenerMaterialPorId);

export default router;