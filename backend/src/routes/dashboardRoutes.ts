import { Router } from "express";

import { DashboardController } from "../controllers/DashboardController";

const router = Router();

const controller = new DashboardController();

router.get(
  "/:id",
  controller.obtenerDashboard
);

export default router;