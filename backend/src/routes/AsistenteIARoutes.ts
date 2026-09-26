import { Router } from "express";

import { AsistenteIAController } from "../controllers/AsistenteIAController";

const router = Router();

const controller = new AsistenteIAController();

router.post(
    "/preguntar",
    controller.preguntar
);

export default router;