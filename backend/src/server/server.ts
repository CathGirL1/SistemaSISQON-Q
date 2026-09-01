import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import rutaPrueba from "../routes/rutaPrueba";
import registroRoutes from "../routes/RegistroUsuario";
import loginRoutes from "../routes/loginUsuario";

import recuperacionAcceso from "../routes/RecuperacionAcceso";
import materialRoutes from "../routes/materialRoutes";
import clienteRoutes from "../routes/clienteRoutes";
import empresaRoutes from "../routes/empresaRoutes";
import tipoObraRoutes from "../routes/tipoObraRoutes";
import manoObraRoutes from "../routes/ManoObraRoutes";
import usuarioRoutes from "../routes/usuarioRoutes";
import dashboardRoutes from "../routes/dashboardRoutes";


import proyectoRoutes from "../routes/proyectoRoutes";
import cotizacionRoutes from "../routes/CotizacionRoutes";
import materialProyectoRoutes from "../routes/MaterialProyectoRoutes";
import monedaRoutes from "../routes/monedaRoutes";


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
servidor.use("/uploads",express.static(path.resolve(process.cwd(), "uploads")));

servidor.use("/", rutaPrueba);
servidor.use("/api/registro", registroRoutes);
servidor.use("/api/login", loginRoutes);

servidor.use("/api/recuperacionAcceso", recuperacionAcceso);
servidor.use("/api/clientes", clienteRoutes);
servidor.use("/api/empresa", empresaRoutes);
servidor.use("/api/tipos-obra",tipoObraRoutes);
servidor.use("/api/mano-obra", manoObraRoutes);
servidor.use("/api/usuario",usuarioRoutes);
servidor.use("/api/dashboard",dashboardRoutes);

servidor.use("/api/materiales", materialRoutes);
servidor.use("/api/proyectos", proyectoRoutes);
servidor.use("/api/cotizaciones", cotizacionRoutes); 
servidor.use("/api/materiales-proyecto",materialProyectoRoutes);
servidor.use("/api/moneda", monedaRoutes);


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