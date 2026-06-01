import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import rutaPrueba from "../routes/rutaPrueba"

dotenv.config();

// Crear el servidor
const servidor = express();

// Permitir peticiones desde otros dominios (React)
servidor.use(cors());

// Permitir recibir datos JSON
servidor.use(express.json());

// Registrar la ruta
servidor.use("/", rutaPrueba);

// Obtener el puerto desde el archivo .env
const puerto = process.env.PORT || 3000;

// Iniciar el servidor
servidor.listen(puerto, () => {
    console.log(`Servidor ejecutándose en el puerto ${puerto}`);
});