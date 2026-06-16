import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import rutaPrueba from "../routes/rutaPrueba"
import registroRoutes from "../routes/RegistroUsuario";
import loginRoutes from "../routes/loginUsuario";

import { connectDB } from "./database";

dotenv.config();

// Crear el servidor
const servidor = express();

// Permitir peticiones desde otros dominios (React)
servidor.use(cors());

// Permitir recibir datos JSON
servidor.use(express.json());

// Registrar la ruta
servidor.use("/", rutaPrueba);
servidor.use("/api/registro", registroRoutes);
servidor.use("/api/login", loginRoutes);

// Obtener el puerto desde el archivo .env
const puerto = process.env.PORT || 3000;

const iniciarServidor = async () => {
    try {
        await connectDB();

        servidor.listen(puerto, () => {
            console.log(`Servidor ejecutándose en el puerto ${puerto}`);
        });

    } catch (error) {
        console.error("Error al iniciar el servidor:", error);
    }
};

iniciarServidor();