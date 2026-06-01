import { Router } from "express";

const rutaPrueba = Router();

rutaPrueba.get("/", (req, res) => {
    res.send("SISQON-Q Backend funcionando correctamente");
});

export default rutaPrueba;