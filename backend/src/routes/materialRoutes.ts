import { Router } from "express";
import { MaterialController } from "../controllers/MaterialController";

const router = Router();
const materialController = new MaterialController();

router.get("/", materialController.obtenerMateriales);

router.get(
  "/:idMaterial/alternativas",
  materialController.obtenerAlternativasMaterial
);

router.get(
  "/:idMaterial",
  materialController.obtenerMaterialPorId
);

export default router;