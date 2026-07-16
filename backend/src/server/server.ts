import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import rutaPrueba from "../routes/rutaPrueba";
import registroRoutes from "../routes/RegistroUsuario";
import loginRoutes from "../routes/loginUsuario";
import materialRoutes from "../routes/materialRoutes";

import { connectDB } from "./database";

dotenv.config();

const servidor = express();

servidor.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

servidor.use(express.json());

servidor.use("/", rutaPrueba);
servidor.use("/api/registro", registroRoutes);
servidor.use("/api/login", loginRoutes);
servidor.use("/api/materiales", materialRoutes);

const puerto = Number(process.env.PORT) || 3000;

const iniciarServidor = async (): Promise<void> => {
  try {
    await connectDB();

    servidor.listen(puerto, () => {
      console.log(
        `✅ Servidor ejecutándose en http://localhost:${puerto}`
      );
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

iniciarServidor();