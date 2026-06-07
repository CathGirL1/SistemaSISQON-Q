import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();
console.log("Servidor:", process.env.DB_SERVER);
console.log("Puerto:", process.env.DB_PORT);
console.log("Base:", process.env.DB_DATABASE);

const config: sql.config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER || "localhost",
    database: process.env.DB_DATABASE,
    port: Number(process.env.DB_PORT),

    options: {
        trustServerCertificate: true,
        encrypt: false
    }
};

export const connectDB = async () => {
    try {
        const pool = await sql.connect(config);

        console.log("✅ Base de datos conectada");

        return pool;
    } catch (error) {
        console.error("❌ Error de conexión:", error);
        throw error;
    }
};