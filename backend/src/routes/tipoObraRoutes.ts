import { Router } from "express";

import { TipoObraController } from "../controllers/TipoObraController";

const tipoObraRoutes = Router();

const tipoObraController =
  new TipoObraController();

tipoObraRoutes.get(
  "/",
  tipoObraController.obtenerTiposObra
);

tipoObraRoutes.get(
  "/:id",
  tipoObraController.obtenerTipoObraPorId
);

tipoObraRoutes.post(
  "/",
  tipoObraController.crearTipoObra
);

tipoObraRoutes.put(
  "/:id",
  tipoObraController.actualizarTipoObra
);

tipoObraRoutes.delete(
  "/:id",
  tipoObraController.eliminarTipoObra
);

export default tipoObraRoutes;