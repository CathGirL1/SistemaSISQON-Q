import { Router } from "express";
import { MonedaController } from "../controllers/MonedaController";

const router = Router();

const controller =
    new MonedaController();

router.get(
    "/usd-uyu",
    controller.obtenerDolarAPesoUruguayo
);

export default router;